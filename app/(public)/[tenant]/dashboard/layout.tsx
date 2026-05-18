import './globals.css';
import styles from './dashboard.module.css';

import Button from '@/components/ui/Button';
import Navbar from '@/components/ui/Navbar';

export default async function AdminLayout({ children, params }: any) {

    return (
        <div className={styles.container}>
            <div className={styles.header}></div>
            <div className={styles.body}>
                <Navbar/>
                {children}
                <div className={styles.help_button_c}>
                    <Button
                        text='¿Necesitas Ayuda?'
                    />
                </div>
            </div>
        </div>
    );
}