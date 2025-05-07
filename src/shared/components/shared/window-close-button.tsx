/* eslint-disable custom-rules/encourage-object-params */
"use client"

import {
  type ReadonlyURLSearchParams,
  useSearchParams,
} from "next/navigation"

import {
  X,
} from "lucide-react"

import {
  Button,
  type ButtonProps,
} from "~/shared/components/ui/button"
import {
  cn,
} from "~/shared/utils"

export const WINDOW_CLOSE_NAME = "window_close"
export const WINDOW_CLOSE_PARAMS = `${WINDOW_CLOSE_NAME}=true`

export function isWindowClose(searchParams: ReadonlyURLSearchParams) {
  return Boolean(searchParams.get(WINDOW_CLOSE_NAME))
}

export function handleWindowClose(
  searchParams: ReadonlyURLSearchParams, fn?: () => void
) {
  if (isWindowClose(searchParams)) {
    window.close()
    return
  }
  fn?.()
}

export function WindowCloseButton({
  className, ...props
}: ButtonProps) {
  const searchParams = useSearchParams()

  if (!isWindowClose(searchParams)) {
    return null
  }

  return (
    <div className={
      cn(
        "text-end", className
      )
    }
    >
      <Button
        type="button"
        onClick={
          () => {
            window.close()
          }
        }
        variant="outline"
        title="Đóng tab hiện tại"
        {...props}
      >
        <X />

        Đóng
      </Button>
    </div>
  )
}
