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



// try {
//   const result = db.prepare(`PRAGMA table_info(invoices);`).all()
//   const fields = result.map((r) => r.name)
//   console.log(fields)
// } catch (err) {
//   console.error(err.message)
// }

// try {
//   db.prepare(`update invoices set payment_status = 'unpaid'`).run()
// } catch (error) {
//   console.error(error)
// }


// try {
//   const result = db
//     .prepare(`SELECT COUNT(id) AS total FROM invoices WHERE payment_status = 'unpaid' AND due_date < DATE('now')`)
//     .get()
//   console.log(result.total)

// } catch (error) {
//   console.error(error)
// }


