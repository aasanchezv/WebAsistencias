'use client'

import React, { useState, useEffect } from 'react';

import { useRouter, useParams } from 'next/navigation';
import { Service } from '@/types/service';
import { Subservice } from '@/types/subservice';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import TextArea from '@/components/ui/TextArea';
import PhotoPicker from '@/components/ui/PhotoPicker';
import LoadingPage from '@/components/ui/LoadingPage';
import SubserviceList from '@/components/ui/SubserviceList';

import styles from '../asistencias.module.css';

export default function AsistenciaDetalle() {
    const router = useRouter();
    const { id } = useParams();

    const [service, setService] = useState<Service | null>(null);
    const [subservices, setSubservices] = useState<Subservice[] | null>(null);

    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);

    const [form, setForm] = useState({ name: '', icon: '', text: '', description: '', active: false });

    const [option, setOption] = useState(0);

    const [error, setError]    = useState<string | null>(null);

    async function fetchService() {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/admin/services/${id}`);
        const data = await res.json();
        setService(data);
        setForm({
            name: data.name ?? '',
            icon: data.icon ?? '',
            text: data.text ?? '',
            description: data.description ?? '',
            active: data.active
        });
        setLoading(false);
    }

    async function fetchSubservices() {
        const res = await fetch(`/api/admin/services/${id}/subservices`);
        const data = await res.json();
        setSubservices(data);
        setLoading2(false);
    }

    useEffect(() => { 
        fetchService();
    }, [id]);

    useEffect(() => {
        setLoading2(true);
        if (option === 2) {
            fetchSubservices();
        }
    }, [option]);


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSave() {
        if (!form.name) {
            setError('El nombre es obligatorio');
            return;
        }
        await fetch(`/api/admin/services/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        fetchService();
    }

    async function handleDelete() {
        if (!confirm('¿Eliminar esta asistencia?')) return;
        await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
        router.push('/admin/dashboard/asistencias');
    }

    if (loading) return (
        <LoadingPage
            primaryColor = "000000"
        />
    );

    if (!service) return <p>No encontrado</p>;

    return (
        <div className={styles.content}>

            <div className={styles.head}>

                <div className={styles.back_container}>
                    <img src="/icons/back.svg" className={styles.back} onClick={() => router.back()} />
                    <p
                        className={styles.title}
                    >
                        Editar Asistencia
                    </p>
                </div>

                <div className={styles.buttons}>
                    <Button text="Actualizar" onClick={handleSave} />
                    {false && <Button text="Eliminar" onClick={handleDelete} /> }
                </div>
            </div>

            <div className={styles.options}>
                <div
                    className={`${styles.option} ${option === 0 ? styles.option_selected : ""}`}
                    onClick={()=>setOption(0)}
                >
                    General
                </div>
                <div
                    className={`${styles.option} ${option === 1 ? styles.option_selected : ""}`}
                    onClick={()=>setOption(1)}
                >
                    Imagen
                </div>
                <div
                    className={`${styles.option} ${option === 2 ? styles.option_selected : ""}`}
                    onClick={()=>setOption(2)}
                >
                    Servicios
                </div>
                {false &&
                <div
                    className={`${styles.option} ${option === 3 ? styles.option_selected : ""}`}
                    onClick={()=>setOption(3)}
                >
                    Preview
                </div>
                }
            </div>

            <div className={`${styles.card} ${styles.card_background}`}>

                <div className={styles.form}>

                    {option === 0 &&
                        <>
                        {error &&
                            <div className={styles.error_c}>
                                <p className={styles.error}>{error}</p>
                            </div>
                        }

                        <div className={styles.grid_2}>
                            <Switch
                                label="Estado"
                                value={form.active}
                                onChange={(value) => setForm(prev => ({ ...prev, active: value }))}
                            />
                        </div>

                        <div className={styles.grid_2}>
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
                        </div>
                        <TextArea
                            label='Descripción'
                            name="description"
                            value={form.description}
                            onChange={(value) => setForm(prev => ({ ...prev, description: value }))}
                            placeholder="Descripción completa"
                        />
                        </>
                    }

                    {option === 1 &&
                        <PhotoPicker
                            label="Icono"
                            name="icon"
                            url={form.icon}
                            onChange={(url) => setForm(prev => ({ ...prev, icon: url }))}
                        />
                    }

                    {option === 2 &&
                        <>
                            {loading2 ? (
                                <LoadingPage/>
                            ) : (
                                <SubserviceList
                                    subservices={subservices}
                                    onSelect={(sub) => router.push(`/admin/dashboard/asistencias/${id}/subservices/${sub.id}`)}
                                />
                            )}
                        </>
                    }

                </div>

            </div>

        </div>
    );
}