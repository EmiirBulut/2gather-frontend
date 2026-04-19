import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister'
import Input from '@/components/ui/Input'
import { ROUTES } from '@/router/routes'
import styles from './AuthForm.module.css'

const registerSchema = z.object({
  displayName: z.string().min(2, 'İsim en az 2 karakter olmalı').max(50, 'İsim en fazla 50 karakter olabilir'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı').max(100, 'Şifre çok uzun'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterForm = () => {
  const { mutate, isPending, error } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const handleRegister = ({ confirmPassword: _confirmPassword, ...data }: RegisterFormData) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(handleRegister)} className={styles.form} noValidate>
      <div className={styles.fields}>
        <Input
          label="AD SOYAD"
          type="text"
          placeholder="Adınız Soyadınız"
          autoComplete="name"
          errorMessage={errors.displayName?.message}
          {...register('displayName')}
        />
        <Input
          label="E-POSTA ADRESİ"
          type="email"
          placeholder="ad@ornek.com"
          autoComplete="email"
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="ŞİFRE"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          errorMessage={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="ŞİFRE TEKRAR"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          errorMessage={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      {error && <p className={styles.serverError}>{error.message}</p>}

      <button type="submit" className={styles.submitBtn} disabled={isPending}>
        {isPending ? 'Hesap oluşturuluyor…' : 'Hesap Oluştur'}
      </button>

      <p className={styles.switchLink}>
        Zaten hesabın var mı? <Link to={ROUTES.LOGIN}>Giriş yap</Link>
      </p>
    </form>
  )
}

export default RegisterForm
