//komponent dla prompta do wygenerowania posta, textarea?

import styles from '../scss/PromptInput.module.scss';

interface PromptImputProps {
    value: string;
    onChange: (val: string) => void;
}

function PromptImput({ value, onChange } : PromptImputProps) {
    return (
        <div className={styles.container}>
            <textarea className={styles.prompt} placeholder="Insert prompt for your post..." value={value} onChange={(e) => onChange(e.target.value)}></textarea>
        </div>
    );
}

export default PromptImput;