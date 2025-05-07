/* eslint-disable custom-rules/encourage-object-params */
import React from "react"

import {
  useControllableState,
} from "~/shared/hooks/state/use-controllable-state"

export interface ListActions<T> {
  /**
   * @description Set new list instead old one
   */
  set: (nextList: T[] | ((prevList: T[]) => T[])) => void
  /**
   * @description Add item(s) at the end of list
   */
  push: (...items: T[]) => void

  /**
   * @description Replace item at given position. If item at given position not exists it will be set.
   */
  updateAt: (index: number, item: T) => void
  /**
   * @description Insert item at given position, all items to the right will be shifted.
   */
  insertAt: (index: number, item: T) => void

  /**
   * @description Replace all items that matches predicate with given one.
   */
  update: (predicate: (a: T, b: T) => boolean, newItem: T) => void
  /**
   * @description Replace first item matching predicate with given one.
   */
  updateFirst: (predicate: (a: T, b: T) => boolean, newItem: T) => void
  /**
   * @description Like `updateFirst` bit in case of predicate miss - pushes item to the list
   */
  upsert: (predicate: (a: T, b: T) => boolean, newItem: T) => void

  /**
   * @description Sort list with given sorting function
   */
  sort: (compareFn?: (a: T, b: T) => number) => void
  /**
   * @description Same as native Array's method
   */
  filter: (callbackFn: (value: T, index?: number, array?: T[]) => boolean, thisArg?: unknown) => void

  /**
   * @description Removes item at given position. All items to the right from removed will be shifted.
   */
  removeAt: (index: number) => void

  /**
   * @description Make the list empty
   */
  clear: () => void
  /**
   * @description Reset list to initial value
   */
  reset: () => void
}

export function useList<T>(props: {
  value?: T[]
  defaultValue?: T[] | (() => T[])
  onValueChange?: (value: T[]) => void
}): [T[], ListActions<T>] {
  const {
    defaultValue = [],
    value,
    onValueChange,
  } = props

  const [
    list,
    setList,
  ] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange: onValueChange,
    shouldUpdate: () => true,
  })

  const actions = React.useMemo<ListActions<T>>(
    () => {
      const a = {
        set: (nextList: React.SetStateAction<T[]>) => {
          const prevList = list
          const setter = nextList as (prevList: T[]) => T[]
          const newList = nextList instanceof Function ? setter(prevList) : nextList
          setList(newList)
        },

        push: (...items: T[]) => {
          if (items.length) {
            actions.set((curr: T[]) => curr.concat(items))
          }
        },

        updateAt: (
          index: number, item: T
        ) => {
          actions.set((curr: T[]) => {
            const arr = curr.slice()

            arr[index] = item

            return arr
          })
        },

        insertAt: (
          index: number, item: T
        ) => {
          actions.set((curr: T[]) => {
            const arr = curr.slice()

            if (index > arr.length) {
              arr[index] = item
            }
            else {
              arr.splice(
                index, 0, item
              )
            }

            return arr
          })
        },

        update: (
          predicate: (a: T, b: T) => boolean, newItem: T
        ) => {
          actions.set((curr: T[]) => curr.map(item => (predicate(
            item, newItem
          ) ? newItem : item)))
        },

        updateFirst: (
          predicate: (a: T, b: T) => boolean, newItem: T
        ) => {
          const index = list.findIndex(item => predicate(
            item, newItem
          ))

          if (index >= 0) {
            actions.updateAt(
              index, newItem
            )
          }
        },

        upsert: (
          predicate: (a: T, b: T) => boolean, newItem: T
        ) => {
          const index = list.findIndex(item => predicate(
            item, newItem
          ))

          if (index >= 0) {
            actions.updateAt(
              index, newItem
            )
          }
          else {
            actions.push(newItem)
          }
        },

        sort: (compareFn?: (a: T, b: T) => number) => {
          actions.set((curr: T[]) => curr.slice().sort(compareFn))
        },

        filter: <S extends T>(callbackFn: (value: T, index: number, array: T[]) => value is S, thisArg?: unknown) => {
          actions.set((curr: T[]) => curr.slice().filter(
            callbackFn, thisArg
          ))
        },

        removeAt: (index: number) => {
          actions.set((curr: T[]) => {
            const arr = curr.slice()

            arr.splice(
              index, 1
            )

            return arr
          })
        },

        clear: () => {
          actions.set([])
        },

        reset: () => {
          const setter = defaultValue as () => T[]
          const newList = defaultValue instanceof Function ? setter() : defaultValue
          actions.set(newList.slice())
        },
      }

      return a as ListActions<T>
    }, [
      defaultValue,
      list,
    ]
  )

  return [
    list,
    actions,
  ]
}
