import {
  type CellContext,
} from "@tanstack/react-table"

import {
  cn,
} from "~/shared/utils"

export function StatusCell<T>({ getValue }: CellContext<T, unknown>) {
  const value = getValue<number>()

  return (
    <div className="flex items-center gap-2">
      <div className={
        cn(
          "size-2 rounded-full",
          value === 1 ? "bg-success" : "bg-danger"
        )
      }
      />

      {value === 1 ? "Bật" : "Tắt"}
    </div>
  )
}
