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
    width: 1600,
    height: 1000,
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
    const { image, data } = payload
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
          bank_account_holder
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
        data.bank_account_holder
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
      row.logo = row.logo.toString('base64')
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
    const rows = db.prepare('SELECT * FROM users').get()
    if (rows && rows.logo) {
      // Buffer → Base64 string
      rows.logo = rows.logo.toString('base64')
    }
    return { success: true, rows }
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
        date,
        company_type, company_name,
        first_name, last_name, full_name, email, phone, website,
        address, postal_code, city, country,
        tax_number, vat_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        customer.is_active ? 1 : 0,
        new Date().toISOString().split('T')[0],

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

ipcMain.handle('get-customer-by-id', async (event, id) => {
  console.log('get-customer-by-id called with id:', id)
  if (!id) {
    return { success: false, message: 'No id provided' }
  }
  try {
    const rows = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(id)
    return { success: true, rows }
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
          service_date,
          date,
          due_date,
          currency,
          payment_terms,
          payment_conditions,
          early_payment_offer,
          early_payment_discount,
          early_payment_percentage,
          early_payment_days,
          early_payment_deadline,
          early_paid_discount_applied,
          paid_at,
          is_small_company,
          is_reverse_charge,
          is_eu_delivery,
          positions,
          net_total,
          vat_total,
          gross_total,
          gross_total_after_discount,
          payment_status,
          cancelled_at,
          cancelled_by,
          cancellation_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        invoice.customer_id,
        JSON.stringify(invoice.customer) || '{}',
        invoice.is_active || 1,
        invoice.service_date,
        invoice.date,
        invoice.due_date,
        invoice.currency,
        invoice.payment_terms,
        invoice.payment_conditions || '',
        invoice.early_payment_offer ? 1 : 0,
        invoice.early_payment_discount || 0,
        invoice.early_payment_percentage || 0,
        invoice.early_payment_days || 0,
        invoice.early_payment_deadline || null,
        invoice.early_paid_discount_applied ? 1 : 0,
        invoice.paid_at || null,
        invoice.is_small_company ? 1 : 0,
        invoice.is_reverse_charge ? 1 : 0,
        invoice.is_eu_delivery ? 1 : 0,
        JSON.stringify(invoice.positions || []),
        invoice.net_total || 0,
        invoice.vat_total || 0,
        invoice.gross_total || 0,
        invoice.gross_total_after_discount || 0,
        invoice.payment_status || 'unpaid',
        invoice.cancelled_at || '',
        invoice.cancelled_by || '',
        invoice.cancellation_reason || ''
      )

    return { success: true, last_id: info.lastInsertRowid }
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
          SELECT id, date, due_date, paid_at, gross_total, gross_total_after_discount, is_active, payment_status, customer
          FROM invoices 
          WHERE is_active = 1 AND payment_status != 'paid'
          ORDER BY id DESC
          LIMIT ?
        `
      )
      .all(limit)

    const total = db
      .prepare(
        `SELECT COUNT(id) As total FROM invoices WHERE is_active = 1 AND payment_status != 'paid'`
      )
      .get().total
    return { success: true, rows, total }
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
      const rows = db
        .prepare(
          `
            SELECT *
            FROM invoices
            WHERE id = ?
          `
        )
        .get(id)

      const payments = db
        .prepare(
          `
            SELECT *
            FROM payments
            WHERE invoice_id = ? AND is_active = 1 ORDER BY id DESC
          `
        )
        .all(id)
      const payment_total =
        db
          .prepare(
            `SELECT sum(payment_amount) As total FROM payments WHERE invoice_id = ? AND is_active = 1`
          )
          .get(id)?.total ?? 0

      const reminders = db
        .prepare(
          `
            SELECT id, date, payment_deadline
            FROM reminders
            WHERE invoice_id = ? AND is_active = 1 ORDER BY id DESC
          `
        )
        .all(id)
      return { success: true, rows, payments, payment_total, reminders }
    }

    //from payments create
    if (table_name === 'payments') {
      let rows = db
        .prepare(
          `
            SELECT id, customer_id, date, due_date, gross_total, gross_total_after_discount, early_payment_offer, early_payment_days, early_payment_discount, early_paid_discount_applied, currency, payment_status
            FROM invoices
            WHERE id = ? AND is_active = 1
          `
        )
        .get(id)
      const payment_id =
        db.prepare(`SELECT id FROM payments As id ORDER BY id DESC LIMIT 1;`).get()?.id ?? 0

      const payment_total =
        db
          .prepare(
            `SELECT sum(payment_amount) As total FROM payments WHERE is_active = 1 AND invoice_id = ?`
          )
          .get(id)?.total ?? 0
      return { success: true, rows, payment_id, payment_total }
    }

    //from reminders create
    if (table_name === 'reminders') {
      let rows = db
        .prepare(
          `
            SELECT id, customer_id, date, due_date, paid_at, gross_total, gross_total_after_discount, early_payment_offer, early_payment_days, early_payment_percentage, early_payment_discount, currency, payment_status, customer
            FROM invoices
            WHERE id = ?
          `
        )
        .get(id)
      const reminder_id =
        db.prepare(`SELECT * FROM reminders ORDER BY id DESC LIMIT 1`).get()?.id ?? 0
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
    let countQuery = ''
    let rows = []
    let total = 0
    let limit = 50

    switch (category) {
      case 'all':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, gross_total_after_discount,
                 is_active, payment_status, early_payment_offer, early_paid_discount_applied,
                 cancelled_at, customer
          FROM invoices
          ORDER BY id DESC
          LIMIT ?
        `
        countQuery = `SELECT COUNT(*) as total FROM invoices`
        break

      case 'active':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, gross_total_after_discount,
                 is_active, payment_status, early_payment_offer, early_paid_discount_applied, customer
          FROM invoices
          WHERE is_active = 1 AND payment_status != 'paid'
          ORDER BY id DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 1 AND payment_status != 'paid'
        `
        break

      case 'canceled':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, gross_total_after_discount,
                 is_active, payment_status, early_payment_offer, early_paid_discount_applied,
                 cancelled_at, customer
          FROM invoices
          WHERE is_active = 0
          ORDER BY updated_at DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 0
        `
        break

      case 'is_paid':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, is_active, payment_status,
                 early_payment_offer, early_paid_discount_applied, customer
          FROM invoices
          WHERE is_active = 1 AND payment_status = 'paid'
          ORDER BY updated_at DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 1 AND payment_status = 'paid'
        `
        break

      case 'is_partially_paid':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, is_active, payment_status,
                 early_payment_offer, early_paid_discount_applied, customer
          FROM invoices
          WHERE is_active = 1 AND payment_status = 'partially_paid'
          ORDER BY updated_at DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 1 AND payment_status = 'partially_paid'
        `
        break

      case 'unpaid':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, is_active, payment_status,
                 early_payment_offer, early_paid_discount_applied, customer
          FROM invoices
          WHERE is_active = 1 AND payment_status = 'unpaid'
          ORDER BY updated_at DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 1 AND payment_status = 'unpaid'
        `
        break

      case 'overdue':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, is_active, payment_status,
                 early_payment_offer, early_paid_discount_applied, customer
          FROM invoices
          WHERE is_active = 1
            AND payment_status = 'unpaid'
            AND DATE(due_date, 'localtime') < DATE('now', 'localtime')
          ORDER BY updated_at DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 1
            AND payment_status = 'unpaid'
            AND DATE(due_date, 'localtime') < DATE('now', 'localtime')
        `
        break

      case 'is_early_paid':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, is_active, payment_status,
                 early_payment_offer, early_paid_discount_applied, customer
          FROM invoices
          WHERE is_active = 1
            AND payment_status = 'paid'
            AND DATE(paid_at, 'localtime') < DATE(due_date, 'localtime')
          ORDER BY updated_at DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 1
            AND payment_status = 'paid'
            AND DATE(paid_at, 'localtime') < DATE(due_date, 'localtime')
        `
        break

      case 'is_late_paid':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, is_active, payment_status,
                 early_payment_offer, early_paid_discount_applied, customer
          FROM invoices
          WHERE is_active = 1
            AND payment_status = 'paid'
            AND DATE(paid_at, 'localtime') > DATE(due_date, 'localtime')
          ORDER BY updated_at DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 1
            AND payment_status = 'paid'
            AND DATE(paid_at, 'localtime') > DATE(due_date, 'localtime')
        `
        break

      case 'outstanding':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, is_active, payment_status,
                 early_payment_offer, early_paid_discount_applied, customer
          FROM invoices
          WHERE is_active = 1
            AND (payment_status = 'unpaid' OR payment_status = 'overdue')
          ORDER BY updated_at DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 1
            AND (payment_status = 'unpaid' OR payment_status = 'overdue')
        `
        break

      case 'is_reminded':
        query = `
          SELECT id, date, due_date, paid_at, gross_total, is_active, payment_status,
                 early_payment_offer, early_paid_discount_applied, customer
          FROM invoices
          WHERE is_active = 1 AND is_reminded = 1
          ORDER BY updated_at DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 1 AND is_reminded = 1
        `
        break

      default:
        query = `
          SELECT *
          FROM invoices
          WHERE is_active = 1 AND payment_status != 'paid'
          ORDER BY id DESC
          LIMIT ?
        `
        countQuery = `
          SELECT COUNT(id) as total
          FROM invoices
          WHERE is_active = 1 AND payment_status != 'paid'
        `
    }

    rows = db.prepare(query).all(limit)

    if (countQuery) {
      const countResult = db.prepare(countQuery).get()
      total = countResult.total
    }

    return { success: true, rows, total }
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
    let total = 0
    if (isNaN(term) && !term.includes('-')) {
      rows = db
        .prepare(
          `SELECT 
            id,
            date,
            due_date,
            paid_at,
            gross_total,
            gross_total_after_discount,
            is_active,
            payment_status,
            early_payment_offer,
            early_paid_discount_applied,
            customer
          FROM invoices
          WHERE is_active = 1 AND (
                  json_extract(customer, '$.first_name') LIKE '${term}%'
                  OR json_extract(customer, '$.last_name') LIKE '${term}%'
                  OR json_extract(customer, '$.company_name') LIKE '${term}%'
                )
          ORDER BY id DESC
          LIMIT ?`
        )
        .all(limit)
      total = db.prepare(`SELECT COUNT(id) As total FROM invoices WHERE is_active = 1`).get().total
    } else {
      if (isNaN(term) && term.includes('-')) {
        const [start, end] = term.split('-').map((item) => parseInt(item.replace(/\D/g, ''), 10))

        rows = db
          .prepare(
            `SELECT id, date, due_date, gross_total, gross_total_after_discount, is_active, payment_status, early_payment_offer, early_paid_discount_applied, customer
            FROM invoices
            WHERE is_active = 1 AND id BETWEEN ? AND ?
            ORDER BY id DESC LIMIT ?`
          )
          .all(start, end, limit)
        total = db
          .prepare(
            `SELECT COUNT(id) As total FROM invoices WHERE is_active = 1 AND id BETWEEN ? AND ?`
          )
          .get(start, end).total
      } else {
        rows = db
          .prepare(
            `SELECT id, date, due_date, gross_total, gross_total_after_discount, is_active,  payment_status, early_payment_offer, early_paid_discount_applied, customer
            FROM invoices
            WHERE is_active = 1 AND (id = ? OR customer_id = ?)
            ORDER BY id DESC LIMIT ?`
          )
          .all(term, term, limit)
        total = db
          .prepare(`SELECT COUNT(id) As total FROM invoices WHERE is_active = 1 AND id + 0 LIKE ?`)
          .get(term).total
      }
    }
    return { success: true, rows, total }
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
          gross_total_after_discount,
          is_active,
          payment_status,
          early_payment_offer,
          early_paid_discount_applied,
          customer
        FROM invoices
        WHERE is_active = 1 AND payment_status != 'paid' AND date BETWEEN ? AND ?
        ORDER BY id DESC
        LIMIT ?;`
      )
      .all(start, end, limit)
    const total = db
      .prepare(
        `SELECT COUNT(id) As total FROM invoices WHERE is_active = 1 AND payment_status != 'paid' AND date BETWEEN ? AND ?`
      )
      .get(start, end).total
    return { success: true, rows, total }
  } catch (error) {
    console.error('dateFilter error:', error)
    return { success: false, message: error.message }
  }
})

