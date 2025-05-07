import {
  type CellContext,
} from "@tanstack/react-table"

import {
  getLangValue,
} from "~/shared/utils/shared"

export function MultiLangCell<T>({ getValue }: CellContext<T, unknown>) {
  return getLangValue(getValue<string>())
}
