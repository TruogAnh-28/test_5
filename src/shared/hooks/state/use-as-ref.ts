import React from "react"

export function useAsRef<T>(data: T) {
  const ref = React.useRef<T>(data)

  React.useInsertionEffect(() => {
    ref.current = data
  })

  return ref
}
