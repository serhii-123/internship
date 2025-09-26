class UrlNotAvailableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UrlNotAvailableError';
    }
}

export default UrlNotAvailableError;