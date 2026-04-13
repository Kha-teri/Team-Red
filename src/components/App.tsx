//glowny komponent, layout
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import styles from '../scss/App.module.scss'
import Button from './Button'
import SocialPostCard from './SocialPostCard.tsx'
import PostContent from './PostContent.tsx'
import RegisterPage from './RegisterPage.tsx'
import LoginPage from './LoginPage.tsx'
import Navbar from './Navbar.tsx'
import AboutPage from './AboutPage.tsx'
import ContactPage from './ContactPage.tsx'
import PostActionBar from './PostActionBar.tsx'
import AccountLinker from './AccountLinker.tsx'
import { AuthProvider, useAuth } from './AuthContext.tsx'
import AccountPage from './AccountPage.tsx'

function ProtectedRoute({children} : { children: ReactNode}) {
  const {isAuthenticated, loading} = useAuth();
  if(loading) return null;
  return isAuthenticated ? children : <Navigate to="/" />
}

function HomePage() {
  const {isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  if(loading) return null;

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
      {isAuthenticated ? <Navbar /> : <></>}
      
      <div className={styles.wrapper}>
        {!isAuthenticated ? (
          <div className={styles.landingPage}>
            <h1>Create social posts with AI</h1>
            <div className={styles.landingButtons}>
              <Button usage="register" text="Get Started" onBtnClick={() => navigate("/register")} />
              <Button usage="login" text="Sign In" onBtnClick={() => navigate("/login")} />
            </div>
          </div>
        ) : (
          <>
            <div className={styles.authButtons}>
              <Button usage="logout" text="Log-out" onBtnClick={logout} />
            </div>
              
            <div className={styles.mainLayout}>
              <SocialPostCard />
              <div className={styles.responseSection}>
                {/*<PostContent content={error ? error : weather ? `Pogoda: ${weather.summary}, Temp: ${weather.temperatureC}` : 'Ladowanie danych...'} />*/}
                <PostContent content="ai response" />
                <PostActionBar />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/linker" element={<ProtectedRoute><AccountLinker /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
    
  )
}

export default App