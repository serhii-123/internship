type ErrorCode = 'ivalid_password' | 'user_not_found';

class AuthError extends Error {
    public code: ErrorCode;

    constructor(code: ErrorCode, message?: string) {
        super(message);

        this.code = code;
        this.name = 'AuthError';
    }
}

export default AuthError;