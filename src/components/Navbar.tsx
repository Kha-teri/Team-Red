import styles from '../scss/Navbar.module.scss'
import { useState } from 'react'
import Button from './Button.tsx';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const src = isNavOpen === false ? '/img/navbar_closed.svg' : '/img/navbar_open.svg';
    const navigate = useNavigate();

    return (
        <>
            <div className={styles.navbar}>
                <button className={`${styles.navTrigger} ${isNavOpen ? styles.navTriggerActive : ''}`} onClick={() => setIsNavOpen(!isNavOpen)}><img src={src} alt="Navbar icon" /></button> 

                <div className={`${styles.sidebar} ${isNavOpen ? styles.sidebarOpen : ''}`}>
                    <div className={styles.logoSpace}>
                        {/*do rozbudowy, jesli bedziemy chceli logo*/}
                        <h2>Menu</h2>
                    </div>
                    <nav className={styles.navLinks}>
                        <Button usage="navbar" text="About" onBtnClick={() => navigate('/about')} />
                        <Button usage="navbar" text="Contact" onBtnClick={() => navigate('/contact')} />
                    </nav>
                </div>
            </div>

            {isNavOpen && <div className={styles.overlay} onClick={() => setIsNavOpen(false)} />}
        </>
    );
}

export default Navbar;