import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
sqlite3.verbose()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../../src/db/invoices.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Connection error:', err.message)
  } else {
    console.log('DB Path:', dbPath)
    console.log('Connected to the SQLite3 database.')
  }
})

export default db

// db.run(`CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     first_name TEXT NOT NULL,
//     last_name TEXT NOT NULL,
//     password TEXT NOT NULL,
//     email TEXT,
//     phone TEXT,
    
//     -- Adres Bilgileri
//     address TEXT,
//     postal_code TEXT,
//     city TEXT,
//     country TEXT DEFAULT 'Deutschland',
//     website TEXT,
    
//     -- Firma Bilgileri
//     firm_name TEXT,
//     legal_form TEXT,                    -- GmbH, AG, OHG vs.
//     managing_director TEXT,             -- Geschäftsführer
    
//     -- Vergi Bilgileri
//     tax_number TEXT,
//     tax_office TEXT,
//     tax_prefix TEXT,                    -- JSON string olarak
//     vat_id TEXT,                        -- USt-IdNr
//     court_registration TEXT,            -- HRB 12345 B
//     court_location TEXT,                -- Amtsgericht Berlin
    
//     -- Fatura Ayarları
//     invoice_categories TEXT,            -- JSON string
//     invoice_counters TEXT,              -- JSON string
    
//     -- Logo/İmza
//     logo TEXT,
//     company_signature TEXT,
    
//     -- Banka Bilgileri
//     bank_name TEXT,
//     bic TEXT,
//     iban TEXT,
//     bank_account_holder TEXT,

//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );`)

// db.run(`INSERT INTO users (
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
//     invoice_categories,
//     invoice_counters,
//     logo,
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
//     '{"FAT": "Rechnung (Allgemein)", "PRO": "Proforma Rechnung", "SRV": "Service Rechnung", "BIL": "IT/Software"}',
//     '{"FAT": 1, "PRO": 1, "SRV": 1, "BIL": 1}',
//     '/assets/logo.png',
//     'Mit freundlichen Grüßen\nTechSolutions GmbH\nHans Mueller\nGeschäftsführer',
//     'Deutsche Bank AG',
//     'DEUTDEBBXXX',
//     'DE89370400440532013000',
//     'TechSolutions GmbH'
// );`)

//customers---------------------------------------------------------
// db.run(`CREATE TABLE customers (
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

// db.run(`INSERT INTO customers (
//     customer_type,
//     company_name,
//     first_name,
//     last_name,
//     address,
//     postal_code,
//     city,
//     country,
//     email,
//     phone,
//     tax_number,
//     vat_id,
//     is_active
// ) VALUES (
//     'individual',
//     NULL,
//     'Anna',
//     'Schmidt',
//     'Berliner Straße 45',
//     '80331',
//     'München',
//     'Deutschland',
//     'anna.schmidt@email.de',
//     '+49 89 1234567',
//     '987/654/32109',
//     NULL,
//     1
// );`)

// db.run(`INSERT INTO customers (
//     customer_type,
//     company_name,
//     first_name,
//     last_name,
//     address,
//     postal_code,
//     city,
//     country,
//     email,
//     phone,
//     tax_number,
//     vat_id,
//     is_active
// ) VALUES (
//     'company',
//     'TechSolutions GmbH',
//     NULL,
//     NULL,
//     'Hauptstraße 123',
//     '10115',
//     'Berlin',
//     'Deutschland',
//     'hans.mueller@techsolutions.de',    -- Firma adı (şirketler için)   
//     '+49 30 12345678',
//     '123/456/78901',
//     'DE123456789',
//     1
// );`)

// db.run(`INSERT INTO customers (
//     customer_type,
//     company_name,
//     first_name,
//     last_name,
//     address,
//     postal_code,
//     city,
//     country,
//     email,
//     phone,
//     tax_number,
//     vat_id,
//     is_active
// ) VALUES (
//     'individual',
//     NULL,
//     'Hans',
//     'Mueller',
//     'Hauptstraße 123',
//     '10115',
//     'Berlin',
//     'Deutschland',
//     'hans.mueller@techsolutions.de',    -- Firma adı (şirketler için)
//     '+49 30 12345678',
//     '123/456/78901',                    -- Steuernummer
//     'DE123456789',                      -- USt-IdNr
//     1
// )`)


//invoices
// db.run(`CREATE TABLE IF NOT EXISTS invoices (
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
//query----------------------------------------------------------

// db.run(`DROP TABLE IF EXISTS customers;`);

//get all tables
db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;", [], (err, rows) => {
  if (err) {
    console.error(err.message)
    return
  }
  console.log(
    'Tablolar:',
    rows.map((r) => r.name)
  )
})

//get all columns
// db.all(`PRAGMA table_info(users)`, [], (err, rows) => {
//   if (err) throw err

//   rows.forEach((row) => {
//     console.log(row.cid, row.name, row.type)
//   })
// })

//get all rows
db.all(`SELECT * FROM users;`, [], (err, rows) => {
  if (err) {
    console.error(err.message)
    return
  }
  console.log(rows) // rows artık array, ilk satıra rows[0] ile ulaşabilirsin
})

// db.run('AlTER TABLE users ADD COLUMN token TEXT DEFAULT null;', [], (err, rows) => {
//   if (err) {
//     console.error(err.message)
//     return
//   }
//   console.log(rows) // rows artık array, ilk satıra rows[0] ile ulaşabilirsin
// })