import type { FocusEvent, RefObject } from "react";
import Validator from "./Validator";

class InputEventHandler {
    static async onEmailBlur(inputRef: RefObject<HTMLInputElement | null>, e: FocusEvent<HTMLInputElement>) {
        const { value } = e.target;
        const isValid = await Validator.validateEmail(value);

        await this.changeBorderColorByValidationResult(inputRef, isValid);
    }

    static async onPasswordBlur(inputRef: RefObject<HTMLInputElement | null>, e: FocusEvent<HTMLInputElement>) {
        const { value } = e.target;
        const isValid = await Validator.validatePassword(value);

        await this.changeBorderColorByValidationResult(inputRef, isValid);
    }

    private static async changeBorderColorByValidationResult(
        ref: RefObject<HTMLInputElement | null>,
        isValid: boolean
    ) {
        const style = (ref.current as HTMLInputElement).style;

        if(isValid)
            style.borderColor = 'rgb(255, 255, 255)';
        else
            style.borderColor = 'rgb(255, 100, 100)';
    }
}

export default InputEventHandler;