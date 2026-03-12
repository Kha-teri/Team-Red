//uniwersalny komponenty dla przyciskow, docelowo: login register, generatepost

import styles from '../scss/Button.module.scss';

function Button () {
    return (
        <button className={styles.btnGlow}>Przycisk</button>
    );
}

export default Button;