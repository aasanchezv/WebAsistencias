'use client'

import styles from './input.module.css';

interface PhoneInputProps {
    label?: string;
    name?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

function formatPhone(digits: string): string {
    const d = digits.replace(/\D/g, '').slice(0, 10);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
    return `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
}

export default function PhoneInput({ label, name, value, onChange, placeholder }: PhoneInputProps) {
    return (
        <div className={styles.container}>
            {label && <p className={styles.label}>{label}</p>}
            <div className={styles.container_simple}>
                <input
                    className={styles.input}
                    name={name}
                    type="tel"
                    value={formatPhone(value)}
                    onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
                    placeholder={placeholder ?? '55 5555 5555'}
                    autoComplete="off"
                    maxLength={12}
                />
            </div>
        </div>
    );
}