//uniwersalny komponenty dla przyciskow, docelowo: login register, generatepost

import styles from '../scss/Button.module.scss';

interface ButtonProps {
    usage: 'generate' | 'login' | 'register' | 'secondary';
    text: string;
}

function Button ( {usage, text} : ButtonProps) {
    return (
        <button className={styles[usage]}>{text}</button>
    );
}

export default Button;