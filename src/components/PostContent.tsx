//komponent dla outputu ai

import styles from '../scss/PostContent.module.scss';
import Button from './Button.tsx';

interface PostContentProps {
    content: string;
    onCopy?: () => void;
    onPost?: () => void;
}

const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
}

function PostContent ( {content, onCopy, onPost } : PostContentProps) {
    const handleCopyClick = () => {
        if (onCopy) {
            onCopy();
            return;
        }

        handleCopy(content);
    }

    return (
        <div className={styles.container}>
            <div className={styles.scrollArea}>
                <div className={styles.content}>
                    <p>{content}</p>
                </div>
            </div>

            <div className={styles.footer}>
                <Button usage="copy" text="Copy" onBtnClick={handleCopyClick}></Button>
                <Button usage="post" text="Post" onBtnClick={onPost}></Button>
            </div>
        </div>
    );
}

export default PostContent;