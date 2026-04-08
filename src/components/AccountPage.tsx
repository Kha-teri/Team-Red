import styles from '../scss/AccountPage.module.scss'
import {useState, useEffect} from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom';

function AccountPage() {
    const [themeMode, setThemeMode] = useState<string>(localStorage.getItem("theme") || "dark");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);;
    const navigate = useNavigate();
    const api_url = 'https://team-red-api.azurewebsites.net/api';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${api_url}/Account/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if(response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
                else if(response.status === 401) {
                    console.warn("Uzytkownik niezalogowany - przekierowanie");
                    navigate('/');
                }
            } catch(err) {
                console.error("Blad polaczenia z API ", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeMode);
    }, []);

    const handleThemeChange = () => {
        const nextTheme = themeMode === "dark" ? 'light' : 'dark';
        setThemeMode(nextTheme);
        localStorage.setItem("theme", nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
    }

    if(loading) return <div className={styles.container}>Loading...</div>

    const data = userData || {
        userName: "Guest",
        email: "unknown@user.com",
        publishedPosts: 0,
        generatedPosts: 0
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.accountLayout}>
                    <h1 className={styles.accountTitle}>My Account</h1>

                    <div className={styles.profileCard}>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoBox}>
                                <span className={styles.label}>Name</span>
                                <p className={styles.value}>{data.userName}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.label}>Email Address</span>
                                <p className={styles.value}>{data.email}</p>
                            </div>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statBox}>
                                <span className={styles.label}>Published</span>
                                <span className={styles.bigNumber}>{data.publishedPosts}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.label}>Generated</span>
                                <span className={styles.bigNumber}>{data.generatedPosts}</span>
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.settingsRow}>
                            <div className={styles.settingsInfo}>
                                <span className={styles.settingName}>Interface Theme</span>
                                <p className={styles.settingsDesc}>
                                    {themeMode ? 'Dark mode is currently active' : 'Light mode is currently active'}
                                </p>
                            </div>

                            <div className={`${styles.switchTrack} ${themeMode === "dark" ? styles.switchOn : ''}`} onClick={() => handleThemeChange()}>
                                <div className={styles.switchThumb} />
                            </div>
                        </div>
                        <Button usage="navbar" text="Back to Home" onBtnClick={() => navigate("/")}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountPage;