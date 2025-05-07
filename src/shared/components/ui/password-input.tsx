"use client"

import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  useContext,
  useState,
} from "react"

import {
  Eye, EyeOff,
} from "lucide-react"

import {
  chain,
} from "~/shared/utils/chain"

import {
  cn,
} from "~/shared/utils"

interface PasswordContextValue {
  isPassword: boolean
  setIsPassword: (isPassword: boolean) => void
}

const PasswordContext = createContext<PasswordContextValue | null>(null,)

const usePasswordContext = () => {
  const context = useContext(PasswordContext)
  if (!context) {
    throw new Error("usePasswordContext must be used within a PasswordContent")
  }
  return context
}

const Password = forwardRef<
  HTMLLabelElement,
  HTMLAttributes<HTMLLabelElement>
>((
  {
    className, ...props
  }, ref
) => {
  const [
    isPassword,
    setIsPassword,
  ] = useState(true)

  return (
    <PasswordContext.Provider
      value={
        {
          isPassword,
          setIsPassword,
        }
      }
    >
      <label
        ref={ref}
        className={
          cn(
            "flex h-9 w-full gap-2 rounded-full border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
            className,
          )
        }
        {...props}
      />
    </PasswordContext.Provider>
  )
})

Password.displayName = "PasswordContainer"

const PasswordInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((
  {
    className, ...props
  }, ref
) => {
  const passwordCtx = usePasswordContext()

  return (
    <input
      {...props}
      ref={ref}
      type={passwordCtx?.isPassword ? "password" : "text"}
      className={
        cn(
          "flex-1 bg-transparent placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )
      }
    />
  )
})

PasswordInput.displayName = "PasswordInput"

const PasswordButton = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>((
  {
    onClick, ...props
  }, ref
) => {
  const passwordCtx = usePasswordContext()
  const Icon = passwordCtx?.isPassword ? EyeOff : Eye

  return (
    <button
      ref={ref}
      tabIndex={-1}
      type="button"
      onClick={
        chain(
          onClick, () =>
            passwordCtx?.setIsPassword(!passwordCtx?.isPassword),
        )
      }
      {...props}
    >
      <Icon className="size-4 text-foreground/65" />
    </button>
  )
})

PasswordButton.displayName = "PasswordButton"

export {
  Password, PasswordInput, PasswordButton,
}
