import { createReadStream } from "fs";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

async function uploadFile(
    auth: OAuth2Client,
    filePath: string,
    fileName: string,
    folderId: string
): Promise<string> {
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
        const result = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id'
        });

        return result.url;
    } catch(e) {
        if(e instanceof Error)
            throw new Error('Error uploading file to G Drive, ' + e.message);
        else
            throw new Error('Error uploading file to G Drive');
    }
}

export default uploadFile;