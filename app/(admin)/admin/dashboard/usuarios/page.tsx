'use client'

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { User } from '@/types/user';

import Empty from "@/components/ui/Empty";
import LoadingPage from '@/components/ui/LoadingPage';
import Button from '@/components/ui/Button';

import styles from './usuarios.module.css';

export default function UsuariosAdmin() {
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchUsers() {
        setLoading(true);
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
        setLoading(false);
    }

    useEffect(() => { fetchUsers(); }, []);

    if (loading) return (
        <LoadingPage
            primaryColor = "000000"
        />
    );

    return (
        <div className={styles.content}>

            <div className={styles.head}>
                <p className={styles.title}>Usuarios</p>
                <div className={styles.buttons}>
                    <Button
                        text="Nuevo +"
                        onClick={() => router.push('/admin/dashboard/usuarios/nuevo')}
                    />
                </div>
            </div>

            {users.length == 0
                ?
                <Empty
                    label="Aún no hay usuarios"
                />
                :
                <div className={styles.list}>

                    <div className={styles.item_header}>
                        <div className={styles.item_column}><p>Nombre</p></div>
                        <div className={styles.item_column}><p>Email</p></div>
                        <div className={styles.item_column}><p>Cliente</p></div>
                        <div className={styles.item_column}><p>Fecha</p></div>
                        <div className={styles.item_column}><p>Estado</p></div>
                    </div>

                    {users.map(user => (
                        <div
                            key={user.id}
                            className={styles.item}
                            onClick={() => router.push(`/admin/dashboard/usuarios/${user.id}`)}
                        >
                            <div className={styles.item_column}>
                                <p>{user.name ?? '—'}</p>
                            </div>
                            <div className={styles.item_column}>
                                <p>{user.email}</p>
                            </div>
                            <div className={styles.item_column}>
                                <p>{user.client?.name ?? '—'}</p>
                            </div>
                            <div className={styles.item_column}>
                                <p>{new Date(user.createdAt).toLocaleDateString('es-MX')}</p>
                            </div>
                            <div
                                className={styles.item_column}
                            >
                                <p>
                                    {user.active ? 'Activo' : 'Inactivo'}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            }

        </div>
    );
}