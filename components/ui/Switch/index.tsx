'use client'

interface SwitchProps {
    label?: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

import styles from './switch.module.css';

export default function Switch({ label, value, onChange }: SwitchProps) {
    return (
        <div className={styles.witch_group}>
            {label && <p className={styles.switch_label}>{label}</p>}
            <div className={styles.switch_row}>
                <div
                    className={`${styles.switch} ${value ? styles.switch_on : ''}`}
                    onClick={() => onChange(!value)}
                >
                    <div className={styles.switch_thumb}/>
                </div>
                <span className={styles.switch_text}>
                    {value ? 'Activo' : 'Inactivo'}
                </span>
            </div>
        </div>
    );
}