import React from "react";
import styles from './inputselect.module.css';

interface SelectOption {
    value: string | number;
    text: string;
}

interface InputSelectProps {
    value?: string | number;
    text?: string;
    name?: string;
    options?: SelectOption[];
    label?: string;
    id?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    error?: boolean;
    errorText?: string;
    leftIcon?: string;
    readonly?: boolean;
    disabled?: boolean;
}

function InputSelect({
    value = '',
    text = 'Seleccionar una opción...',
    name = '',
    options = [],
    label = '',
    id = '',
    onChange = () => { },
    required = false,
    error = false,
    errorText = 'This field is required',
    leftIcon = '',
    readonly = false,
    disabled = false,
}: InputSelectProps) {

    return (
        <div className={styles.container}>

            {label && <p className={styles.label}>{label}</p>}

            <div className={styles.container_simple}>

                {leftIcon && (
                    <div className={styles.icon_c}>
                        <img className={styles.icon} src={leftIcon} alt="Left Icon" />
                    </div>
                )}

                <select
                    className={`${styles.input} ${error ? styles.error : ''}`}
                    style={{ backgroundImage: "url(/icons/unfold.svg)" }}
                    onChange={(e) => onChange(e.target.value)}
                    id={id}
                    name={name}
                    value={value ?? ''}
                    required={required}
                    disabled={disabled}
                >
                    <option value="">{text}</option>
                    {options.map((item, i) => (
                        <option key={i} value={item.value}>{item.text}</option>
                    ))}
                </select>

            </div>

            {error && (
                <div className={styles.error_container}>
                    <img src="https://growbot.elefante.mx/img/icons/warning.svg" className={styles.error_img} alt="" />
                    <p className={styles.error_text}>{errorText}</p>
                </div>
            )}

        </div>
    );
}

export default InputSelect;