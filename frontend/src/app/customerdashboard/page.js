"use client"
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import axios from 'axios';
import Navbar from '@/components/logout';
const CustomerDashboard = () => {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token11');

        if (!token) {
            router.push('/');
            return;
        }

        // Verify token via API
        axios.post('http://localhost:4000/customertoken/customertokenverify', { token })
            .then(response => {
                if (response.status !== 200) {
                    router.push('/');
                }
            })
            .catch(() => {
                router.push('/');
            });
    }, []);

    return (
      <>
      <Navbar/>
      <h1>hello</h1></>
    );
      
      
   
    
};

export default CustomerDashboard;
