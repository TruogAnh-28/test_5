/* eslint-disable no-restricted-syntax */
/* eslint-disable custom-rules/encourage-object-params */
import React from "react"

import {
  useLazyRef,
} from "~/shared/hooks/state/use-lazy-ref"

export type UseSetStateReturn<T> = [
  T,
  (nextState: Partial<T> | ((prevState: T) => Partial<T>)) => void,
]

export const useSetState = <T extends Record<string, unknown>>(
  initialState: T | (() => T),
  options?: {
    skipNil?: boolean // skip value is null or undefined.
  },
): UseSetStateReturn<T> => {
  const initialStateRef = useLazyRef(() =>
    initialState instanceof Function ? initialState() : initialState,)

  const [
    state,
    setState,
  ] = React.useReducer(
    (
      prevState: T, nextState: Partial<T>
    ) =>
      ({
        ...prevState,
        ...nextState,
      }) as T,
    initialStateRef.current ?? {
    },
  )

  const set = React.useCallback(
    (nextState: Partial<T> | ((prevState: T) => Partial<T>)) => {
      const prevState = state
      const setter = nextState as (prevState: T) => T
      const newState
        = nextState instanceof Function ? setter(prevState) : nextState

      if (typeof options?.skipNil === "boolean" && options?.skipNil) {
        Object.keys(newState).forEach((key) => {
          if (newState[key] === undefined || newState[key] === null) {
            newState[key as keyof typeof newState]
              = initialStateRef.current[
                key as keyof typeof initialStateRef.current
              ]
          }
        })
      }

      setState(newState)
    },
    [
      initialStateRef,
      options?.skipNil,
      state,
    ],
  )

  return [
    state,
    set,
  ]
}
