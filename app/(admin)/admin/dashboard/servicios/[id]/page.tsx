'use client'

import React, { useState, useEffect } from 'react';

import { useRouter, useParams } from 'next/navigation';
import { Service } from '@/types/service';
import { Subservice } from '@/types/subservice';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PhoneInput from '@/components/ui/PhoneInput';
import TextArea from '@/components/ui/TextArea';
import PhotoPicker from '@/components/ui/PhotoPicker';
import InputSelect from '@/components/ui/InputSelect';
import LoadingPage from '@/components/ui/LoadingPage';

import styles from '../servicios.module.css';

export default function EditarServicio() {
    const router = useRouter();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: '',
        icon: '',
        text: '',
        description: '',
        serviceId: '',
        phone: '',
        whatsapp: ''
    });
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [option, setOption] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const [subRes, srvRes] = await Promise.all([
                fetch(`/api/admin/subservices/${id}`),
                fetch('/api/admin/services'),
            ]);

            const subservice: Subservice = await subRes.json();
            const services: Service[] = await srvRes.json();

            setForm({
                name: subservice.name ?? '',
                icon: subservice.icon ?? '',
                text: subservice.text ?? '',
                description: subservice.description ?? '',
                serviceId: String(subservice.serviceId),
                phone: subservice.phone ?? '',
                whatsapp : subservice.whatsapp ?? ''
            });
            setServices(services);
            setLoading(false);
        }
        fetchData();
    }, [id]);

    async function handleSubmit() {
        if (!form.name || !form.serviceId) {
            setError('El Nombre y Asistencia son obligatorios');
            return;
        }

        setSaving(true);
        setError(null);

        const res = await fetch(`/api/admin/subservices/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, serviceId: Number(form.serviceId) }),
        });

        if (!res.ok) {
            setError('Error al guardar los cambios.');
            setSaving(false);
            return;
        }

        router.push('/admin/dashboard/servicios');
    }

    async function handleDelete() {
        if (!confirm('¿Eliminar este servicio? Esta acción no se puede deshacer.')) return;

        const res = await fetch(`/api/admin/subservices/${id}`, { method: 'DELETE' });

        if (!res.ok) {
            setError('Error al eliminar el servicio.');
            return;
        }

        router.push('/admin/dashboard/servicios');
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
                    <p className={styles.title}>Editar Servicio</p>
                </div>
                <div className={styles.buttons}>
                    <Button text="Eliminar" onClick={handleDelete} />
                    <Button text={saving ? 'Guardando...' : 'Guardar'} onClick={handleSubmit} />
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
                    Contacto
                </div>
                <div
                    className={`${styles.option} ${option === 2 ? styles.option_selected : ""}`}
                    onClick={()=>setOption(2)}
                >
                    Imagen
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
                            <Input
                                label="Nombre"
                                name="name"
                                value={form.name}
                                onChange={(value) => setForm(prev => ({ ...prev, name: value }))}
                                placeholder="Nombre del servicio"
                            />
                            <InputSelect
                                label="Asistencia"
                                value={form.serviceId}
                                options={services.map(s => ({ value: s.id, text: s.name ?? '—' }))}
                                onChange={(value) => setForm(prev => ({ ...prev, serviceId: value }))}
                            />
                        </div>

                        <Input
                            label="Texto"
                            name="text"
                            value={form.text}
                            onChange={(value) => setForm(prev => ({ ...prev, text: value }))}
                            placeholder="Texto corto"
                        />

                        <TextArea
                            label="Descripción"
                            name="description"
                            value={form.description}
                            onChange={(value) => setForm(prev => ({ ...prev, description: value }))}
                            placeholder="Descripción completa"
                        />
                    </>
                    }

                    {option === 1 &&
                        <div className={styles.grid_2}>

                            <PhoneInput
                                label={"WhatsApsp"}
                                name={"whatsapp"}
                                placeholder={"WhatsApp"}
                                value={form.whatsapp}
                                onChange={(value) => setForm(prev => ({ ...prev, whatsapp: value }))}                          
                            />

                            <PhoneInput
                                label={"Teléfono"}
                                name={"phone"}
                                placeholder={"Teléfono de Contacto"}
                                value={form.phone}
                                onChange={(value) => setForm(prev => ({ ...prev, phone: value }))}                          
                            />

                        </div>
                    }

                    {option === 2 &&
                        <PhotoPicker
                            label="Icono"
                            name="icon"
                            url={form.icon}
                            onChange={(url) => setForm(prev => ({ ...prev, icon: url }))}
                        />
                    }

                </div>
            </div>

        </div>
    );
}