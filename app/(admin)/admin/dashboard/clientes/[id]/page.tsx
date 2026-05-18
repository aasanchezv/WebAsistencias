'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import PhotoPicker from '@/components/ui/PhotoPicker';
import ColorPicker from '@/components/ui/ColorPicker';
import LoadingPage from '@/components/ui/LoadingPage';

import { Service } from '@/types/service';

import styles from '../clientes.module.css';

interface Client {
    id: number;
    name: string;
    slug: string;
    logo_url: string;
    primary_color: string;
    secondary_color: string | null;
    active: boolean;
}

export default function EditarCliente() {
    const router = useRouter();
    const { id } = useParams();

    const [allServices, setAllServices] = useState<Service[]>([]);
    const [assignedServices, setAssignedServices] = useState<Service[]>([]);
    const [loadingServices, setLoadingServices] = useState(true);

    const [form, setForm] = useState({
        name: '',
        slug: '',
        logo_url: '',
        primary_color: '',
        secondary_color: '',
        active: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [option, setOption] = useState(0);

    useEffect(() => {
        async function fetchClient() {
            const res = await fetch(`/api/admin/tenants/${id}`);
            const data: Client = await res.json();
            setForm({
                name: data.name,
                slug: data.slug,
                logo_url: data.logo_url,
                primary_color: data.primary_color,
                secondary_color: data.secondary_color ?? '',
                active: data.active,
            });
            setLoading(false);
        }
        fetchClient();
    }, [id]);

    useEffect(() => {
        async function fetchServices() {
            const [allRes, assignedRes] = await Promise.all([
                fetch('/api/admin/services'),
                fetch(`/api/admin/tenants/${id}/services`)
            ]);
            const all = await allRes.json();
            const assigned = await assignedRes.json();

            setAllServices(all);
            setAssignedServices(assigned);
            setLoadingServices(false);
        }
        fetchServices();
    }, [id]);

    async function handleSubmit() {
        if (!form.name || !form.slug || !form.logo_url || !form.primary_color) {
            setError('Nombre, slug, logo y color primario son obligatorios.');
            return;
        }

        setSaving(true);
        setError(null);

        const res = await fetch(`/api/admin/tenants/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            setError('Error al guardar los cambios.');
            setSaving(false);
            return;
        }

        router.push('/admin/dashboard/clientes');
    }

    async function handleDelete() {
        if (!confirm('¿Eliminar este cliente? Esta acción no se puede deshacer.')) return;

        const res = await fetch(`/api/admin/tenants/${id}`, { method: 'DELETE' });

        if (!res.ok) {
            setError('Error al eliminar el cliente.');
            return;
        }

        router.push('/admin/dashboard/clientes');
    }

    async function handleToggleService(service: Service) {
        const isAssigned = assignedServices.some(s => s.id === service.id);

        const res = await fetch(`/api/admin/tenants/${id}/services`, {
            method: isAssigned ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceId: service.id }),
        });

        if (!res.ok) return;

        setAssignedServices(prev =>
            isAssigned
                ? prev.filter(s => s.id !== service.id)
                : [...prev, service]
        );
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
                    <p className={styles.title}>Editar Cliente</p>
                </div>
                <div className={styles.buttons}>
                    {false && <Button text="Eliminar" onClick={handleDelete} /> }
                    <Button text={saving ? 'Guardando...' : 'Actualizar'} onClick={handleSubmit} />
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
                    Colores
                </div>
                <div
                    className={`${styles.option} ${option === 2 ? styles.option_selected : ""}`}
                    onClick={()=>setOption(2)}
                >
                    Asistencias
                </div>
                <div
                    className={`${styles.option} ${option === 3 ? styles.option_selected : ""}`}
                    onClick={()=>setOption(3)}
                >
                    Imagen
                </div>
                {false &&
                <div
                    className={`${styles.option} ${option === 4 ? styles.option_selected : ""}`}
                    onClick={()=>setOption(4)}
                >
                    Preview
                </div>
                }
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={`${styles.card} ${styles.card_background}`}>
                <div className={styles.form}>

                    {option === 0 &&
                        <div className={styles.grid_2}>

                            <Switch
                                label="Estado"
                                value={form.active}
                                onChange={(value) => setForm(prev => ({ ...prev, active: value }))}
                            />

                            <Input
                                label="URL"
                                name="url"
                                value={`/${form.slug}/login/`}
                                placeholder="URL"
                                readonly={true}
                            />

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
                                placeholder="ej: mi-cliente"
                            />
                        </div>
                    }

                    {option === 1 &&
                        <div className={styles.grid_2}>
                            <div>

                                <div className={styles.input_color_c}>
                                    <div 
                                        className={styles.input_color_square}
                                        style={{
                                            background: `#${form.primary_color}`
                                        }}
                                    >
                                    </div>
                                    <Input
                                        label="Color Primario"
                                        name="primary_color"
                                        value={form.primary_color}
                                        onChange={(value) => setForm(prev => ({ ...prev, primary_color: value }))}
                                        placeholder="FF0000"
                                    />
                                </div>

                                <div className={styles.input_color_c}>
                                    <div 
                                        className={styles.input_color_square}
                                        style={{
                                            background: `#${form.secondary_color}`
                                        }}
                                    >
                                    </div>
                                    <Input
                                        label="Color Secundario"
                                        name="secondary_color"
                                        value={form.secondary_color}
                                        onChange={(value) => setForm(prev => ({ ...prev, secondary_color: value }))}
                                        placeholder="000000"
                                    />
                                </div>
                                
                                
                            </div>
                            <ColorPicker
                                label="Paleta de colores"
                                value={form.primary_color}
                                onChange={(hex) => setForm(prev => ({ ...prev, primary_color: hex }))}
                            />
                        </div>
                    }

                    {option === 2 &&
                        <>
                            {loadingServices ? (
                                <p>Cargando servicios...</p>
                            ) : (
                                <div className={styles.grid_2}>
                                    {/* Columna izquierda: disponibles */}
                                    <div>
                                        <div className={styles.service_list}>
                                            {allServices
                                                .filter(s => !assignedServices.some(a => a.id === s.id))
                                                .map(service => (
                                                    <div key={service.id} className={styles.service_item}>
                                                        <img src={service.icon} className={styles.service_icon} />
                                                        <span className={styles.service_name}>{service.name ?? service.text}</span>
                                                        <div
                                                            className={styles.service_btn_add}
                                                            onClick={() => handleToggleService(service)}
                                                        >
                                                            <img src="/icons/add_service.svg" />
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            {allServices.filter(s => !assignedServices.some(a => a.id === s.id)).length === 0 && (
                                                <div className={styles.service_empty_c}>
                                                    <p className={styles.service_empty}>Todas las asistencias asignadas</p>
                                                    <img src="/icons/all_services.svg" className={styles.service_empty_icon}/>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Columna derecha: asignados */}
                                    <div>
                                        <div className={styles.service_list}>
                                            {assignedServices.map(service => (
                                                <div key={service.id} className={styles.service_item}>
                                                    <img src={service.icon} className={styles.service_icon} />
                                                    <span className={styles.service_name}>{service.name ?? service.text}</span>
                                                    <button
                                                        className={styles.service_btn_remove}
                                                        onClick={() => handleToggleService(service)}
                                                    >
                                                        −
                                                    </button>
                                                </div>
                                            ))}
                                            {assignedServices.length === 0 && (
                                                <div className={styles.service_empty_c}>
                                                    <p className={styles.service_empty}>Sin asistencias asignadas</p>
                                                    <img src="/icons/no_services.svg" className={styles.service_empty_icon}/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    }

                    {option === 3 &&
                        <PhotoPicker
                            label="Logo"
                            name="logo_url"
                            url={form.logo_url}
                            onChange={(url) => setForm(prev => ({ ...prev, logo_url: url }))}
                        />
                    }

                    {option === 4 &&
                        <></>
                    }
                    
                </div>
            </div>

        </div>
    );
}