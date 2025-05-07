"use client"

import React from "react"

import {
  Profile,
} from "~/shared/components/layouts/header/profile"
import {
  SidebarTrigger,
} from "~/shared/components/ui/sidebar"
import {
  cn,
} from "~/shared/utils"

export function Header() {
  const [
    isSticky,
    setIsSticky,
  ] = React.useState(false)

  React.useEffect(
    () => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setIsSticky(true)
        }
        else { setIsSticky(false) }
      }

      window.addEventListener(
        "scroll", handleScroll
      )

      return () => {
        window.removeEventListener(
          "scroll", handleScroll
        )
      }
    }, []
  )

  return (
    <header
      aria-label="heading"
      className={
        cn(
          "sticky top-0 z-20 bg-sidebar", isSticky
            ? "w-full"
            : ""
        )
      }
    >
      <nav
        className="sm:px-30 rounded-none bg-transparent px-4 py-2.5 dark:bg-transparent"
      >
        <div
          className="flex w-full items-center justify-between gap-3 "
        >
          <div
            className="flex items-center gap-4"
          >
            <SidebarTrigger className="size-10 [&>svg]:size-5" />

            {/* <Logo
              className="md:hidden w-12"
            /> */}

          </div>

          {/* <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div> */}

          <div
            className="flex items-center gap-3"
          >
            <Profile />
          </div>
        </div>
      </nav>
    </header>
  )
}
