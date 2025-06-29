import { confirm, input } from "@inquirer/prompts";
import { config } from "dotenv";
import authorize from "./authorize";
import uploadFile from "./uploadFile";
import shortenLink from "./shortenLink";
import FileUtils from "./FileUtils";

config();

const folderId: string = process.env.FOLDER_ID as string;
const redirectURI: string = process.env.REDIRECT_URI as string;
const refreshToken: string = process.env.REFRESH_TOKEN as string;
const clientId: string = process.env.CLIENT_ID as string;
const clientSecret: string = process.env.CLIENT_SECRET as string;
const clientEmail: string = process.env.CLIENT_EMAIL as string;

async function start(
    folderId: string,
    redirectURI: string,
    refreshToken: string,
    clientId: string,
    clientSecret: string,
    clientEmail: string
): Promise<void> {
    const auth = await authorize(redirectURI, refreshToken, clientId, clientEmail, clientSecret);
    const filePath: string = await FileUtils.getFilePath();
    let fileName: string = await FileUtils.getFileNameFromPath(filePath);
    const fileExtension = filePath.slice(filePath.lastIndexOf('.') + 1);
    
    console.log(
        `Path to file: ${filePath}\n` 
        + `File name: ${fileName}\n`
        + `File extension: ${fileExtension}`
    );

    const rename: boolean = await confirm({
        message: `You're uploading the file with the name: ${fileName}. Would you like to change it?`
    });

    if(rename)
        fileName = await input({
            message: 'Enter new file name (WITHOUT extension aka .jpg, .png etc.)'
        });

    const url = await uploadFile(auth, filePath, fileName, folderId);
    console.log('Successfully uploaded!');
    
    const shortify: boolean = await confirm({ message: 'Would you like to shorten you link?' });

    if(!shortify) return;

    const shortUrl: string = await shortenLink(url);
    console.log('Your short link is: ' + shortUrl);
}

start(folderId, redirectURI, refreshToken, clientId, clientSecret, clientEmail);