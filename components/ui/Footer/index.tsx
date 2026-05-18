import React from "react";
import styles from './footer.module.css';
import Button from "../Button";

import {useTenant} from '@/components/providers/TenantProvider'

const Footer = () => {

    const tenant = useTenant();

    return(
        
        <footer className={styles.container}>
            <div className={styles.body}>
                <div className={styles.left}>
                    <img
                        src={`${tenant.logo_url}`}
                        className={styles.logo}
                    />
                    <p className={styles.text}>© 2026 Assist</p>
                    <p className={styles.text}>Todos los derechos reservados.</p>
                    <p className={styles.text}>Términos y Condiciones</p>
                    <p className={styles.text}>Aviso de Privacidad</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;