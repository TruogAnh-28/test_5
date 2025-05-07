import {
  cn,
} from "~/shared/utils"

export function TableContainer({
  className, ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-label="Table-Container"
      className={
        cn(
          "space-y-3", className
        )
      }
      {...props}
    />
  )
}
