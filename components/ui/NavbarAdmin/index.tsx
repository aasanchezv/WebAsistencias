'use client'

import React, { useState } from "react";
import styles from './navbaradmin.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NavItemProps {
    href: string;
    icon: string;
    label: string;
}

function NavItem({ href, icon, label }: NavItemProps) {
    const router = useRouter();
    return (
        <div className={styles.nav_item} onClick={() => router.push(href)}>
            <div className={styles.nav_icon}>
                <Image src={icon} alt={label} width={24} height={24} />
            </div>
            <div className={styles.nav_label}>
                <span>{label}</span>
            </div>
        </div>
    );
}

interface NavbarAdminProps {
    isAdmin?: boolean;
}

export default function NavbarAdmin({ isAdmin = false }: NavbarAdminProps) {
    const [closed, setClosed] = useState<boolean>(false);

    return (
        <nav className={closed ? `${styles.nav} ${styles.nav_closed}` : styles.nav}>

            <div className={styles.nav_logo_c}>
                <Image src="/img/logo_default.png" alt="Logo" className={styles.nav_logo} width={120} height={40} />
            </div>

            <NavItem href="/admin/dashboard/asistencias" icon="/icons/asistencias.svg" label="Asistencias" />

            <NavItem href="/admin/dashboard/servicios" icon="/icons/subservicio.svg" label="Servicios" />

            <NavItem href="/admin/dashboard/clientes" icon="/icons/clientes.svg" label="Clientes" />

            <NavItem href="/admin/dashboard/usuarios" icon="/icons/usuarios.svg" label="Usuarios" />

            <NavItem href="/admin/dashboard/condiciones-generales" icon="/icons/condicionesgenerales.svg" label="Condiciones Generales" />

            <NavItem href="/admin/dashboard/quejas-y-sugerencias" icon="/icons/quejas.svg" label="Quejas y Sugerencias" />

            <div className={styles.nav_divider} />

            <div className={styles.nav_item} onClick={() => { /* lógica de logout */ }}>
                <div className={styles.nav_icon}>
                    <Image src="/icons/salir.svg" alt="Cerrar Sesión" width={24} height={24} />
                </div>
                <div className={styles.nav_label}>
                    <span>Cerrar Sesión</span>
                </div>
            </div>

            <Image
                src="/img/icons/close_menu.svg"
                alt="Cerrar menú"
                className={closed ? `${styles.nav_close_menu} ${styles.nav_close_menu_closed}` : styles.nav_close_menu}
                onClick={() => setClosed(!closed)}
                width={24}
                height={24}
            />

        </nav>
    );
}