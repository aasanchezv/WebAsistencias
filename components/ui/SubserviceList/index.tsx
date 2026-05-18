'use client'

import { Subservice } from '@/types/subservice';

import Empty from '@/components/ui/Empty';

import styles from './subserviceList.module.css';

interface SubserviceListProps {
    subservices: Subservice[];
    onSelect?: (sub: Subservice) => void;
}

export default function SubserviceList({ subservices, onSelect }: SubserviceListProps) {
    return (
        <div className={styles.list}>
            {subservices.map(sub => (
                <div
                    key={sub.id}
                    className={styles.item}
                    onClick={() => onSelect?.(sub)}
                >
                    {sub.icon
                        ? <img src={sub.icon} className={styles.icon} />
                        : <div className={styles.icon_placeholder} />
                    }
                    <div className={styles.info}>
                        <p className={styles.name}>{sub.name ?? sub.text}</p>
                        <p className={styles.desc}>{sub.description}</p>
                    </div>
                    <img src="/icons/back.svg" className={styles.arrow} />
                </div>
            ))}
            {subservices.length === 0 && (
                <Empty
                    label='Aún no hay servicios asociados'
                />
            )}
        </div>
    );
}