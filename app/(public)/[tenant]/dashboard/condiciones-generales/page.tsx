'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant } from '@/components/providers/TenantProvider';
import LoadingPage from '@/components/ui/LoadingPage';

import styles from '../dashboard.module.css';

const SLUG = 'condiciones-generales';

export default function AsistenciaDetalle() {

    const router = useRouter();
    const tenant = useTenant();
    const [title,   setTitle]   = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/pages/${SLUG}`)
            .then(r => r.json())
            .then(d => {
                setTitle(d.title ?? '');
                setContent(d.content ?? '');
                setLoading(false);
            });
    }, []);

    if (loading) return <LoadingPage secondaryColor="000000" />;

    return (
        <div className={styles.content}>
            <div className={styles.head}>
                <div className={styles.back_container}>
                    <img src="/icons/back.svg" className={styles.back} onClick={() => router.back()} />
                    <p className={styles.title}>{title}</p>
                </div>
            </div>
            <div className={styles.card_background}>
                <div
                    className={styles.rich_content}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
            
        </div>
    );
}