//uniwersalny komponenty dla przyciskow, docelowo: login register, generatepost

import styles from '../scss/Button.module.scss';

interface ButtonProps {
    usage: 'generate' | 'post' | 'copy' | 'login' | 'register';
    text: string;
    onClick?: () => void;
}

function Button ( {usage, text} : ButtonProps) {
    return (
        <button className={styles[usage]}>{text}</button>
    );
}

export default Button;