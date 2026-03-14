//glowny komponent, layout
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import styles from '../scss/App.module.scss'
import Button from './Button'
import SocialPostCard from './SocialPostCard.tsx'
import PostContent from './PostContent.tsx'
import RegisterPage from './RegisterPage.tsx'

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
      <div className={styles.wrapper}>
        <SocialPostCard />

        <div className={styles.responseSection}>
          <div className={styles.authButtons}>
            <Button usage="register" text="Register" onBtnClick={() => navigate('/register')} />

            <div className={styles.loginSlot}>
              <Button
                usage="login"
                text="Login"
                onBtnClick={() => setIsLoginOpen((currentState) => !currentState)}
              />

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
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@email.com"
                  />
                </label>

                <label className={styles.loginField}>
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                  />
                </label>

                <button type="submit" className={styles.signInButton}>
                  Sign in
                </button>
              </form>
            </div>
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
