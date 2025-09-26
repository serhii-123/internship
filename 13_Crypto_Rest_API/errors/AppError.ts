class AppError extends Error {
    constructor(public message: string) {
        super(message)
        this.name = 'AppError'
    }
}

export default AppError