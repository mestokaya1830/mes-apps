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


{/* <template>
  <div class="form-group">
    <label class="form-label">🇩🇪 Unternehmensform (Deutschland)</label>
    <select v-model="companyTypeDE" class="form-input">
      <option disabled value="">-- Bitte wählen --</option>
      <option v-for="type in companyTypesDE" :key="type.value" :value="type.value">
        {{ type.label }}
      </option>
    </select>

    <p class="text-sm text-gray-500 mt-1">
      Ausgewählt: <strong>{{ companyTypeDE }}</strong>
    </p>
  </div>
</template>

<script>
export default {
  name: "CompanyTypeDE",
  data() {
    return {
      companyTypeDE: "",
      companyTypesDE: [
        { value: "einzelunternehmen", label: "Einzelunternehmen" },
        // Şahıs işletmesi – en yaygın küçük işletme türü (Kleinunternehmer §19 UStG)
        { value: "freiberufler", label: "Freiberufler" },
        // Serbest meslek (doktor, mimar, mühendis, yazar vb.) – KDV bazen muaf
        { value: "gbr", label: "GbR (Gesellschaft bürgerlichen Rechts)" },
        // Adi ortaklık – serbest meslek sahipleri veya küçük işletmeler
        { value: "ug", label: "UG (haftungsbeschränkt)" },
        // Mini GmbH – düşük sermaye ile limited şirket
        { value: "gmbh", label: "GmbH (Gesellschaft mit beschränkter Haftung)" },
        // Limited şirket – genelde KDV yükümlüsü
        { value: "ohg", label: "OHG (Offene Handelsgesellschaft)" },
        // Ticari ortaklık – küçük sayılmaz
        { value: "kg", label: "KG (Kommanditgesellschaft)" },
        // Komandit ortaklık – orta veya büyük ölçekli işletmeler
        { value: "gmbh_co_kg", label: "GmbH & Co. KG" },
        // GmbH'nin komandit ortak olduğu özel ortaklık türü
        { value: "partg", label: "PartG (Partnerschaftsgesellschaft)" },
        // Profesyonel meslekler (avukat, doktor, diş hekimi, mimar vb.) için ortaklık
        { value: "partgmbb", label: "PartGmbB (Partnerschaftsgesellschaft mit beschränkter Berufshaftung)" },
        // Sınırlı mesleki sorumluluklu ortaklık
        { value: "ek", label: "e.K. (eingetragener Kaufmann)" },
        // Tescilli tacir – genelde küçük veya orta işletmeler
        { value: "ev", label: "e.V. (eingetragener Verein)" },
        // Dernek – kâr amacı gütmeyen organizasyonlar
        { value: "ggmbh", label: "gGmbH (gemeinnützige GmbH)" },
        // Kar amacı gütmeyen limited şirket – özel vergi durumu (§4 UStG)
        { value: "stiftung", label: "Stiftung" },
        // Vakıf – genellikle kamu yararına çalışan kuruluşlar
        { value: "ag", label: "AG (Aktiengesellschaft)" },
        // Anonim şirket – büyük ölçekli işletmeler
        { value: "se", label: "SE (Societas Europaea)" }
        // Avrupa şirketi – uluslararası düzeyde faaliyet gösteren büyük firmalar
      ]
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.form-input {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style> */}
{/* <div>
  <label>🇩🇪 Unternehmensform (Deutschland)</label>
  <select v-model="deCompanyType" @change="checkKleinunternehmerAvailability('de')">
    <option disabled value="">-- Bitte wählen --</option>
    <option v-for="type in companyTypesDE" :key="type.value" :value="type.value">
      {{ type.label }}
    </option>
  </select>

  <div class="mt-2">
    <label>
      <input
        type="checkbox"
        v-model="isKleinunternehmerDE"
        :disabled="!kleinunternehmerAvailableDE"
      />
      Kleinunternehmer nach §19 UStG
    </label>
  </div>
</div> */}

