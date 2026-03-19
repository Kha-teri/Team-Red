import styles from '../scss/AboutPage.module.scss'
import Button from './Button.tsx'
import { useNavigate } from 'react-router-dom';

function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>About <span>AI Post Generator</span></h1>
                    <p className={styles.subtitle}>
                        todo
                    </p>
                </header>

                <section className={styles.grid}>
                    <div className={styles.card}>
                        <h3>todo</h3>
                        <p>todo</p>
                    </div>
                </section>

                <footer className={styles.footer}>
                    <Button usage="navbar" text="Back to Home" onBtnClick={() => navigate('/')} />
                </footer>
            </div>
        </div>
    );
}

export default AboutPage;