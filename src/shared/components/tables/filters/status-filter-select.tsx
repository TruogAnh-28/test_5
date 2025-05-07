import {
  useUrlParams,
} from "~/shared/hooks/state/use-url-params"

import {
  BaseSelectFilter,
} from "~/shared/components/tables/filters/base-select-filter"

const StatusOptions = [
  {
    label: "Bật",
    value: "1",
  },
  {
    label: "Tắt",
    value: "0",
  },
]

export function StatusSelectFilter() {
  const [
    getParam,
    setParam,
  ] = useUrlParams()

  const status = getParam(
    "status", -1
  )

  return (
    <BaseSelectFilter
      mode="single"
      title="Trạng thái"
      options={StatusOptions}
      value={status >= 0 ? String(status) : undefined}
      onValueChange={
        status => setParam(
          status, "status"
        )
      }
    />
  )
}
