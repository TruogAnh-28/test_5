/* eslint-disable no-restricted-syntax */
"use client"

import {
  usePathname,
} from "next/navigation"

import {
  ChevronLeft,
} from "lucide-react"

// import {
//   getUserSession,
// } from "~/shared/hooks/data/use-session"
// import {
//   useLazyRef,
// } from "~/shared/hooks/state/use-lazy-ref"

// import {
//   handlePermission,
//   isSupperAdmin,
// } from "~/shared/utils/permission"

import {
  useSessionStore,
} from "~/shared/hooks/data/use-session"

import {
  handlePermission,
} from "~/shared/utils/permission"

import {
  Link,
} from "~/i18n"
import {
  type MenuItem,
  useSidebarContent,
} from "~/shared/components/layouts/sidebar/sidebar-content"
import {
  Logo,
} from "~/shared/components/shared/logo"
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "~/shared/components/ui/collapsible"
import {
  ScrollArea,
} from "~/shared/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarSeparator,
} from "~/shared/components/ui/sidebar"
import {
  cn,
} from "~/shared/utils"

export function AppSidebar() {
  const { open } = useSidebar()
  const SIDEBARS = useSidebarContent()
  return (
    <Sidebar
      collapsible="icon"
      className="!border-r-0 z-30"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={
                cn(
                  "hover:bg-transparent w-fit active:bg-transparent h-11 py-0",
                  !open && "group-data-[collapsible=icon]:!p-0"
                )
              }
            >
              <Logo
                minimal={!open}
                className="size-36"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea
          className="size-full"
        >
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {
                  SIDEBARS.map(it => (
                    <Tree
                      key={it?.title}
                      {...it}
                    />
                  ))
                }
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div
            className="h-9"
          />
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}

function Tree({
  isSubMenu, ...props
}: MenuItem & { isSubMenu?: boolean }) {
  const {
    open,
    setOpenMobile,
  } = useSidebar()
  const pathname = usePathname()
  // const userRef = useLazyRef(getUserSession)
  const sessionUser = useSessionStore().getUserSession()

  if (props.separator) {
    return <SidebarSeparator />
  }

  const handleActivePathname = (url?: string) => {
    if (url && /^(?:\/|\/products)$/.test(url)) {
      return pathname === url
    }
    if (url) {
      return (pathname.startsWith(`/en${url}`) || pathname.startsWith(`/vi${url}`))
    }
  }

  const handleWithPermission = (item: MenuItem) => {
    let granted = true

    if (item.permissionCode) {
      granted = handlePermission({
        code: item.permissionCode,
        user: sessionUser || undefined,
      })
    }

    if (item.isSupperAdminOnly) {
      granted = true
    }

    return granted
  }

  if (!props?.children || props?.children?.length === 0) {
    const SidebarMenuButtonComp = isSubMenu ? SidebarMenuSubButton : SidebarMenuButton
    const activeDD = handleActivePathname(props.url)

    return handleWithPermission(props) ? (
      <SidebarMenuButtonComp
        onClick={() => setOpenMobile(false)}
        asChild
        tooltip={props.title}
        title={props.title}
        className={
          cn(
            "rounded-full h-auto hover:text-primary text-foreground group/link transition-colors duration-200 text-[15px]",
            open && "px-3 py-2.5 [&>svg]:size-5",
            activeDD
              ? "text-primary font-medium"
              : "",
          )
        }
      >
        <Link
          href={props.url || "#"}
          prefetch
        >
          {
            !isSubMenu && (
              props.icon
                ? (
                  <props.icon
                    className={
                      cn(
                        "text-link/60 dark:text-white transition-colors duration-200 group-hover/link:text-primary",
                        activeDD
                          ? "!text-primary"
                          : "",
                      )
                    }
                  />
                )
                : (
                  <span
                    className={
                      cn(
                        "bg-link/60 dark:bg-white mx-1 size-1 rounded-full group-hover/link:bg-primary",
                        activeDD
                          ? "!bg-primary"
                          : ""
                      )
                    }
                  />
                )
            )
          }

          <span
            className="grow truncate leading-5"
          >
            {props.title}
          </span>
        </Link>
      </SidebarMenuButtonComp>
    ) : null
  }

  const SidebarMenuItemComp = isSubMenu ? SidebarMenuSubItem : SidebarMenuItem
  const activeDD = props.children.find((child) => {
    return child.children
      ? !!child.children.find(t => handleActivePathname(t.url))
      : handleActivePathname(child.url)
  })
  const parentGranted = props.children.some((child1) => {
    let granted1 = true

    if (child1.children) {
      granted1 = child1.children.some(child2 => handleWithPermission(child2))
    }
    else {
      granted1 = handleWithPermission(child1)
    }

    return granted1
  })

  return parentGranted ? (
    <SidebarMenuItemComp>
      <Collapsible
        defaultOpen={!!activeDD}
        className="group/collapsible [&[data-state=open]>button>svg:last-child]:-rotate-90"
      >
        <CollapsibleTrigger
          asChild
        >
          <SidebarMenuButton
            tooltip={props?.title}
            title={props?.title}
            className={
              cn(
                "group/collapseButton rounded-full h-auto hover:!text-primary text-link dark:text-white transition-colors duration-200 text-[15px]",
                open && "px-3 py-2.5 [&>svg:first-child]:size-5",
                activeDD && "!text-primary hover:!text-primary font-medium"
              )
            }
          >
            {
              !isSubMenu && (props?.icon
                ? (
                  <props.icon
                    className={
                      cn(
                        "text-link/60 dark:text-white group-hover/collapseButton:text-primary",
                        activeDD && "!text-primary"
                      )
                    }
                  />
                )
                : (
                  <span
                    className={
                      cn(
                        "mx-1 size-1 rounded-full bg-link",
                        activeDD && "bg-primary"
                      )
                    }
                  />
                ))
            }

            <span
              className="grow truncate leading-5"
            >
              {props?.title}
            </span>

            <ChevronLeft
              className="ml-auto duration-200 transition-transform"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        {
          Array.isArray(props?.children) && (
            <CollapsibleContent>
              <SidebarMenuSub
                className="mr-0 pr-0"
              >
                {
                  props?.children.map(child => (
                    <Tree
                      key={child.title}
                      isSubMenu
                      {...child}
                    />
                  ))
                }
              </SidebarMenuSub>
            </CollapsibleContent>
          )
        }
      </Collapsible>
    </SidebarMenuItemComp>
  ) : null
}
