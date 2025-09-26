import { confirm, input } from "@inquirer/prompts";

class FileUtils {
    static async getPath(): Promise<string> {
        let filePath = await input({
            message: 'Drag and drop your image to terminal and press Enter for upload:',
            validate: async s => {
                const clearedPath: string = s.replace(/^'+|'+$/g, '');
                const extension: string = await this.getExtensionByFileStr(clearedPath);
                const isValid = await this.validateExtensionForImage(extension);

                return isValid;
            }
        });
        filePath = filePath.replace(/^'+|'+$/g, '');

        return filePath;
    }

    static async getNameByPath(path: string): Promise<string> {
        const nameStartIndex: number = path.lastIndexOf('/') + 1;
        const name = path.slice(nameStartIndex);

        return name;
    }

    static async getExtensionByFileStr(fileStr: string): Promise<string> {
        const extensionStartIndex: number = fileStr.lastIndexOf('.') + 1;
        const extension: string = fileStr.slice(extensionStartIndex);
        
        return extension;
    }

    private static async validateExtensionForImage(extension: string): Promise<boolean> {
        const allowedExtensions: string[] = ['jpg', 'jpeg', 'png'];
        const isValid: boolean = allowedExtensions.includes(extension);

        return isValid;
    }

    static async displayInfo(path: string, name: string, extension: string): Promise<void> {
        console.log(
            `Path to file: ${path}\n` 
            + `File name: ${name}\n`
            + `File extension: ${extension}`
        );
    }

    static async askForRename(fileName: string): Promise<boolean> {
        const message: string = `You're uploading the file with the name: ${fileName}. Would you like to change it?`
        const rename = await confirm({ message });

        return rename;
    }

    static async getNewName(): Promise<string> {
        const message: string = 'Enter new file name (WITHOUT extension aka .jpg, .png etc.)';
        const name: string = await input({ message, validate: s => s.length != 0 });

        return name;
    }
}

export default FileUtils;