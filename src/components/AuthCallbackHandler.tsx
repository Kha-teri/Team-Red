import styles from '../scss/AuthCallbackHandler.module.scss'
import { useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

function AuthCallbackHandler() {
    const { platformName } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL;
    const isProcessing = useRef(false);
    
    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if(code && state && !isProcessing.current) {
            isProcessing.current = true;

            const controller = platformName!.charAt(0).toUpperCase() + platformName!.slice(1);

            fetch(`${api_url}/${controller}/callback?code=${code}&state=${state}`, {
                credentials: 'include'
            })
            .then(async(res) => {
                if(res.ok) {
                    navigate('/linker?success=true');
                }
                else {
                    const errorData = await res.text();
                    console.error('Error ', errorData);
                    navigate('/linker?success=failed');
                }
            })
            .catch(err => {
                console.error('Network error ', err);
                navigate('/linker?error=network');
            });
        }
    }, [searchParams, platformName, navigate, api_url]);

    return (
        <div className={styles.container}>
            
        </div>
    )
}

export default AuthCallbackHandler;