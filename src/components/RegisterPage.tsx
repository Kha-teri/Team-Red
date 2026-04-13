import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './AuthContext'
import styles from '../scss/AuthPage.module.scss'
import Button from './Button'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth();
  const [formData, setFormData] = useState({fullName: '', email: '', password: ''});

  const handleRegister = async (e:React.FormEvent) => {
    e.preventDefault();
    const success = await register(formData.fullName, formData.email, formData.password);
    success ? navigate('/') : alert("blad rejestracji");
  }

  return (
    <main className={styles.screen}>
      <section className={styles.card}>
        <h1>Create account</h1>

        <form className={styles.form} onSubmit={handleRegister}>
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" type="text" placeholder="John Smith" onChange={e => setFormData({...formData, fullName: e.target.value})} />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="john@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="At least 8 characters" onChange={e => setFormData({...formData, password: e.target.value})} />

          <Button usage="register" text="Register user" />
        </form>

        <div className={styles.footer}>
          <Button usage="login" text="Back" onBtnClick={() => navigate('/')} />
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
