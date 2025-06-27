import { google } from "googleapis";

async function authorize(email: string, key: string) {
    const scopes: string[] = ['https://www.googleapis.com/auth/drive'];
    const auth = new google.auth.JWT({
        email,
        key,
        scopes
    });

    try {
        await auth.authorize();

        return auth;
    } catch(e) {
        if(e instanceof Error)
            throw new Error(e.message);
        else
            throw new Error('Some error happened');
    }
}

export default authorize;