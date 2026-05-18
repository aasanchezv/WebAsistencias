'use client'

import React, { useState, useEffect } from "react";

import { useRouter } from 'next/navigation';
import { useTenant } from '@/components/providers/TenantProvider';
import { Service } from '@/types/service';

import Button from "@/components/ui/Button";

import styles from './dashboard.module.css';

export default function Dashboard() {

    const tenant = useTenant();
    const router = useRouter();

    const [services, setServices] = useState<Service[]>([]);
    const [loading,  setLoading]  = useState(true);

    async function fetchServices() {
        setLoading(true);
        const res  = await fetch(`/api/tenant/${tenant.slug}/services`);
        const data = await res.json();
        setServices(data);
        setLoading(false);
    }

    useEffect(() => { fetchServices(); }, []);

    return (
        <>
            <div className={styles.content}>

                <div className={styles.head}>
                    <p className={styles.title}>Servicios de Asistencia</p>
                </div>

                <div className={styles.dashboard}>

                    {loading && <p>Cargando...</p>}

                    {!loading && services.length === 0 && (
                        <p>No hay servicios disponibles.</p>
                    )}

                    <div className={styles.services_container}>
                        {services.map(service => (
                            <div
                                key={service.id}
                                className={styles.service_card}
                                onClick={() => router.push(`/${tenant.slug}/dashboard/asistencia/${service.id}`)}
                            >
                                <div
                                    className={styles.service_icon_c}
                                    style={{
                                        backgroundImage:`url(${service.icon})`
                                    }}
                                >
                                </div>
                                <div className={styles.service_info}>
                                    <p className={styles.service_name}>{service.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
                

            </div>
        
        </>
    );
}