'use client'

import React, { useState, useEffect } from "react";

import { useRouter } from 'next/navigation';
import { Subservice } from '@/types/subservice';

import Button from "@/components/ui/Button";
import LoadingPage from '@/components/ui/LoadingPage';
import Empty from "@/components/ui/Empty";

import styles from './servicios.module.css';

export default function ServiciosAdmin() {
    const router = useRouter();

    const [subservices, setSubservices] = useState<Subservice[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchSubservices() {
        setLoading(true);
        const res = await fetch('/api/admin/subservices');
        const data = await res.json();
        setSubservices(data);
        setLoading(false);
    }

    useEffect(() => { fetchSubservices(); }, []);

    if (loading) return (
        <LoadingPage
            primaryColor = "000000"
        />
    );

    return (
        <div className={styles.content}>

            <div className={styles.head}>
                <p className={styles.title}>Servicios</p>
                <div className={styles.buttons}>
                    <Button
                        text="Nuevo +"
                        onClick={() => router.push('/admin/dashboard/servicios/nuevo')}
                    />
                </div>
            </div>

            {subservices.length == 0
                ?
                <div className={styles.card_background}>
                    <Empty
                        label="Aún no hay servicios"
                    />
                </div>
                :
                <div className={styles.list}>

                    <div className={styles.item_header}>
                        <div className={styles.item_column}><p>Nombre</p></div>
                        <div className={styles.item_column}><p>Icono</p></div>
                        <div className={styles.item_column}><p>Texto</p></div>
                        <div className={styles.item_column}><p>Asistencia</p></div>
                    </div>

                    {subservices.map(subservice => (
                        <div
                            key={subservice.id}
                            className={styles.item}
                            onClick={() => router.push(`/admin/dashboard/servicios/${subservice.id}`)}
                        >
                            <div className={styles.item_column}>
                                <p>{subservice.name ?? '—'}</p>
                            </div>
                            <div className={styles.item_column}>
                                <div
                                    className={styles.logo}
                                    style={{ backgroundImage: `url(${subservice.icon})` }}
                                />
                            </div>
                            <div className={styles.item_column}>
                                <p>{subservice.text}</p>
                            </div>
                            <div className={styles.item_column}>
                                <p>{subservice.service?.name ?? subservice.serviceId}</p>
                            </div>
                        </div>
                    ))}

                </div>
            }

        </div>
    );
}