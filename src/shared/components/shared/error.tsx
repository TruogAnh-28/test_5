import {
  ErrorMessage, type ErrorMessageProps,
} from "~/shared/components/shared/error-message"
import {
  cn,
} from "~/shared/utils"

export function ErrorView({
  className, ...props
}: ErrorMessageProps) {
  return (
    <div className={
      cn(
        "grid size-full place-content-center py-6", className
      )
    }
    >
      <ErrorMessage {...props} />
    </div>
  )
}
