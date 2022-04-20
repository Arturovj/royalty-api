const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage;

cloudinary.config({
    cloud_name: process.env.CLOUDINARU_NAME,
    api_key: process.env.CLOUDINARU_KEY,
    api_secret: process.env.CLOUDINARU_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'iron-gym',
        allowed_formats: ['jpg', 'png']
    }
})

module.exports = multer({ storage })