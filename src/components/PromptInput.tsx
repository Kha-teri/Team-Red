//komponent dla prompta do wygenerowania posta, textarea?

import styles from '../scss/PromptInput.module.scss';

function PromptImput() {
    return (
        <div className={styles.container}>
            <textarea className={styles.prompt} placeholder="Insert prompt for your post..."></textarea>
        </div>
    );
}

export default PromptImput;