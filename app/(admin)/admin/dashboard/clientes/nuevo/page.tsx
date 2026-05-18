'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PhotoPicker from '@/components/ui/PhotoPicker';
import ColorPicker from '@/components/ui/ColorPicker';

import styles from '../clientes.module.css';

export default function NuevoCliente() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        slug: '',
        logo_url: '',
        primary_color: '',
        secondary_color: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit() {
        if (!form.name || !form.slug || !form.logo_url || !form.primary_color) {
            setError('Nombre y ID son obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        const res = await fetch('/api/admin/tenants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            setError('Error al crear el cliente.');
            setLoading(false);
            return;
        }

        router.push('/admin/dashboard/clientes');
    }

    return (
        <div className={styles.content}>

            <div className={styles.head}>
                <div className={styles.back_container}>
                    <img src="/icons/back.svg" className={styles.back} onClick={() => router.back()} />
                    <p className={styles.title}>Nuevo Cliente</p>
                </div>
                <div className={styles.buttons}>
                    <Button text={loading ? 'Guardando...' : 'Guardar'} onClick={handleSubmit} />
                </div>
            </div>

            <div className={`${styles.card} ${styles.card_background}`}>
                <div className={styles.form}>

                    {error &&
                        <div className={styles.error_c}>
                            <p className={styles.error}>{error}</p>
                        </div>
                    }

                    <div className={styles.grid_2}>
                        <Input
                            label="Nombre"
                            name="name"
                            value={form.name}
                            onChange={(value) => setForm(prev => ({ ...prev, name: value }))}
                            placeholder="Nombre del cliente"
                        />
                        <Input
                            label="ID"
                            name="slug"
                            value={form.slug}
                            onChange={(value) => setForm(prev => ({ ...prev, slug: value }))}
                            placeholder="ej: micliente"
                        />
                    </div>

                    <div className={styles.grid_2}>
                        <div>
                            <Input
                                label="Color Primario"
                                name="primary_color"
                                value={form.primary_color}
                                onChange={(value) => setForm(prev => ({ ...prev, primary_color: value }))}
                                placeholder="FF0000"
                            />
                            <Input
                                label="Color Secundario"
                                name="secondary_color"
                                value={form.secondary_color}
                                onChange={(value) => setForm(prev => ({ ...prev, secondary_color: value }))}
                                placeholder="000000"
                            />
                        </div>
                        <ColorPicker
                            label="Paleta de colores"
                        />
                    </div>

                    <PhotoPicker
                        label="Logo"
                        name="logo_url"
                        url={form.logo_url}
                        onChange={(url) => setForm(prev => ({ ...prev, logo_url: url }))}
                    />

                </div>
            </div>

        </div>
    );
}