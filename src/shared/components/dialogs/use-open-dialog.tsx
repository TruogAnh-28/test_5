/* eslint-disable no-restricted-syntax */
/* eslint-disable custom-rules/encourage-object-params */
import {
  create,
} from "zustand"

type Key = string
type Value = unknown

export type OpenDialogsStore = {
  getLastKey: () => string | undefined
  getValue: <V extends Value>(key: Key, defaultValue?: unknown) => V
  onBack: () => void
  onClose: (key?: Key) => void
  onCloseAll: () => void
  onOpen: <V extends Value>(key: Key, value?: V) => void
  onOpenChange: <V extends Value>(key: Key, value?: V, closeAll?: boolean) => (open?: boolean) => void
  opened: (key: Key) => boolean
  setValue: <V extends Value>(key: Key, value: V | ((value: V) => V)) => void
  values: Map<Key, Value>
}

/**
 * dialog lồng dialog thì sử dụng
 */
const useOpenDialogs = create<OpenDialogsStore>()((
  set, get
) => ({
  values: new Map(),
  // lấy key cuối cùng
  getLastKey: () => {
    return Array.from(get().values.keys()).pop()
  },
  // bật dialog được mở cuối cùng
  opened: (key) => {
    let isOpen = false
    if (key) {
      const lastKey = get().getLastKey()
      isOpen = lastKey === key
    }
    return isOpen
  },
  // mở dialog theo key
  onOpen: <V extends Value>(key: string, value: V) => {
    const newValues = new Map(get().values)
    if (key) {
      newValues.set(
        key, value
      )
    }
    set({
      values: newValues,
    })
  },
  // đóng dialog theo key
  onClose: (key) => {
    if (key) {
      const newValues = new Map()
      let isMatch = false

      get().values.forEach((
        value, mapKey
      ) => {
        if (!isMatch && mapKey !== key) {
          newValues.set(
            mapKey, value
          )
        }
        else {
          isMatch = true
        }
      })

      set({
        values: newValues,
      })
    }
    else {
      get().onBack()
    }
  },
  // thay đổi đóng/mở dialog theo key
  onOpenChange:
    (
      key, value, closeAll = true
    ) =>
      (open) => {
        if (open) {
          get().onOpen(
            key, value
          )
        }
        else if (closeAll) {
          get().onCloseAll()
        }
        else {
          get().onClose(key)
        }
      },
  // đóng tất cả dialog
  onCloseAll: () => {
    set({
      values: new Map(),
    })
  },
  // quay lại dialog đã mở trước đó
  onBack: () => {
    const lastKey = get().getLastKey()

    if (lastKey) {
      get().onClose(lastKey)
    }
  },
  // cập nhật giá trị theo key
  setValue: <V extends Value>(
    key: string, value: V | ((value: V) => V),
  ) => {
    const newValues = new Map(get().values)

    if (key && newValues.has(key)) {
      const newValue = value instanceof Function ? value(get().getValue(key)) : value
      newValues.set(
        key, newValue
      )
    }

    set({
      values: newValues,
    })
  },
  // lấy giá trị theo key
  getValue: <V extends Value>(key: string, defaultValue?: unknown) => {
    const values = get().values

    if (key && values.has(key)) {
      return (values.get(key) ?? defaultValue) as V
    }
    return defaultValue as V
  },
}))

const showDialog = useOpenDialogs.getState().onOpen
const backDialog = useOpenDialogs.getState().onBack

export {
  useOpenDialogs,
  showDialog,
  backDialog,
}
