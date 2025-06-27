import { confirm, input } from "@inquirer/prompts";
import { config } from "dotenv";
import authorize from "./authorize";
import uploadFile from "./uploadFile";

config();

const folderId: string = process.env.FOLDER_ID as string;
const clientToken: string = process.env.CLIENT_TOKEN as string;
const clientEmail: string = process.env.CLIENT_EMAIL as string;

async function start(folderId: string, clientToken: string): Promise<void> {
    const auth = await authorize(clientEmail, clientToken);
    const filePath: string = await input({
        message: 'Drag and drop your image to terminal and press Enter for upload:'
    });
    let fileName = filePath.slice(filePath.lastIndexOf('/') + 1);
    const fileExtension = filePath.slice(filePath.lastIndexOf('.') + 1)
    
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

    await uploadFile(auth, filePath, fileName, folderId);
    console.log('Successfully uploaded!');
    
    const shortify: boolean = await confirm({ message: 'Would you like to shorten you link?' });

    if(shortify)
        console.log('Your short link is: ')
}

start(folderId, clientToken);