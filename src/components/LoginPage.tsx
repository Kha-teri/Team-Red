import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './AuthContext'
import styles from '../scss/AuthPage.module.scss'
import Button from './Button'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = await login(formData.username, formData.password)
    err ? setError(err) : navigate('/')
  }

  return (
    <main className={styles.screen}>
      <section className={styles.card}>
        <h1>Login</h1>

        <form className={styles.form} onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" placeholder="Enter your username" onChange={e => { setFormData({ ...formData, username: e.target.value }); setError(null) }} required />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password" onChange={e => { setFormData({ ...formData, password: e.target.value }); setError(null) }} required />

          {error && <p className={styles.error}>{error}</p>}
          <Button usage="login" text="Sign in" />
        </form>

        <div className={styles.footer}>
          <Button usage="register" text="Back" onBtnClick={() => navigate('/')} />
        </div>
      </section>
    </main>
  )
}

export default LoginPage