import './globals.css';
import styles from './dashboard.module.css';

import NavbarAdmin from '@/components/ui/NavbarAdmin';

export default async function AdminLayout({ children, params }: any) {

    return (
        <div className={styles.container}>
            <div className={styles.header}></div>
            <div className={styles.body}>
                <NavbarAdmin/>
                {children}
            </div>
        </div>
    );
}