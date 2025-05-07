"use client"

import React from "react"

// import {
//   PreviousPageButton,
// } from "~/shared/components/shared/previous-page-button"
import {
  WindowCloseButton,
} from "~/shared/components/shared/window-close-button"
import {
  useSidebar,
} from "~/shared/components/ui/sidebar"
import {
  cn,
} from "~/shared/utils"

export function BasePage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useSidebar()
  return (
    <div
      className={
        cn(
          "grow flex flex-col w-screen",
          open
            ? "md:!w-[calc(100vw-var(--sidebar-width)-17px)]"
            : "md:!w-[calc(100vw-var(--sidebar-width-icon)-17px)]",
          className
        )
      }
      {...props}
    >
      {/* <PreviousPageButton className="p-5 pb-0" /> */}

      {children}

      <WindowCloseButton className="p-5 pt-0" />
    </div>
  )
}

export function PageContainer({
  className, ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        cn(
          "p-5 space-y-5 flex-1", className
        )
      }
      {...props}
    />
  )
}

export function PageHeader({
  className, ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        cn(
          "flex items-center justify-between gap-3", className
        )
      }
      {...props}
    />
  )
}

export function PageHeading({
  className, ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={
        cn(
          "text-2xl font-semibold leading-tight tracking-tighter capitalize", className
        )
      }
      {...props}
    />
  )
}

export function PageDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={
        cn(
          "max-w-2xl text-balance font-light text-foreground",
          className
        )
      }
      {...props}
    />
  )
}

export function PageActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        cn(
          "flex items-center gap-3",
          className
        )
      }
      {...props}
    />
  )
}
