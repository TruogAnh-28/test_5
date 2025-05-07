/* eslint-disable no-restricted-syntax */
import {
  type LucideIcon,
  House,
  UserRoundCog,
  UsersRound,
  CircleDollarSign,
  FileText,
  CreditCard,
  Settings,
  ArchiveRestore,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  type PermissionCode,
} from "~/types/permission-code"

export interface MenuItem {
  children?: MenuItem[]
  icon?: LucideIcon
  title: string
  url?: string
  separator?: boolean
  permissionCode?: PermissionCode | PermissionCode[]
  isSupperAdminOnly?: boolean
}

export function useSidebarContent(): MenuItem[] {
  const t = useTranslations("sidebar")

  return [
    {
      icon: House,
      title: t("home"),
      url: "/",
    },
    {
      icon: FileText,
      title: t("reports"),
      url: "/reports",
    },
    {
      icon: CircleDollarSign,
      title: t("campaigns.title"),
      children: [
        {
          title: t("campaigns.traffic"),
          url: "/traffic-seo-campaigns",
        },
        // {
        //   title: t("campaigns.backlink"),
        //   url: "/backlink-campaigns",
        // },
      ],
    },
    {
      icon: CreditCard,
      title: t("transactions.title"),
      children: [
        {
          title: t("transactions.deposit"),
          url: "/deposit",
        },
        {
          title: t("transactions.depositHistory"),
          url: "/deposit-history",
        },
        {
          title: t("transactions.transactionHistory"),
          url: "/transactions",
        },
      ],
    },
    {
      icon: ArchiveRestore,
      title: t("agency"),
      url: "/agency",
    },
    {
      icon: UserRoundCog,
      title: t("accounts.title"),
      children: [
        {
          title: t("accounts.employees"),
          url: "/employees",
          permissionCode: "search-employee",
        },
        {
          title: t("accounts.users"),
          url: "/users",
          permissionCode: "search-user",
        },
      ],
    },
    {
      icon: UsersRound,
      title: t("permissions.title"),
      children: [
        {
          title: t("permissions.permissionsList"),
          url: "/permissions",
          permissionCode: "read-permissions",
        },
        {
          title: t("permissions.rolesList"),
          url: "/roles",
          permissionCode: "read-role",
        },
      ],
    },
    {
      icon: Settings,
      title: t("setting.title"),
      permissionCode: "update-config",
      url: "/setting",
    },
  ]
}
