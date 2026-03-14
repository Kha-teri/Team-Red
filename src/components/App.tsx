//glowny komponent, layout
import { useState } from 'react'
import styles from '../scss/App.module.scss'
import Button from './Button'
import SocialPostCard from './SocialPostCard.tsx'
import PostContent from './PostContent.tsx'

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <SocialPostCard />

        <div className={styles.responseSection}>
          <div className={styles.authButtons}>
            <Button usage="register" text="Register" />
            <Button usage="login" text="Login" />
          </div>

          <PostContent content="ai responseeee" />
        </div>
      </div>
    </div>
  )
}

export default App
