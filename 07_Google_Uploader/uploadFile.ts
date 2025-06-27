import { createReadStream } from "fs";
import { JWT } from "google-auth-library";
import { google } from "googleapis";

async function uploadFile(
    auth: JWT,
    filePath: string,
    fileName: string,
    folderId: string
) {
    const drive = google.drive({
        version: 'v3',
        auth
    });

    const fileMetadata = {
        name: fileName,
        parents: [folderId],
    }

    const media = {
        mimeType: 'application/octet-stream',
        body: createReadStream(filePath)
    };

    try {
        await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id'
        });
    } catch(e) {
        if(e instanceof Error)
            console.log('Error uploading file to G Drive, ' + e.message);
        else
            console.log('Error uploading file to G Drive');
    }
}

export default uploadFile;