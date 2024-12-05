import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const token = searchParams.get('token');
                const refreshToken = searchParams.get('refreshToken');

                if (!token || !refreshToken) {
                    throw new Error('Missing authentication tokens');
                }

                localStorage.setItem('authToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                toast.success('Successfully logged in!');
                navigate('/homepage');
            } catch (error) {
                console.error('Auth callback error:', error);
                toast.error('Authentication failed');
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate, searchParams]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
        }}>
            <div>Processing authentication...</div>
        </div>
    );
};

export default AuthCallback;