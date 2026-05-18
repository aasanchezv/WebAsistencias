'use client'

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTenant } from '@/components/providers/TenantProvider';

import Spinner from '@/components/ui/Spinner';

import styles from './tenant.module.css';

export default function TenantRoot() {
    const router = useRouter();
    const { tenant } = useParams();
    const client = useTenant();

    useEffect(() => {
        async function checkAuth() {
            try {
                const res  = await fetch(`/api/${tenant}/auth/me`, { credentials: 'include' });
                const data = await res.json();
                if (data?.authenticated) {
                    router.replace(`/${tenant}/dashboard`);
                } else {
                    router.replace(`/${tenant}/login`);
                }
            } catch {
                router.replace(`/${tenant}/login`);
            }
        }
        checkAuth();
    }, [tenant]);

    return (
        <div className={styles.container}>
            <Spinner
                primaryColor={client.primary_color}
            />
        </div>
        
    );
}