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
//Almnaya---------------------
// 1️⃣ Tüzel kişiler (Kapitalgesellschaften – Limited/Anonim şirketler)
// GmbH – Gesellschaft mit beschränkter Haftung (Limited şirket)
// AG – Aktiengesellschaft (Anonim şirket)
// KGaA – Kommanditgesellschaft auf Aktien (Hisse senetli komandit şirket)
// SE – Societas Europaea (Avrupa anonim şirketi)
// Ortaklıklar / şahıs şirketleri (Personengesellschaften)
// OG – Offene Gesellschaft (Açık ticaret ortaklığı)
// KG – Kommanditgesellschaft (Komandit şirket)
// Einzelfirma (Tek kişilik işletme / şahıs şirketi)
// GesbR – Gesellschaft bürgerlichen Rechts (Basit ortaklık)
// Serbest meslek ve diğer
// Freiberufler (Serbest meslek sahibi: doktor, avukat, danışman vb.)
// Genossenschaft (Kooperatif / eG)
// Verein (Dernek – kar amacı gütmeyen)


//Avusturya---------------------
// 1️⃣ Avusturya – Tüzel kişiler (Kapitalgesellschaften – Limited/Anonim şirketler)
// GmbH – Gesellschaft mit beschränkter Haftung (Limited şirket)
// AG – Aktiengesellschaft (Anonim şirket)
// KGaA – Kommanditgesellschaft auf Aktien (Hisse senetli komandit şirket)
// SE – Societas Europaea (Avrupa anonim şirketi)
// Ortaklıklar / şahıs şirketleri (Personengesellschaften)
// OG – Offene Gesellschaft (Açık ticaret ortaklığı)
// KG – Kommanditgesellschaft (Komandit şirket)
// Einzelfirma (Tek kişilik işletme / şahıs şirketi)
// GesbR – Gesellschaft bürgerlichen Rechts (Basit ortaklık)
// Serbest meslek ve diğer
// Freiberufler (Serbest meslek sahibi: doktor, avukat, danışman vb.)
// Genossenschaft (Kooperatif / eG)
// Verein (Dernek – kar amacı gütmeyen)

//Isvicre---------------------
// 1️⃣ Isvicre – Tüzel kişiler (Kapitalgesellschaften – Limited/Anonim şirketler)
// GmbH – Gesellschaft mit beschränkter Haftung (Limited şirket)
// AG – Aktiengesellschaft (Anonim şirket)
// KGaA – Kommanditgesellschaft auf Aktien (Hisse senetli komandit şirket)
// SE – Societas Europaea (Avrupa anonim şirketi)
// Ortaklıklar / şahıs şirketleri (Personengesellschaften)
// OG – Offene Gesellschaft (Açık ticaret ortaklığı)
// KG – Kommanditgesellschaft (Komandit şirket)
// Einzelfirma (Tek kişilik işletme / şahıs şirketi)
// GesbR – Gesellschaft bürgerlichen Rechts (Basit ortaklık)
// Serbest meslek ve diğer
// Freiberufler (Serbest meslek sahibi: doktor, avukat, danışman vb.)
// Genossenschaft (Kooperatif / eG)
// Verein (Dernek – kar amacı gütmeyen)

export default db

// db.exec(`CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     first_name TEXT NOT NULL,
//     last_name TEXT NOT NULL,
//     password TEXT NOT NULL,
//     email TEXT UNIQUE NOT NULL,
//     phone TEXT NOT NULL,
//     address TEXT NOT NULL,
//     postal_code TEXT NOT NULL,
//     city TEXT NOT NULL,
//     country TEXT DEFAULT 'Deutschland',
//     website TEXT,
//     firm_name TEXT NOT NULL,
//     legal_form TEXT NOT NULL,                    -- GmbH, AG, OHG vs.
//     managing_director TEXT,                      -- Geschäftsführer
//     tax_number TEXT NOT NULL,                    -- Steuernummer
//     tax_office TEXT,                             -- Opsiyonel (Steueramt)
//     tax_prefix TEXT,                             -- Opsiyonel (VAT ID prefix, örn: DE)
//     vat_id TEXT,                                 -- USt-IdNr
//     court_registration TEXT,                     -- Opsiyonel (Handelsregisternummer)
//     court_location TEXT,                         -- Amtsgericht Berlin
//     logo TEXT NOT NULL,
//     company_signature TEXT NOT NULL,
//     bank_name TEXT NOT NULL,
//     bic TEXT NOT NULL,
//     iban TEXT NOT NULL,
//     bank_account_holder TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );`)

