'use client'

import React, { useState } from "react";
import styles from './navbar.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTenant } from '@/components/providers/TenantProvider';

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

interface NavbarProps {
    isAdmin?: boolean;
}

export default function Navbar({ isAdmin = false }: NavbarProps) {
    const tenant = useTenant();
    const router = useRouter();
    const [closed, setClosed] = useState<boolean>(false);

    async function handleLogout() {
        await fetch(`/api/${tenant.slug}/auth/logout`, { method: 'POST' });
        router.push(`/${tenant.slug}/login`);
    }

    return (
        <>
            <nav className={closed ? `${styles.nav} ${styles.nav_closed}` : styles.nav}>

                <div className={styles.nav_logo_c}>
                    <Image
                        src={tenant.logo_url || '/img/logo_default.png'}
                        alt={tenant.name}
                        className={styles.nav_logo}
                        width={120}
                        height={40}
                    />
                </div>

                <NavItem href={`/${tenant.slug}/dashboard/`}           icon="/icons/asistencias.svg" label="Servicios de Asistencia" />
                <NavItem href={`/${tenant.slug}/dashboard/condiciones-generales`} icon="/icons/subservicio.svg" label="Condiciones Generales"    />
                <NavItem href={`/${tenant.slug}/dashboard/quejas-y-sugerencias`}  icon="/icons/clientes.svg"   label="Quejas y Sugerencias"     />

                <div className={styles.nav_divider} />

                <div className={styles.nav_item} onClick={handleLogout}>
                    <div className={styles.nav_icon}>
                        <Image src="/icons/salir.svg" alt="Cerrar Sesión" width={24} height={24} />
                    </div>
                    <div className={styles.nav_label}>
                        <span>Cerrar Sesión</span>
                    </div>
                </div>

            </nav>

            <div className={styles.nav_mobile}>

                <Image
                    src="/icons/ham.svg"
                    alt="Cerrar menú"
                    className={styles.nav_mobile_ham}
                    onClick={() => setClosed(!closed)}
                    width={24}
                    height={24}
                />
                
            </div>

            <div className={styles.nav_mobile_logo_c}>

                <img
                    src={tenant.logo_url || '/img/logo_default.png'}
                    alt="Cerrar menú"
                    className={styles.nav_mobile_logo}
                />
                
            </div>

            <nav className={closed ? `${styles.nav_mobile_menu_body} ${styles.nav_mobile_menu_body_open}` : styles.nav_mobile_menu_body}>

                <div className={styles.nav_mobile_menu_content}>

                    <div className={styles.nav_mobile_menu_left}>

                        <div className={styles.nav_logo_c}>
                            <Image
                                src={tenant.logo_url || '/img/logo_default.png'}
                                alt={tenant.name}
                                className={styles.nav_logo}
                                width={120}
                                height={40}
                            />
                        </div>

                        <NavItem href={`/${tenant.slug}/dashboard/`}           icon="/icons/asistencias.svg" label="Servicios de Asistencia" />
                        <NavItem href={`/${tenant.slug}/dashboard/condiciones-generales`} icon="/icons/subservicio.svg" label="Condiciones Generales"    />
                        <NavItem href={`/${tenant.slug}/dashboard/quejas-y-sugerencias`}  icon="/icons/clientes.svg"   label="Quejas y Sugerencias"     />

                        <div className={styles.nav_divider} />

                        <div className={styles.nav_item} onClick={handleLogout}>
                            <div className={styles.nav_icon}>
                                <Image src="/icons/salir.svg" alt="Cerrar Sesión" width={24} height={24} />
                            </div>
                            <div className={styles.nav_label}>
                                <span>Cerrar Sesión</span>
                            </div>
                        </div>

                    </div>

                    <div
                        className={styles.nav_mobile_menu_right}
                        onClick={() => setClosed(!closed)}
                    >

                    </div>

                </div>

            </nav>
        </>
    );
}