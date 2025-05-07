import {
  AuthLoginForm,
} from "~/features/auth/components/form/login-form"
import {
  getTranslation,
} from "~/i18n" // tuỳ bạn để ở đâu

// export const metadata = {
//   title: "Đăng nhập",
// }

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslation(params.locale) // tự viết hàm này
  return {
    title: t("auth.login.title"),
  }
}
export default function Login() {
  return (
    <div>
      <AuthLoginForm />

    </div>
  )
}
