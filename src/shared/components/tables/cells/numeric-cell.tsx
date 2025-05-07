import {
  type CellContext,
} from "@tanstack/react-table"

export function NumericCell<T>({ getValue }: CellContext<T, unknown>) {
  return parseInt(getValue<string>())
}
