import {
  create,
} from "zustand"

type TDocument = {
  title: string
  descriptions: string
  cancel?: string
  action: string
}

type ConfirmAlertProps = {
  document?: TDocument
  onAction?: () => unknown
  onActionSuccess?: <T>(value: T) => void
  hasToast?: boolean
}

interface ConfirmAlertStore {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (props: ConfirmAlertProps) => void
  props?: ConfirmAlertProps
}

// eslint-disable-next-line custom-rules/encourage-object-params
export const useConfirmAlert = create<ConfirmAlertStore>()(set => ({
  open: false,
  onOpenChange: (open) => {
    set({
      open,
      props: undefined,
    })
  },
  onConfirm: (props) => {
    set({
      open: true,
      props,
    })
  },
}))

export const confirmAlert = useConfirmAlert.getState().onConfirm
