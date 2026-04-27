//glowny komponent, layout
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
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
import { addPostHistoryEntry } from './postHistory.tsx';

function ProtectedRoute({children} : { children: ReactNode}) {
  const {isAuthenticated, loading} = useAuth();
  if(loading) return null;
  return isAuthenticated ? children : <Navigate to="/" />
}

function HomePage() {
  const {isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("Your post will appear here");
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);

  const api_url = import.meta.env.VITE_API_URL;

  if(loading) return null;

  const handleAskGemini = async() => {
    if(!prompt.trim()) return;
    setIsGenerating(true);

    const formData = new FormData();
    formData.append('Prompt', prompt);
    formData.append('Model', 'Gemini3FlashPreview');

    try {
      const response = await fetch(`${api_url}/Gemini/ask-gemini`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if(response.ok) {
        const data = await response.json();
        setAiResponse(data.response);
        addPostHistoryEntry(prompt, data.response);
      }
      else
        setAiResponse("Błąd serwera.");
    }
    catch(err) {
      console.error(err);
      setAiResponse("Blad połączenia z API.");
    }
    finally {
      setIsGenerating(false);
    }
  }

  const handleSavePost = async () => {
    if(!aiResponse || aiResponse === "Your post will appear here") {
      alert("Generate post first");
      return;
    }
    if(selectedPlatforms.length === 0) {
      alert("Select at least one platform");
      return;
    }

    try {
      const response = await fetch(`${api_url}/Post/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: aiResponse,
          platformIds: selectedPlatforms
        }),
        credentials: 'include',
      });

      if(response.ok) {
        setAiResponse("Your post will appear here");
        setPrompt("");
        setSelectedPlatforms([]);
      }
    } catch(err) {
      console.error("Blad polaczenia z serwerem ", err);
      return;
    }
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
              <SocialPostCard prompt={prompt} setPrompt={setPrompt} onGenerate={handleAskGemini} isGenerating={isGenerating} onSocialsChange={setSelectedPlatforms}/>
              <div className={styles.responseSection}>
                {/*<PostContent content={error ? error : weather ? `Pogoda: ${weather.summary}, Temp: ${weather.temperatureC}` : 'Ladowanie danych...'} />*/}
                <PostContent content={aiResponse} onContentChange={setAiResponse} onPost={handleSavePost}/>
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