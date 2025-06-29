import { input } from "@inquirer/prompts";

class FileUtils {
    static async getFilePath(): Promise<string> {
        let filePath = await input({
            message: 'Drag and drop your image to terminal and press Enter for upload:'
        });
        filePath = filePath.replace(/^'+|'+$/g, '');

        return filePath;
    }

    static async getFileNameFromPath(path: string): Promise<string> {
        const fileNameStartIndex: number = path.lastIndexOf('/') + 1
        const fileName = path.slice(fileNameStartIndex);

        return fileName;
    }
}

export default FileUtils;