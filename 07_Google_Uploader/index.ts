import { confirm, input } from "@inquirer/prompts";

async function start() {
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

    console.log('Successfully uploaded!');
    
    const shortify: boolean = await confirm({ message: 'Would you like to shorten you link?' });

    if(shortify)
        console.log('Your short link is: ')
}

start();