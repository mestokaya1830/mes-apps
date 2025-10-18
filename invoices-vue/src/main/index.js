import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from '../db/sqliteConn.js'
import nodeMailer from 'nodemailer'

let win = null

function createWindow() {
  win = new BrowserWindow({
    // fullscreen: true,
    width: 1200,
    height: 800,
    show: false,
    frame: false,
    autoHideMenuBar: true,
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

  win.on('ready-to-show', () => {
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

app.whenReady().then(async () => {
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('control-window', (event, data) => {
  console.log(data)
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
      console.log(data)
      const user = db
        .prepare(
          `INSERT INTO users (
            first_name,
            last_name,
            password,
            email,
            phone,
            address,
            postal_code,
            city,
            country,
            website,
            firm_name,
            legal_form,
            managing_director,
            tax_number,
            tax_office,
            tax_prefix,
            vat_id,
            court_registration,
            court_location,
            logo,
            image_type,
            company_signature,
            bank_name,
            bic,
            iban,
            bank_account_holder
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          data.first_name,
          data.last_name,
          data.password,
          data.email,
          data.phone,
          data.address,
          data.postal_code,
          data.city,
          data.country,
          data.website,
          data.firm_name,
          data.legal_form,
          data.managing_director,
          data.tax_number,
          data.tax_office,
          data.tax_prefix,
          data.vat_id,
          data.court_registration,
          data.court_location,
          Buffer.from(image),
          data.image_type,
          data.company_signature,
          data.bank_name,
          data.bic,
          data.iban,
          data.bank_account_holder
        )

      //for to disk storage
      // const buffer = Buffer.from(image.split(',')[1], 'base64')
      // const savePath = path.join(
      //   app.getAppPath(),
      //   'src',
      //   'renderer',
      //   'src',
      //   'assets',
      //   data.firm_name.toLowerCase().replace(/[^a-z0-9_-]/gi, '_') + '.' + data.logo.split('.')[1]
      // )
      // await fs.promises.writeFile(savePath, buffer)

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
    const row = db
      .prepare(
        'UPDATE users SET bank_name = ?, bic = ?, iban = ?, bank_account_holder = ?,image_type = ?, logo = ? WHERE id = ?'
      )
      .run(
        data.bank_name,
        data.bic,
        data.iban,
        data.bank_account_holder,
        data.image_type,
        Buffer.from(image),
        1
      )
    return { success: true, customer: row }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
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
  console.log(email, password)
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
  console.log(token)

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
  console.log(data)
  // try {
  //   const row = db
  //     .prepare('INSERT INTO customers (first_name, last_name, email, phone) VALUES (?,?,?,?)')
  //     .run(data.first_name, data.last_name, data.email, data.phone)
  //   return { success: true, customer: row }
  // } catch (err) {
  //   console.error('DB error:', err.message)
  //   return { success: false, message: err.message }
  // }
})

ipcMain.handle('update-customer', async (event, data) => {
  const { id, customer } = data
  // console.log('Customer:', customer)
  // console.log('Is object?', typeof customer === 'object')
  // console.log('Values:', Object.values(customer))

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
    console.log(row)
    return { success: true, customer: row }
  } catch (err) {
    console.error('DB error:', err.message)
    return { success: false, message: err.message }
  }
})

ipcMain.handle('delete-customer', async (event, id) => {
  console.log(id)
  // try {
  //   const row = db.prepare('DELETE FROM customers WHERE id = ?').run(id)
  //   return { success: true, customer: row }
  // } catch (err) {
  //   console.error('DB error:', err.message)
  //   return { success: false, message: err.message }
  // }
})
