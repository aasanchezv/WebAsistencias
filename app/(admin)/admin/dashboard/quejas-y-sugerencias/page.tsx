'use client'

import React, { useState, useEffect } from "react";

import RichEditor from '@/components/ui/RichEditor';
import Input from '@/components/ui/Input';
import Button from "@/components/ui/Button";

import LoadingPage from '@/components/ui/LoadingPage';
import styles from './clientes.module.css';

const SLUG = 'quejas-y-sugerencias';

export default function CondicionesGeneralesAdmin() {

    const [title,   setTitle]   = useState('');
    const [content, setContent] = useState('');
    const [saving,  setSaving]  = useState(false);
    const [loading, setLoading] = useState(false);

     useEffect(() => {
        fetch(`/api/admin/pages/${SLUG}`)
            .then(r => r.json())
            .then(d => {
                setTitle(d.title ?? '');
                setContent(d.content ?? '');
            });
    }, []);

    async function handleSave() {
        setSaving(true);
        await fetch(`/api/admin/pages/${SLUG}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ title, content }),
        });
        setSaving(false);
    }

    if (loading) return (
        <LoadingPage
            primaryColor = "000000"
        />
    );

    return (

        <div className={styles.content}>

            <div className={styles.head}>

                <p className={styles.title}>Quejas y Sugerencias</p>

                <div className={styles.buttons}>

                    <Button
                        text="Guardar"
                        margin="auto 0 auto auto"
                        onClick={handleSave}
                    />

                </div>

            </div>

            <div className={styles.tools}>

            </div>

            <div className={styles.card_background}>

                <Input
                    label="Título"
                    value={title}
                    onChange={setTitle}
                    placeholder="Título de la página"
                />
                <RichEditor content={content} onChange={setContent} />

            </div>

        </div>

    )
}