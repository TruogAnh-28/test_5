import VerifyEmailPage from "~/features/auth/components/pages/verify-email-page"

export const metadata = {
  title: "Xác minh Email",
}

export default function Page({ params }: { params: { token: string } }) {
  return <VerifyEmailPage params={params} />
}
