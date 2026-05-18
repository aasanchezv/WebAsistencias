'use client'

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { Service } from '@/types/service';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PhoneInput from '@/components/ui/PhoneInput';
import TextArea from '@/components/ui/TextArea';
import PhotoPicker from '@/components/ui/PhotoPicker';
import InputSelect from '@/components/ui/InputSelect';

import styles from '../servicios.module.css';

export default function NuevoServicio() {
    const router = useRouter();

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchServices() {
            const res = await fetch('/api/admin/services');
            const data = await res.json();
            setServices(data);
        }
        fetchServices();
    }, []);

    async function handleSubmit() {
        if (!form.name || !form.serviceId) {
            setError('Nombre y Asistencia son obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        const res = await fetch('/api/admin/subservices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, serviceId: Number(form.serviceId) }),
        });

        if (!res.ok) {
            setError('Error al crear el servicio.');
            setLoading(false);
            return;
        }

        router.push('/admin/dashboard/servicios');
    }

    return (
        <div className={styles.content}>

            <div className={styles.head}>
                <div className={styles.back_container}>
                    <img src="/icons/back.svg" className={styles.back} onClick={() => router.back()} />
                    <p className={styles.title}>Nuevo Servicio</p>
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
                            placeholder="Nombre del servicio"
                        />

                        <InputSelect
                            label="Asistencia"
                            value={form.serviceId}
                            options={services.map(s => ({ value: s.id, text: s.name.toLocaleLowerCase() ?? '—' }))}
                            onChange={(value) => setForm(prev => ({ ...prev, serviceId: value }))}
                        />

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

                    <PhotoPicker
                        label="Icono"
                        name="icon"
                        url={form.icon}
                        onChange={(url) => setForm(prev => ({ ...prev, icon: url }))}
                    />

                </div>
            </div>

        </div>
    );
}