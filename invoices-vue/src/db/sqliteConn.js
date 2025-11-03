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
//   db.prepare('DROP TABLE users').run()
// } catch (err) {
//   console.error(err.message)
// }

// try {
//   db.prepare('DELETE FROM users').run() // veya DROP TABLE users için: 'DROP TABLE users'
// } catch (err) {
//   console.error(err.message)
// }

// db.exec(`CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY CHECK(id = 1),
//     gender TEXT NOT NULL,
//     first_name TEXT NOT NULL,
//     last_name TEXT NOT NULL,
//     password TEXT NOT NULL,
//     email TEXT UNIQUE NOT NULL,
//     phone TEXT NOT NULL,
//     address TEXT NOT NULL,
//     postal_code TEXT NOT NULL,
//     city TEXT NOT NULL,
//     state TEXT NOT NULL,
//     country TEXT DEFAULT 'Deutschland',
//     website TEXT,
//     company_name TEXT NOT NULL,
//     company_details TEXT NOT NULL,
//     company_signature TEXT NOT NULL,                -- GmbH, AG, OHG vs.
//     contact_person TEXT,                       -- Geschäftsführer
//     tax_number TEXT NOT NULL,                    -- Steuernummer
//     tax_office TEXT,                             -- Opsiyonel (Steueramt)                             -- Opsiyonel (VAT ID prefix, örn: DE)
//     vat_id TEXT,                                 -- USt-IdNr
//     court_registration TEXT,                     -- Opsiyonel (Handelsregisternummer)
//     court_location TEXT,                         -- Amtsgericht Berlin
//     logo TEXT NOT NULL,
//     image_type TEXT NOT NULL,
//     bank_name TEXT NOT NULL,
//     bic TEXT NOT NULL,
//     iban TEXT NOT NULL,
//     bank_account_holder TEXT NOT NULL,
//     invoice_approved TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );`)

//customers---------------------------------------------------------
// db.exec(`CREATE TABLE IF NOT EXISTS customers (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     first_name TEXT NOT NULL,
//     last_name TEXT NOT NULL,
//     email TEXT NOT NULL,
//     phone TEXT NOT NULL,
//     address TEXT NOT NULL,
//     postal_code TEXT NOT NULL,
//     city TEXT NOT NULL,
//     country TEXT NOT NULL,
//     company_name TEXT NOT NULL,
//     customer_type TEXT NOT NULL,
//     tax_number TEXT NOT NULL,
//     vat_id TEXT NOT NULL,
//     is_active TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );`)

// db.exec(`
// INSERT INTO customers (customer_type, company_name, first_name, last_name, address, postal_code, city, country, email, phone, tax_number, vat_id, is_active, created_at) VALUES
// ('individual', 'Ahmet Yılmaz Einzelunternehmen', 'Ahmet', 'Yılmaz', 'Musterstr. 12', '10115', 'Berlin', 'Deutschland', 'ahmet.yilmaz@example.com', '+49 170 1234567', 'DE123456789', 'DE987654321', 'Active', CURRENT_TIMESTAMP),
// ('company', 'TechNova GmbH', 'Lena', 'Schmidt', 'Industriestr. 5', '80331', 'München', 'Deutschland', 'lena.schmidt@technova.de', '+49 89 99887766', 'DE1122334455', 'DE5566778899', 'Active', CURRENT_TIMESTAMP),
// ('individual', 'Elif Demir Beratung', 'Elif', 'Demir', 'Schillerstr. 8', '50667', 'Köln', 'Deutschland', 'elif.demir@example.com', '+49 171 2223344', 'DE998877665', 'DE665544332', 'Active', CURRENT_TIMESTAMP),
// ('company', 'GreenBuild AG', 'Thomas', 'Becker', 'Bauweg 22', '20095', 'Hamburg', 'Deutschland', 'thomas.becker@greenbuild.de', '+49 40 88776655', 'DE2233445566', 'DE6677889900', 'Active', CURRENT_TIMESTAMP),
// ('individual', 'Mert Kaya Consulting', 'Mert', 'Kaya', 'Goethestr. 9', '60313', 'Frankfurt', 'Deutschland', 'mert.kaya@example.com', '+49 162 3344556', 'DE445566778', 'DE778899001', 'Inactive', CURRENT_TIMESTAMP),
// ('company', 'AutoPro GmbH', 'Julia', 'Neumann', 'Werkstr. 77', '70173', 'Stuttgart', 'Deutschland', 'julia.neumann@autopro.de', '+49 711 33445566', 'DE5566778899', 'DE9988776655', 'Active', CURRENT_TIMESTAMP),
// ('individual', 'Selin Aydin Trading', 'Selin', 'Aydın', 'Parkallee 3', '28195', 'Bremen', 'Deutschland', 'selin.aydin@example.com', '+49 176 5566778', 'DE887766554', 'DE554433221', 'Active', CURRENT_TIMESTAMP),
// ('company', 'DataSoft AG', 'Markus', 'Keller', 'IT-Str. 1', '44135', 'Dortmund', 'Deutschland', 'markus.keller@datasoft.de', '+49 231 99887711', 'DE6677889900', 'DE4455667788', 'Active', CURRENT_TIMESTAMP),
// ('individual', 'Burak Öztürk Handel', 'Burak', 'Öztürk', 'Blumenweg 10', '90402', 'Nürnberg', 'Deutschland', 'burak.ozturk@example.com', '+49 172 4455667', 'DE334455667', 'DE778899002', 'Inactive', CURRENT_TIMESTAMP),
// ('company', 'EuroTrade GmbH', 'Sabine', 'Fischer', 'Handelsstr. 9', '01067', 'Dresden', 'Deutschland', 'sabine.fischer@eurotrade.de', '+49 351 88776655', 'DE7788990011', 'DE9900112233', 'Active', CURRENT_TIMESTAMP),
// ('individual', 'Zeynep Koç Services', 'Zeynep', 'Koç', 'Hauptstr. 25', '86150', 'Augsburg', 'Deutschland', 'zeynep.koc@example.com', '+49 173 7788990', 'DE123123123', 'DE321321321', 'Active', CURRENT_TIMESTAMP),
// ('company', 'MedicaPlus GmbH', 'Andreas', 'Vogel', 'Gesundheitsweg 4', '97070', 'Würzburg', 'Deutschland', 'andreas.vogel@medicaplus.de', '+49 931 44556677', 'DE9090909090', 'DE8080808080', 'Active', CURRENT_TIMESTAMP);
// `)


