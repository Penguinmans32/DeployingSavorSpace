import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const refreshToken = params.get('refreshToken');
            const error = params.get('error');

            if (error) {
                toast.error('Authentication failed');
                navigate('/login');
                return;
            }

            if (token && refreshToken) {
                // Store tokens
                localStorage.setItem('authToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                
                // Clear URL and redirect
                navigate('/homepage', { replace: true });
                toast.success('Successfully logged in!');
            } else {
                toast.error('Invalid authentication response');
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate]);

    return null; 
};

export default AuthCallback;