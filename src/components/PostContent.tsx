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
    return (
        <div className={styles.container}>
            <div className={styles.scrollArea}>
                <div className={styles.content}>
                    <p>{content}</p>
                </div>
            </div>

            <div className={styles.footer}>
                <Button usage="copy" text="Copy" onBtnClick={() => handleCopy(content)}></Button>
                <Button usage="post" text="Post"></Button>
            </div>
        </div>
    );
}

export default PostContent;