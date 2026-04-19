import AuthLayout from '@/features/auth/components/AuthLayout'
import RegisterForm from '@/features/auth/components/RegisterForm'

const RegisterPage = () => (
  <AuthLayout eyebrow="KAYIT PANELİ" title="Hesap Oluştur">
    <RegisterForm />
  </AuthLayout>
)

export default RegisterPage