{/* <template>
  <div class="form-group">
    <label class="form-label">🇦🇹 Unternehmensform (Österreich)</label>
    <select v-model="companyTypeAT" class="form-input">
      <option disabled value="">-- Bitte wählen --</option>
      <option v-for="type in companyTypesAT" :key="type.value" :value="type.value">
        {{ type.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "CompanyTypeAT",
  data() {
    return {
      companyTypeAT: "",
      companyTypesAT: [
        { value: "einzelunternehmen", label: "Einzelunternehmen" },
        // Şahıs işletmesi – Kleinunternehmer olabilir (§6 Abs 1 Z 27 UStG)
        { value: "og", label: "OG (Offene Gesellschaft)" },
        // OHG benzeri ticari ortaklık
        { value: "kg", label: "KG (Kommanditgesellschaft)" },
        // Komandit ortaklık – genelde ticari
        { value: "gmbh", label: "GmbH (Gesellschaft mit beschränkter Haftung)" },
        // Limited şirket – KDV yükümlüsü
        { value: "ag", label: "AG (Aktiengesellschaft)" },
        // Anonim şirket
        { value: "genossenschaft", label: "Genossenschaft" },
        // Kooperatif – tarım veya finans sektörlerinde yaygın
        { value: "verein", label: "Verein" }
        // Dernek – kar amacı gütmez
      ]
    }
  }
}
</script> */}
// <!-- Avusturya -->
// <div class="mt-6">
//   <label>🇦🇹 Unternehmensform (Österreich)</label>
//   <select v-model="atCompanyType" @change="checkKleinunternehmerAvailability('at')">
//     <option disabled value="">-- Bitte wählen --</option>
//     <option v-for="type in companyTypesAT" :key="type.value" :value="type.value">
//       {{ type.label }}
//     </option>
//   </select>

//   <div class="mt-2">
//     <label>
//       <input
//         type="checkbox"
//         v-model="isKleinunternehmerAT"
//         :disabled="!kleinunternehmerAvailableAT"
//       />
//       Kleinunternehmerregelung (§6 Abs.1 Z 27 UStG)
//     </label>
//   </div>
// </div>

{/* <template>
  <div class="form-group">
    <label class="form-label">🇨🇭 Unternehmensform (Schweiz)</label>
    <select v-model="companyTypeCH" class="form-input">
      <option disabled value="">-- Bitte wählen --</option>
      <option v-for="type in companyTypesCH" :key="type.value" :value="type.value">
        {{ type.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "CompanyTypeCH",
  data() {
    return {
      companyTypeCH: "",
      companyTypesCH: [
        { value: "einzelfirma", label: "Einzelfirma" },
        // Şahıs işletmesi – küçük işletme (100.000 CHF altı ciroda KDV muaf)
        { value: "gmbh", label: "GmbH (Gesellschaft mit beschränkter Haftung)" },
        // Limited şirket
        { value: "ag", label: "AG (Aktiengesellschaft)" },
        // Anonim şirket – büyük ölçekli
        { value: "kg", label: "Kommanditgesellschaft" },
        // Komandit ortaklık
        { value: "verein", label: "Verein" },
        // Dernek – kâr amacı gütmez
        { value: "genossenschaft", label: "Genossenschaft" },
        // Kooperatif – topluluk odaklı işletmeler
        { value: "stiftung", label: "Stiftung" }
        // Vakıf – kâr amacı gütmez kurum
      ]
    }
  }
}
</script> */}
// <!-- İsviçre -->
// <div class="mt-6">
//   <label>🇨🇭 Unternehmensform (Schweiz)</label>
//   <select v-model="chCompanyType" @change="checkKleinunternehmerAvailability('ch')">
//     <option disabled value="">-- Bitte wählen --</option>
//     <option v-for="type in companyTypesCH" :key="type.value" :value="type.value">
//       {{ type.label }}
//     </option>
//   </select>

//   <div class="mt-2">
//     <label>
//       <input
//         type="checkbox"
//         v-model="isKleinunternehmerCH"
//         :disabled="!kleinunternehmerAvailableCH"
//       />
//       MWST-befreit (Umsatz unter 100’000 CHF)
//     </label>
//   </div>
// </div>

