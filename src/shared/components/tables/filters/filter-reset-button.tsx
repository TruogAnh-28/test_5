import {
  usePathname, useRouter,
  useSearchParams,
} from "next/navigation"

import {
  RotateCcw,
} from "lucide-react"

import {
  Button,
} from "~/shared/components/ui/button"
import {
  cn,
} from "~/shared/utils"

export function FilterResetButton() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <Button
      onClick={() => router.push(pathname)}
      variant="outline"
      size="sm"
      className={cn(searchParams.size === 0 ? "hidden" : "")}
    >
      <RotateCcw />
      Đặt lại
    </Button>
  )
}
