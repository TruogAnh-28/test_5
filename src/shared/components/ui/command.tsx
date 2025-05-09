/* eslint-disable no-restricted-syntax */
"use client"

import * as React from "react"

import {
  type DialogProps,
} from "@radix-ui/react-dialog"
import {
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons"
import {
  Command as CommandPrimitive,
} from "cmdk"

import {
  useControllableState,
} from "~/shared/hooks/state/use-controllable-state"

import {
  Dialog, DialogContent,
} from "~/shared/components/ui/dialog"
import {
  cn,
} from "~/shared/utils"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive> & {
    className?: string
  }
>((
  {
    className, ...props
  }, ref
) => (
  <CommandPrimitive
    ref={ref}
    className={
      cn(
        "flex h-full w-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground",
        className
      )
    }
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

function CommandDialog({
  children, ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    className?: string
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
  }
>((
        {
          className, defaultValue, value: valueProp, onValueChange, ...props
        }, ref
      ) => {
        const [
          value,
          setValue,
        ] = useControllableState({
          defaultProp: defaultValue as string,
          prop: valueProp,
          onChange: onValueChange,
        })

        return (
          <div
            className="flex items-center border-b px-3"
            // eslint-disable-next-line react/no-unknown-property
            cmdk-input-wrapper=""
          >
            <MagnifyingGlassIcon className="mr-2 size-4 shrink-0 opacity-50" />

            <CommandPrimitive.Input
              ref={ref}
              className={
                cn(
                  "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                  className
                )
              }
              value={value}
              onValueChange={setValue}
              {...props}
            />
          </div>
        )
      })

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> & {
    className?: string
  }
>((
  {
    className, ...props
  }, ref
) => (
  <CommandPrimitive.List
    ref={ref}
    className={
      cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden", className
      )
    }
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> & {
    className?: string
  }
// eslint-disable-next-line custom-rules/encourage-object-params
>((
  props, ref
) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> & {
    className?: string
  }
>((
  {
    className, ...props
  }, ref
) => (
  <CommandPrimitive.Group
    ref={ref}
    className={
      cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )
    }
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator> & {
    className?: string
  }
>((
  {
    className, ...props
  }, ref
) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={
      cn(
        "-mx-1 h-px bg-border", className
      )
    }
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    className?: string
  }
>((
  {
    className, ...props
  }, ref
) => (
  <CommandPrimitive.Item
    ref={ref}
    className={
      cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-primary data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )
    }
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

function CommandShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={
        cn(
          "ml-auto text-xs tracking-widest text-muted-foreground",
          className
        )
      }
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
