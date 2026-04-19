import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import Input from '@/components/ui/Input'
import { ROUTES } from '@/router/routes'
import styles from './AuthForm.module.css'

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

type LoginFormData = z.infer<typeof loginSchema>

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

const LoginForm = () => {
  const { mutate, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleLogin = (data: LoginFormData) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)} className={styles.form} noValidate>
      <div className={styles.fields}>
        <Input
          label="E-posta"
          type="email"
          placeholder="ad@ornek.com"
          autoComplete="email"
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Şifre"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          errorMessage={errors.password?.message}
          {...register('password')}
        />
      </div>

      <div className={styles.row}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" />
          Beni Hatırla
        </label>
        <a href="#" className={styles.forgotLink}>Şifremi Unuttum</a>
      </div>

      {error && <p className={styles.serverError}>{error.message}</p>}

      <button type="submit" className={styles.submitBtn} disabled={isPending}>
        {isPending ? 'Giriş yapılıyor…' : 'Giriş Yap'}
      </button>

      <div className={styles.divider}>VEYA</div>

      <button type="button" className={styles.googleBtn}>
        <GoogleIcon />
        Google ile devam et
      </button>

      <p className={styles.switchLink}>
        Hesabın yok mu? <Link to={ROUTES.REGISTER}>Kaydol</Link>
      </p>
    </form>
  )
}

export default LoginForm
