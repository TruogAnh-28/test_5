import React from "react"

import {
  cn,
} from "~/shared/utils"

export function StatusDot({
  className, status, ...props
}: React.HTMLAttributes<HTMLDivElement> & { status?: number }) {
  return (
    <span
      className={
        cn(
          "inline-block size-2 rounded-full",
          typeof status === "number" ? status === 1 ? "bg-success" : "bg-destructive" : "",
          className
        )
      }
      {...props}
    />
  )
}
