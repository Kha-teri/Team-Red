//komponent dla skecji opcji posta, np. wygenerowania nowego outputu od ai
import styles from "../scss/PostActionBar.module.scss"
import Button from './Button'

function PostActionBar() {
    return (
        <div className={styles.container}>
            <Button usage="postaction" text="Re-generate" />
        </div>
    );
}

export default PostActionBar;