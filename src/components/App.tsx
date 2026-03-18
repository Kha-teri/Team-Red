//glowny komponent, layout
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import styles from '../scss/App.module.scss'
import Button from './Button'
import SocialPostCard from './SocialPostCard.tsx'
import PostContent from './PostContent.tsx'
import RegisterPage from './RegisterPage.tsx'
import Navbar from './Navbar.tsx'
import AboutPage from './AboutPage.tsx'
import ContactPage from './ContactPage.tsx'
import PostActionBar from './PostActionBar.tsx'

function HomePage() {
  const navigate = useNavigate()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoginOpen(false)
  }

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.wrapper}>
        <div className={styles.authButtons}>
          <Button usage="register" text="Register" onBtnClick={() => navigate("/register")} />

          <div className={styles.loginSlot}>
            <Button usage="login" text="Login" onBtnClick={() => setIsLoginOpen((prev) => !prev)} />
            
            <form 
              className={`${styles.loginDropdown} ${isLoginOpen ? styles.loginDropdownOpen : ''}`}
              onSubmit={handleLoginSubmit}
              noValidate
            >
              <label className={styles.loginField}>
                E-mail
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </label>

              <label className={styles.loginField}>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
              </label>

              <button type="submit" className={styles.signInButton}>
                Sign in
              </button>
            </form>
          </div>
        </div>
        <div className={styles.mainLayout}>
          <SocialPostCard />
          <div className={styles.responseSection}>
            <PostContent content="ai response" />
            <PostActionBar />
          </div>
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
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}

export default App
