type RefreshToken = {
    tokenHash: string,
    userId: string,
    expiresAt: Date,
    createdAt: Date,
    revoked: boolean
}

export { RefreshToken };