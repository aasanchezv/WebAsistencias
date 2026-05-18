'use client'

import React, { useState, useRef } from 'react';
import styles from './photopicker.module.css';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
const MAX_SIZE = 1024 * 1024;

interface PhotoPickerProps {
    label?: string;
    name?: string;
    url?: string;
    onChange?: (url: string) => void;
}

export default function PhotoPicker({
    label = '',
    name = '',
    url = '',
    onChange = () => { },
}: PhotoPickerProps) {

    const inputRef = useRef<HTMLInputElement>(null);

    const [preview, setPreview] = useState<string>(url);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    async function uploadFile(file: File) {
        setError(null);
        setWarning(null);

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Tipo de archivo no permitido. Usa PNG, JPG o SVG.');
            return;
        }

        if (file.size > MAX_SIZE) {
            setWarning(`Imagen muy pesada (${(file.size / 1024).toFixed(0)} KB). Máximo recomendado: 1MB.`);
        }

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? 'Error al subir la imagen.');
                setPreview('');
                return;
            }

            onChange(data.url);
        } catch {
            setError('Error de red al subir la imagen.');
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    }

    return (
        <div className={styles.container}>

            {label && <p className={styles.label}>{label}</p>}

            <div
                className={`${styles.dropzone} ${dragOver ? styles.photo_picker_input_container_2_show : ''} ${error ? styles.photo_picker_drop_zone_error : ''}`}
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
            >
                {loading ? (
                    <div className={styles.photo_picker_input_container}>
                        <span>Subiendo...</span>
                    </div>
                ) : preview ? (
                    <div className={styles.preview_container}>
                        <img src={preview} alt="Preview" className={styles.preview} />
                    </div>
                ) : (
                    <div className={styles.photo_picker_input_container}>
                        <img src="/icons/upload_image.svg" alt="" width={40} height={40} />
                        <div className={styles.add_cliente_tooltip}>
                            <span>Buscar o soltar imagen (PNG, JPG, SVG)</span>
                        </div>
                    </div>
                )}

                {dragOver && (
                    <div className={`${styles.photo_picker_input_container_2} ${styles.photo_picker_input_container_2_show}`}>
                        <span>Aquí puedes soltar la imagen</span>
                    </div>
                )}
            </div>

            {error && (
                <div className={styles.input_error_container}>
                    <img src="/img/icons/warning.svg" className={styles.input_error_img} alt="" />
                    <p className={styles.input_error_p}>{error}</p>
                </div>
            )}

            {warning && (
                <div className={styles.input_error_container}>
                    <img src="/img/icons/warning2.svg" className={styles.input_error_img} alt="" />
                    <p className={styles.input_warning_p}>{warning}</p>
                </div>
            )}

            {!error && preview && (
                <div className={styles.input_error_container}>
                    <img src="/icons/done.svg" className={styles.input_error_img} alt="" />
                    <p className={styles.input_success_p}>Imagen cargada correctamente</p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                name={name}
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                className={styles.add_portada_input_img}
                onChange={handleInputChange}
            />

        </div>
    );
}