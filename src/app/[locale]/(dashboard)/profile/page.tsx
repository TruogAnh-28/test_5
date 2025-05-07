import {
  ProfileChangePasswordForm,
} from "~/features/auth/components/form/profile-change-password-form"
// import {
//   ProfileForm,
// } from "~/features/auth/components/form/profile-form"
import {
  ProfileAvatarForm,
} from "~/features/profile/components/forms/profile-avatar-form"
import {
  getServerAuthSession,
} from "~/server/auth"
import {
  PageContainer, PageHeader,
} from "~/shared/components/shared/page-component"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

export const metadata = {
  title: "Thông tin cá nhân",
}

export default async function Page() {
  const session = await getServerAuthSession()
  return (
    <PageContainer>
      <PageHeader>
        <h1 className="text-xl ">{`Tài khoản ${session?.user.email}`}</h1>
      </PageHeader>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="flex flex-col bg-transparent">
          <CardHeader>
            <CardTitle>Thay đổi thông tin</CardTitle>

            <CardDescription>Thay ảnh cá nhân</CardDescription>
          </CardHeader>

          <CardContent className="grow">
            <ProfileAvatarForm />
          </CardContent>
        </Card>

        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>Thay đổi mật khẩu</CardTitle>

            <CardDescription>Thay đổi mật khẩu của bạn</CardDescription>
          </CardHeader>

          <CardContent>
            <ProfileChangePasswordForm />
          </CardContent>
        </Card>

        {/*
        <Card className="md:col-span-2 bg-transparent">
          <CardHeader>
            <CardTitle>Thay đổi thông tin</CardTitle>

            <CardDescription>Thay ảnh đổi thông tin cá nhân của bạn tại đây</CardDescription>
          </CardHeader>

          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card> */}
      </div>
    </PageContainer>
  )
}
