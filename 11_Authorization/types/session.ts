type Session = {
    tokenHash: string,
    userId: string,
    createdAt: Date,
    expiresIn: Date,
    revoked: boolean
}

export { Session };