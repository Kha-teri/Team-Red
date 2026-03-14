//glowny komponent, layout
import { Route, Routes, useNavigate } from 'react-router-dom'
import styles from '../scss/App.module.scss'
import Button from './Button'
import SocialPostCard from './SocialPostCard.tsx'
import PostContent from './PostContent.tsx'
import RegisterPage from './RegisterPage.tsx'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <SocialPostCard />

        <div className={styles.responseSection}>
          <div className={styles.authButtons}>
            <Button usage="register" text="Register" onBtnClick={() => navigate('/register')} />
            <Button usage="login" text="Login" />
          </div>

          <PostContent content="ai responseeee" />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
