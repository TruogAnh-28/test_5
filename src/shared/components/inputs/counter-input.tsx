/* eslint-disable no-restricted-syntax */
import React from "react"

import {
  Minus, Plus,
} from "lucide-react"
import {
  NumericFormat, type NumericFormatProps,
} from "react-number-format"

import {
  useCounter, type UseCounterProps,
} from "~/shared/hooks/state/use-counter"

import {
  cn,
} from "~/shared/utils"

type CounterInputProps = Omit<NumericFormatProps, "value" | "defaultValue" | "onValueChange"> & UseCounterProps

export function CounterInput({
  value, defaultValue, min, max, onValueChange, className, ...props
}: CounterInputProps) {
  const [
    count,
    {
      dec,
      inc,
      set,
    },
  ] = useCounter({
    defaultValue: defaultValue ?? 0,
    max,
    min,
    onValueChange,
    value,
  })

  const handleKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      if (e.code === "ArrowUp") {
        inc()
      }

      if (e.code === "ArrowDown") {
        dec()
      }
    }, [
      inc,
      dec,
    ]
  )

  return (
    <div className={
      cn(
        "flex justify-start h-9 w-fukk rounded-full border border-input bg-transparent text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring overflow-hidden", props.disabled ? "opacity-50" : "", className
      )
    }
    >
      <button
        title="Giảm 1"
        onClick={() => dec()}
        type="button"
        disabled={props.disabled}
        className="shrink-0 size-9 hover:bg-muted text-muted-foreground disabled:hover:bg-transparent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 grid place-content-center"
      >
        <Minus />
      </button>

      <NumericFormat
        inputMode="numeric"
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={0}
        min={min}
        max={max}
        value={count}
        onValueChange={
          ({ floatValue }) => {
            if (floatValue !== count) {
              set(floatValue ?? 0)
              onValueChange?.(floatValue ?? 0)
            }
          }
        }
        className="flex-1 px-3 w-full py-1 outline-none border-x bg-transparent"
        onKeyDown={handleKeyDown}
        onFocus={e => e.target.select()}
        title="Nhập số lượng"
        {...props}
      />

      <button
        title="Tăng 1"
        onClick={() => inc()}
        type="button"
        disabled={props.disabled}
        className="shrink-0 size-9 disabled:hover:bg-transparent hover:bg-muted text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 grid place-content-center"
      >
        <Plus />
      </button>
    </div>
  )
}
