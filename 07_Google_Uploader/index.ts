import { config } from "dotenv";
import FileUtils from "./FileUtils";
import GoogleUtils from "./GoogleUtils";
import TinyUrlUtils from "./TinyUrlUtils";

config();

const tinyUrlToken: string = process.env.TINYURL_TOKEN as string;
const folderId: string = process.env.FOLDER_ID as string;
const redirectURI: string = process.env.REDIRECT_URI as string;
const refreshToken: string = process.env.REFRESH_TOKEN as string;
const clientId: string = process.env.CLIENT_ID as string;
const clientSecret: string = process.env.CLIENT_SECRET as string;

async function start(
    folderId: string,
    redirectURI: string,
    refreshToken: string,
    clientId: string,
    clientSecret: string
): Promise<void> {
    const auth = await GoogleUtils.authorize(redirectURI, refreshToken, clientId, clientSecret);
    const filePath: string = await FileUtils.getPath();
    let fileName: string = await FileUtils.getNameByPath(filePath);
    const fileExtension: string = await FileUtils.getExtensionByFileStr(fileName);
    
    await FileUtils.displayInfo(filePath, fileName, fileExtension);

    const rename: boolean = await FileUtils.askForRename(fileName);

    if(rename)
        fileName = await FileUtils.getNewName();

    const fileId = await GoogleUtils.uploadFile(auth, filePath, fileName, folderId);
    console.log('Successfully uploaded!');
    
    const shortify: boolean = await TinyUrlUtils.askForShortneLink();

    if(!shortify) return;
    
    const fileUrl: string = `https://drive.google.com/file/d/${fileId}/view`; 
    const shortFileUrl: string = await TinyUrlUtils.shortenLink(tinyUrlToken, fileUrl);

    console.log('Your short link is: ' + shortFileUrl);
}

start(folderId, redirectURI, refreshToken, clientId, clientSecret);