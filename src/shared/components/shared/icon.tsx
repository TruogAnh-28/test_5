import React from "react"

import {
  cn,
} from "~/shared/utils"

type IconProps = React.HTMLAttributes<HTMLDivElement>

export const Icon = {
  Check: ({
    className, ...props
  }: IconProps) => (
    <div
      aria-label="check-icon"
      className={
        cn(
          "w-1 h-2 border-current rotate-45 border-b-2 border-r-2 border-solid mb-px", className
        )
      }
      {...props}
    />
  ),
  ChevronDown: ({
    className, ...props
  }: IconProps) => (
    <div
      aria-label="chevron-down-icon"
      className={
        cn(
          "size-1.5 border-current rotate-45 border-b border-r border-solid mb-px", className
        )
      }
      {...props}
    />
  ),
  Ellipsis: ({
    className, ...props
  }: IconProps) => (
    <div
      aria-label="ellipsis-icon"
      className={
        cn(
          "relative size-1 bg-current rounded-full after:bg-current after:rounded-full after:size-1 after:absolute after:translate-x-1 before:bg-current before:rounded-full before:size-1 before:absolute before:-translate-x-2", className
        )
      }
      {...props}
    />
  ),
  X: ({
    className, ...props
  }: IconProps) => (
    <div
      aria-label="ellipsis-icon"
      className={
        cn(
          "size-3 grid place-content-center", className
        )
      }
      {...props}
    >
      <div
        className="relative w-2.5 border-current border-b rotate-45 after:absolute after:right-0 after:w-2.5 after:border-current after:border-b after:rotate-90"
      />
    </div>
  ),
}
