import crypto from 'crypto'
import {bucket} from "../config/storage.js"

export const uploadToGCS = (file: any, folder= "") => {
    return new Promise((resolve, reject) => {

        const folderPath = typeof folder === "string" && folder.trim() ? folder : "default-folder";
        
        const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`

        const blob = bucket.file(`${folderPath}/${uniqueSuffix}-${file.originalname}`)

        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype
        })

        blobStream.on('error', (error) => {
            reject(error)
        })


        blobStream.on('finish', () => {
            const publicURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            resolve(publicURL)
        })

        blobStream.end(file.buffer);

    })
}