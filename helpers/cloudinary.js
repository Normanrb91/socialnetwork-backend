const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, 
});

const uploadImage = async (filePath, id) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: `socialNetwork/${id}`})
}

const deleteImage = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId)
}

module.exports = {
    uploadImage,
    deleteImage
}