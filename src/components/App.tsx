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
import AuthCallbackHandler from './AuthCallbackHandler.tsx'

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
  const [userConnections, setUserConnections] = useState<any[]>([]);

  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if(isAuthenticated) {
      fetch(`${api_url}/UserPlatform/user-platforms`, {
        credentials: 'include'
      })
      .then(res => res.ok ? res.json() : [])
      .then(data => setUserConnections(data))
      .catch(err => console.error("Error with fetching connections ", err));
    }
  }, [isAuthenticated, api_url]);

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
      else {
        const errorData = await response.text();
        console.error("Server error (400):", errorData);
        setAiResponse("Server error");
      }
    }
    catch(err) {
      console.error(err);
      setAiResponse("Blad połączenia z API.");
    }
    finally {
      setIsGenerating(false);
    }
  }

  /*
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
  */

  const handlePublish = async () => {
    if(!aiResponse || aiResponse == "Your post will appear here") return alert("Generate post first");
    if(selectedPlatforms.length === 0) return alert("Select at least one platform");

    for(const platformId of selectedPlatforms) {
      const connection = userConnections.find(con => con.platform.id === platformId);

      console.log("Wysyłam post:", { 
            UserPlatformId: connection.id, 
            Content: aiResponse 
          });

      if(connection && connection.platform.type === "LinkedIn") {
        try {
          const res = await fetch(`${api_url}/LinkedIn/post`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              userPlatformId: connection.id,
              text: aiResponse,
            }),
            credentials: 'include'
          });

          if(!res.ok) {
            const errorText = await res.text();
            console.error(`Error with API (${res.status}):`, errorText);
            throw new Error(`LinkedIn API returned ${res.status}: ${errorText}`);
          }

          alert("Pubilshed on LinkedIn");
        } catch(err) {
          console.error("Error with publishing, post did not publish", err);
          return;
        }
      }
    }

    try {
        const response = await fetch(`${api_url}/Post/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Title: prompt.substring(0,20),
              Body: aiResponse,
              promptText: prompt,
              PlatformIds: selectedPlatforms
            }),
            credentials: 'include',
        });

        if (response.ok) {
            setAiResponse("Your post will appear here");
            setPrompt("");
            setSelectedPlatforms([]);
        }
        else {
          const errorData = await response.text();
          console.error("Error with saving post", errorData);
        }
    } catch (err) {
        console.error("Error with saving post", err);
    }
  }

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
              <SocialPostCard prompt={prompt} setPrompt={setPrompt} onGenerate={handleAskGemini} isGenerating={isGenerating} selectedPlatforms={selectedPlatforms} onSocialsChange={setSelectedPlatforms}/>
              <div className={styles.responseSection}>
                <PostContent content={aiResponse} onContentChange={setAiResponse} onPost={handlePublish}/>
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
        <Route path="/auth/callback/:platformName" element={<ProtectedRoute><AuthCallbackHandler /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
    
  )
}

export default App