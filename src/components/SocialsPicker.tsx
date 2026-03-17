//komponent dla sekcji z wyborem sociali do wrzucenia posta

import styles from '../scss/SocialsPicker.module.scss';
import { useState } from 'react';

function SocialsPicker() {
    const [selectedSocials, setSelectedSocials] = useState<string[]>([]);

    const handleToggleSocial = (name: string) => {
        if(selectedSocials.includes(name))
            setSelectedSocials(selectedSocials.filter(el => el !== name));
        else
            setSelectedSocials([...selectedSocials, name]);
    }

    return (
        <div className={styles.container}>
            <label>Pick socials for your post</label>
            <div className={styles.socialsPicker}>
                {['linkedin', 'facebook', 'instagram'].map((social) => (
                    <button key={social} className={selectedSocials.includes(social) ? styles.active : ''} onClick={() => handleToggleSocial(social)}><img src={`/img/${social}_icon.svg`} alt={social} /></button>
                ))}
            </div>
        </div>
    );
}

export default SocialsPicker;
