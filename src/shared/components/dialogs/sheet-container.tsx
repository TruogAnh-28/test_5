/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/* eslint-disable no-restricted-syntax */
import React from "react"

import {
  create,
} from "zustand"

import {
  Sheet as UiSheet, SheetContent as UiSheetContent, SheetTrigger as UiSheetTrigger, SheetClose as UiSheetClose, SheetDescription as UiSheetDescription, SheetFooter as UiSheetFooter, SheetHeader as UiSheetHeader, SheetTitle as UiSheetTitle,
} from "~/shared/components/ui/sheet"
import {
  cn,
} from "~/shared/utils"
import {
  type PermissionCode,
} from "~/types/permission-code"

type OpenSheetStore<K extends string = string, V extends unknown = unknown> = {
  getValue: (key: K) => V
  onClose: (key?: K) => void
  onCloseAll: () => void
  onOpen: (key: K, value?: V, code?: PermissionCode | PermissionCode[]) => void
  onOpenChange: (key: K, value?: V, closeAll?: boolean) => (open?: boolean) => void
  opened: (key: K) => boolean
  setValue: (key: K, value: React.SetStateAction<V>) => void
  values: Map<K, V>
}

/**
 * dialog lồng dialog thì sử dụng
 */
// eslint-disable-next-line custom-rules/encourage-object-params
const useOpenSheet = create<OpenSheetStore<string, unknown>>()((
  set, get
) => ({
  values: new Map(),
  // bật dialog được mở cuối cùng
  opened: (key) => {
    let isOpen = false
    if (key) {
      isOpen = get().values.has(key)
    }
    return isOpen
  },
  // mở dialog theo key
  onOpen: (
    key, value = undefined, code
  ) => {
    const isGranted = true
    // if (code) {

    // }

    if (isGranted) {
      const newMap = new Map(get().values)
      if (key) {
        newMap.set(
          key, value
        )
      }
      set({
        values: newMap,
      })
    }
  },
  // đóng dialog theo key
  onClose: (key) => {
    const newMap = new Map(get().values)

    if (key) {
      newMap.delete(key)
    }

    set({
      values: newMap,
    })
  },
  // đóng tất cả dialog
  onCloseAll: () => {
    set({
      values: new Map(),
    })
  },
  // thay đổi đóng/mở dialog theo key
  onOpenChange:
    (
      key, value, closeAll = false
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
  // lấy giá trị theo key
  getValue: (key) => {
    const values = get().values

    if (key) {
      return values.get(key)
    }
  },
  // cập nhật giá trị theo key
  setValue: (
    key, newValue
  ) => {
    const rValues = new Map(get().values)

    if (key) {
      const value = newValue instanceof Function ? newValue(get().getValue(key)) : newValue

      rValues.set(
        key, value
      )
    }

    set({
      values: rValues,
    })
  },
}))

const showSheet = useOpenSheet.getState().onOpen

interface SheetContainerProps extends Omit<React.ComponentProps<typeof UiSheetContent>, "children"> {
  accessorKey: string
  children: React.ReactNode | ((props: OpenSheetStore & { value?: unknown }) => React.ReactNode)
  TriggerComponent?: React.ReactElement
}

function SheetContainer({
  accessorKey: key, children, TriggerComponent, className, ...props
}: SheetContainerProps) {
  const store = useOpenSheet()
  const handleOpenChange = React.useCallback(
    store.onOpenChange(key), [key]
  )
  const open = React.useMemo(
    () => store.opened(key), [
      store.values,
      key,
    ]
  )
  return (
    <UiSheet
      open={open}
      onOpenChange={handleOpenChange}
    >
      {TriggerComponent ? <UiSheetTrigger asChild>{TriggerComponent}</UiSheetTrigger> : null}

      <UiSheetContent
        className={
          cn(
            "p-0 w-screen sm:w-auto sm:max-w-[75vw] min-w-96 gap-0 flex flex-col", className
          )
        }
        {...props}
      >
        {
          children instanceof Function
            ? children({
              ...store,
              value: store.values.has(key) ? store.values.get(key) : undefined,
              onClose: () => store.onClose(key),
            })
            : children
        }
      </UiSheetContent>
    </UiSheet>
  )
}

function SheetContent({
  className, ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        cn(
          "flex-1 p-4 overflow-y-auto", className
        )
      }
      {...props}
    />
  )
}

function SheetHeader({
  className, ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <UiSheetHeader
      className={
        cn(
          "p-4 pb-0", className
        )
      }
      {...props}
    />
  )
}

function SheetFooter({
  className, ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <UiSheetFooter
      className={
        cn(
          "p-4", className
        )
      }
      {...props}
    />
  )
}

const SheetClose = UiSheetClose
const SheetDescription = UiSheetDescription

function SheetTitle({
  className, ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <UiSheetTitle
      className={
        cn(
          "capitalize", className
        )
      }
      {...props}
    />
  )
}

export {
  useOpenSheet, showSheet, SheetContainer, SheetContent, SheetHeader, SheetFooter, SheetClose, SheetTitle, SheetDescription,
}
