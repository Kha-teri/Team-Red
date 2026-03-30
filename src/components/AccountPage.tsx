import styles from '../scss/AccountPage.module.scss'
import {useState} from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom';

function AccountPage() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const navigate = useNavigate();

    const user = {
        name: "User",
        email: "user@user.com",
        publishedPosts: 0,
        generatedPosts: 0
    }

    const handleThemeChange = () => {
        const nextTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        
        document.documentElement.setAttribute('data-theme', nextTheme);
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.accountLayout}>
                    <h1 className={styles.accountTitle}>My Account</h1>

                    <div className={styles.profileCard}>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoBox}>
                                <span className={styles.label}>Name</span>
                                <p className={styles.value}>{user.name}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.label}>Email Address</span>
                                <p className={styles.value}>{user.email}</p>
                            </div>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statBox}>
                                <span className={styles.label}>Published</span>
                                <span className={styles.bigNumber}>{user.publishedPosts}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.label}>Generated</span>
                                <span className={styles.bigNumber}>{user.generatedPosts}</span>
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.settingsRow}>
                            <div className={styles.settingsInfo}>
                                <span className={styles.settingName}>Interface Theme</span>
                                <p className={styles.settingsDesc}>
                                    {isDarkMode ? 'Dark mode is currently active' : 'Light mode is currently active'}
                                </p>
                            </div>

                            <div className={`${styles.switchTrack} ${isDarkMode ? styles.switchOn : ''}`} onClick={() => handleThemeChange()}>
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