import AuthLayout from '@/features/auth/components/AuthLayout'
import LoginForm from '@/features/auth/components/LoginForm'

const LoginPage = () => (
  <AuthLayout eyebrow="GİRİŞ PANELİ" title="Hoş Geldiniz">
    <LoginForm />
  </AuthLayout>
)

export default LoginPage
