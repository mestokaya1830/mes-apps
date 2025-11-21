import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from '../db/sqliteConn.js'
import nodeMailer from 'nodemailer'

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
  app.on('browser-window-created', (_, window) => {
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

ipcMain.handle('register', async (event, image, data) => {
  try {
    if (data) {
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
    } else {
      return { success: false, message: 'Invalid email or password' }
    }
  } catch (error) {
    console.log(error)
  }
})

ipcMain.handle('update-user', async (event, image, data) => {
  try {
    if (data) {
      db.prepare('DELETE FROM users WHERE id != 1').run()
      const companyDetailsJSON = JSON.stringify(data.company_details || {})
      const contactPersonJSON = JSON.stringify(data.contact_person || {})

      const user = db
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

      if (user.changes > 0) {
        return { success: true, message: 'Profil wurde erfolgreich aktualisiert' }
      } else {
        return { success: false, message: 'Profil konnte nicht aktualisiert werden' }
      }
    } else {
      return { success: false, message: 'Ungültige Daten' }
    }
  } catch (error) {
    console.error('updateProfile error:', error)
    return { success: false, message: error.message }
  }
})

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

ipcMain.handle('login', async (event, data) => {
  const { email, password } = data
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

ipcMain.handle('email-verfication', async (event, data) => {
  const { email } = data
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

ipcMain.handle('reset-password', async (event, data) => {
  try {
    db.prepare("DELETE FROM tokens WHERE replace(expires_at, 'T', ' ') < datetime('now')").run()
    const { token, password } = data
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

ipcMain.handle('get-customers', async () => {
  try {
    const rows = db.prepare('SELECT * FROM customers').all()
    return { success: true, customers: rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-customer-by-id', async (event, id) => {
  try {
    const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(id)
    return { success: true, customer: row }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('customer-details', async (event, id) => {
  try {
    const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(id)
    return { success: true, customer: row }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('add-customer', async (event, data) => {
  try {
    const row = db
      .prepare('INSERT INTO customers (first_name, last_name, email, phone) VALUES (?,?,?,?)')
      .run(data.first_name, data.last_name, data.email, data.phone)
    return { success: true, customer: row }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('update-customer', async (event, data) => {
  const { id, customer } = data
  try {
    const row = db
      .prepare(
        'UPDATE customers SET customer_type = ?, company_name = ?, first_name = ?, last_name = ?, address = ?, postal_code = ?, city = ?, country = ?, email = ?, phone = ?, tax_number = ?, vat_id = ?, is_active = ?  WHERE id = ?'
      )
      .run(
        customer.customer_type,
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
    return { success: true, customer: row }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('delete-customer', async (event, id) => {
  try {
    const row = db.prepare('DELETE FROM customers WHERE id = ?').run(id)
    return { success: true, customer: row }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('save-document', async (event, tableName, data) => {
  if (tableName === 'invoices') {
    try {
      const customer = JSON.stringify(data.selected_customer || {})
      const payment = JSON.stringify(data.payment || {})
      const positions = JSON.stringify(data.positions || {})
      const tax_options = JSON.stringify(data.tax_options || {})
      const summary = JSON.stringify(data.summary || {})
      const row = db
      db.prepare(
        `
    INSERT INTO invoices (
      date,
      is_active,
      currency,
      service_date,
      customer,
      payment,
      positions,
      tax_options,
      summary
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
      ).run(
        data.date,
        data.is_active,
        data.currency,
        data.service_date,
        customer,
        payment,
        positions,
        tax_options,
        summary
      )
      return { success: true, customer: row }
    } catch (err) {
      console.error('DB error:', err.message)
      return { success: false, message: err.message }
    }
  }

  //save offers table
  if (tableName === 'offers') {
    console.log(data)
    try {
      const customer = JSON.stringify(data.selected_customer || {})
      const payment = JSON.stringify(data.payment || {})
      const positions = JSON.stringify(data.positions || {})
      const summary = JSON.stringify(data.summary || {})
      const row = db
      db.prepare(
        `
    INSERT INTO offers (
      date,
      subject,
      is_legal,
      is_active,
      valid_until,
      currency,
      customer,
      payment,
      positions,
      summary
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `
      ).run(
        data.date,
        data.subject,
        data.is_legal,
        data.is_active,
        data.valid_until,
        data.currency,
        customer,
        payment,
        positions,
        summary
      )
      return { success: true, customer: row }
    } catch (err) {
      console.error('DB error:', err.message)
      return { success: false, message: err.message }
    }
  }

  //save orders table
  if (tableName === 'orders') {
    try {
      const customer = JSON.stringify(data.selected_customer || {})
      const payment = JSON.stringify(data.payment || {})
      const positions = JSON.stringify(data.positions || {})
      const summary = JSON.stringify(data.summary || {})
      const row = db
      db.prepare(
        `
    INSERT INTO orders (
      date,
      is_legal,
      is_active,
      currency,
      service_period_start,
      service_period_end,
      validity_date,
      delivery_date,
      delivery_terms,
      shipping_method,
      customer_reference,
      customer_notes,
      internal_notes,
      special_notes,
      closing_text,
      customer,
      positions,
      payment,
      summary
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
      ).run(
        data.date,
        data.is_legal,
        data.is_active,
        data.currency,
        data.service_period_start,
        data.service_period_end,
        data.validity_date,
        data.delivery_date,
        data.delivery_terms,
        data.shipping_method,
        data.customer_reference,
        data.customer_notes,
        data.internal_notes,
        data.special_notes,
        data.closing_text,
        customer,
        payment,
        positions,
        summary
      )
      return { success: true, customer: row }
    } catch (err) {
      console.error('DB error:', err.message)
      return { success: false, message: err.message }
    }
  }
})

ipcMain.handle('get-document', async (data, tabelName) => {
  try {
    const rows = db.prepare(`SELECT * FROM ${tabelName}`).all()
    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('get-document-by-id', async (data, id, tableName) => {
  try {
    const rows = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id)
    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('set-document-status', async (data, id, tableName, value) => {
  try {
    db.prepare(`Update ${tableName} Set is_active = ? WHERE id = ?`).run(value, id)
    return { success: true }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('set-paid-status', async (data, id, tableName, value) => {
  try {
    db.prepare(`Update ${tableName} Set status = ? WHERE id = ?`).run(value, id)
    return { success: true }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('document-report', async (data, tableName, startDate, endDate) => {
  try {
    console.log(startDate, endDate)
    const rows = db
      .prepare(`SELECT * FROM ${tableName} WHERE date BETWEEN ? AND ?`)
      .all(startDate, endDate)
    return { success: true, rows }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})