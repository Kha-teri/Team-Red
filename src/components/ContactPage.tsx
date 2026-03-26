import { useNavigate } from 'react-router-dom';
import styles from '../scss/ContactPage.module.scss';
import Button from './Button';

function ContactPage() {
    const navigate = useNavigate();

    const contactMethods = [
        { label: 'Github', value: 'https://github.com/Kha-Teri/Team-Red', link: 'https://github.com'}
    ];

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header>
                    <h1>Get in <span>Touch</span></h1>
                    <p>Reach us out</p>
                </header>

                <div className={styles.linksGrid}>
                    {contactMethods.map((el, index) => (
                      <a key={index} href={el.value} target="_blank" className={styles.contactItem}>
                        <span className={styles.label}>{el.label}</span>
                        <span className={styles.value}>{el.link}</span>
                      </a>  
                    ))}
                </div>

                <div className={styles.footer}>
                    <Button usage="navbar" text="Back to Home" onBtnClick={() => navigate('/')} />
                </div>
            </div>
        </div>
    );
}

export default ContactPage;