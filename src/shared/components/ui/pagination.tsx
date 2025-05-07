import * as React from "react"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"

import {
  type ButtonProps, buttonVariants,
} from "~/shared/components/ui/button"
import {
  cn,
} from "~/shared/utils"

function Pagination({
  className, ...props
}: React.ComponentProps<"nav"> & {
  className?: string
}) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={
        cn(
          "mx-auto flex w-full justify-center", className
        )
      }
      {...props}
    />
  )
}
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul"> & {
    className?: string
  }
>((
  {
    className, ...props
  }, ref
) =>
  (
    <ul
      ref={ref}
      className={
        cn(
          "flex flex-row items-center gap-1", className
        )
      }
      {...props}
    />
  ))

PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & {
    className?: string
  }
>((
  {
    className, ...props
  }, ref
) =>
  (
    <li
      ref={ref}
      className={
        cn(
          "", className
        )
      }
      {...props}
    />
  ))

PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  className?: string
  isActive?: boolean
  disabled?: boolean
} & Pick<ButtonProps, "size"> &
React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={
        cn(
          "cursor-pointer",
          props?.disabled && "cursor-not-allowed opacity-50 pointer-events-none",
          buttonVariants({
            variant: isActive ? "outline" : "ghost",
            size,
          }),
          className,
        )
      }
      {...props}
    />
  )
}
PaginationLink.displayName = "PaginationLink"

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  className?: string
  disabled?: boolean
}) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={
        cn(
          "gap-1 pl-2.5 cursor-pointer",
          props?.disabled && "cursor-not-allowed opacity-50 pointer-events-none",
          className,
        )
      }
      {...props}
    >
      <ChevronLeftIcon
        className="size-4"
      />

      <span>Previous</span>
    </PaginationLink>
  )
}
PaginationPrevious.displayName = "PaginationPrevious"

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  className?: string
  disabled?: boolean
}) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={
        cn(
          "gap-1 pr-2.5 cursor-pointer",
          props?.disabled && "cursor-not-allowed opacity-50 pointer-events-none",
          className,
        )
      }
      {...props}
    >
      <span>Next</span>

      <ChevronRightIcon
        className="size-4"
      />
    </PaginationLink>
  )
}
PaginationNext.displayName = "PaginationNext"

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span"> & {
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={
        cn(
          "flex h-9 w-9 items-center justify-center", className
        )
      }
      {...props}
    >
      <DotsHorizontalIcon
        className="size-4"
      />

      <span
        className="sr-only"
      >
        More pages
      </span>
    </span>
  )
}
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
