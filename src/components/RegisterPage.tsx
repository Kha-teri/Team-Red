import { useNavigate } from 'react-router-dom'
import styles from '../scss/AuthPage.module.scss'
import Button from './Button'

function RegisterPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.screen}>
      <section className={styles.card}>
        <h1>Create account</h1>

        <form className={styles.form}>
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" type="text" placeholder="John Smith" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="john@example.com" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="At least 8 characters" />

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
