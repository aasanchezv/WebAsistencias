import React from "react";
import styles from './textarea.module.css';

interface TextAreaProps {
  id?:          string;
  label?:       string;
  value?:       string;
  name?:        string;
  required?:    boolean;
  onChange?:    (value: string) => void;  // ← recibe string, no el evento
  placeholder?: string;
  readonly?:    boolean;
}

function TextArea({
  id = '',
  label= '',
  value = '',
  name = '',
  required = false,
  onChange = () => {},
  placeholder = '',
  readonly = false
}: TextAreaProps) {

  return (
    <div className={`${styles.textarea_container_simple}`}>
      {label && <p className={styles.textarea_label}>{label}</p>}
      
      <label className ={styles.labelfor} htmlFor={id}>{name}</label> 
      <textarea
        id={id}
        className={styles.textarea}
        required={required}
        defaultValue={value}
        name={name}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readonly}
      />
    </div>
  );
}

export default TextArea;
