//komponent dla sekcji z wyborem sociali do wrzucenia posta

import styles from '../scss/SocialsPicker.module.scss';
import { useState, useEffect } from 'react';

interface Platform {
    id: number;
    type: string;
}

function SocialsPicker() {
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [selectedSocials, setSelectedSocials] = useState<number[]>([]);
    const api_url = 'https://team-red-api.azurewebsites.net/api';

    useEffect(() => {
        const fetchPlatforms = async () => {
            try {
                const response = await fetch(`${api_url}/Platform/platforms`);
                if(response.ok) {
                    const data = await response.json();
                    setPlatforms(data);
                }
            }
            catch(err) {
                console.error("Nie udalo sie pobrac platform: ", err);
            }
        };
        fetchPlatforms();
    }, []);

    const handleToggleSocial = (id: number) => {
        if(selectedSocials.includes(id))
            setSelectedSocials(selectedSocials.filter(el => el !== id));
        else
            setSelectedSocials([...selectedSocials, id]);
    }

    return (
        <div className={styles.container}>
            <label>Pick socials for your post</label>
            <div className={styles.socialsPicker}>
                {platforms.map((platform) => {
                    const iconName = platform.type.toLowerCase();

                    return (
                        <button key={platform.id} className={selectedSocials.includes(platform.id) ? styles.active : ''} onClick={() => handleToggleSocial(platform.id)}>
                            <img src={`/img/${iconName}_icon.svg`} alt={platform.type} />
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

export default SocialsPicker;
