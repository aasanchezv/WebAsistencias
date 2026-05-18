'use client'

import React, { useState, useEffect } from "react";

import { Service } from '@/types/service';
import Button from "@/components/ui/Button";

import styles from './dashboard.module.css';

export default function DashboardAdmin() {
    
    const [services, setServices] = useState<Service[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [selected, setSelected] = useState<Service | null>(null);  // editar
    const [showModal, setShowModal] = useState(false);

    async function fetchServices() {
        setLoading(true);
        const res  = await fetch('/api/admin/services');
        const data = await res.json();
        setServices(data);
        setLoading(false);
    }

    useEffect(() => { fetchServices(); }, []);

    return (
        
        <div className={styles.content}>

            <div className={styles.head}>

                <p className={styles.title}>Dashboard</p>

            </div>

            <div className={styles.dashboard}>


                <div className={styles.item}>
                    <p className={styles.item_title}>Asistencias</p>
                </div>

                <div className={styles.item}>
                    <p className={styles.item_title}>Clientes</p>
                </div>

                <div className={styles.item}>
                    <p className={styles.item_title}>Usuarios</p>
                </div>
                

            </div>

        </div>

    )
}