//glowna karta dla prompta, wyboru sociali oraz przycisku wygenerowania tresci

import styles from '../scss/SocialPostCard.module.scss';
import PromptInput from './PromptInput';
import SocialsPicker from './SocialsPicker';
import Button from './Button';

function SocialPostCard() {
    return (
        <div className={styles.container}>
            <PromptInput />
            <SocialsPicker />
            <Button usage="generate" text="Generate post" />
        </div>
    );
}

export default SocialPostCard;


