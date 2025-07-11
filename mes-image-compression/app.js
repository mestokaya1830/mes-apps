import express from 'express'
const app = express()
import helmet from 'helmet'
import multer from 'multer'
import sharp from 'sharp'
import fs from 'fs'
import dotenv from 'dotenv'
import path from 'path'
import zip from 'express-zip'

dotenv.config()
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '3mb' }))
app.use(express.static('dist'))

if(process.env.NODE_ENV == 'production'){
  app.use(express.static('dist'))
  app.get('*', (req, res) => res.sendFile(path.resolve('dist/index.html')))
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dist/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
const fileFilter = function (req, file, cb) {
  const types = ['image/jpeg','image/jpg','image/png','image/gif', 'image/webp', 'image/avif', 'image/tiff']
  if(!types.includes(file.mimetype)){
    const error = new Error('Wrong file type')
    error.code = 'LIMIT_FILE_TYPES'
    return cb(error, false)
  }
  cb(null, true)
}

const resize = multer({
  storage,
  fileFilter,
  limits:{
    fileSize: 1e+7 //10 mb
  }
})

app.post('/api/compression/:quality/:imagepath', resize.array('files', 20), async (req, res, ) => {
  try {
    await fs.promises.mkdir(path.resolve('./dist/uploads/', req.params.imagepath), { recursive: true });
    const originalName = []
    const quality = Number(req.params.quality)
    for (const item of req.files) {
      const imageType = item.filename.split('.').pop()
      if(imageType == 'jpeg' || imageType == 'jpg'){
        await sharp(item.path)
        .resize(5600, 3200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality:quality, progressive: true }) // Progressive JPEGs
        .toFile('./dist/uploads/'+ req.params.imagepath +'/'+ item.originalname)
      } else if(imageType == 'gif'){
        await sharp(item.path, { animated: true })
        .resize(5600, 3200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .gif({quality:quality, interFrameMaxError: 8 })
        .toFile('./dist/uploads/'+ req.params.imagepath +'/'+ item.originalname)
      } else {
        await sharp(item.path)
        .resize(5600, 3200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        [imageType]({ quality:quality })
        .toFile('./dist/uploads/'+ req.params.imagepath +'/'+ item.originalname)
      }

      try {
        await fs.promises.unlink(item.path);
        originalName.push(item.originalname); // Dosya silindikten SONRA çalışır
      } catch (err) {
        console.error('Dosya silinemedi:', err);
      }
    }
    res.status(200).json({files:req.files})
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/download/:imagepath', async (req, res) => {
  const imagePath = `./dist/uploads/${req.params.imagepath}`
  if (fs.existsSync(imagePath)) {
  try {
    const files = await fs.promises.readdir(`./dist/uploads/${req.params.imagepath}`);
    const allFiles = files.map(item => {
      return {
        path: `${imagePath}/${item}`,
        name: item
      }
    });
    
    // ZIP için express-zip veya benzer middleware kullanın
    res.zip(allFiles);
  } catch (err) {
    console.log('Unable to scan directory: ' + err);
    res.status(500).json({ error: 'Directory scan failed' });
  }
} else {
    res.json({code: 400, message:'Sorry no images to download!'})
  }
})
app.post('/api/remove-images', async (req, res) => {
  const imagePath = path.resolve('./dist/uploads/', req.body.imagepath)
  try {
    await fs.promises.access(imagePath)
    await fs.promises.rm(imagePath, { recursive: true, force: true })
    res.json({ code: 200 })
  } catch {
    res.status(400).json({ code: 400, message: 'Sorry no images to remove!' })
  }
})
app.use((error, req, res, next) => {
  if(error.code == 'LIMIT_FILE_TYPES'){
    res.json({error:'Wrong file type!'})
  }
  if(error.code == 'LIMIT_FILE_SIZE'){
    res.json({error:'File to large! Each file must be less 10 MB'})
  }
})

app.listen(3000, () => {
  console.log('Server is running...')
})
