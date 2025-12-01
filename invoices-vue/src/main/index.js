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
        orders: db.prepare('SELECT COUNT(*) AS count FROM orders  WHERE is_active = 1').get().count,
        deliveries: db.prepare('SELECT COUNT(*) AS count FROM deliveries WHERE is_active = 1').get()
          .count,
        reminders: db.prepare('SELECT COUNT(*) AS count FROM remeinders').get().count,
        payments: db.prepare('SELECT COUNT(*) AS count FROM payments WHERE is_paid = 1').get().count
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
        company_type, company_name,
        first_name, last_name, full_name, email, phone,
        address, postal_code, city, country,
        tax_number, vat_id, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        customer.company_type ?? '',
        customer.company_name ?? '',
        customer.first_name,
        customer.last_name,
        customer.first_name + ' ' + customer.last_name,
        customer.email,
        customer.phone,
        customer.address ?? '',
        customer.postal_code ?? '',
        customer.city ?? '',
        customer.country ?? '',
        customer.tax_number ?? '',
        customer.vat_id ?? '',
        customer.is_active ?? 1
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
        SELECT id, company_type, company_name, first_name, last_name, is_active FROM customers LIMIT ?
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
  if (!id) {
    return { success: false, message: 'No id provided' }
  }
  try {
    const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(id)
    const invoice_id = db.prepare(`SELECT id FROM invoices ORDER BY id DESC LIMIT 1;`).get()

    const data = {
      customer,
      invoice_id
    }
    return { success: true, data }
    // const rows = db
    //   .prepare(
    //     `
    //    SELECT
    //       c.*,

    //       -- Invoice count
    //       COALESCE((SELECT COUNT(*) FROM invoices i WHERE i.customer_id = c.id AND i.is_active = 1), 0) AS total_invoices,

    //       -- Payments aggregate
    //       COALESCE((SELECT COUNT(*) FROM payments p WHERE p.customer_id = c.id AND p.is_paid = 1), 0) AS total_paid,
    //       COALESCE((SELECT COUNT(*) FROM payments p WHERE p.customer_id = c.id AND p.is_paid = 0), 0) AS total_unpaid,
    //       COALESCE((SELECT COUNT(*) FROM payments p
    //                 JOIN invoices i ON i.id = p.invoice_id
    //                 WHERE p.customer_id = c.id AND p.is_paid = 0 AND i.due_date < DATE('now')), 0) AS overdue,
    //       COALESCE((SELECT COUNT(*) FROM payments p
    //                 JOIN invoices i ON i.id = p.invoice_id
    //                 WHERE p.customer_id = c.id AND p.is_paid = 1 AND p.date < i.due_date), 0) AS early_paid,

    //       -- Orders / Offers / Reminders
    //       COALESCE((SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id AND o.is_active = 1), 0) AS total_orders,
    //       COALESCE((SELECT COUNT(*) FROM offers ofr WHERE ofr.customer_id = c.id AND ofr.is_active = 1), 0) AS total_offers,
    //       COALESCE((SELECT COUNT(*) FROM reminders r WHERE r.customer_id = c.id AND r.is_active = 1), 0) AS total_reminders

    //     FROM customers c
    //     WHERE c.id = ?

    //   `
    //   )
    //   .get(id)
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
            customer,
            is_active,
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
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        JSON.stringify(invoice.customer) || null,
        invoice.is_active,
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

ipcMain.handle('get-invoice-by-id', async (event, id) => {
  if (!id) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const rows = db
      .prepare(
        `
          SELECT *
          FROM invoices
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

ipcMain.handle('set-invoice-status', async (event, payload) => {
  if (!payload) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const { id, status } = payload
    db.prepare(`Update invoices Set is_active = ? WHERE id = ?`).run(status, id)
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
  if (!data) {
    return { success: false, message: 'No data provided' }
  }

  try {
    const info = db
      .prepare(
        `
          INSERT INTO offers (
            customer_id,
            is_active,
            offer_date,
            subject,
            is_legal,
            valid_until,
            currency,
            payment_terms,
            positions,
            total_net,
            total_vat,
            total_gross
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        data.customer_id,
        data.is_active ?? 1,
        data.offer_date,
        data.subject,
        data.is_legal ?? 1,
        data.valid_until,
        data.currency ?? 'EUR',
        data.payment_terms ?? '',
        JSON.stringify(data.positions || []),
        data.total_net ?? 0,
        data.total_vat ?? 0,
        data.total_gross ?? 0
      )

    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

//orders
ipcMain.handle('add-order', async (event, data) => {
  if (!data) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const info = db
      .prepare(
        `
      INSERT INTO orders (
        order_number,
        date,
        is_legal,
        is_active,
        service_period_start,
        service_period_end,
        validity_date,
        delivery_date,
        delivery_address,
        customer_id,
        company_name,
        first_name,
        last_name,
        address,
        postal_code,
        city,
        country,
        email,
        customer_reference,
        payment_terms,
        payment_method,
        payment_conditions,
        payment_purpose,
        paid_amount,
        delivery_terms,
        shipping_method,
        customer_notes,
        internal_notes,
        special_notes,
        closing_text,
        positions_json
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `
      )
      .run(
        data.order_number,
        data.date,
        data.is_legal,
        data.is_active,
        data.service_period_start,
        data.service_period_end,
        data.validity_date,
        data.delivery_date,
        data.delivery_address,
        data.selected_customer.id,
        data.selected_customer.company_name,
        data.selected_customer.first_name,
        data.selected_customer.last_name,
        data.selected_customer.address,
        data.selected_customer.postal_code,
        data.selected_customer.city,
        data.selected_customer.country,
        data.selected_customer.email,
        data.customer_reference,
        data.payment.payment_terms,
        data.payment.payment_method,
        data.payment.payment_conditions,
        data.payment.payment_purpose,
        data.payment.paid_amount,
        data.delivery_terms,
        data.shipping_method,
        data.customer_notes,
        data.internal_notes,
        data.special_notes,
        data.closing_text,
        JSON.stringify(data.positions) // 🔥 burada JSON string'e çeviriyoruz
      )

    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('Error saving order:', err)
    return { success: false, message: err.message }
  }
})

//deliveries
ipcMain.handle('add-delivery', async (event, data) => {
  if (data) {
    try {
      const customer = JSON.stringify(data.customer || {})
      const positions = JSON.stringify(data.positions || {})

      db.prepare(
        `
          INSERT INTO deliveries (
            order_id,
            date,
            delivery_status,
            delivered_by,
            delivery_reference,
            received_by,
            note,
            customer,
            positions
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      ).run(
        data.order_id,
        data.date,
        data.note,
        data.delivery_status,
        data.delivered_by,
        data.delivery_reference,
        data.received_by,
        customer,
        positions
      )
      return { success: true }
    } catch (err) {
      console.error('DB error:', err.message)
      return { success: false, message: err.message }
    }
  }
})

//reminders
ipcMain.handle('add-reminder', async (event, data) => {
  if (!data) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const info = db
      .prepare(
        `
          INSERT INTO reminders (
            date,
            remeinder_fee,
            late_fee,
            level,
            intro_text,
            warning_text,
            closing_text,
            payment_deadline,
            invoice
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        data.date,
        data.remeinder_fee,
        data.late_fee,
        data.level,
        data.intro_text,
        data.warning_text,
        data.closing_text,
        data.payment_deadline,
        JSON.stringify(data.invoice || {})
      )
    return { success: true, lastInsertId: info.lastInsertRowid }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

//add payment
ipcMain.handle('add-payment', async (data, file_name, image_file) => {
  if (!data) {
    return { success: false, message: 'No data provided' }
  }
  try {
    const info = db
      .prepare(
        `
          INSERT INTO payments (
            payment_date,
            amount,
            payment_method,
            reference,
            notes,
            partial_paid,
            file_name,
            is_active,
            invoice_id,
            invoice_customer_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `
      )
      .run(
        data.payment_date,
        data.amount,
        data.payment_method,
        data.reference,
        data.notes,
        data.partial_paid ? 1 : 0, // ✅ Boolean -> Integer
        file_name,
        data.is_active,
        data.invoice_id,
        data.invoice_customer_id
      )
    if (image_file) {
      const base64Data = image_file.includes(',') ? image_file.split(',')[1] : image_file
      const buffer = Buffer.from(base64Data, 'base64')
      const savePath = path.join(app.getAppPath(), 'src/renderer/public/uploads', file_name)
      await fs.promises.writeFile(savePath, buffer)
    }
    return { success: true, lastInsertId: info.lastInsertRowid }
    // const buffer = Buffer.from(image_file.split(',')[1], 'base64')
    // // const savePath = path.join(os.homedir(), fileName);//linux home folder
    // // const savePath = path.join(os.homedir(), "Downloads", fileName);// linux downloads folder
    // const savePath = path.join(app.getAppPath(), 'src/renderer/public/uploads', file_name) // inner app uploads folder
    // await fs.promises.writeFile(savePath, buffer)
    // return { success: true, customer: row }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-document', async (event, data, tableName) => {
  let limit = 50
  try {
    if (tableName === 'invoices') {
      const rows = db
        .prepare(
          `
         SELECT
              i.id,
              i.total,
              i.created_at,
              c.id,
              c.company_name,
              c.first_name,
              c.last_name,
              COALESCE(SUM(p.amount), 0) AS total_paid,
              (i.total - COALESCE(SUM(p.amount), 0)) AS remaining_amount
          FROM invoices i
          JOIN customers c
              ON c.id = i.customer_id
          LEFT JOIN payments p
              ON p.invoice_id = i.id
          WHERE i.is_active = 1
          GROUP BY i.id
          ORDER BY i.created_at DESC
          LIMIT ?;
        `
        )
        .all(limit)
      return { success: true, rows }
    }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-document-by-id', async (event, data, id, tableName) => {
  try {
    if (tableName === 'invoices') {
      const rows = db
        .prepare(
          `
            SELECT 
            i.*,
            c.*,
            p.*
            FROM invoices i
            JOIN customers c ON c.customer_id = i.invoice_customer_id
            LEFT JOIN payments p ON p.payment_invoice_id = i.invoice_id
            WHERE i.invoice_id = :id
          `
        )
        .all({ id })
      return { success: true, rows }
    }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

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