// db.exec(`INSERT INTO users (
//     first_name,
//     last_name,
//     password,
//     email,
//     phone,
//     address,
//     postal_code,
//     city,
//     country,
//     website,
//     firm_name,
//     legal_form,
//     managing_director,
//     tax_number,
//     tax_office,
//     tax_prefix,
//     vat_id,
//     court_registration,
//     court_location,
//     company_signature,
//     bank_name,
//     bic,
//     iban,
//     bank_account_holder
// ) VALUES (
//     'Hans',
//     'Mueller',
//     '909090',
//     'user@user.de',
//     '+49 30 12345678',
//     'Hauptstraße 123',
//     '10115',
//     'Berlin',
//     'Deutschland',
//     'www.techsolutions.de',
//     'TechSolutions GmbH',
//     'GmbH',
//     'Hans Mueller',
//     '123/456/78901',
//     'Finanzamt Berlin Mitte/Tiergarten',
//     '{"FAT": "FAT", "PRO": "PRO", "SRV": "SRV", "BIL": "BIL"}',
//     'DE123456789',
//     'HRB 12345 B',
//     'Amtsgericht Berlin',
//     'Mit freundlichen Grüßen\nTechSolutions GmbH\nHans Mueller\nGeschäftsführer',
//     'Deutsche Bank AG',
//     'DEUTDEBBXXX',
//     'DE89370400440532013000',
//     'TechSolutions GmbH'
// );`)

//customers---------------------------------------------------------
// db.exec(`CREATE TABLE customers (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     customer_type TEXT NOT NULL,        -- 'individual' | 'company'
//     company_name TEXT,                  -- Firma adı (şirketler için)
//     first_name TEXT,                    -- Ad (bireysel müşteri için)
//     last_name TEXT,                     -- Soyad (bireysel müşteri için)
//     address TEXT NOT NULL,
//     postal_code TEXT NOT NULL,
//     city TEXT NOT NULL,
//     country TEXT DEFAULT 'Deutschland',
//     email TEXT,
//     phone TEXT,
//     tax_number TEXT,                    -- Steuernummer
//     vat_id TEXT,                       -- USt-IdNr
//     is_active BOOLEAN DEFAULT 1,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );`)

// db.exec(`
//     INSERT INTO customers (
//         customer_type, company_name, first_name, last_name, address,
//         postal_code, city, country, email, phone, tax_number, vat_id, is_active
//     ) VALUES (
//         'individual',
//         NULL,
//         'Hans',
//         'Müller',
//         'Hamburger Straße 123',
//         '20095',
//         'Hamburg',
//         'Deutschland',
//         'hans.mueller@email.de',
//         '+49 40 123456789',
//         '12/345/67890',
//         NULL,
//         1
//     );

//     INSERT INTO customers (
//         customer_type, company_name, first_name, last_name, address,
//         postal_code, city, country, email, phone, tax_number, vat_id, is_active
//     ) VALUES (
//         'company',
//         'TechSolutions GmbH',
//         NULL,
//         NULL,
//         'Maximilianstraße 45',
//         '80539',
//         'München',
//         'Deutschland',
//         'info@techsolutions.de',
//         '+49 89 987654321',
//         '143/567/89012',
//         'DE123456789',
//         1
//     );
//     INSERT INTO customers (
//         customer_type, company_name, first_name, last_name, address,
//         postal_code, city, country, email, phone, tax_number, vat_id, is_active
//     ) VALUES (
//         'individual',
//         NULL,
//         'Anna',
//         'Schmidt',
//         'Unter den Linden 78',
//         '10117',
//         'Berlin',
//         'Deutschland',
//         'anna.schmidt@gmail.com',
//         '+49 30 456789123',
//         '11/987/65432',
//         NULL,
//         1
//     );
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

try {
  const users = db.prepare('SELECT * FROM users').all()
  console.log('Users:', users)
} catch (err) {
  console.error(err.message)
}

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
//   db.prepare('DROP TABLE users').run()
// } catch (err) {
//   console.error(err.message)
// }

// try {
//   db.prepare('DELETE FROM users').run() // veya DROP TABLE users için: 'DROP TABLE users'
// } catch (err) {
//   console.error(err.message)
// }

// try {
//   db.exec('ALTER TABLE users DROP COLUMN invoice_categories')
//   db.close()
// } catch (err) {
//   console.error(err.message)
// }