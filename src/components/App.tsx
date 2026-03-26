//glowny komponent, layout
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import styles from '../scss/App.module.scss'
import Button from './Button'
import SocialPostCard from './SocialPostCard.tsx'
import PostContent from './PostContent.tsx'
import RegisterPage from './RegisterPage.tsx'
import Navbar from './Navbar.tsx'
import AboutPage from './AboutPage.tsx'
import ContactPage from './ContactPage.tsx'
import PostActionBar from './PostActionBar.tsx'
import AccountLinker from './AccountLinker.tsx'
import { AuthProvider, useAuth } from './AuthContext.tsx'

function ProtectedRoute({children} : { children: ReactNode}) {
  const {isAuthenticated, loading} = useAuth();
  if(loading) return null;
  return isAuthenticated ? children : <Navigate to="/" />
}

function HomePage() {
  const navigate = useNavigate()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login, isAuthenticated, logout} = useAuth();
  const [error, setError] = useState(false);

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    const success = await login(email, password);
    success ? setIsLoginOpen(false) : setError(true);
  }

  /*
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/WeatherForecast')
    .then(response => {
      if(!response.ok) throw new Error('blad sieci');
      return response.json();
    }).then(data => {
      setWeather(data[0])
    })
    .catch(err => {
      console.error(err)
      setError("nie udalo sie pobrac pogody");
    })
  }, []);
  */

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.wrapper}>
        <div className={styles.authButtons}>
          {isAuthenticated ? (
            <Button usage="login" text="logout" onBtnClick={logout} />
          ) : 
          (
            <>
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
            </>
          )}
        </div>
        <div className={styles.mainLayout}>
          <SocialPostCard />
          <div className={styles.responseSection}>
            {/*<PostContent content={error ? error : weather ? `Pogoda: ${weather.summary}, Temp: ${weather.temperatureC}` : 'Ladowanie danych...'} />*/}
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
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/linker" element={<ProtectedRoute><AccountLinker /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
    
  )
}

export default App
