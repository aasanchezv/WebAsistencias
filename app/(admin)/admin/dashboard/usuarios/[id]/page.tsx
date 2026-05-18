'use client'

import React, { useState, useEffect } from 'react';

import { useRouter, useParams } from 'next/navigation';
import { Client } from '@/types/client';
import { User } from '@/types/user';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import InputSelect from '@/components/ui/InputSelect';
import LoadingPage from '@/components/ui/LoadingPage';

import styles from '../usuarios.module.css';

export default function EditarUsuario() {
    const router = useRouter();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        clientId: '',
        active:false
    });
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            const [userRes, clientsRes] = await Promise.all([
                fetch(`/api/admin/users/${id}`),
                fetch('/api/admin/tenants'),
            ]);

            const user: User = await userRes.json();
            const clients: Client[] = await clientsRes.json();

            setForm({
                name: user.name ?? '',
                email: user.email ?? '',
                password: '',
                clientId: String(user.clientId),
                active: user.active
            });
            setClients(clients);
            setLoading(false);
        }
        fetchData();
    }, [id]);

    async function handleSubmit() {
        if (!form.email || !form.clientId) {
            setError('Email y cliente son obligatorios.');
            return;
        }

        setSaving(true);
        setError(null);

        const res = await fetch(`/api/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, clientId: Number(form.clientId) }),
        });

        if (!res.ok) {
            setError('Error al guardar los cambios.');
            setSaving(false);
            return;
        }

        router.push('/admin/dashboard/usuarios');
    }

    async function handleDelete() {
        if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;

        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });

        if (!res.ok) {
            setError('Error al eliminar el usuario.');
            return;
        }

        router.push('/admin/dashboard/usuarios');
    }

    if (loading) return (
        <LoadingPage
            primaryColor = "000000"
        />
    );

    return (
        <div className={styles.content}>

            <div className={styles.head}>
                <div className={styles.back_container}>
                    <img src="/icons/back.svg" className={styles.back} onClick={() => router.back()} />
                    <p className={styles.title}>Editar Usuario</p>
                </div>
                <div className={styles.buttons}>
                    <Button text="Eliminar" onClick={handleDelete} />
                    <Button text={saving ? 'Guardando...' : 'Guardar'} onClick={handleSubmit} />
                </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={`${styles.card} ${styles.card_background}`}>
                <div className={styles.form}>

                    <div className={styles.grid_2}>

                        <Switch
                            label="Estado"
                            value={form.active}
                            onChange={(value) => setForm(prev => ({ ...prev, active: value }))}
                        />

                    </div>

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

                        <Input
                            label="Nueva contraseña"
                            name="password"
                            value={form.password}
                            onChange={(value) => setForm(prev => ({ ...prev, password: value }))}
                            placeholder="Dejar vacío para no cambiar"
                        />
                        
                        <InputSelect
                            label="Cliente"
                            value={form.clientId}
                            options={clients.map(c => ({ value: c.id, text: c.name }))}
                            onChange={(value) => setForm(prev => ({ ...prev, clientId: value }))}
                        />

                    </div>

                </div>
            </div>

        </div>
    );
}