//payments
ipcMain.handle('add-payment', async (event, payload) => {
  if (!payload) return { success: false, message: 'No data provided' }

  try {
    const data = payload

    const info = db
      .prepare(
        `
        INSERT INTO payments (
          is_active,
          date,

          invoice_id,
          customer_id,

          payment_amount,
          payment_method,
          payment_reference,

          counterparty_name,
          counterparty_iban,
          counterparty_bic,
          counterparty_bank,

          cancelled_at,
          cancelled_by,
          cancellation_reason,

          notes,
          file_name,

          invoice
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `
      )
      .run(
        data.is_active ? 1 : 0,
        data.date,

        data.invoice_id,
        data.customer_id,

        data.payment_amount,
        data.payment_method,
        data.payment_reference ?? '',

        data.counterparty_name ?? '',
        data.counterparty_iban ?? '',
        data.counterparty_bic ?? '',
        data.counterparty_bank ?? '',

        data.cancelled_at ?? '',
        data.cancelled_by ?? '',
        data.cancellation_reason ?? '',

        data.notes ?? '',
        data.file_name ?? '',

        JSON.stringify(data.invoice)
      )
    db.prepare(
      'UPDATE invoices SET payment_status = ?, paid_at = ?, early_paid_discount_applied = ? WHERE id = ?'
    ).run(
      data.invoice.payment_status,
      data.date,
      data.invoice.early_paid_discount_applied ? 1 : 0,
      data.invoice.id
    )

    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err)
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
          WHERE id = ? AND is_active = 1
        `
      )
      .get(id)

    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('cancel-payment-by-id', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No id provided' }
  }
  try {
    db.transaction(() => {
      const { id, invoice_id, cancelled_at, cancelled_by, cancellation_reason } = payload

      db.prepare(
        `
            UPDATE payments
            SET is_active = 0,
                cancelled_at = ?,
                cancelled_by = ?,
                cancellation_reason = ?
            WHERE id = ?
          `
      ).run(cancelled_at, cancelled_by, cancellation_reason, id)

      const hasActivePayment = db
        .prepare(
          `
            SELECT 1
            FROM payments
            WHERE invoice_id = ?
              AND is_active = 1
              AND id != ?
            LIMIT 1
          `
        )
        .get(invoice_id, id)

      if (!hasActivePayment) {
        db.prepare(
          `
            UPDATE invoices
            SET payment_status = 'unpaid'
            WHERE id = ?
          `
        ).run(invoice_id)
      }
    })()

    return { success: true }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

//reminders
ipcMain.handle('add-reminder', async (event, payload) => {
  const data = payload
  if (!payload) return { success: false, message: 'No data provided' }

  try {
    const info = db
      .prepare(
        `
        INSERT INTO reminders (
          is_active,
          date,
          invoice_id,
          customer_id,

          customer,
          invoice,

          level,
          sent_method,
          proof_type,

          reminder_fee,
          late_interest,

          payment_deadline,

          intro_text,
          warning_text,
          closing_text,
          
          cancelled_at,
          cancelled_by,
          cancellation_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        data.is_active ? 1 : 0,
        data.date,

        data.invoice_id,
        data.customer_id,

        JSON.stringify(data.customer),
        JSON.stringify(data.invoice),

        data.level,
        data.sent_method,
        data.proof_type,

        data.reminder_fee,
        data.late_interest,

        data.payment_deadline,

        data.intro_text,
        data.warning_text,
        data.closing_text,

        data.cancelled_at,
        data.cancelled_by,
        data.cancellation_reason
      )

    if (info.lastInsertRowid) {
      db.prepare('UPDATE invoices SET is_reminded = 1 WHERE id = ?').run(data.invoice_id)
    }
    return { success: true, last_id: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-reminder-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const rows = db
      .prepare(
        `
          SELECT *
          FROM reminders
          WHERE id = ? AND is_active = 1
        `
      )
      .get(id)

    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('cancel-reminder-by-id', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No id provided' }
  }
  try {
    db.transaction(() => {
      const { id, invoice_id, cancelled_at, cancelled_by, cancellation_reason } = payload

      db.prepare(
        `
            UPDATE reminders
            SET is_active = 0,
                cancelled_at = ?,
                cancelled_by = ?,
                cancellation_reason = ?
            WHERE id = ?
          `
      ).run(cancelled_at, cancelled_by, cancellation_reason, id)

      const hasActiveReminder = db
        .prepare(
          `
            SELECT 1
            FROM reminders
            WHERE invoice_id = ?
              AND is_active = 1
              AND id != ?
            LIMIT 1
          `
        )
        .get(invoice_id, id)

      if (!hasActiveReminder) {
        db.prepare(
          `
            UPDATE invoices
            SET is_reminded = 0
            WHERE id = ?
          `
        ).run(invoice_id)
      }
    })()

    return { success: true }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
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
          is_active,
          is_legal,

          introduction_text,
          closing_text,
          notes,
          
          internal_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        data.customer_id,

        data.date,
        data.valid_until || null,

        JSON.stringify(data.customer || {}),

        data.subject,
        data.currency,
        data.payment_terms || '',
        data.delivery_terms || '',
        data.delivery_time || '',

        JSON.stringify(data.positions || []),
        data.net_total || 0,
        data.vat_total || 0,
        data.gross_total || 0,

        data.status || 'draft',
        data.is_active ? 1 : 0,
        data.is_legal ? 1 : 0,

        data.introduction_text || '',
        data.closing_text || '',
        data.notes || '',

        data.internal_notes || ''
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
          SELECT id, date, valid_until, status, customer, is_active
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

ipcMain.handle('cancel-offer-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No id provided' }
  }
  try {
    const info = db.prepare('UPDATE offers SET is_active = 0 WHERE id = ?').run(id)
    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-offer-by-status', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const rows = db
      .prepare(
        `
          SELECT id, date, status, status_by, status_comments
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

ipcMain.handle('cancel-offer', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const { id, is_active, cancelled_at, cancellation_reason, cancelled_by } = payload
    db.prepare(
      `Update offers Set is_active = ?, cancelled_at =?, cancellation_reason = ?, cancelled_by = ? WHERE id = ?`
    ).run(is_active, cancelled_at, cancellation_reason, cancelled_by, id)
    return { success: true }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

// /orders
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

          subject,

          date,
          validity_date,
          service_period_start,
          service_period_end,
          delivery_date,

          status,
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
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?
        )
      `
      )
      .run(
        null, // id (AUTOINCREMENT)

        data.customer_id,
        JSON.stringify(data.customer || {}),

        data.subject,

        data.date,
        data.validity_date,
        data.service_period_start,
        data.service_period_end,
        data.delivery_date,

        data.status ?? 'pending',
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

        data.created_at ?? new Date().toISOString(),
        data.updated_at ?? new Date().toISOString()
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

ipcMain.handle('update-order-by-id', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }

  try {
    const {
      id,
      status,
      status_by,
      status_date,
      status_comments,
      subject,
      delivery_address,
      delivery_postal_code,
      delivery_city,
      delivery_country,
      shipping_method,
      payment_terms,
      payment_method,
      payment_reference,
      customer_notes,
      internal_notes
    } = payload

    const info = db
      .prepare(
        `
        UPDATE orders
        SET
          status = ?,
          status_by = ?,
          status_date = ?,
          status_comments = ?,
          subject = ?,
          delivery_address = ?,
          delivery_postal_code = ?,
          delivery_city = ?,
          delivery_country = ?,
          shipping_method = ?,
          payment_terms = ?,
          payment_method = ?,
          payment_reference = ?,
          customer_notes = ?,
          internal_notes = ?,
          updated_at = datetime('now')
        WHERE id = ?
        `
      )
      .run(
        status,
        status_by,
        status_date,
        status_comments,
        subject,
        delivery_address,
        delivery_postal_code,
        delivery_city,
        delivery_country,
        shipping_method,
        payment_terms,
        payment_method,
        payment_reference,
        customer_notes,
        internal_notes,
        id
      )

    return { success: true, changes: info.changes }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('cancel-order-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No id provided' }
  }
  try {
    const info = db.prepare('UPDATE orders SET is_active = 0 WHERE id = ?').run(id)
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

ipcMain.on('save-invoice-pdf', (event, { buffer, fileName }) => {
  try {
    // const savePath = '/media/username/USB/invoice-pdfs'
    // const savePath = path.join(app.getPath('userData'), 'pdf-storage')// in home->username-> .config folder
    const savePath = path.join(app.getPath('downloads'), 'invoice-pdfs')
    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath)

    const filePath = path.join(savePath, `${fileName}.pdf`)
    fs.writeFileSync(filePath, Buffer.from(buffer))

    console.log('PDF Saved:', filePath)
    // Burada audit log veya DB işlemi yapılabilir
  } catch (err) {
    console.error('PDF Error:', err)
  }
})


//reports
ipcMain.handle('report-customers', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }

  try {
    const { start, end, limit } = payload

    const rows = db
      .prepare(
        `      SELECT 
              c.id,
              c.company_name,
              c.full_name,
              COUNT(i.id) AS invoice_count,
              MAX(i.date) AS last_activity,
              SUM(i.gross_total) AS invoice_total,
              SUM(CASE WHEN i.payment_status = 'paid' THEN 1 ELSE 0 END) AS paid,
              SUM(CASE WHEN i.payment_status = 'unpaid' THEN 1 ELSE 0 END) AS unpaid,
              SUM(CASE WHEN i.payment_status = 'partially_paid' THEN 1 ELSE 0 END) AS partially_paid,
              SUM(CASE WHEN i.due_date < DATE('now') AND i.payment_status != 'paid' THEN 1 ELSE 0 END) AS overdue
          FROM customers c
          LEFT JOIN invoices i ON c.id = i.customer_id
          WHERE c.is_active = 1 AND c.date BETWEEN ? AND ?
          GROUP BY c.id
          ORDER BY c.company_name ASC   -- veya toplam gelire göre DESC
          LIMIT ?`
      )
      .all(start, end, limit)

    return {
      success: true,
      rows: rows
    }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('report-invoices', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const { start, end } = payload
    const rows = db
      .prepare(
        `SELECT * FROM invoices WHERE is_active = 1 AND date BETWEEN ? AND ? ORDER BY date DESC`
      )
      .all(start, end)

    console.log(rows)

    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('report-taxs', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }

  const { start, end } = payload

  try {
    const rows = db
      .prepare(
        `SELECT * FROM invoices WHERE is_active = 1 AND date BETWEEN ? AND ? ORDER BY date DESC`
      )
      .all(start, end)
    return { success: true, rows }
  } catch (error) {
    console.error('DB error:', error.message)
    return { success: false, message: error.message }
  }
})

ipcMain.handle('report-sales', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }

  const { start, end } = payload

  try {
    const rows = db
      .prepare(
        `SELECT * FROM invoices WHERE is_active = 1 AND date BETWEEN ? AND ? ORDER BY date DESC`
      )
      .all(start, end)
    return { success: true, rows }
  } catch (error) {
    console.error('DB error:', error.message)
    return { success: false, message: error.message }
  }
})