import {
  type ReactNode,
} from "react"

import {
  cn,
} from "~/shared/utils"

export interface ExplainProps {
  title: string
  value: string | ReactNode
  className?: string
}
export function Explain({
  title, value, className,
}: ExplainProps) {
  return (
    <div className={cn(className)}>
      <span className="font-semibold">
        {title}
        :
      </span>

      {" "}

      <span className="">
        {value}
      </span>

    </div>
  )
}
