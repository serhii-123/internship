import { google } from "googleapis";

async function authorize(redirectURI: string, refreshToken: string, clientId: string, email: string, access_token: string) {
    const scopes: string[] = ['https://www.googleapis.com/auth/drive'];
    const auth = new google.auth.OAuth2(clientId, access_token, redirectURI);

    auth.setCredentials({
        refresh_token: refreshToken,
    });

    return auth;
}

export default authorize;