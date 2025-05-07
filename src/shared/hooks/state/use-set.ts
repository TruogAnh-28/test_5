import React from "react"

export function useSet<T>(values?: T[]): Set<T> {
  const setRef = React.useRef(new Set(values))
  const [
    , forceUpdate,
  ] = React.useReducer(
    x => (x + 1) % 1000000, 0
  )

  setRef.current.add = (...args) => {
    const res = Set.prototype.add.apply(
      setRef.current, args
    )
    forceUpdate()

    return res as Set<T>
  }

  setRef.current.clear = (...args) => {
    Set.prototype.clear.apply(
      setRef.current, args
    )
    forceUpdate()
  }

  setRef.current.delete = (...args) => {
    const res = Set.prototype.delete.apply(
      setRef.current, args
    )
    forceUpdate()

    return res
  }

  return setRef.current
}