// summary
{/* <script>
export default {
  data() {
    return {
      // --- Almanya ---
      deCompanyType: "",
      isKleinunternehmerDE: false,
      kleinunternehmerAvailableDE: true,
      companyTypesDE: [
        { value: "einzelunternehmen", label: "Einzelunternehmen" },
        { value: "freiberufler", label: "Freiberufler" },
        { value: "gbr", label: "GbR" },
        { value: "ug", label: "UG (haftungsbeschränkt)" },
        { value: "gmbh", label: "GmbH" },
        { value: "ohg", label: "OHG" },
        { value: "kg", label: "KG" },
        { value: "gmbh_co_kg", label: "GmbH & Co. KG" },
        { value: "partg", label: "PartG" },
        { value: "partgmbb", label: "PartGmbB" },
        { value: "ek", label: "e.K." },
        { value: "ev", label: "e.V." },
        { value: "ggmbh", label: "gGmbH" },
        { value: "stiftung", label: "Stiftung" },
        { value: "ag", label: "AG" },
        { value: "se", label: "SE" }
      ],

      // --- Avusturya ---
      atCompanyType: "",
      isKleinunternehmerAT: false,
      kleinunternehmerAvailableAT: true,
      companyTypesAT: [
        { value: "einzelunternehmen", label: "Einzelunternehmen" },
        { value: "freiberufler", label: "Freiberufler" },
        { value: "og", label: "Offene Gesellschaft (OG)" },
        { value: "kg", label: "Kommanditgesellschaft (KG)" },
        { value: "gmbh", label: "GmbH" },
        { value: "ag", label: "AG" },
        { value: "genossenschaft", label: "Genossenschaft" },
        { value: "verein", label: "Verein" },
        { value: "stiftung", label: "Stiftung" }
      ],

      // --- İsviçre ---
      chCompanyType: "",
      isKleinunternehmerCH: false,
      kleinunternehmerAvailableCH: true,
      companyTypesCH: [
        { value: "einzelfirma", label: "Einzelfirma" },
        { value: "gmbh", label: "GmbH" },
        { value: "ag", label: "AG" },
        { value: "genossenschaft", label: "Genossenschaft" },
        { value: "stiftung", label: "Stiftung" },
        { value: "verein", label: "Verein" }
      ]
    }
  },
  methods: {
    checkKleinunternehmerAvailability(country) {
      if (country === "de") {
        const nonEligible = ["gmbh", "ohg", "kg", "gmbh_co_kg", "partgmbb", "ek", "ag", "se"]
        this.kleinunternehmerAvailableDE = !nonEligible.includes(this.deCompanyType)
        if (!this.kleinunternehmerAvailableDE) this.isKleinunternehmerDE = false
      }

      if (country === "at") {
        const nonEligible = ["gmbh", "ag", "genossenschaft"]
        this.kleinunternehmerAvailableAT = !nonEligible.includes(this.atCompanyType)
        if (!this.kleinunternehmerAvailableAT) this.isKleinunternehmerAT = false
      }

      if (country === "ch") {
        const nonEligible = ["ag", "genossenschaft", "stiftung"]
        this.kleinunternehmerAvailableCH = !nonEligible.includes(this.chCompanyType)
        if (!this.kleinunternehmerAvailableCH) this.isKleinunternehmerCH = false
      }
    }
  }
}
</script> */}
// | Ülke           | Küçük işletme yasası                  | Tipik uygun türler                   | Yasal dayanak      |
// | -------------- | ------------------------------------- | ------------------------------------ | ------------------ |
// | 🇩🇪 Almanya   | Kleinunternehmerregelung              | Einzelunternehmen, Freiberufler, GbR | §19 UStG           |
// | 🇦🇹 Avusturya | Kleinunternehmerregelung              | Einzelunternehmen, OG, KG            | §6 Abs.1 Z 27 UStG |
// | 🇨🇭 İsviçre   | MWST-Be
// | Ülke           | Standart KDV | İndirimli Oran(lar) | Küçük İşletme Muafiyeti             |
// | -------------- | ------------ | ------------------- | ----------------------------------- |
// | 🇩🇪 Almanya   | **19 %**     | 7 %                 | §19 UStG – < 22 000 €/yıl           |
// | 🇦🇹 Avusturya | **20 %**     | 10 %, 13 %          | §6 Abs.1 Z 27 UStG – < 35 000 €/yıl |
// | 🇨🇭 İsviçre   | **8.1 %**    | 2.6 %, 3.8 %        | MWST-befreiung – < 100 000 CHF/yıl  |
// freiung (Umsatz < 100’000 CHF) | Einzelfirma, kleine GmbH             | MWSTG Art. 10      |
// computed: {
//   vatRates() {
//     switch (this.country) {
//       case "de":
//         return [0, 7, 19]
//       case "at":
//         return [0, 10, 13, 20]
//       case "ch":
//         return [0, 2.6, 3.8, 8.1]
//       default:
//         return [0]
//     }
//   }
// }

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
//     id INTEGER PRIMARY KEY CHECK(id = 1),
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
//     managing_director TEXT,
//     contact_person TEXT,
//     is_small_business TEXT NOT NULL,                        -- Geschäftsführer
//     tax_number TEXT NOT NULL,                    -- Steuernummer
//     tax_office TEXT,                             -- Opsiyonel (Steueramt)
//     tax_prefix TEXT,                             -- Opsiyonel (VAT ID prefix, örn: DE)
//     vat_id TEXT,                                 -- USt-IdNr
//     court_registration TEXT,                     -- Opsiyonel (Handelsregisternummer)
//     court_location TEXT,                         -- Amtsgericht Berlin
//     logo TEXT NOT NULL,
//     image_type TEXT NOT NULL,
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
// try {
//   const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all()
//   console.log(
//     'Tablolar:',
//     tables.map((r) => r.name)
//   )
// } catch (err) {
//   console.error(err.message)
// }

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