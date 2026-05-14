import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './AuthContext'
import styles from '../scss/AuthPage.module.scss'
import Button from './Button'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth();
  const [formData, setFormData] = useState({fullName: '', email: '', password: ''});
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e:React.FormEvent) => {
    e.preventDefault();
    if(formData.password.length < 8) return setError('Password must be at least 8 characters');
    const err = await register(formData.fullName, formData.email, formData.password);
    err ? setError(err) : navigate('/');
  }

  return (
    <main className={styles.screen}>
      <section className={styles.card}>
        <h1>Create account</h1>

        <form className={styles.form} onSubmit={handleRegister}>
          <label htmlFor="fullName">User name</label>
          <input id="fullName" type="text" placeholder="Example user name" onChange={e => { setFormData({...formData, fullName: e.target.value}); setError(null) }} />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="user@example.com" onChange={e => { setFormData({...formData, email: e.target.value}); setError(null) }} />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="At least 8 characters" onChange={e => { setFormData({...formData, password: e.target.value}); setError(null) }} />

          {error && <p className={styles.error}>{error}</p>}
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
