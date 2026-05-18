'use client'

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { Client } from '@/types/client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputSelect from '@/components/ui/InputSelect';

import styles from '../usuarios.module.css';

export default function NuevoUsuario() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        clientId: '',
    });
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewPass, setViewPass] = useState(false);

    useEffect(() => {
    async function fetchClients() {
        const res  = await fetch('/api/admin/tenants');
        const data = await res.json();
        setClients(data);
    }
    fetchClients();
    }, []);

    async function handleSubmit() {
        if (!form.name || !form.email || !form.password || !form.clientId) {
            setError('Todos los campos son obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, clientId: Number(form.clientId) }),
        });

        if (!res.ok) {
            setError('Error al crear el usuario.');
            setLoading(false);
            return;
        }

        router.push('/admin/dashboard/usuarios');
    }

    return (
        <div className={styles.content}>

            <div className={styles.head}>
                <div className={styles.back_container}>
                    <img src="/icons/back.svg" className={styles.back} onClick={() => router.back()} />
                    <p className={styles.title}>Nuevo Usuario</p>
                </div>
                <div className={styles.buttons}>
                    <Button text={loading ? 'Guardando...' : 'Guardar'} onClick={handleSubmit} />
                </div>
            </div>

            <div className={`${styles.card} ${styles.card_background}`}>

                {error &&
                    <div className={styles.error_c}>
                        <p className={styles.error}>{error}</p>
                    </div>
                }

                <div className={styles.form}>

                    <div className={styles.grid_2}>
                        <Input
                            label="Nombre"
                            name="name"
                            value={form.name}
                            onChange={(value) => setForm(prev => ({ ...prev, name: value }))}
                            placeholder="Nombre completo"
                        />
                        <Input
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={(value) => setForm(prev => ({ ...prev, email: value }))}
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div className={styles.grid_2}>
                        <Input
                            label="Contraseña"
                            name="password"
                            value={form.password}
                            onChange={(value) => setForm(prev => ({ ...prev, password: value }))}
                            placeholder="Contraseña"
                            rightIcon   = {
                                viewPass ? 
                                "/img/icons/no-view.svg" :
                                "/img/icons/view.svg"
                            }
                            type = {viewPass ? "text" : "password" }
                             rightIconClick={
                                () => {
                                    setViewPass(!viewPass);
                                }
                            }
                        />
                        <InputSelect
                            label="Cliente"
                            value={form.clientId}
                            options={clients.map(c => ({ value: c.id, text: c.name.toLowerCase() }))}
                            onChange={(value) => setForm(prev => ({ ...prev, clientId: value }))}
                        />
                    </div>

                </div>
            </div>

        </div>
    );
}