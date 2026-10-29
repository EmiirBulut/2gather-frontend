import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useChangePassword } from '../hooks/useChangePassword'
import { getSettingsErrorMessage } from './settingsErrors'
import styles from './SettingsSection.module.css'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Mevcut şifre zorunludur'),
    newPassword: z.string().min(8, 'Yeni şifre en az 8 karakter olmalıdır'),
    confirmPassword: z.string(),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

const EMPTY_VALUES: FormValues = { currentPassword: '', newPassword: '', confirmPassword: '' }

const PasswordForm = () => {
  const { mutate: changePassword, isPending, isSuccess, error, reset: resetMutation } = useChangePassword()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  })

  const errorMessage = getSettingsErrorMessage(error)

  const onSubmit = ({ currentPassword, newPassword }: FormValues) => {
    resetMutation()
    changePassword({ currentPassword, newPassword }, { onSuccess: () => reset(EMPTY_VALUES) })
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Şifre</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input label="Mevcut Şifre" type="password" autoComplete="current-password" errorMessage={errors.currentPassword?.message} {...register('currentPassword')} />
        <Input label="Yeni Şifre" type="password" autoComplete="new-password" errorMessage={errors.newPassword?.message} {...register('newPassword')} />
        <Input label="Yeni Şifre (Tekrar)" type="password" autoComplete="new-password" errorMessage={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <div className={styles.actions}>
          <Button type="submit" isLoading={isPending}>Şifreyi Değiştir</Button>
          {isSuccess && <span className={styles.successText}>Şifreniz değiştirildi.</span>}
          {errorMessage && <span className={styles.errorText}>{errorMessage}</span>}
        </div>
      </form>
    </section>
  )
}

export default PasswordForm
