import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../../src/db/invoices.db')

let db = null
try {
  db = new Database(dbPath, { verbose: console.log })
  console.log('DB Path:', dbPath)
  console.log('Connected to the SQLite3 database.')
} catch (err) {
  console.error('Connection error:', err.message)
}
process.on('exit', () => db.close())

export default db

try {
  const rows = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`).all()
  console.log('Tables', rows)
} catch (err) {
  console.error(err.message)
}

// db.exec('PRAGMA foreign_keys = ON;')//default off


// try {
//   const result = db.prepare(`PRAGMA table_info(invoices);`).all()
//   const fields = result.map((r) => r.name)
//   console.log(fields)
// } catch (err) {
//   console.error(err.message)
// }

// try {
//   const result = db.prepare(`Alter Table payments Add Column outstanding REAL;`).run() // 1 → customer id
//   console.log(result)
// } catch (err) {
//   console.error(err.message)
// }



// try {
//   const result = db.prepare(`DROP TABLE IF EXISTS payments`).run()
//   console.log('invoices with early_payment_days:', result)
// } catch (error) {
//   console.error(error.message)
// }

// try {
//   const result = db.prepare(`Select * from payments;`).all()
//   console.log('payments add payment_amount:', result)
// } catch (error) {
//   console.error(error.message)
// }

// try {
//   const result = db.prepare(`Delete From payments;`).run() // 1 → customer id
// } catch (error) {
//   console.error(error.message)
// }