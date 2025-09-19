import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
sqlite3.verbose()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../../backend/db/invoice.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Connection error:', err.message)
  } else {
    console.log('DB Path:', dbPath)
    console.log('Connected to the SQLite3 database.')
  }
})

//users---------------------------------------------------------------
// db.run(`
//   CREATE TABLE IF NOT EXISTS users (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   first_name TEXT NOT NULL,
//   last_name TEXT NOT NULL,
//   password TEXT NOT NULL,
//   email TEXT,
//   phone TEXT,
//   address TEXT,
//   firm_name TEXT,
//   tax_number TEXT,
//   tax_office TEXT,
//   tax_prefix JSON,
//   Ust_tdNr TEXT,
//   logo TEXT,
//   bank_name TEXT,
//   bic TEXT,
//   empfanger_name TEXT,
//   iban TEXT,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
// )`)

// db.run(`INSERT INTO users (
//   first_name,
//   last_name,
//   password,
//   email,
//   phone,
//   address,
//   firm_name,
//   tax_number,
//   tax_office,
//   tax_prefix,
//   Ust_tdNr,
//   logo,
//   bank_name,
//   bic,
//   empfanger_name,
//   iban
// ) VALUES (
//   'Max',
//   'Mustermann',
//   '909090',
//   'max.mueller@example.de',
//   '+49 171 2345678',
//   'Berliner Str. 45, 10115 Berlin',
//   'Müller IT-Dienstleistungen GmbH',
//   'DE123456789',
//   'Finanzamt Berlin-Mitte',
//   '{
//     "FAT": "Rechnung (Allgemein)",
//     "PRO": "Proforma Rechnung (Vorab)",
//     "SRV": "Service Rechnung",
//     "HIZ": "Dienstleistungsrechnung",
//     "DAN": "Beratungsrechnung",
//     "EGT": "Schulung/Kurs",
//     "TAM": "Reparatur/Instandsetzung",
//     "KIR": "Mietrechnung",
//     "INS": "Bau Rechnung",
//     "TAS": "Transport/Rechnungen",
//     "MED": "Medizin/Gesundheit",
//     "BIL": "IT/Software",
//     "RKL": "Werbung/Marketing",
//     "TEM": "Reinigungsdienst",
//     "GUV": "Sicherheitsdienst",
//     "YEM": "Catering/Essen",
//     "FOT": "Foto/Video",
//     "MUZ": "Musik/Ton"
//   }',
//   'UST-DE998877',
//   'logo_mueller.png',
//   'Deutsche Bank',
//   'DEUTDEFF',
//   'Max Müller',
//   'DE89370400440532013000'
// );
// `)

//customers---------------------------------------------------------------
db.run(`
  CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  firm_name TEXT,
  tax_number TEXT,
  Ust_tdNr TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`)

// db.run(
//   `
//   INSERT INTO customers (
//     name, email, phone, address, firm_name, tax_number, Ust_tdNr
//   ) VALUES (?, ?, ?, ?, ?, ?, ?)
// `,
//   [
//     'Hans Müller',
//     'hans.mueller@example.de',
//     '+49 171 11223344',
//     'Hauptstr. 10, 10115 Berlin',
//     'Müller & Co. GmbH',
//     'DE123456789',
//     'UST-DE998877'
//   ]
// )

// db.run(
//   `
//   INSERT INTO customers (
//     name, email, phone, address, firm_name, tax_number, Ust_tdNr
//   ) VALUES (?, ?, ?, ?, ?, ?, ?)
// `,
//   [
//     'Anna Schmidt',
//     'anna.schmidt@example.de',
//     '+49 172 22334455',
//     'Marktplatz 5, 50667 Köln',
//     'Schmidt Consulting KG',
//     'DE987654321',
//     'UST-DE112233'
//   ]
// )

// db.run(
//   `
//   INSERT INTO customers (
//     name, email, phone, address, firm_name, tax_number, Ust_tdNr
//   ) VALUES (?, ?, ?, ?, ?, ?, ?)
// `,
//   [
//     'Thomas Fischer',
//     'thomas.fischer@example.de',
//     '+49 160 33445566',
//     'Bahnhofstr. 7, 80331 München',
//     'Fischer IT-Services AG',
//     'DE192837465',
//     'UST-DE445566'
//   ]
// )


//query----------------------------------------------------------

// db.run(`DROP TABLE IF EXISTS customers;`);

//get all tables
// db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;", [], (err, rows) => {
//   if (err) {
//     console.error(err.message)
//     return
//   }
//   console.log(
//     'Tablolar:',
//     rows.map((r) => r.name)
//   )
// })

//get all columns
// db.all(`PRAGMA table_info(users)`, [], (err, rows) => {
//   if (err) throw err

//   rows.forEach((row) => {
//     console.log(row.cid, row.name, row.type)
//   })
// })

//get all rows
// db.all(`SELECT * FROM customers;`, [], (err, rows) => {
//   if (err) {
//     console.error(err.message)
//     return
//   }
//   console.log(rows) // rows artık array, ilk satıra rows[0] ile ulaşabilirsin
// })

// export default db
