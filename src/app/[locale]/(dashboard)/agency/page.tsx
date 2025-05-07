import {
  ViewAgencyAdmin,
} from "~/features/agency/components/view-agency-admin"
import {
  ViewUserAgency,
} from "~/features/agency/components/view-user-agency"
import {
  redirect,
} from "~/i18n"
import {
  getServerAuthSession,
} from "~/server/auth"

export const metadata = {
  title: "Quản lý đại lý",
}

export default async function AgencyAdminPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session?.user.role.id === 1

  return (
    <div className="p-8">
      {isAdmin ? <ViewAgencyAdmin /> : <ViewUserAgency />}
    </div>
  )
}
