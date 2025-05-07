/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable custom-rules/encourage-object-params */
import * as React from "react"

import {
  useControllableState,
} from "~/shared/hooks/state/use-controllable-state"
import {
  useUpdateEffect,
} from "~/shared/hooks/state/use-update-effect"

import {
  chain,
} from "~/shared/utils/chain"
import {
  mergeRefs,
} from "~/shared/utils/merge-ref"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/shared/components/ui/command"
import {
  cn,
} from "~/shared/utils"

// utils
type ChildrenRenderer<C, P> = C | ((props: P) => C)

function rendererChildren<C extends React.ReactNode, P>(
  children: ChildrenRenderer<C, P>,
  props: P,
) {
  if (children instanceof Function) {
    return children(props)
  }
  return children
}

// Select
export type ValueState = string | string[] | undefined
export type SelectionMode = "single" | "multiple"

interface ReactSelectBase {
  required?: boolean
  disabled?: boolean
  initialFocus?: boolean
}

export interface ReactSelectSingleProps extends ReactSelectBase {
  mode?: "single"
  defaultValue?: string
  value?: string
  onValueChange?: (value?: string) => void
}

export interface ReactSelectMultipleProps extends ReactSelectBase {
  mode?: "multiple"
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value?: string[]) => void
  min?: number
  max?: number
}

export type ReactSelectProps = {
  children?: React.ReactNode | ((context: ReactSelectContextValue) => React.ReactNode)
} & (ReactSelectSingleProps | ReactSelectMultipleProps)

interface ReactSelectContextValue extends ReactSelectBase {
  getModifierSelect: (value: string) => Record<string, boolean | undefined>
  handleClear: React.MouseEventHandler<HTMLButtonElement>
  handleRemove: (value: string) => React.MouseEventHandler<HTMLButtonElement>
  handleSelect: (value: string) => void
  mode: SelectionMode
  value: ReactSelectProps["value"]
  min?: number
  max?: number
}

const ReactSelectContext = React.createContext<ReactSelectContextValue | null>(null)

const useReactSelect = () => {
  const context = React.useContext(ReactSelectContext)
  if (!context) {
    throw new Error("useReactSelect must be used within a ReactSelect")
  }
  return context
}

function ReactSelect(props: ReactSelectProps) {
  const {
    disabled = false,
    initialFocus = true,
    max = 0,
    min = 0,
    mode = "single",
    required = true,

    defaultValue,
    value: valueProp,
    onValueChange,

    children,
  } = props as ReactSelectProps & { min?: number
    max?: number }

  const [
    value,
    setValue,
  ] = useControllableState<ValueState>({
    defaultProp: defaultValue,
    prop: valueProp,
    onChange: onValueChange as (state: ValueState) => void,
  })

  useUpdateEffect(
    () => {
      if (!valueProp) {
        setValue(undefined)
      }
    }, [valueProp]
  )

  const handleSelectSingle = React.useCallback(
    (triggerValue: string) => {
      const selected = value as ReactSelectSingleProps["value"]
      let newDate: string | undefined = triggerValue
      if (!required && selected && triggerValue === selected) {
        // If the value is the same, clear the selection.
        newDate = undefined
      }
      return newDate
    },
    [
      required,
      value,
    ],
  )

  const handleSelectMulti = React.useCallback(
    (triggerValue: string) => {
      const selected = (value as ReactSelectMultipleProps["value"]) ?? []
      let newDates: string[] | undefined = [...selected]
      if (selected.includes(triggerValue)) {
        if (selected?.length === min) {
          // Min value reached, do nothing
          return
        }
        if (required && selected?.length === 1) {
          // Required value already selected do nothing
          return
        }
        newDates = selected?.filter(it => it !== triggerValue)
      }
      else if (selected?.length === max) {
        // Max value reached, reset the selection to date
        newDates = [triggerValue]
      }
      else {
        // Add the date to the selection
        newDates = [
          ...newDates,
          triggerValue,
        ]
      }
      return newDates
    },
    [
      max,
      min,
      required,
      value,
    ],
  )

  const handleSelect = React.useCallback(
    (triggerValue: string) => {
      let newValue: ReactSelectProps["value"]

      switch (mode) {
        case "single":
          newValue = handleSelectSingle(triggerValue)
          break

        case "multiple":
          newValue = handleSelectMulti(triggerValue)
          break
      }

      setValue(newValue)
    },
    [
      mode,
      setValue,
      handleSelectSingle,
      handleSelectMulti,
    ],
  )

  const handleRemove = React.useCallback(
    (triggerValue: string): React.MouseEventHandler<HTMLButtonElement> =>
      (e) => {
        e.preventDefault()
        e.stopPropagation()

        let newValue: ReactSelectProps["value"]

        switch (mode) {
          case "single":
            newValue = undefined
            break

          case "multiple":
            newValue = handleSelectMulti(triggerValue)
            break
        }

        setValue(newValue)
      },
    [
      handleSelectMulti,
      mode,
      setValue,
    ],
  )

  const handleClear = React.useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (e) => {
      e.preventDefault()
      e.stopPropagation()

      setValue(undefined)
    }, [setValue]
  )

  const getModifierSelect = React.useCallback(
    (triggerValue: string) => {
      const dataAttributes: Record<string, boolean | undefined> = {
      }
      switch (mode) {
        case "single":
          dataAttributes.checked = value === triggerValue
          break

        case "multiple":
          dataAttributes.checked = value?.includes(triggerValue)
          break
      }
      return dataAttributes
    },
    [
      mode,
      value,
    ],
  )

  const contextValue: ReactSelectContextValue = {
    disabled,
    getModifierSelect,
    handleClear,
    handleRemove,
    handleSelect,
    initialFocus,
    max,
    min,
    mode,
    required,
    value,
  }
  return (
    <ReactSelectContext.Provider value={contextValue}>
      {
        rendererChildren(
          children, contextValue
        )
      }
    </ReactSelectContext.Provider>
  )
}

