//uniwersalny komponenty dla przyciskow, docelowo: login register, generatepost

import styles from '../scss/Button.module.scss';

interface ButtonProps {
    usage: 'generate' | 'post' | 'copy' | 'login' | 'register';
    text: string;
    onBtnClick?: () => void;
}

function Button ( {usage, text, onBtnClick} : ButtonProps) {
    return (
        <button className={styles[usage]} onClick={onBtnClick}>{text}</button>
    );
}

export default Button;