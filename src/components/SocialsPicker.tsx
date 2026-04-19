//komponent dla sekcji z wyborem sociali do wrzucenia posta

import styles from '../scss/SocialsPicker.module.scss';
import { useState, useEffect } from 'react';

interface Platform {
    id: number;
    type: string;
}

interface SocialsPickerProps {
    onChange: (selectedIds: number[]) => void;
}

function SocialsPicker({ onChange } : SocialsPickerProps) {
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [selectedSocials, setSelectedSocials] = useState<number[]>([]);
    const api_url = import.meta.env.VITE_API_URL;

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
        let newSelection;

        if(selectedSocials.includes(id))
            newSelection = selectedSocials.filter(el => el !== id);
        else
            newSelection = [...selectedSocials, id];

        setSelectedSocials(newSelection);
        onChange(newSelection)
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