const Select = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Command>
>((
  props, ref
) => {
  const innerRef = React.useRef<HTMLDivElement>(null)

  const {
    mode, value, initialFocus,
  } = useReactSelect()

  React.useEffect(
    () => {
      if (innerRef.current && initialFocus) {
        innerRef.current.focus()
      }
    }, []
  )

  const getDefaultValue = React.useCallback(
    () => {
      let defaultValue
      switch (mode) {
        case "single":
          defaultValue = value
          break

        case "multiple":
          defaultValue = value && value?.length > 0 ? value[0] : undefined
          break
      }
      return defaultValue as string
    }, [
      mode,
      value,
    ]
  )

  return (
    <Command
      ref={
        mergeRefs(
          ref, innerRef
        )
      }
      defaultValue={getDefaultValue()}
      {...props}
    />
  )
})
Select.displayName = "Select"

const SelectInput = CommandInput

interface SelectListProps
  extends Omit<React.ComponentProps<typeof CommandList>, "children"> {
  children: React.ReactNode | ((context: ReactSelectContextValue) => React.ReactNode)
}

const SelectList = React.forwardRef<HTMLDivElement, SelectListProps>((
  {
    children, ...props
  }, ref
) => {
  const context = useReactSelect()
  return (
    <CommandList
      ref={ref}
      {...props}
    >
      {children instanceof Function ? children(context) : children}
    </CommandList>
  )
},)
SelectList.displayName = "SelectList"

const SelectEmpty = CommandEmpty

const SelectGroup = CommandGroup

const SelectSeparator = CommandSeparator

const SelectItem = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof CommandItem>>((
  {
    value: valueProp, className, onSelect, ...props
  }, ref
) => {
  const {
    getModifierSelect, handleSelect,
  } = useReactSelect()
  const { checked } = getModifierSelect(valueProp!)
  return (
    <CommandItem
      ref={ref}
      data-checked={checked}
      value={valueProp}
      onSelect={
        chain(
          onSelect, handleSelect
        )
      }
      className={
        cn(
          "gap-2 rounded-lg [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          className,
        )
      }
      {...props}
    />
  )
},)
SelectItem.displayName = "SelectItem"

export {
  ReactSelect,
  Select,
  SelectEmpty,
  SelectGroup,
  SelectInput,
  SelectItem,
  SelectList,
  SelectSeparator,
}
