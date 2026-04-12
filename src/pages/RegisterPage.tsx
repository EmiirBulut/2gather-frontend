import AuthLayout from '@/features/auth/components/AuthLayout'
import RegisterForm from '@/features/auth/components/RegisterForm'

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Hesap oluşturun"
      subtitle="Birkaç saniyede başlayın, hemen planlamaya başlayın."
    >
      <RegisterForm />
    </AuthLayout>
  )
}

export default RegisterPage