//invoices
// db.exec(`CREATE TABLE IF NOT EXISTS invoices (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,           -- Fatura yazan firma (login'den gelir)
//     customer_id INTEGER NOT NULL,       -- Seçilen müşteri

//     -- Fatura Bilgileri
//     invoice_type TEXT NOT NULL,         -- 'FAT', 'SRV', 'BIL' vs.
//     invoice_number TEXT NOT NULL,       -- SRV-0001, BIL-0005 vs.
//     invoice_date DATE NOT NULL,         -- Fatura tarihi
//     due_date DATE,                      -- Vade tarihi

//     -- Fatura İçeriği
//     subject TEXT,                       -- Fatura başlığı
//     invoice_items TEXT NOT NULL,        -- Yapılan işler (JSON array)
//     notes TEXT,                         -- Ek notlar/şartlar

//     -- Hesaplama Sonuçları
//     subtotal DECIMAL(10,2) NOT NULL,    -- KDV hariç toplam
//     tax_rate DECIMAL(5,2) NOT NULL,     -- KDV oranı %19, %7, %0
//     tax_amount DECIMAL(10,2) NOT NULL,  -- KDV tutarı
//     total_amount DECIMAL(10,2) NOT NULL, -- Genel toplam

//     -- Durum Takibi
//     status TEXT DEFAULT 'draft',        -- draft, sent, paid
//     payment_status TEXT DEFAULT 'pending', -- pending, paid, overdue

//     -- Dosya
//     pdf_path TEXT,                      -- PDF dosya yolu

//     -- Sistem
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );`)

//tokens----------------------------------------------------------
// db.exec(`CREATE TABLE tokens (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     token TEXT UNIQUE NOT NULL,
//     user_id INTEGER,
//     expires_at DATETIME NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );`)

// db.run(`INSERT INTO tokens (token, user_id, expires_at)
// VALUES ('your_token_here2', 13233, datetime('now', '+15 minutes'));`)

// db.exec(`
//   CREATE TABLE IF NOT EXISTS users (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   email TEXT,
//   password TEXT,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
// )`)

//queries---------------------------------------------------------
try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all()
  console.log(
    'Tablolar:',
    tables.map((r) => r.name)
  )
} catch (err) {
  console.error(err.message)
}

// try {
//   db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run('mesto@outlook.com', '909090')
// } catch (err) {
//   console.error(err.message)
// }

// try {
//   const users = db.prepare('SELECT * FROM users').all()
//   console.log('Users:', users)
// } catch (err) {
//   console.error(err.message)
// }

// try {
//   const user = db.prepare('SELECT * FROM users WHERE email = ?').get('mesto@outlook.com')
//   console.log('User:', user)
// } catch (err) {
//   console.error(err.message)
// }

// try {
//   const user = db.prepare('UPDATE users SET email = ? WHERE id = ?').run('mesto@outlook.com', 1)
//   console.log('User:', user)
// } catch (err) {
//   console.error(err.message)
// }

// try {
//   const user = db.prepare('DELETE FROM users WHERE id = ?').run(1)
//   console.log('User:', user)
// } catch (err) {
//   console.error(err.message)
// }



// try {
//   db.exec('ALTER TABLE users DROP COLUMN invoice_categories')
//   db.close()
// } catch (err) {
//   console.error(err.message)
// }