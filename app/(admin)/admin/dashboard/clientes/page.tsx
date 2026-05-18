'use client'

import React, { useState, useEffect } from "react";

import { useRouter } from 'next/navigation'
import { Client } from '@/types/client';

import Empty from "@/components/ui/Empty";
import LoadingPage from '@/components/ui/LoadingPage';
import Button from "@/components/ui/Button";

import styles from './clientes.module.css';

export default function ClientesAdmin() {

    const router = useRouter();

    const [clients, setclients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchTenants() {
        setLoading(true);
        const res = await fetch('/api/admin/tenants');
        const data = await res.json();
        setclients(data);
        setLoading(false);
    }

    useEffect(() => { fetchTenants(); }, []);

    if (loading) return (
        <LoadingPage
            primaryColor = "000000"
        />
    );

    return (

        <div className={styles.content}>

            <div className={styles.head}>

                <p className={styles.title}>Clientes</p>

                <div className={styles.buttons}>

                    <Button
                        text="Nuevo +"
                        onClick={() => router.push('/admin/dashboard/clientes/nuevo')}
                        margin="auto 0 auto auto"
                    />

                </div>

            </div>

            <div className={styles.tools}>

            </div>

            {clients.length == 0
                ?
                <Empty
                    label="Aún no hay clientes"
                />
                :
                <div className={styles.list}>

                    <div className={`${styles.item_header}`}>
                        <div
                            className={`${styles.item_column}`}
                            onClick={
                                () => {

                                }
                            }
                        >
                            <p>Nombre</p>
                        </div>
                        <div
                            className={`${styles.item_column}`}
                            onClick={
                                () => {

                                }
                            }
                        >
                            <p>ID</p>
                        </div>
                        <div
                            className={`${styles.item_column}`}
                            onClick={
                                () => {

                                }
                            }
                        >
                            <p>Color Primario</p>
                        </div>
                        <div
                            className={`${styles.item_column}`}
                            onClick={
                                () => {

                                }
                            }
                        >
                            <p>Color Secundario</p>
                        </div>
                        <div
                            className={`${styles.item_column}`}
                            onClick={
                                () => {

                                }
                            }
                        >
                            <p>Logo</p>
                        </div>
                        <div
                            className={`${styles.item_column}`}
                            onClick={
                                () => {

                                }
                            }
                        >
                            <p>URL</p>
                        </div>
                        <div
                            className={`${styles.item_column}`}
                            onClick={
                                () => {

                                }
                            }
                        >
                            <p>Estado</p>
                        </div>
                    </div>

                    {clients.map(client => (
                        <div
                            key={client.name}
                            className={`${styles.item}`}
                            onClick={() => router.push(`/admin/dashboard/clientes/${client.id}`)}
                        >

                            <div
                                className={`${styles.item_column}`}
                                onClick={
                                    () => {

                                    }
                                }
                            >
                                <p>{client.name}</p>
                            </div>
                            <div
                                className={`${styles.item_column}`}
                                onClick={
                                    () => {

                                    }
                                }
                            >
                                <p>{client.slug}</p>
                            </div>
                            <div
                                className={`${styles.item_column}`}
                                onClick={
                                    () => {

                                    }
                                }
                            >
                                <div
                                    className={styles.color_circle}
                                    style={{
                                        background: `#${client.primary_color}`
                                    }}
                                >
                                </div>
                            </div>
                            <div
                                className={`${styles.item_column}`}
                                onClick={
                                    () => {

                                    }
                                }
                            >
                                <div
                                    className={styles.color_circle}
                                    style={{
                                        background: `#${client.secondary_color}`
                                    }}
                                >
                                </div>   
                            </div>
                            <div
                                className={`${styles.item_column}`}
                                onClick={
                                    () => {

                                    }
                                }
                            >
                                <div
                                    className={styles.logo}
                                    style={{
                                        backgroundImage: `url(${client.logo_url})`
                                    }}
                                >

                                </div>
                            </div>
                            <div
                                className={`${styles.item_column}`}
                                onClick={
                                    () => {

                                    }
                                }
                            >
                                <img
                                    className={`${styles.item_icon}`}
                                    src="/icons/gotourl.svg"
                                    onClick={(e)=>{
                                        e.stopPropagation()
                                        window.open(`/${client.slug}/login`, '_blank');
                                    }}
                                />
                            </div>
                            <div
                                className={`${styles.item_column}`}
                                onClick={
                                    () => {

                                    }
                                }
                            >
                                <p>
                                    {client.active ? 'Activo' : 'Inactivo'}
                                </p>
                            </div>


                        </div>
                    ))}

                </div>
            }

        </div>

    )
}