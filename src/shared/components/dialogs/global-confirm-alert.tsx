/* eslint-disable no-restricted-syntax */
import React from "react"

import {
  toast,
} from "sonner"

import {
  useConfirmAlert,
} from "~/shared/components/dialogs/use-confirm-alert"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "~/shared/components/ui/alert-dialog"
import {
  type ErrorResponse,
} from "~/types/api"

export function GlobalConfirmAlert() {
  const {
    open, onOpenChange, props,
  } = useConfirmAlert()

  const {
    document, onAction, onActionSuccess, hasToast = true,
  } = props ?? {
  }

  const handleAction = React.useCallback(
    () => {
      if (onAction instanceof Function) {
        if (hasToast) {
          toast.promise(
            Promise.resolve(onAction()), {
              loading: "Đang xóa...",
              success: (data) => {
                onActionSuccess?.(data)
                return (data as ErrorResponse)?.message ?? "Xóa thành công"
              },
              error: (error) => {
                return (error as Error)?.message ?? "Xóa thất bại"
              },
            }
          )
        }
        else {
          onAction()
        }
      }
    }, [
      hasToast,
      onAction,
      onActionSuccess,
    ]
  )

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{document?.title ?? "Bạn có muốn xóa không?"}</AlertDialogTitle>

          <AlertDialogDescription>{document?.descriptions ?? "Thao tác này không thể quay lại. Điều này sẽ xóa dữ liệu của bạn khỏi máy chủ của chúng tôi."}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{document?.cancel ?? "Đóng"}</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleAction}
            className="bg-destructive hover:bg-destructive"
          >
            {document?.action ?? "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
