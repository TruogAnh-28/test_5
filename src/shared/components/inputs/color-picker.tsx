"use client"

import React from "react"

import {
  HexColorPicker,
} from "react-colorful"

import {
  useControllableState,
} from "~/shared/hooks/state/use-controllable-state"

import {
  throttle,
} from "~/shared/utils/throttle"

import {
  Input,
} from "~/shared/components/ui/input"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "~/shared/components/ui/popover"
import {
  cn,
} from "~/shared/utils"

interface ColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void
}

const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>((
  {
    onValueChange, defaultValue, value: valueProp, className, ...props
  }, ref
) => {
  const [
    value,
    setValue,
  ] = useControllableState<string>({
    defaultProp: defaultValue as string,
    prop: valueProp as string,
    onChange: onValueChange,
  })

  const handleChange = React.useCallback(
    throttle(
      setValue, 100
    ), []
  )

  const parsedValue = value ?? "#FFFFFF"

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <div className="absolute z-10 left-0 inset-y-0 size-9 p-1">
            <div
              className="rounded-full size-full transition-colors border duration-300"
              style={
                {
                  backgroundColor: parsedValue,
                }
              }
            />
          </div>
        </PopoverTrigger>

        <Input
          ref={ref}
          className={
            cn(
              "pl-10", className
            )
          }
          value={value}
          onChange={e => handleChange(e.target.value)}
          {...props}
        />
      </div>

      <PopoverContent
        align="start"
        className="w-fit"
      >
        <HexColorPicker
          color={parsedValue}
          onChange={handleChange}
        />
      </PopoverContent>
    </Popover>
  )
})
ColorPicker.displayName = "ColorPicker"

export {
  ColorPicker,
}
