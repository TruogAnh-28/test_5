import {
  PasswordResetForm,
} from "~/features/auth/components/form/reset-password-form"

export const metadata = {
  title: "Lấy lại tài khoản",
}

export default function ResetPasswordPage() {
  return (
    <div>
      <PasswordResetForm />
    </div>
  )
}
