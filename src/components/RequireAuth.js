import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import LinearProgress from '@mui/material/LinearProgress';
import { createClient } from '@supabase/supabase-js';
const PROJECT_URI = 'https://pffvjutwxkszuvnsqayc.supabase.co'
const PROJECT_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZnZqdXR3eGtzenV2bnNxYXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMTMxMDUsImV4cCI6MTk3NzU4OTEwNX0.JryH2jtpXFt-dwHAEdMVH0ykYB3cRfHXS0DKiGM1Z8c'

const supabase = createClient(PROJECT_URI, PROJECT_ANON, {
    db: {
        schema: 'public',
    },
    auth: {
        autoRefreshToken: true,
        persistSession: true,
    }
})

const RequireAuth = () => {
    const { auth, setAuth, loading } = useAuth();
    const location = useLocation();

    useEffect(()=> {
        let isMounted = true;
        const controller = new AbortController();

        async function getUser() {
            const {
                data: { session },
            } = await supabase.auth.getSession()
              
            const { user } = session

            isMounted && setAuth(user)
        }

        getUser()


        return ()=> {
            controller.abort();
            isMounted = false
        };
    }, [])

    return (
        loading 
        ? <LinearProgress sx={{m: 20}}/> 
        : auth?.role === 'authenticated' 
            ? <Outlet />
            : auth?.user?.id
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;