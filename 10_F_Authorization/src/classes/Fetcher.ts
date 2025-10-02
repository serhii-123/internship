class Fetcher {
    static async makeSignInRequest(email: string, password: string) {
        const loginUrl = `http://localhost:3000/login?email=${email}&password=${password}`;
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        return response;
    }

    static async makeSignUpRequest(email: string, password: string) {
        const signUpUrl = `http://localhost:3000/sign_up`;
        const requestBody = { email, password };
        const response = await fetch(signUpUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        return response;
    }
}

export default Fetcher;