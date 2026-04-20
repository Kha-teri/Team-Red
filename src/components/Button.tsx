//uniwersalny komponenty dla przyciskow, docelowo: login register, generatepost

import styles from '../scss/Button.module.scss';

interface ButtonProps {
    usage: 'generate' | 'post' | 'copy' | 'login' | 'register' | 'navbar' | 'postaction' | 'logout';
    text: string;
    onBtnClick?: () => void;
    isDisabled?: boolean;
}

function Button ( {usage, text, onBtnClick, isDisabled} : ButtonProps) {
    return (
        <button className={styles[usage]} onClick={onBtnClick} disabled={isDisabled}>{text}</button>
    );
}

export default Button;