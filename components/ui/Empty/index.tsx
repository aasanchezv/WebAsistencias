'use client'

import styles from './empty.module.css';

interface EmptyProps{
    label: string;
}

export default function Empty({label}:EmptyProps){
    return(
        <div className={styles.container}>
            <p
                className={styles.label}
            >
               {label}
            </p>
            <img
                className={styles.icon}
                src="/icons/no_services.svg"
            />
        </div>
    )
}