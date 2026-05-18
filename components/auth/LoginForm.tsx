'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant } from '@/components/providers/TenantProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingPage from '@/components/ui/LoadingPage';
import Footer from '@/components/ui/Footer';
import styles from './login.module.css';

export default function LoginForm() {
    const tenant = useTenant();
    const router = useRouter();

    const [authenticated, setAuthenticated] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Usuario y/o contraseña incorrectos');
    const [viewPass, setViewPass] = useState(false);

    const [form, setForm] = useState({ email: '', password: '' });

    // Verifica si ya hay sesión activa
    async function checkAuth() {
        try {
            const res = await fetch(`/api/${tenant.slug}/auth/me`, { credentials: 'include' });
            const data = await res.json();
            if (data?.authenticated) {
                router.push(`/${tenant.slug}/dashboard`);
            } else {
                setAuthenticated(false);
            }
        } catch {
            setAuthenticated(false);
        }
    }

    useEffect(() => { checkAuth(); }, []);

    const handleChange = (field: keyof typeof form) => (value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoadingButton(true);
        setShowError(false);

        const res = await fetch(`/api/${tenant.slug}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
            setErrorMsg(data.error ?? 'Usuario y/o contraseña incorrectos');
            setShowError(true);
            setLoadingButton(false);
            return;
        }

        router.push(`/${tenant.slug}/dashboard`);
    }

    if (authenticated) return <LoadingPage />;

    return (
        <div className={styles.container}>

            <form
                id="form"
                className={styles.card}
                onSubmit={handleSubmit}
            >

                <img src={tenant.logo_url} className={styles.logo} alt={tenant.name} />

                <Input
                    leftIcon="/img/icons/black-mail-72x72.png"
                    placeholder="Usuario"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    required={true}
                    label="Usuario"
                />

                <Input
                    leftIcon="/img/icons/black-key-icon-72x72.png"
                    placeholder="Contraseña"
                    rightIcon={viewPass ? '/img/icons/no-view.svg' : '/img/icons/view.svg'}
                    name="password"
                    required={true}
                    type={viewPass ? 'text' : 'password'}
                    onChange={handleChange('password')}
                    rightIconClick={() => setViewPass(!viewPass)}
                    label="Contraseña"
                />

                {showError && (
                    <div className={styles.error}>
                        <p>{errorMsg}</p>
                    </div>
                )}

                <Button
                    disabled={false}
                    text="Iniciar Sesión"
                    loading={loadingButton}
                    margin="auto"
                    background={tenant.primary_color}
                    color={tenant.secondary_color ?? '#ffffff'}
                />

            </form>

            <Footer />

        </div>
    );
}