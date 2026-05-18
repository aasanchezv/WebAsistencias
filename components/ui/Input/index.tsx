import React from "react";
import styles from "./input.module.css";

interface InputProps {
    id?: string;
    label?: string;
    value?: string;
    type?: React.HTMLInputTypeAttribute;
    name?: string;
    required?: boolean;
    onChange?: (value: string) => void;
    onKeyUp?: (value: string) => void;
    placeholder?: string;
    leftIcon?: string;
    rightIcon?: string;
    rightIconClick?: () => void;
    readonly?: boolean;
    error?: boolean;
    errorText?: string;
}

const Input: React.FC<InputProps> = ({
    id = "",
    label = "",
    value = "",
    type = "text",
    name = "",
    required = false,
    onChange = () => {},
    onKeyUp = () => {},
    placeholder = "",
    leftIcon = "",
    rightIcon = "",
    rightIconClick = () => {},
    readonly = false,
    error = false,
    errorText = "Este campo es requerido",
}) => {

    const containerClass = type !== "hidden" ? styles.container_simple : "";

    return (
    <div className={styles.container}>
        {label && <p className={styles.label}>{label}</p>}

        <div className={containerClass}>
            {leftIcon && (
                <div className={styles.icon_c}>
                    <img
                        className={styles.icon}
                        src={leftIcon}
                        alt="Left Icon"
                    />
                </div>
            )}

        <input
            id={id}
            className={`${styles.input} ${
                error ? styles.error : ""
            }`}
            type={type}
            name={name}
            required={required}
            defaultValue={value}
            autoComplete="off"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
            }
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
                onKeyUp((e.target as HTMLInputElement).value)
            }
            placeholder={placeholder}
            readOnly={readonly}
        />

        {rightIcon && (
            <div className={styles.icon_c}>
                <img
                    className={`${styles.icon} ${styles.icon_pointer}`}
                    src={rightIcon}
                    alt="Right Icon"
                    onClick={rightIconClick}
                />
            </div>
        )}

        {error && (
            <div className={styles.error_container}>
                <div>
                    <img
                        src="https://growbot.elefante.mx/img/icons/warning.svg"
                        className="input-error-img"
                        alt="Error Icon"
                    />
                </div>
                <div>
                    <p className={styles.error_p}>{errorText}</p>
                </div>
          </div>
        )}
        </div>
    </div>
  );
};

export default Input;
