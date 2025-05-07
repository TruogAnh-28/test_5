import {
  Spin,
  type SpinProps,
} from "~/shared/components/ui/spinner"
import {
  cn,
} from "~/shared/utils"

export function Loading({
  className, ...props
}: SpinProps) {
  return (
    <div className={
      cn(
        "py-9 size-full grid place-content-center",
        className
      )
    }
    >
      <Spin {...props} />
    </div>
  )
}
