//komponent dla skecji opcji posta, np. wygenerowania nowego outputu od ai
import styles from "../scss/PostActionBar.module.scss"
import Button from './Button'

interface PostActionBarProps {
    isGenerating: boolean;
    isDisabled?: boolean;
    onRegenerate?: () => void;
}

function PostActionBar({onRegenerate, isGenerating, isDisabled} : PostActionBarProps) {
    return (
        <div className={styles.container}>
            <Button usage="postaction" text={isGenerating ? "Re-generating..." : "Re-generate"} onBtnClick={onRegenerate} isDisabled={isGenerating || isDisabled} />
        </div>
    );
}

export default PostActionBar;