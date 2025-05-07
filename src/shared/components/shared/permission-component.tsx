"use client"

import {
  type ReactNode,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  ArrowLeft,
} from "lucide-react"

import {
  useSessionStore,
} from "~/shared/hooks/data/use-session"

import {

  handlePermission,
} from "~/shared/utils/permission"

import {
  ErrorMessage,
} from "~/shared/components/shared/error-message"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  type PermissionCode,
} from "~/types/permission-code"

interface PermissionComponentProps {
  children?: ReactNode
  code?: PermissionCode | PermissionCode[]
  hasMessage?: boolean
  isSupperAdminOnly?: boolean
  MessageComponent?: ReactNode
}

export function PermissionComponent({
  children, MessageComponent, hasMessage = false, code, isSupperAdminOnly,
}: PermissionComponentProps) {
  const router = useRouter()
  const sessionUser = useSessionStore().getUserSession() // Hook này luôn gọi
  const isGranted = handlePermission({
    code,
    isSupperAdminOnly,
    user: sessionUser || undefined,
  })

  if (!isGranted) {
    return hasMessage
      ? MessageComponent ?? (
        <div className="grid size-full place-content-center py-6 gap-3">
          <ErrorMessage
            title="Bạn hiện không xem được nội dung này"
            message="Lỗi này thường là do bạn không có quyền truy cập hoặc nội dung đã bị khóa"
          />

          <div className="flex justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
            >
              <ArrowLeft />

              Quay lại
            </Button>
          </div>
        </div>
      )
      : null
  }

  return children
}
