"use client"
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import axios from 'axios';

const ServiceProviderDashboard = () => {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token11');

        if (!token) {
            router.push('/');
            return;
        }

        // Verify token via API
        axios.post('http://localhost:4000/serviceprovidertoken/serviceprovidertokenverify', { token })
            .then(response => {
                if (response.status !== 200) {
                    router.push('/');
                }
            })
            .catch(() => {
                router.push('/');
            });
    }, []);

    return <div>Welcome to Service Provider Dashboard</div>;
};

export default ServiceProviderDashboard;
