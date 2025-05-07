/* eslint-disable react/no-array-index-key */
import React from "react"

import {
  VisuallyHidden,
} from "@radix-ui/react-visually-hidden"

import {
  useOpenDialogs,
  type OpenDialogsStore,
} from "~/shared/components/dialogs/use-open-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "~/shared/components/ui/sheet"
import {
  Tabs, TabsContent,
} from "~/shared/components/ui/tabs"

export type SheetContainerContent = {
  accessorKey: string
  isCloseAsBack?: boolean
  children: React.ReactNode | ((props: OpenDialogsStore & { value?: unknown }) => React.ReactNode)
}

export interface SheetsContainerProps {
  content?: SheetContainerContent[]
}

export function SheetsContainer({ content }: SheetsContainerProps) {
  const store = useOpenDialogs()

  const tabValue = React.useMemo(
    store.getLastKey, [store.values]
  )
  const sheetOpen = React.useMemo(
    () => {
      return store.values.size > 0 && content?.some(it => it.accessorKey === tabValue)
    }, [
      content,
      tabValue,
    ]
  )

  const isCloseAsBack = React.useMemo(
    () => {
      const found = content?.find(it => it.accessorKey === tabValue)
      if (found) {
        return found.isCloseAsBack ?? false
      }
      return false
    }, [
      content,
      tabValue,
    ]
  )

  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={
        () => {
          if (isCloseAsBack) {
            store.onBack()
          }
          else {
            store.onCloseAll()
          }
        }
      }
    >
      <SheetContent className="p-0 w-screen sm:w-auto sm:max-w-[75vw] min-w-96">
        <VisuallyHidden>
          <SheetTitle />

          <SheetDescription />
        </VisuallyHidden>

        {
          content ? (
            <Tabs
              value={tabValue}
              className="h-full"
            >
              {
                content?.map(({
                  accessorKey, children,
                }) => {
                  return (
                    <TabsContent
                      key={accessorKey}
                      value={accessorKey}
                      className="data-[state=active]:flex flex-col h-full mt-0"
                    >
                      {
                        children instanceof Function
                          ? children({
                            value: store.values.has(accessorKey) ? store.values.get(accessorKey) : undefined,
                            ...store,
                          })
                          : children
                      }
                    </TabsContent>
                  )
                })
              }
            </Tabs>
          ) : null
        }
      </SheetContent>
    </Sheet>
  )
}
