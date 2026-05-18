"use client"

import React from "react";
import Spinner from "../Spinner/";
import styles from "./button.module.css";

interface ButtonProps {
    margin?: string;
    text?: string;
    id?: string;
    disabled?: boolean;
    background?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    loading?: boolean;
    color?: string;
    align?: React.CSSProperties["textAlign"];
    link?: string;
    borderColor?: string
}

const Button = (props: ButtonProps) => {
    const {
        text = "Click aquí",
        id = "",
        disabled = false,
        onClick = () => {},
        loading = false,
        background = "9BC31D",
        color = "ffffff",
        align = "center",
        margin = "center",
        link = "",
        borderColor = "9BC31D"
    } = props;

    const style: React.CSSProperties = {
        background : `#${background}`,
        color      :`#${color}`,
        textAlign  : align,
        border     : `2px solid #${background}`,
        margin     : margin
    };

    const content = loading ? (
        <Spinner size={20} border={3} primaryColor={color} secondaryColor={background}/>
    ) : (
        <>{text}</>
    );

    return (
        <div className={styles.container} style={{ margin: margin }}>
            {link ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.button}
                    style={style}
                >
                    {content}
                </a>
            ) : (
                <button
                    id={id}
                    className={styles.button}
                    type="submit"
                    disabled={disabled}
                    style={style}
                    onClick={onClick}
                >
                    {content}
                </button>
            )}
        </div>
    );
};

export default Button;
