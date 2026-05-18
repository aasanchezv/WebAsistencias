'use client'

import React, { useState, useEffect } from "react";

import { useRouter } from 'next/navigation'
import { Service } from '@/types/service';

import Button from "@/components/ui/Button";
import LoadingPage from '@/components/ui/LoadingPage';
import Empty from "@/components/ui/Empty";

import styles from './asistencias.module.css';

export default function AsistenciasAdmin() {

    const router = useRouter();

    const [services, setServices] = useState<Service[]>([]);
    const [loading,  setLoading]  = useState(true);

    async function fetchServices() {
        setLoading(true);
        const res  = await fetch('/api/admin/services');
        const data = await res.json();
        setServices(data);
        setLoading(false);
    }

    useEffect(() => { fetchServices(); }, []);

    if (loading) return (
        <LoadingPage
            primaryColor = "000000"
        />
    );

    return (
        
        <div className={styles.content}>

            <div className={styles.head}>

                <p className={styles.title}>Asistencias</p>

                <div className={styles.buttons}>

                    <Button
                        text="Nuevo +"
                        onClick={() => router.push('/admin/dashboard/asistencias/nuevo')}
                        margin="auto 0 auto auto"
                    />

                </div>

            </div>

            <div className={styles.tools}>

            </div>

            {services.length == 0 
                ?
                <div className={styles.card_background}>
                    <Empty
                        label="Aún no hay asistencias"
                    />
                </div>
                :
                <div className={styles.list}>

                    {services.map(service => (
                        <div
                            key={service.name}
                            className = {`${styles.item}`}
                            onClick={() => router.push(`/admin/dashboard/asistencias/${service.id}`)}
                        >

                            <p className = {`${styles.item_title}`}>{service.name}</p>

                            <div
                                className={styles.icon}
                                style={{
                                    backgroundImage : `url(${service.icon})`
                                }}
                            >

                            </div>
                            
                        </div>
                    ))}

                </div>
            }

        </div>

    )
}