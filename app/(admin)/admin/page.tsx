'use client'

import React, { useState, useEffect } from "react";

import { useRouter } from 'next/navigation'
import { httprequest } from '@/utils/Httprequest/httprequest';

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadingPage from "@/components/ui/LoadingPage"

import styles from './login.module.css';

export default function LoginAdmin() {

    const router = useRouter();
    const [authenticated,setAuthenticated] = useState(false);

    const [loadingButton, setLoadingButton] = useState(false);
    const [showError, setShowError] = useState(false);
    const [viewPass, setViewPass] = useState(false);

    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    
    const handleChange = (field:any) => (e:any) => {
        setForm((prevForm) => ({ ...prevForm, [field]: e }));
    };

    async function handleSubmit(e:any) {
        e.preventDefault();
        if (loadingButton) return;
        
        setLoadingButton(true);
        setShowError(false);

        try {
            await httprequest({
                api: '/api/admin/login',
                method: 'POST',
                data: form,
            });

            await new Promise(res => setTimeout(res, 1000));

            router.replace('/admin/dashboard/asistencias');

        } catch (err) {
            setShowError(true);
        } finally {
            setLoadingButton(false);
        }
    }

    return (
        
        <>
            {
                !authenticated ? (
                    <div className={styles.container}>

                        <form
                            id="form"
                            className={styles.card}
                            onSubmit={(e) => { handleSubmit(e) }}
                        >

                            <img
                                src="/logos/assist.png"
                                className={styles.logo}
                            />

                            <Input
                                leftIcon    = "/img/icons/black-mail-72x72.png"
                                placeholder = "Usuario"
                                name        = "email"
                                type        = "email"
                                value       = {form.email}
                                onChange    = {handleChange('email')}
                                required    = {true}
                                label       = "Usuario"
                            />

                            <Input
                                leftIcon    = "/img/icons/black-key-icon-72x72.png"
                                placeholder = "Contraseña"
                                rightIcon   = {
                                    viewPass ? 
                                    "/img/icons/no-view.svg" :
                                    "/img/icons/view.svg"
                                }
                                name        = "password"
                                required    = {true}
                                type        = {viewPass ? "text" : "password" }
                                onChange    = { handleChange('password') }
                                rightIconClick={
                                    () => {
                                        setViewPass(!viewPass);
                                    }
                                }
                                label       = "Contraseña"
                            />

                            {showError &&
                                <div
                                    className={styles.error}
                                >
                                    <p className="">Usuario y/o contraseña incorrectos</p>
                                </div>
                            }

                            <Button
                                disabled   = {false}
                                text       = "Iniciar Sesión"
                                loading    = {loadingButton}
                                margin     = {"auto"}
                                background = {"9BC31D"}
                                color      = {"ffffff"}
                            />

                        </form>

                    </div>
                ) : <LoadingPage/>
            }

        </>

    )
}