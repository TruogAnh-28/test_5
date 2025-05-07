import {
  format,
} from "date-fns"

export function UpdatedDateCell<T extends Record<string, unknown>>(props: { data?: T }) {
  if (!props.data?.updated_date || !props.data?.created_date) {
    return null
  }

  return (
    <div className="capitalize">
      <p>
        {
          typeof props.data?.updated_date === "string"
            ? format(
              props.data.updated_date, "dd MMMM, yyyy"
            ) : null
        }
      </p>

      <p className="text-xs text-muted-foreground">
        Tạo:

        {" "}

        {
          typeof props.data?.created_date === "string"
            ? format(
              props.data.created_date, "dd MMMM, yyyy"
            ) : null
        }
      </p>
    </div>
  )
}
