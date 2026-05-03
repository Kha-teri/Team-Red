//glowna karta dla prompta, wyboru sociali oraz przycisku wygenerowania tresci

import styles from '../scss/SocialPostCard.module.scss';
import PromptInput from './PromptInput';
import SocialsPicker from './SocialsPicker';
import Button from './Button';

interface SocialPostCardProps {
    prompt: string;
    setPrompt: (val: string) => void;
    onGenerate: () => void;
    isGenerating: boolean;
    selectedPlatforms: number[];
    onSocialsChange: (ids: number[]) => void;
}

function SocialPostCard({ prompt, setPrompt, onGenerate, isGenerating, selectedPlatforms, onSocialsChange } : SocialPostCardProps) {
    return (
        <div className={styles.container}>
            <PromptInput value={prompt} onChange={setPrompt}/>
            <SocialsPicker selectedIds={selectedPlatforms} onChange={onSocialsChange} />
            <Button usage="generate" text={isGenerating ? "Generating..." : "Generate Post"} onBtnClick={onGenerate} isDisabled={isGenerating}/>
        </div>
    );
}

export default SocialPostCard;


