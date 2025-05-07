"use client"

import {
  usePathname,
  useRouter, useSearchParams,
} from "next/navigation"

import {
  ArrowLeft,
} from "lucide-react"

import {
  handleWindowClose,
} from "~/shared/components/shared/window-close-button"
import {
  Button, type ButtonProps,
} from "~/shared/components/ui/button"
import {
  cn,
} from "~/shared/utils"

export function PreviousPageButton({
  className, ...props
}: ButtonProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // trang đầu tiên có length = 2 (bao gồm trang hiện tại và trang new tab của trình duyệt)
  if (
    /^(?:\/)$/.test(pathname)
    || /^\/settings/i.test(pathname)
    || (history.length <= 2)
  ) {
    return null
  }

  return (
    <div className={
      cn(
        "text-start", className
      )
    }
    >
      <Button
        variant="ghost"
        onClick={
          () => handleWindowClose(
            searchParams, () => router.back()
          )
        }
        {...props}
      >
        <ArrowLeft />
        Quay lại
      </Button>
    </div>
  )
}
