import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ROUTES } from '@/router/routes'
import styles from './AuthForm.module.css'

// ─── Schema ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

type LoginFormData = z.infer<typeof loginSchema>

// ─── Component ────────────────────────────────────────────────────────────────

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

      {error && (
        <p className={styles.serverError}>{error.message}</p>
      )}

      <Button type="submit" fullWidth isLoading={isPending} size="lg">
        Giriş Yap
      </Button>

      <p className={styles.switchLink}>
        Hesabın yok mu?{' '}
        <Link to={ROUTES.REGISTER}>Kayıt ol</Link>
      </p>
    </form>
  )
}

export default LoginForm
