import { initializeApp } from "@firebase/app"

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig)

import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "@firebase/storage";
import ImageService from "./ImageService";

const storage = getStorage(app);

const RemoteImageService = {
    upload: async (base64Url: string) => {

        // Generate a unique file name with its extension
        let fileName = ImageService.generateRandomHashedName() + "." + ImageService.getExtensionFromBase64(base64Url);

        // Make a storage reference
        const storageRef = ref(storage, '/images/' + fileName);

        // Upload the base64Url String to firebase
        let snapshot = await uploadString(storageRef, base64Url, 'data_url');

        // Return the download Url for database
        return await getDownloadURL(snapshot.ref)
    },
    delete: async (path: string) => {
        try {
            // Create a reference to the file to delete
            const desertRef = ref(storage, path);

            // Delete the file
            return await deleteObject(desertRef)

        } catch (err: any) {
            throw err
        }
    }

}

export default RemoteImageService