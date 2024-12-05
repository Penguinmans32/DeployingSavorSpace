import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    };

    const spinnerStyle = {
        textAlign: 'center'
    };

    const spinnerTextStyle = {
        display: 'block',
        marginTop: '10px'
    };

    useEffect(() => {
        const handleAuth = () => {
            try {
                const rawParams = window.location.search;
                const params = new URLSearchParams(rawParams);
                const token = params.get('token');
                const refreshToken = params.get('refreshToken');

                if (!token || !refreshToken) {
                    console.error('Missing tokens in URL');
                    toast.error('Authentication failed');
                    navigate('/login');
                    return;
                }

                localStorage.setItem('authToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                toast.success('Successfully logged in!');
                navigate('/homepage', { replace: true });
            } catch (error) {
                console.error('Auth callback error:', error);
                toast.error('Authentication failed');
                navigate('/login');
            }
        };

        handleAuth();
    }, [navigate]);

    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}>
                <span style={spinnerTextStyle}>Completing login...</span>
            </div>
        </div>
    );
};

export default AuthCallback;