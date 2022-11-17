import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import path from "path";

let imageUploadPath = "./public/images/";
if (!fs.existsSync(imageUploadPath)) {
    fs.mkdirSync(imageUploadPath, { recursive: true });
}

const ImageService = {
    // Function to get the actual payload of the base64 string
    getPayloadFromBase64: (base64: String) => {
        return base64.split(',')[1]
    },

    //Function to get the extension from the base64 string
    getExtensionFromBase64: (base64: String) => {
        let temp = base64.split(';')[0].split('/')[1]
        return temp.includes('+')
            ? base64.split(';')[0].split('/')[1].split('+')[0]
            : base64.split(';')[0].split('/')[1]
    },

    // Function to get the type (eg, image,etc) of the base64 
    getImageType: (base64: String) => {
        return base64.split('/')[0].split(':')[1];
    },

    // Function to generate a random filename 
    generateRandomHashedName: () => {
        return uuidv4()
    },

    // Function to locally store file to a filesystem
    saveImageToFileSystem: (base64Url: String, destPath: String) => {
        try {
            let fileName = ImageService.generateRandomHashedName() + "." + ImageService.getExtensionFromBase64(base64Url);
            const buffer = Buffer.from(ImageService.getPayloadFromBase64(base64Url), "base64");
            fs.writeFileSync(path.join(destPath.toString(), fileName), buffer);
            return path.join('images/', fileName);
        } catch (err: any) {
            throw err
        }
    },

    // Function to locally delete the file from file system
    deleteImageFromFileSystem: (path: String) => {
        try {
            if (fs.existsSync(String(path))) {
                fs.unlinkSync(String(path))
                return true
            } else
                return false
        } catch (err: any) {
            throw err
        }
    }
}

export default ImageService