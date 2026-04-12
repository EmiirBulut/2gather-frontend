import AuthLayout from '@/features/auth/components/AuthLayout'
import LoginForm from '@/features/auth/components/LoginForm'

const LoginPage = () => {
  return (
    <AuthLayout
      title="Tekrar hoş geldiniz"
      subtitle="Hesabınıza giriş yapın ve listenize devam edin."
    >
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
