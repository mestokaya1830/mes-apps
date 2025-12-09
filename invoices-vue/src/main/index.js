import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from '../db/sqliteConn.js'
import nodeMailer from 'nodemailer'
import fs from 'fs'

let win = null
function createWindow() {
  win = new BrowserWindow({
    width: 1260,
    height: 800,
    show: false, // Pencereyi gizle
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: '#ffffff', // Beyaz flaş önler
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.resolve(__dirname, '../preload/preload.js'),
      sandbox: true,
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true,
      devTools: is.dev
    }
  })

  // Pencere DOM + paint hazır olduğunda göster
  win.once('ready-to-show', () => {
    win.show()
    win.setTitle('Mes Invoices App')
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(path.resolve(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (event, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

//window control
ipcMain.handle('control-window', (event, data) => {
  if (!win) return
  switch (data) {
    case 'minimize':
      win.minimize()
      break
    // case 'maximize':
    //   win.isMaximized() ? win.unmaximize() : win.maximize()
    //   break
    case 'close':
      win.close()
      break
  }
})

//register
ipcMain.handle('check-register', async () => {
  try {
    const row = db.prepare('SELECT * FROM users').all()
    if (row.length > 0) {
      return { success: true }
    } else {
      return { success: false }
    }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('register', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const [image, data] = payload
    const companyDetailsJSON = JSON.stringify(data.company_details || {})
    const contactPersonJSON = JSON.stringify(data.contact_person || {})

    const user = db
      .prepare(
        `INSERT INTO users (
          gender,
          first_name,
          last_name,
          password,
          email,
          phone,
          address,
          postal_code,
          city,
          state,
          country,
          website,

          company_name,
          company_details,
          company_signature,
          contact_person,

          tax_number,
          tax_office,
          vat_id,
          court_registration,
          court_location,

          logo,
          image_type,

          bank_name,
          bic,
          iban,
          bank_account_holder,

          invoice_approved
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        data.gender,
        data.first_name,
        data.last_name,
        data.password,
        data.email,
        data.phone,
        data.address,
        data.postal_code,
        data.city,
        data.state,
        data.country,
        data.website,

        data.company_name,
        companyDetailsJSON,
        data.company_signature,
        contactPersonJSON,

        data.tax_number,
        data.tax_office,
        data.vat_id,
        data.court_registration,
        data.court_location,

        Buffer.from(image),
        data.image_type,

        data.bank_name,
        data.bic,
        data.iban,
        data.bank_account_holder,

        data.invoice_approved
      )
    return { success: true, user: user }
  } catch (error) {
    console.log(error)
  }
})

//user and login
ipcMain.handle('login', async (event, payload) => {
  const { email, password } = payload
  try {
    const row = db
      .prepare('SELECT * FROM users WHERE email = ? AND password = ?')
      .get(email, password)

    if (row) {
      return { success: true, user: row }
    } else {
      return { success: false, message: 'Invalid email or password' }
    }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('reset-password', async (event, payload) => {
  try {
    db.prepare("DELETE FROM tokens WHERE replace(expires_at, 'T', ' ') < datetime('now')").run()
    const { token, password } = payload
    const tokenRow = db.prepare('SELECT * FROM tokens WHERE token = ?').get(token)
    if (!tokenRow) {
      return { success: false, message: 'Invalid token' }
    } else {
      const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(tokenRow.user_id)
      if (!userRow) {
        return { success: false, message: 'User not found' }
      } else {
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(password, userRow.id)
        db.prepare('DELETE FROM tokens WHERE token = ?').run(token)
        return { success: true, message: 'Password reset successfully' }
      }
    }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('email-verfication', async (event, payload) => {
  const { email } = payload
  const expiresAt = new Date(Date.now() + 60000 * 1)
  const token = Math.random().toString(36).substring(2, 50)
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (user) {
      db.prepare('INSERT INTO tokens (token, user_id, expires_at) VALUES (?,?,?)').run(
        token,
        user.id,
        expiresAt.toISOString()
      )
      return { success: true, message: 'Email sent and token insert' }
    } else {
      return { success: false, message: 'No user found with that email' }
    }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: 'DB insert failed' }
  }

  // const { email } = data
  // const token = Math.random().toString(36).substring(2, 50)
  // const expiresAt = new Date(Date.now() + 60000 * 15) // 15 minutes
  // //email host settings
  // const transporter = nodeMailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 465,
  //   auth: {
  //     user: 'mesto1830@gmail.com',
  //     pass: 'taao aisb gkkc evwx'
  //   }
  // })
  // //email options
  // const mailoption = {
  //   from: 'mesto1830@gmail.com',
  //   to: email,
  //   subject: 'Password Reset Request',
  //   text: 'To reset password please click link below...',
  //   html: `
  //   <h2>To reset password please use this token'</h2>
  //   <h1>${token}</h1>
  //   `
  // }
  // transporter.sendMail(mailoption, (err, info) => {
  //   if (err) {
  //     console.error('Email error:', err.message)
  //     return { success: false, message: err.message }
  //   } else {
  //     console.log('Email sent:', info.response, token)
  //     try {
  //       const row = db
  //         .prepare('INSERT INTO tokens (token, user_id, expires_at) VALUES (?,?,?)')
  //         .run(token, 1, expiresAt)
  //       if (!row) {
  //         console.warn('No user found with that email')
  //         return { success: false, message: 'No user found with that email' }
  //       } else {
  //         return { success: true, message: 'Email sent and token updated' }
  //       }
  //     } catch {
  //       console.error('DB error:', err.message)
  //       return { success: false, message: err.message }
  //     }
  //   }
  // })
})

ipcMain.handle('get-user', async () => {
  try {
    const row = db.prepare('SELECT * FROM users WHERE id = 1').get()
    if (row && row.logo) {
      // Buffer → Base64 string
      row.logo = row.logo.toString('base64')
    }
    return { success: true, user: row }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('update-user', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const { image, user } = payload
    db.prepare('DELETE FROM users WHERE id != 1').run()
    const info = db
      .prepare(
        `UPDATE users SET
          gender = ?,
          first_name = ?,
          last_name = ?,
          password = ?,
          email = ?,
          phone = ?,
          address = ?,
          postal_code = ?,
          city = ?,
          state = ?,
          country = ?,
          website = ?,
          company_name = ?,
          company_details = ?,
          company_signature = ?,
          contact_person = ?,
          tax_number = ?,
          tax_office = ?,
          vat_id = ?,
          court_registration = ?,
          court_location = ?,
          logo = ?,
          image_type = ?,
          bank_name = ?,
          bic = ?,
          iban = ?,
          bank_account_holder = ?,
          invoice_approved = ?
        WHERE id = 1`
      )
      .run(
        user.gender,
        user.first_name,
        user.last_name,
        user.password,
        user.email,
        user.phone,
        user.address,
        user.postal_code,
        user.city,
        user.state,
        user.country,
        user.website,
        user.company_name,
        JSON.stringify(user.company_details || {}),
        user.company_signature,
        JSON.stringify(user.contact_person || {}),
        user.tax_number,
        user.tax_office,
        user.vat_id,
        user.court_registration,
        user.court_location,
        Buffer.from(image),
        user.image_type,
        user.bank_name,
        user.bic,
        user.iban,
        user.bank_account_holder,
        user.invoice_approved
      )

    if (info.changes > 0) {
      return { success: true, message: 'Profil wurde erfolgreich aktualisiert' }
    } else {
      return { success: false, message: 'Profil konnte nicht aktualisiert werden' }
    }
  } catch (error) {
    console.error('updateProfile error:', error)
    return { success: false, message: error.message }
  }
})

//dashbords
ipcMain.handle('get-dashboard', async () => {
  try {
    const rows = db.transaction(() => {
      return {
        customers: db.prepare('SELECT COUNT(*) AS count FROM customers WHERE is_active = 1').get()
          .count,
        invoices: db.prepare('SELECT COUNT(*) AS count FROM invoices WHERE is_active = 1').get()
          .count,
        offers: db.prepare('SELECT COUNT(*) AS count FROM offers WHERE is_active = 1').get().count,
        orders: db.prepare('SELECT COUNT(*) AS count FROM orders  WHERE is_active = 1').get().count
      }
    })()

    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

//customers
ipcMain.handle('add-customer', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const { customer } = payload
    const info = db
      .prepare(
        `
      INSERT INTO customers (
        is_active,
        company_type, company_name,
        first_name, last_name, full_name, email, phone, website,
        address, postal_code, city, country,
        tax_number, vat_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        customer.is_active ? 1 : 0,

        customer.company_type,
        customer.company_name,

        customer.first_name,
        customer.last_name,
        customer.first_name + ' ' + customer.last_name,

        customer.email,
        customer.phone,
        customer.website,
        customer.address,
        customer.postal_code,
        customer.city,
        customer.country,

        customer.tax_number,
        customer.vat_id
      )

    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-customers', async () => {
  try {
    const limit = 50
    const rows = db
      .prepare(
        `
        SELECT id, company_type, company_name, first_name, last_name, is_active FROM customers ORDER BY id DESC LIMIT ?
      `
      )
      .all(limit)

    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-customer-by-id', async (event, payload) => {
  const { id, table_name } = payload
  if (!id) {
    return { success: false, message: 'No id provided' }
  }
  try {
    const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(id)
    const lastRow = db.prepare(`SELECT id FROM ${table_name} ORDER BY id DESC LIMIT 1;`).get()

    const last_id = lastRow ? lastRow.id : 0
    const data = {
      customer,
      last_id
    }
    return { success: true, data }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('update-customer-by-id', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const { id, customer } = payload
    const info = db
      .prepare(
        'UPDATE customers SET company_type = ?, company_name = ?, first_name = ?, last_name = ?, address = ?, postal_code = ?, city = ?, country = ?, email = ?, phone = ?, tax_number = ?, vat_id = ?, is_active = ?  WHERE id = ?'
      )
      .run(
        customer.company_type,
        customer.company_name,
        customer.first_name,
        customer.last_name,
        customer.address,
        customer.postal_code,
        customer.city,
        customer.country,
        customer.email,
        customer.phone,
        customer.tax_number,
        customer.vat_id,
        customer.is_active,
        id
      )
    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('customer-details', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No id provided' }
  }
  try {
    const customer = db
      .prepare(
        `
          SELECT * FROM customers WHERE id = ?
        `
      )
      .get(id)
    //get all counts for customer
    const counts = db
      .prepare(
        `
          SELECT
            COALESCE((SELECT COUNT(*) FROM invoices 
                      WHERE json_extract(customer, '$.id') = CAST(:id AS TEXT)), 0) AS invoice_count,
            COALESCE((SELECT COUNT(*) FROM offers    WHERE customer_id = :id), 0) AS offer_count,
            COALESCE((SELECT COUNT(*) FROM orders    WHERE customer_id = :id), 0) AS order_count,
            COALESCE((SELECT COUNT(*) FROM reminders WHERE customer_id = :id), 0) AS reminder_count,
            COALESCE((SELECT COUNT(*) FROM payments  WHERE customer_id = :id), 0) AS payment_count
        `
      )
      .get({ id })

    const data = {
      customer,
      counts
    }
    return { success: true, data }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('delete-customer-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No id provided' }
  }
  try {
    const info = db.prepare('DELETE FROM customers WHERE id = ?').run(id)
    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('search-customers', async (event, term) => {
  if (!term) {
    return { success: false, message: 'No data provided' }
  }
  let limit = 50
  if (isNaN(term) && !term.includes('-')) {
    try {
      const rows = db
        .prepare(
          `SELECT id, company_name, first_name, last_name, is_active FROM customers
           WHERE company_type LIKE '${term}%' 
           OR company_name LIKE '%${term}%' 
           OR first_name LIKE '${term}%' 
           OR last_name LIKE '${term}%' 
           OR full_name LIKE '${term}%' 
           ORDER BY id DESC LIMIT ?`
        )
        .all(limit)
      return { success: true, rows }
    } catch (err) {
      console.error('DB error:', err.message)
      return { success: false, message: err.message }
    }
  } else {
    try {
      if (isNaN(term) && term.includes('-')) {
        const [start, end] = term.split('-').map((item) => parseInt(item.replace(/\D/g, ''), 10))
        const rows = db
          .prepare(
            `SELECT id, company_name, first_name, last_name, is_active FROM customers 
            WHERE id BETWEEN ? AND ? AND is_active = 1
            ORDER BY id DESC LIMIT ?`
          )
          .all(start, end, limit)
        return { success: true, rows }
      } else {
        console.log(term)
        const rows = db
          .prepare(
            `SELECT id, company_name, first_name, last_name, is_active FROM customers 
            WHERE id + 0 LIKE ? AND is_active = 1
            ORDER BY id DESC LIMIT ?`
          )
          .all(term, limit)
        return { success: true, rows }
      }
    } catch (err) {
      console.error('DB error:', err.message)
      return { success: false, message: err.message }
    }
  }
})

//invoices
ipcMain.handle('add-invoice', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const invoice = payload
    const info = db
      .prepare(
        `
          INSERT INTO invoices (
            customer_id,
            customer,
            is_active,

            cancelled_by,
            cancelled_at,
            cancellation_reason,

            date,
            due_date,
            service_date,

            currency,
            payment_terms,
            payment_conditions,
            early_payment_discount,
            early_payment_percentage,
            early_payment_days,
            total_after_discount,

            is_small_company,
            is_reverse_charge,
            is_eu_delivery,

            positions,
            net_total,
            vat_total,
            gross_total
          ) VALUES (?, ?, ?, ?, ?, ?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        invoice.customer_id,
        JSON.stringify(invoice.customer) || null,
        invoice.is_active,

        invoice.cancelled_by,
        invoice.cancelled_at,
        invoice.cancellation_reason,

        invoice.date,
        invoice.due_date,
        invoice.service_date,

        invoice.currency,
        invoice.payment_terms,
        invoice.payment_conditions,
        invoice.early_payment_discount,
        invoice.early_payment_percentage,
        invoice.early_payment_days,
        invoice.total_after_discount,

        invoice.is_small_company ? 1 : 0,
        invoice.is_reverse_charge ? 1 : 0,
        invoice.is_eu_delivery ? 1 : 0,

        JSON.stringify(invoice.positions || []),
        invoice.net_total,
        invoice.vat_total,
        invoice.gross_total
      )
    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-invoices', async () => {
  try {
    const limit = 50
    const rows = db
      .prepare(
        `
          SELECT id, date, due_date, gross_total, is_active, customer
          FROM invoices
          WHERE is_active = 1
          ORDER BY id DESC
          LIMIT ?
        `
      )
      .all(limit)
    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-invoice-by-id', async (event, payload) => {
  const { id, table_name } = payload
  if (!id) {
    return { success: false, message: 'No data provided' }
  }
  try {
    //from invoices details
    if (table_name === 'invoices') {
      let rows = db
        .prepare(
          `
            SELECT *
            FROM invoices
            WHERE id = ?
          `
        )
        .get(id)

      let payments = db
        .prepare(
          `
            SELECT *
            FROM payments
            WHERE invoice_id = ?
          `
        )
        .all(id)
      rows.payments = payments
      return { success: true, rows }
    }

    //from payments create
    if (table_name === 'payments') {
      let rows = db
        .prepare(
          `
            SELECT id, customer_id, date, due_date, gross_total, early_payment_days, early_payment_percentage, early_payment_discount, total_after_discount, currency
            FROM invoices
            WHERE id = ?
          `
        )
        .get(id)
      const payment_id =
        db.prepare(`SELECT id FROM payments As id ORDER BY id DESC LIMIT 1;`).get()?.id ?? 0

      const previously_paid_amount =
        db.prepare(`SELECT sum(previously_paid_amount) As total FROM payments WHERE invoice_id = ?`)
          ?.total ?? 0
      return { success: true, rows, payment_id, previously_paid_amount }
    }

    //from reminders create
    if (table_name === 'reminders') {
      let rows = db
        .prepare(
          `
            SELECT id, date, due_date, gross_total, total_after_discount, currency,  customer
            FROM invoices
            WHERE id = ?
          `
        )
        .get(id)
      const reminder_id =
        db.prepare(`SELECT id FROM reminders ORDER BY id DESC LIMIT 1`).get()?.id ?? 0
      return { success: true, rows, reminder_id }
    }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('cancel-invoice', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const { id, is_active, cancelled_at, cancellation_reason, cancelled_by } = payload
    db.prepare(
      `Update invoices Set is_active = ?, cancelled_at =?, cancellation_reason = ?, cancelled_by = ? WHERE id = ?`
    ).run(is_active, cancelled_at, cancellation_reason, cancelled_by, id)
    return { success: true }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('flter-invoices-categories', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const category = payload
    let query = ''
    let rows = []
    let limit = 50

    switch (category) {
      case 'all':
        query = `SELECT id, date, due_date, gross_total, is_active, customer
          FROM invoices
          ORDER BY id DESC
          LIMIT ?`
        rows = db.prepare(query).all(limit)
        break

      case 'active':
        query = `SELECT id, date, due_date, gross_total, is_active, customer
          FROM invoices
          WHERE is_active = 1
          ORDER BY id DESC
          LIMIT ?`
        rows = db.prepare(query).all(limit)
        break

      case 'canceled':
        query = `SELECT id, date, due_date, gross_total, is_active, customer
          FROM invoices
          WHERE is_active = 0
          ORDER BY id DESC
          LIMIT ?`
        rows = db.prepare(query).all(limit)
        break

      case 'is_paid':
        query = `
            SELECT
                i.id,
                i.date,
                i.due_date,
                i.gross_total,
                i.is_active,
                i.customer
            FROM invoices i
            WHERE EXISTS (
                SELECT 1
                FROM payments p
                WHERE p.invoice_id = i.id AND p.is_paid = 1
            )
            ORDER BY i.id DESC
            LIMIT ?;
          `
        rows = db.prepare(query).all(limit)
        break

      case 'is_not_paid':
        query = `
            SELECT
                i.id,
                i.date,
                i.due_date,
                i.gross_total,
                i.is_active,
                i.customer
            FROM invoices i
            WHERE NOT EXISTS (
                SELECT 1
                FROM payments p
                WHERE p.invoice_id = i.id AND p.is_paid = 1
            )
            ORDER BY i.id DESC
            LIMIT ?;
          `
        rows = db.prepare(query).all(limit)
        break

      case 'is_partially_paid':
        query = `
              SELECT
                  i.id,
                  i.date,
                  i.due_date,
                  i.gross_total,
                  i.is_active,
                  i.customer
              FROM invoices i
              WHERE i.is_active = 1
                AND EXISTS (
                    SELECT 1
                    FROM payments p
                    WHERE p.invoice_id = i.id
                      AND p.is_paid = 0
                      AND p.is_partially_paid = 1
                )
              ORDER BY i.id DESC
              LIMIT ?;
            `
        rows = db.prepare(query).all(limit)
        break

      default:
        query = `SELECT * FROM invoices WHERE is_active = 1 ORDER BY id DESC LIMIT ?`
        rows = db.prepare(query).all(limit)
    }

    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('search-invoices', async (event, term) => {
  if (!term) {
    return { success: false, message: 'No data provided' }
  }
  try {
    let limit = 50
    let rows = []
    if (isNaN(term) && !term.includes('-')) {
      console.log(term)
      rows = db
        .prepare(
          `SELECT 
            id,
            date,
            due_date,
            gross_total,
            is_active,
            customer
          FROM invoices
          WHERE (
                  json_extract(customer, '$.first_name') LIKE '${term}%'
                  OR json_extract(customer, '$.last_name') LIKE '${term}%'
                  OR json_extract(customer, '$.company_name') LIKE '${term}%'
                )
                AND is_active = 1
          ORDER BY id DESC
          LIMIT ?`
        )
        .all(limit)
    } else {
      if (isNaN(term) && term.includes('-')) {
        const [start, end] = term.split('-').map((item) => parseInt(item.replace(/\D/g, ''), 10))

        rows = db
          .prepare(
            `SELECT id, date, due_date, gross_total, is_active, customer
            FROM invoices
            WHERE id BETWEEN ? AND ? AND is_active = 1
            ORDER BY id DESC LIMIT ?`
          )
          .all(start, end, limit)
      } else {
        rows = db
          .prepare(
            `SELECT id, date, due_date, gross_total, is_active, customer
            FROM invoices
            WHERE id + 0 LIKE ? AND is_active = 1
            ORDER BY id DESC LIMIT ?`
          )
          .all(term, limit)
      }
    }
    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('filter-invoices-date', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    let limit = 50
    const { start, end } = payload
    const rows = db
      .prepare(
        `SELECT 
          id,
          date,
          due_date,
          gross_total,
          is_active,
          customer
        FROM invoices
        WHERE date BETWEEN ? AND ?
        ORDER BY id DESC
        LIMIT ?;`
      )
      .all(start, end, limit)
    return { success: true, rows }
  } catch (error) {
    console.error('dateFilter error:', error)
    return { success: false, message: error.message }
  }
})

//offers
ipcMain.handle('add-offer', async (event, data) => {
  console.log(data)
  if (!data) return { success: false, message: 'No data provided' }

  try {
    const info = db
      .prepare(
        `
        INSERT INTO offers (
          customer_id,

          date,
          valid_until,

          customer,
          contact_person,

          subject,
          currency,
          payment_terms,
          delivery_terms,
          delivery_time,

          positions,
          net_total,
          vat_total,
          gross_total,

          status,
          status_date,
          is_active,
          is_legal,

          introduction_text,
          closing_text,
          notes,
          
          internal_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        data.customer_id,

        data.date,
        data.valid_until,

        JSON.stringify(data.customer || {}),
        data.contact_person,

        data.subject,
        data.currency,
        data.payment_terms,
        data.delivery_terms,
        data.delivery_time,

        JSON.stringify(data.positions || []),
        data.net_total,
        data.vat_total,
        data.gross_total,

        data.status,
        data.status_date,
        data.is_active ? 1 : 0,
        data.is_legal ? 1 : 0,

        data.introduction_text,
        data.closing_text,
        data.notes,

        data.internal_notes
      )

    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-offers', async () => {
  try {
    const limit = 50
    const rows = db
      .prepare(
        `
          SELECT id, date, valid_until, status, status_date, customer, is_active
          FROM offers
          WHERE is_active = 1
          ORDER BY id DESC
          LIMIT ?
        `
      )
      .all(limit)
    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-offer-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const rows = db
      .prepare(
        `
          SELECT *
          FROM offers
          WHERE id = ?
        `
      )
      .get(id)

    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('delete-offer-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No id provided' }
  }
  try {
    const info = db.prepare('DELETE FROM offers WHERE id = ?').run(id)
    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('update-offer-by-id', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const { id, status, status_by, status_date, status_comments } = payload
    const info = db
      .prepare(
        `
          UPDATE offers
          SET status = ?, status_by = ?, status_date = ?, status_comments = ?
          WHERE id = ?
        `
      )
      .run(status, status_by, status_date, status_comments, id)
    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

//orders
ipcMain.handle('add-order', async (event, payload) => {
  if (!payload) return { success: false, message: 'No data provided' }

  try {
    const data = payload

    const info = db
      .prepare(
        `
        INSERT INTO orders (
          id,
          customer_id,
          customer,

          date,
          validity_date,
          service_period_start,
          service_period_end,
          delivery_date,

          status,
          status_date,
          status_by,
          status_comments,

          is_active,
          cancelled_at,
          cancelled_by,
          cancellation_reason,

          delivery_address,
          delivery_postal_code,
          delivery_city,
          delivery_country,

          payment_terms,
          payment_method,
          payment_conditions,
          payment_reference,

          delivery_terms,
          shipping_method,

          positions,
          currency,
          net_total,
          vat_total,
          gross_total,

          intro_text,
          customer_notes,
          internal_notes,
          closing_text,

          sent_at,
          sent_method,

          created_at,
          updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?,
          ?, ?
        )
      `
      )
      .run(
        null, // id (AUTOINCREMENT)

        data.customer_id,
        JSON.stringify(data.customer || {}),

        data.date,
        data.validity_date,
        data.service_period_start,
        data.service_period_end,
        data.delivery_date,

        data.status ?? 'pending',
        data.status_date,
        data.status_by,
        data.status_comments,

        data.is_active ? 1 : 0,
        data.cancelled_at,
        data.cancelled_by,
        data.cancellation_reason,

        data.delivery_address,
        data.delivery_postal_code,
        data.delivery_city,
        data.delivery_country,

        data.payment_terms,
        data.payment_method,
        data.payment_conditions,
        data.payment_reference,

        data.delivery_terms,
        data.shipping_method,

        JSON.stringify(data.positions || []),
        data.currency,
        data.net_total,
        data.vat_total,
        data.gross_total,

        data.intro_text,
        data.customer_notes,
        data.internal_notes,
        data.closing_text,

        data.sent_at,
        data.sent_method,

        data.created_at,
        data.updated_at
      )

    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-order-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const rows = db
      .prepare(
        `
          SELECT *
          FROM orders
          WHERE id = ?
        `
      )
      .get(id)

    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-orders', async () => {
  try {
    const limit = 50
    const rows = db
      .prepare(
        `
          SELECT id, date, status, customer, is_active
          FROM orders
          WHERE is_active = 1
          ORDER BY id DESC
          LIMIT ?
        `
      )
      .all(limit)
    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('delete-order-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No id provided' }
  }
  try {
    const info = db.prepare('DELETE FROM orders WHERE id = ?').run(id)
    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('cancel-order', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const { id, is_active, cancelled_at, cancellation_reason, cancelled_by } = payload
    db.prepare(
      `Update orders Set is_active = ?, cancelled_at = ?, cancellation_reason = ?, cancelled_by = ? WHERE id = ?`
    ).run(is_active, cancelled_at, cancellation_reason, cancelled_by, id)
    return { success: true }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('add-payment', async (event, payload) => {
  if (!payload) return { success: false, message: 'No data provided' }

  try {
    const payment = payload
    console.log(payment)
    const info = db
      .prepare(
        `
        INSERT INTO payments (
          invoice_id,
          customer_id,
          invoice_date,
          invoice_due_date,
          currency,
          invoice_total,
          payment_date,
          paid_amount,
          outstanding_amount,
          payment_method,
          payment_reference,
          counterparty_name,
          counterparty_iban,
          notes,
          is_partially_paid,
          is_paid,
          file_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        payment.invoice_id,
        payment.customer_id,
        payment.invoice_date,
        payment.invoice_due_date,
        payment.currency,
        payment.invoice_total,
        payment.payment_date,
        payment.paid_amount,
        payment.outstanding_amount,
        payment.payment_method,
        payment.payment_reference,
        payment.counterparty_name,
        payment.counterparty_iban,
        payment.notes,
        payment.is_partially_paid ? 1 : 0,
        payment.is_paid ? 1 : 0,
        payment.file_name
      )

    // Save file if uploaded
    if (payment.image_file && payment.file_name) {
      const base64Data = payment.image_file.includes(',')
        ? payment.image_file.split(',')[1]
        : payment.image_file
      const buffer = Buffer.from(base64Data, 'base64')
      const savePath = path.join(
        app.getAppPath(),
        'src/renderer/public/uploads/payments',
        payment.file_name
      )
      await fs.promises.writeFile(savePath, buffer)
    }

    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-payment-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const rows = db
      .prepare(
        `
          SELECT *
          FROM payments
          WHERE id = ?
        `
      )
      .get(id)

    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('delete-payment-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No id provided' }
  }
  try {
    const info = db.prepare('DELETE FROM payments WHERE id = ?').run(id)
    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

//reminders
ipcMain.handle('add-reminder', async (event, payload) => {
  console.log(payload)
  const data = payload
  if (!payload) return { success: false, message: 'No data provided' }

  try {
    const info = db
      .prepare(
        `
        INSERT INTO reminders (
          invoice_id,
          customer_id,

          is_sent,
          is_cancelled,

          level,
          level_text,

          reminder_date,
          due_date_new,
          reminder_fee,
          late_interest,

          intro_text,
          warning_text,
          closing_text,

          sent_at,
          sent_method,

          proof_type,
          proof_file_name,
          proof_sent_at,

          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        data.invoice_id,
        data.customer_id,

        data.is_sent ? 1 : 0,
        data.is_cancelled ? 1 : 0,

        data.level,
        data.level_text,

        data.reminder_date,
        data.due_date_new,
        data.reminder_fee,
        data.late_interest,

        data.intro_text,
        data.warning_text,
        data.closing_text,

        data.sent_at,
        data.sent_method,

        data.proof_type,
        data.proof_file_name,
        data.proof_sent_at
      )

    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

//deliveries
ipcMain.handle('add-delivery', async (event, data) => {
  if (!data) return { success: false, message: 'No data provided' }

  try {
    const info = db
      .prepare(
        `
        INSERT INTO deliveries (
          order_id,
          invoice_id,
          customer_id,

          customer,

          date,

          planned_delivery_date,
          
          status,
          is_active,
          is_cancelled,
          
          positions,

          delivery_date,
          delivered_by,
          delivery_method,
          tracking_number,
          delivery_reference,
          received_by,
          received_at,

          delivery_address,
          delivery_postal_code,
          delivery_city,
          delivery_country,


          delivered_total_cent,
          remaining_total_cent,

          note,
          internal_note,

          pdf_file_name,
          proof_file_name,
          proof_type,

          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        data.order_id,
        data.invoice_id,
        data.customer_id,
        JSON.stringify(data.customer || {}),
        data.delivery_number,
        data.delivery_date,
        data.planned_delivery_date,
        data.status ?? 'pending',
        data.is_active ?? 1,
        data.is_cancelled,
        data.delivered_by,
        data.delivery_method,
        data.tracking_number,
        data.delivery_reference,
        data.received_by,
        data.received_at,
        data.delivery_address,
        data.delivery_postal_code,
        data.delivery_city,
        data.delivery_country,
        JSON.stringify(data.positions || {}),
        data.delivered_total_cent,
        data.remaining_total_cent,
        data.note,
        data.internal_note,
        data.pdf_file_name,
        data.proof_file_name,
        data.proof_type
      )

    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

//reports
ipcMain.handle('document-report', async (data, tableName, startDate, endDate) => {
  try {
    console.log(startDate, endDate)
    const rows = db
      .prepare(
        `SELECT 
          i.*,
          p.*
        FROM invoices i
        LEFT JOIN payments p 
            ON p.invoice_id = i.id
        WHERE i.date BETWEEN ? AND ?
        ORDER BY i.date ASC, p.payment_date ASC;
        `
      )
      .all(startDate, endDate)
    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})
