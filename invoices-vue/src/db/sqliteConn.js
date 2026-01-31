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
//   db.prepare('delete from users').run()
// } catch (error) {
//   console.log(error)
// }
// try {
//   const result = db.prepare(`PRAGMA table_info(invoices);`).all()
//   const fields = result.map((r) => r.name)
//   console.log(fields)
// } catch (err) {
//   console.error(err.message)
// }

// try {
//   db.prepare(`Alter table users DROP COLUMN  invoice_approved;`).run()
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

// try {
//   const rows = db.prepare('Select * from users').all()
//   console.log(rows)
// } catch (error) {
//   console.log(error)
// }

// try {
//   db.prepare(`
// INSERT INTO users (
//   gender, first_name, last_name, password, email, phone, 
//   address, postal_code, city, state, country, website,
//   company_name, company_details, company_signature, contact_person,
//   tax_number, tax_office, vat_id, court_registration, court_location,
//   bank_name, bic, iban, bank_account_holder
// ) VALUES 
// (
//   'Herr',
//   'Markus',
//   'Schmidt',
//   '$2y$10$example_hashed_password_here',
//   'markus.schmidt@beispiel.de',
//   '+49 711 12345678',
//   'Königstraße 45',
//   '70173',
//   'Stuttgart',
//   'Baden-Württemberg',
//   'Deutschland',
//   'www.schmidt-consulting.de',
//   'Schmidt Consulting GmbH',
//   '{"gruendungsjahr": "2015", "mitarbeiter": "25", "branche": "IT-Beratung"}',
//   'Mit freundlichen Grüßen\nMarkus Schmidt\nGeschäftsführer',
//   '{"name": "Anna Müller", "position": "Assistentin", "telefon": "+49 711 12345679"}',
//   '12345/67890',
//   'Finanzamt Stuttgart I',
//   'DE123456789',
//   'HRB 12345',
//   'Stuttgart',
//   'Commerzbank Stuttgart',
//   'COBADEFFXXX',
//   'DE89370400440532013000',
//   'Schmidt Consulting GmbH'
// ),
// (
//   'Frau',
//   'Julia',
//   'Weber',
//   '121212',
//   'admin@admin.de',
//   '+49 711 98765432',
//   'Rotebühlplatz 10',
//   '70178',
//   'Stuttgart',
//   'Baden-Württemberg',
//   'Deutschland',
//   'www.webdesign-bw.de',
//   'Weber Webdesign',
//   '{"gruendungsjahr": "2018", "mitarbeiter": "8", "branche": "Webdesign"}',
//   'Herzliche Grüße\nJulia Weber',
//   '{"name": "Thomas Klein", "position": "Projektleiter", "telefon": "+49 711 98765433"}',
//   '98765/43210',
//   'Finanzamt Stuttgart II',
//   'DE987654321',
//   NULL,
//   NULL,
//   'Sparkasse Stuttgart',
//   'SOLADES1STG',
//   'DE12600501017001234567',
//   'Julia Weber'
// )`).run();
  
//   console.log('Veriler başarıyla eklendi!');
// } catch (error) {
//   console.log('Hata:', error);
// }