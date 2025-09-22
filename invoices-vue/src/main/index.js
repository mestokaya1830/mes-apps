import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from '../db/sqliteConn.js'
import nodeMailer from 'nodemailer'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: true,
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true,
      devTools: is.dev
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setTitle('Mes Invoices App')
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
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

ipcMain.handle('login', async (event, data) => {
  const { email, password } = data
  console.log(email, password)
  return new Promise((resolve) => {
    db.get(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password],
      (err, row) => {
        if (err) {
          console.error('DB error:', err.message)
          resolve({ success: false, message: err.message })
        } else if (row) {
          resolve({ success: true, user: row })
        } else {
          resolve({ success: false, message: 'Invalid email or password' })
        }
      }
    )
  })
})

ipcMain.handle('getUsers', async () => {
  return new Promise((resolve) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        console.error('DB error:', err.message)
        resolve({ success: false, users: [], message: err.message })
      } else {
        resolve({ success: true, users: rows })
      }
    })
  })
})

ipcMain.handle('email-verfication', async (event, data) => {
  const { email } = data
  console.log(email)
  return new Promise((resolve) => {
    const token = Math.random().toString(36).substring(2, 50)
    //email host settings
    const transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'mesto1830@gmail.com',
        pass: 'taao aisb gkkc evwx'
      }
    })
    //email options
    const mailoption = {
      from: 'mesto1830@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: 'To reset password please click link below...',
      html: `
    <h2>To reset password please use this token'</h2>
    <h1>${token}</h1>
    `
    }
    //send email
    transporter.sendMail(mailoption, (err, info) => {
      if (err) {
        console.error('Email error:', err.message)
        resolve({ success: false, message: err.message })
      } else {
        console.log('Email sent:', info.response, token)
        db.run(
          'UPDATE users SET token = ? WHERE email = ?',
          [token, 'user@user.de'],
          function (err) {
            if (err) {
              console.error('DB error:', err.message)
              resolve({ success: false, message: 'DB update failed' })
            } else if (this.changes === 0) {
              console.warn('No user found with that email')
              resolve({ success: false, message: 'No user found with that email' })
            } else {
              resolve({ success: true, message: 'Email sent and token updated' })
            }
          }
        )
      }
    })
  })
})

ipcMain.handle('reset-password', async (event, data) => {
  try {
    const { password, token } = data
    // const hashedPassword = await bcrypt.hash(password, 10)

    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET password = ? WHERE email = ? AND token = ?',
        [password, 'user@user.de', token],
        function (err) {
          if (err) reject(err)
          else resolve()
        }
      )
    })

    return { success: true, message: 'Password reset successfully' }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
