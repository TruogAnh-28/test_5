import {
  type ReactNode,
} from "react"

export default async function VerifyLayout({ children }: Readonly<{
  children: ReactNode
}>) {
  return (
    <div
      className="flex h-screen flex-col"
    >
      <main
        className="bg-background flex flex-col items-center justify-center size-full"
      >
        <div className="w-full max-w-md px-4">
          {children}
        </div>
      </main>
    </div>
  )
}
