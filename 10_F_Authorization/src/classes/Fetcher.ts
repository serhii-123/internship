class Fetcher {
    static async makeSignInRequest(email: string, password: string) {
        const loginUrl = `http://localhost:3000/login?email=${email}&password=${password}`;
        const headers = { 'Content-Type': 'application/json' };
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers,
        });

        return response;
    }

    static async makeSignUpRequest(email: string, password: string) {
        const signUpUrl = `http://localhost:3000/sign_up`;
        const requestBody = { email, password };
        const headers = { 'Content-Type': 'application/json' };
        const response = await fetch(signUpUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
        });

        return response;
    }

    static async makeRefreshRequest(refreshToken: string) {
        const refreshUrl = 'http://localhost:3000/refresh';
        const headers = { 'Authorization': `Bearer ${refreshToken}` };
        const response = await fetch(refreshUrl, {
            method: 'POST',
            headers
        });
        
        return response;
    }

    static async makeMeRequest(accessToken: string) {
        const meUrl = 'http://localhost:3000/me';
        const headers = { 'Authorization': `Bearer ${accessToken}` };
        const response = await fetch(meUrl, {
            headers
        });

        return response;
    }
}

export default Fetcher;