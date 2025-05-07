import React, {
  type ReactNode,
} from "react"

import {
  usePathname,
} from "next/navigation"

import {
  Edit2, Trash,
} from "lucide-react"

import {
  Link,
} from "~/i18n"
import {
  DeleteAlertDialog,
} from "~/shared/components/dialogs/delete-alert-dialog"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "~/shared/components/ui/sheet"

interface ActionsCellProps {
  _id: string | number
  deleteDisabled?: boolean
  editDisabled?: boolean
  EndActionsComponent?: ReactNode
  FormComponent?: ReactNode | ((props: { onClose: () => void }) => ReactNode)
  name?: string
  onDelete?: ({ _id }: { _id: string | number }) => Promise<unknown>
  onDeleteSuccess?: () => void
  StartActionsComponent?: ReactNode
}

export function ActionsCell({
  FormComponent, _id, onDeleteSuccess, onDelete, name, StartActionsComponent, deleteDisabled, EndActionsComponent, editDisabled,
}: ActionsCellProps) {
  const pathname = usePathname()
  const [
    open,
    setOpen,
  ] = React.useState(false)

  return (
    <div className="flex gap-1 justify-center">
      {StartActionsComponent}

      {
        FormComponent ? (
          <React.Fragment>
            <Button
              asChild
              title="Sửa"
              variant="ghost"
              size="icon"
              className="size-8 md:hidden"
              disabled={editDisabled}
            >
              <Link href={`${pathname}/${_id}`}>
                <Edit2 />
              </Link>
            </Button>

            <Sheet
              open={open}
              onOpenChange={setOpen}
            >
              <SheetTrigger asChild>
                <Button
                  title="Sửa"
                  disabled={editDisabled}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 hidden md:flex"
                >
                  <Edit2 />
                </Button>
              </SheetTrigger>

              <SheetContent className="w-screen sm:w-auto sm:max-w-[75vw] flex flex-col p-0 gap-0">
                <SheetHeader className="pt-4 px-4">
                  <SheetTitle>
                    Sửa
                    {" "}

                    {name}
                  </SheetTitle>

                  <SheetDescription />
                </SheetHeader>

                <div className="grow overflow-y-auto p-4">
                  {
                    FormComponent instanceof Function ? FormComponent({
                      onClose: () => setOpen(false),
                    }) : FormComponent
                  }
                </div>

                <SheetFooter className="pb-4 px-4">
                  <Button
                    onClick={() => setOpen(false)}
                    variant="outline"
                  >
                    Đóng
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </React.Fragment>
        ) : null
      }

      {
        onDelete instanceof Function ? (
          <DeleteAlertDialog
            onDelete={
              () => onDelete({
                _id,
              })
            }
            onDeleteSuccess={onDeleteSuccess}
            TriggerComponent={
              (
                <Button
                  title="Xóa"
                  disabled={deleteDisabled}
                  variant="ghost"
                  size="icon"
                  className="size-8 hover:text-destructive hover:bg-destructive/20 hover:dark:bg-destructive hover:dark:text-white"
                >
                  <Trash />
                </Button>
              )
            }
          />
        ) : null
      }

      {EndActionsComponent}
    </div>
  )
}
