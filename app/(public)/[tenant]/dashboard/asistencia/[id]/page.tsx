'use client'

import React, { useState, useEffect } from "react";

import { useRouter, useParams } from 'next/navigation';
import { useTenant } from '@/components/providers/TenantProvider';
import { Service } from '@/types/service';
import { Subservice } from '@/types/subservice';
import SubserviceList from '@/components/ui/SubserviceList';

import LoadingPage from '@/components/ui/LoadingPage';
import Button from "@/components/ui/Button";

import styles from '../../dashboard.module.css';

export default function AsistenciaDetalle() {

    const router   = useRouter();
    const { id }   = useParams();
    const tenant   = useTenant();

    const [service,     setService]     = useState<Service | null>(null);
    const [subservices, setSubservices] = useState<Subservice[]>([]);
    const [loading,     setLoading]     = useState(true);
    const [notFound,    setNotFound]    = useState(false);
    const [selected, setSelected] = useState<Subservice | null>(null);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/tenant/${tenant.slug}/services/${id}`);

            if (res.status === 403 || res.status === 404) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setService(data.service);
            setSubservices(data.subservices);
            setLoading(false);
        }
        fetchData();
    }, [id]);

    if (loading)  return <LoadingPage secondaryColor="000000" />;
    if (notFound) return <p>Asistencia no encontrada.</p>;

    return (
        <>
        <div className={styles.content}>
            <div className={styles.head}>
                <div className={styles.back_container}>
                    <img src="/icons/back.svg" className={styles.back} onClick={() => router.back()} />
                    <p className={styles.title}>{service?.name ?? service?.text}</p>
                </div>
            </div>

            <div className={styles.services_container}>
                {subservices.map(service => (
                    <div
                        key={service.id}
                        className={styles.service_card}
                        onClick={() => setSelected(service)}                    >
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
        {selected && (
            <div className={styles.overlay} onClick={() => setSelected(null)}>
                <div className={styles.popup} onClick={(e) => e.stopPropagation()}>

                    <div className={styles.popup_head}>
                        {selected.icon && (
                            <div
                                className={styles.popup_icon}
                                style={{ backgroundImage: `url(${selected.icon})` }}
                            />
                        )}
                        <p className={styles.popup_title}>{selected.name ?? selected.text}</p>
                        <img
                            src="/icons/close.svg"
                            className={styles.popup_close}
                            onClick={() => setSelected(null)}
                        />
                    </div>

                    <p className={styles.popup_description}>{selected.description}</p>

                    <div className={styles.popup_actions}>
                        {selected.phone && (
                            <Button
                                text="Solicitar Asistencia"
                                background="cccccc"
                                link={`tel:${selected.phone}`}
                            />
                        )}
                        {selected.whatsapp && (
                            <Button
                                text="Whatsapp"
                                background="25d366"
                                link={`https://wa.me/52${selected.whatsapp.replace(/\D/g, '')}`}
                            />
                        )}
                    </div>

                </div>
            </div>
        )}
        </>
    );
}