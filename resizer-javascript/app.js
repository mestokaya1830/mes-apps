import express from 'express'
const app = express()
import helmet from 'helmet'
import multer from 'multer'
import sharp from 'sharp'
import fs from 'fs'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ debug: true })
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '3mb' }))
app.use(express.static('dist'))

if(process.env.NODE_ENV == 'production'){
  app.use(express.static('dist'))
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist/index.html')))
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

app.post('/api/resize/:width/:heigth/:imagepath', resize.array('files', 20), async (req, res, ) => {
  try {
    await fs.promises.mkdir(path.resolve(__dirname, 'dist/uploads/' + req.params.imagepath), { recursive: true })
    const originalName = []
    for (const item of req.files) {
      const imageType = item.filename.split('.').pop()
      if(imageType == 'jpeg' || imageType == 'jpg'){
        await sharp(item.path)
        .resize(Number(req.params.width), Number(req.params.heigth))
        .jpeg({ quality: 80, progressive: true }) // Progressive JPEGs
        .toFile(path.resolve(__dirname, 'dist/uploads/'+ req.params.imagepath +'/'+ item.originalname))
        await fs.promises.unlink(item.path)
        originalName.push(item.originalname)
      } else if(imageType == 'gif'){
        await sharp(item.path, { animated: true })
        .resize(Number(req.params.width), Number(req.params.heigth))
        .gif({quality: 80, interFrameMaxError: 8 })
        .toFile(path.resolve(__dirname, 'dist/uploads/'+ req.params.imagepath +'/'+ item.originalname))
        await fs.promises.unlink(item.path)
        originalName.push(item.originalname)
      } else {
        await sharp(item.path)
        .resize(Number(req.params.width), Number(req.params.heigth))
        [imageType]({quality: 80})
        .toFile(path.resolve(__dirname, 'dist/uploads/'+ req.params.imagepath +'/'+ item.originalname))
        await fs.promises.unlink(item.path)
        originalName.push(item.originalname)
      }
    }
   
    res.status(200).json({files:req.files})
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/remove-images', async (req, res) => {
   const imagePath = path.join(__dirname, 'dist/uploads/', String(req.body.imagepath));
  try {
    await fs.promises.access(imagePath);
    await fs.promises.rm(imagePath, { recursive: true, force: true });
    res.json({ code: 200 });
  } catch (err) {
    console.error('Error removing folder:', err);
    res.status(400).json({ code: 400, message: 'Sorry no images to remove!' });
  }
})
app.use((error, req, res, next) => {
  if(error.code == 'LIMIT_FILE_TYPES'){
    res.json({error:'Wrong file type!'})
  }
  if(error.code == 'LIMIT_FILE_SIZE'){
    res.json({error:'File to large! Each file must be less then 10 MB'})
  }
})

app.listen(3000, () => {
  console.log('Server is running...')
})
