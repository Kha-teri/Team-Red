//glowny komponent, layout

import { useState } from 'react'
import styles from '../scss/App.module.scss'
import Button from './Button'
import SocialPostCard from './SocialPostCard.tsx'

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <SocialPostCard />
      </div>
    </div>
  )
}

export default App
