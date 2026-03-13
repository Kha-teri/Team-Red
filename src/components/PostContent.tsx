//komponent dla outputu ai

import styles from '../scss/PostContent.module.scss';
import Button from './Button.tsx';

interface PostContentProps {
    content: string;
    onCopy?: () => void;
    onPost?: () => void;
}

function PostContent ( {content, onCopy, onPost } : PostContentProps) {
    return (
        <div className={styles.container}>
            <div className={styles.scrollArea}>
                <div className={styles.content}>
                    <p>{content}ai response</p>
                </div>
            </div>

            <div className={styles.footer}>
                <Button usage="copy" text="Copy"></Button>
                <Button usage="post" text="Post"></Button>
            </div>
        </div>
    );
}

export default PostContent;