import {
    forwardRef,
    useImperativeHandle, useRef,
    type ChangeEvent,
    type FocusEvent,
    type RefObject
} from "react";
import './input-block.css';

type InputBlockProps = {
    key: string;
    className: string;
    type: string;
    placeholder: string;
    invalidInputMessage: string;
    validation: (value: any) => boolean | Promise<boolean>;
    onChange: (e: ChangeEvent<HTMLInputElement>) => any;
};

type ForwardRefBody = {
    makeInvalid: () => any;
}

function InputBlock(props: InputBlockProps, ref: any) {
    const inputRef = useRef<HTMLInputElement>(null);
    const invalidInputMsgBlock = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        makeInvalid: async () => {
            const inputStyle = (inputRef as RefObject<HTMLInputElement>)
                .current
                .style;
            const invalidMsgStyle = (invalidInputMsgBlock as RefObject<HTMLDivElement>)
                .current
                .style;
            const color = 'rgb(255, 100, 100)';
            inputStyle.borderColor = color;
            invalidMsgStyle.display = 'block';
        }
    }));

    const onFocus = async () => {
         const inputStyle = (inputRef as RefObject<HTMLInputElement>)
            .current
            .style;
        const invalidMsgStyle = (invalidInputMsgBlock as RefObject<HTMLDivElement>)
            .current
            .style;
        const color = 'rgb(255, 255, 255)';
        inputStyle.borderColor = color;
        invalidMsgStyle.display = 'none';
    }

    const onBlur = async (e: FocusEvent<HTMLInputElement>) => {
        const inputStyle = (inputRef as RefObject<HTMLInputElement>)
            .current
            .style;
        const invalidMsgStyle = (invalidInputMsgBlock as RefObject<HTMLDivElement>)
            .current
            .style;
        const { value } = e.target;
        const isValid = await props.validation(value);
        const validColor = 'rgb(255, 255, 255)';
        const invalidColor = 'rgb(255, 100, 100)';
        
        if(isValid) {
            inputStyle.borderColor = validColor;
            invalidMsgStyle.display = 'none';
        } else {
            inputStyle.borderColor = invalidColor;
            invalidMsgStyle.display = 'block';
        }
    }

    return <div className={`input-block ${props.className}`}>
        <div
            ref={invalidInputMsgBlock}
            className="input-block__invalid-input-message"
        >
            {props.invalidInputMessage}
        </div>
        <input
            key={props.key}
            ref={inputRef}
            className="input-block__input"
            type={props.type}
            placeholder={props.placeholder}
            onChange={props.onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSubmit={e => e.preventDefault()} />
    </div>
}

export default forwardRef<ForwardRefBody, InputBlockProps>(InputBlock);