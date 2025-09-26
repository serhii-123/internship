type TokenType = 'access' | 'refresh';

class InvalidJwtTokenError extends Error {
    public tokenType: TokenType;

    constructor(tokenType: TokenType) {
        const msg = `Invalid ${tokenType} token`;
        
        super(msg);
        
        this.name = 'InvalidJwtTokenError';
    }
}

export default InvalidJwtTokenError;