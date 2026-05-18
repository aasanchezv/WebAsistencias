'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import PhotoPicker from '@/components/ui/PhotoPicker';

import styles from '../asistencias.module.css';

export default function NuevaAsistencia() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        icon: '',
        text: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit() {
        if (!form.name) {
            setError('El nombre es obligatorio');
            return;
        }

        setLoading(true);
        setError(null);

        const res = await fetch('/api/admin/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            setError('Error al crear la asistencia.');
            setLoading(false);
            return;
        }

        router.push('/admin/dashboard/asistencias');
    }

    return (
        <div className={styles.content}>

            <div className={styles.head}>
                <div className={styles.back_container}>
                    <img src="/icons/back.svg" className={styles.back} onClick={() => router.back()}/>
                    <p
                        className={styles.title}
                    >
                        Nueva Asistencia
                    </p>
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

                        <div>

                            <Input
                                label='Nombre'
                                name="name"
                                value={form.name}
                                onChange={(value) => setForm(prev => ({ ...prev, name: value.toLocaleLowerCase() }))}
                                placeholder="Nombre"
                            />

                            <Input
                                label='Texto corto'
                                name="text"
                                value={form.text}
                                onChange={(value) => setForm(prev => ({ ...prev, text: value }))}
                                placeholder="Texto corto"
                            />

                            <TextArea
                                label='Description'
                                name="description"
                                value={form.description}
                                onChange={(value) => setForm(prev => ({ ...prev, description: value }))}
                                placeholder="Descripción completa"
                            />

                        </div>

                        <div>

                            <PhotoPicker
                                label="Icono"
                                name="icon"
                                url={form.icon}
                                onChange={(url) => setForm(prev => ({ ...prev, icon: url }))}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}