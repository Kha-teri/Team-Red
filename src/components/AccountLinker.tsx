import { useState, useEffect } from 'react';
import styles from '../scss/AccountLinker.module.scss'
import { useNavigate } from 'react-router-dom';
import Button from './Button';

/* interface AccountLinkerProps {
    id: string;
    name: string;
    icon: string;
    isConnected: boolean;
    username?: string;
} */

interface Platform {
    id: number;
    type: string;
}

interface UserPlatform {
    id: number;
    accountUsername: string;
    platform: Platform;
}

function AccountLinker() {
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL;

    const [allPlatforms, setAllPlatforms] = useState<Platform[]>([]);
    const [userConnections, setUserConnections] = useState<UserPlatform[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async() => {
        try {
            const [platRes, userRes] = await Promise.all([
                fetch(`${api_url}/Platform/platforms`),
                fetch(`${api_url}/UserPlatform/user-platforms`, { credentials: 'include'})
            ]);

            if(platRes.ok && userRes.ok) {
                setAllPlatforms(await platRes.json());
                setUserConnections(await userRes.json());
            }
        }
        catch(err) {
            console.error("Blad polaczenia: ", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {loadData();}, []);

    const handleConnect = async (platform: Platform) => {
        if(platform.type === 'LinkedIn') {
            try {
                const res = await fetch(`${api_url}/LinkedIn/authorize`, {
                    credentials: 'include'
                });

                if(res.ok) {
                    const data = await res.json();
                    if(data.url) {
                        window.location.href = data.url;
                    }
                }
                else {
                    console.error("Error with fetching authorization URL");
                }
            } catch(err) {
                console.error("Error with connecting to LinkedIn ", err);
            }
            return;
        }

        const requestBody = {
            platformId: platform.id,
            accessToken: "test_token",
            externalAccountId: "ext_123",
            accountUsername: "NewUser",
            accountComment: "Connected via Linker"
        };

        try {
            const res = await fetch(`${api_url}/UserPlatform/add`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            if(res.ok) 
                loadData();
        }
        catch(err) {
            console.error("Blad dodawania: ", err);
        }
    }

    const handleDisconnect = async (userPlatformId: number) => {
        try {
            const res = await fetch(`${api_url}/UserPlatform/${userPlatformId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            if(res.ok)
                loadData();
        }
        catch(err) {
            console.error("Blad usuwania: ", err);
        }
    }

    /*
    const toggleConnection = (id: string) => {
        setAccounts(prev => prev.map(acc => {
            if(acc.id === id) {
                const newState = !acc.isConnected;
                return {...acc, isConnected: !acc.isConnected, username: newState ? 'Test_User' : undefined};
            }
            return acc;
        }));
    }
    */

    if(loading)
        return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <h1>Social media integrations</h1>
                    <p>Connect your accounts to enable posting</p>
                </header>

                <div className={styles.accountsList}>
                    {allPlatforms.map(platform => {
                        const connection = userConnections.find(c => c.platform.id === platform.id);
                        const isConnected = !!connection;
                        
                        return (
                            <div key={platform.id} className={`${styles.accountItem} ${isConnected ? styles.connected : ''}`}>
                                <div className={styles.info}>
                                    <div className={styles.iconWrapper}>
                                        <img src={`/img/${platform.type.toLowerCase()}_icon.svg`} alt={platform.type} />
                                    </div>
                                    <div className={styles.text}>
                                        <h3>{platform.type}</h3>
                                        <span>{isConnected ? (
                                            <>Connected as <span className={styles.username}>{connection.accountUsername}</span></>
                                            ) : (
                                                'Not connected'
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <button className={isConnected ? styles.disconnectBtn : styles.connectBtn} onClick={() => isConnected ? handleDisconnect(connection.id) : handleConnect(platform)}>
                                    {isConnected ? 'Disconnect' : 'Connect account'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <footer className="footer">
                    <Button usage="navbar" text="Back" onBtnClick={() => navigate("/")}/>
                </footer>
            </div>
        </div>
    )
}

export default AccountLinker;