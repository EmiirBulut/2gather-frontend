import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import { getSettingsErrorMessage } from './settingsErrors'
import type { UserProfileDto } from '../types'
import styles from './SettingsSection.module.css'

const createProfileSchema = (originalEmail: string) =>
  z
    .object({
      displayName: z.string().trim().min(1, 'Görünen ad zorunludur').max(100, 'Görünen ad en fazla 100 karakter olabilir'),
      email: z.string().trim().email('Geçerli bir e-posta adresi giriniz'),
      currentPassword: z.string().optional(),
    })
    .refine(
      ({ email, currentPassword }) =>
        email.toLowerCase() === originalEmail.toLowerCase() || Boolean(currentPassword),
      { message: 'E-posta adresini değiştirmek için mevcut şifrenizi girin', path: ['currentPassword'] }
    )

type FormValues = z.infer<ReturnType<typeof createProfileSchema>>

interface Props {
  profile: UserProfileDto
}

const ProfileForm = ({ profile }: Props) => {
  const { mutate: updateProfile, isPending, isSuccess, error, reset: resetMutation } = useUpdateProfile()

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(createProfileSchema(profile.email)),
    defaultValues: { displayName: profile.displayName, email: profile.email, currentPassword: '' },
  })

  const isEmailChanged = watch('email').trim().toLowerCase() !== profile.email.toLowerCase()
  const errorMessage = getSettingsErrorMessage(error)

  const onSubmit = ({ displayName, email, currentPassword }: FormValues) => {
    resetMutation()
    updateProfile(
      { displayName, email, currentPassword: isEmailChanged ? currentPassword : undefined },
      {
        onSuccess: (updated) =>
          reset({ displayName: updated.displayName, email: updated.email, currentPassword: '' }),
      }
    )
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Profil</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input label="Görünen Ad" errorMessage={errors.displayName?.message} {...register('displayName')} />
        <Input label="E-posta" type="email" autoComplete="email" errorMessage={errors.email?.message} {...register('email')} />
        {isEmailChanged && (
          <Input
            label="Mevcut Şifre"
            type="password"
            autoComplete="current-password"
            errorMessage={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
        )}
        <div className={styles.actions}>
          <Button type="submit" isLoading={isPending}>Kaydet</Button>
          {isSuccess && <span className={styles.successText}>Profil güncellendi.</span>}
          {errorMessage && <span className={styles.errorText}>{errorMessage}</span>}
        </div>
      </form>
    </section>
  )
}

export default ProfileForm
