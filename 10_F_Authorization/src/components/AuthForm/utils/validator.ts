class Validator {
    static async validateEmail(email: string) {
        const validationExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = validationExp.test(email);

        return isValid;
    }

    static async validatePassword(password: string) {
        const minLength = 8;
        const isValid = password.length >= minLength;

        return isValid
    }
}

export default Validator;