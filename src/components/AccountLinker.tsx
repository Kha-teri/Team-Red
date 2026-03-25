import { useState } from 'react';
import styles from '../scss/AccountLinker.module.scss'
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface AccountLinkerProps {
    id: string;
    name: string;
    icon: string;
    isConnected: boolean;
    username?: string;
}

function AccountLinker() {
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState<AccountLinkerProps[]>([
        {id: 'linkedin', name: 'LinkedIn', icon: '/img/linkedin_icon.svg', isConnected: true, username: 'Test_user'},
        {id: 'facebook', name: 'Facebook', icon: '/img/facebook_icon.svg', isConnected: false},
        {id: 'instagram', name: 'Instagram', icon: '/img/instagram_icon.svg', isConnected: false}
    ]);

    const toggleConnection = (id: string) => {
        setAccounts(prev => prev.map(acc => {
            if(acc.id === id) {
                const newState = !acc.isConnected;
                return {...acc, isConnected: !acc.isConnected, username: newState ? 'Test_User' : undefined};
            }
            return acc;
        }));
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <h1>Social media integrations</h1>
                    <p>Connect your accounts to enable posting</p>
                </header>

                <div className={styles.accountsList}>
                    {accounts.map(el => (
                        <div key={el.id} className={`${styles.accountItem} ${el.isConnected ? styles.connected : ''}`}>
                            <div className={styles.info}>
                                <div className={styles.iconWrapper}>
                                    <img src={el.icon} alt={el.name} />
                                </div>
                                <div className={styles.text}>
                                    <h3>{el.name}</h3>
                                    <span>{el.isConnected ? (
                                        <>Connected as <span className={styles.username}>{el.username}</span></>
                                        ) : (
                                            'Not connected'
                                        )}
                                    </span>
                                </div>
                            </div>

                            <button className={el.isConnected ? styles.disconnectBtn : styles.connectBtn} onClick={() => toggleConnection(el.id)}>
                                {el.isConnected ? 'Disconnect' : 'Connect account'}
                            </button>
                        </div>
                    ))}
                </div>

                <footer className="footer">
                    <Button usage="navbar" text="Back" onBtnClick={() => navigate("/")}/>
                </footer>
            </div>
        </div>
    )
}

export default AccountLinker;