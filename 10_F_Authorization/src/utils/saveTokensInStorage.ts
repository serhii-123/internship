async function saveTokensInStorage(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessJwt', accessToken);
    localStorage.setItem('refreshJwt', refreshToken);
}

export default saveTokensInStorage;