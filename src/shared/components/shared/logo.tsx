/* eslint-disable react/boolean-prop-naming */
import {
  ImageView,
} from "~/shared/components/shared/image"
import {
  cn,
} from "~/shared/utils"

export function Logo({
  minimal = false, isLight = false, className = "",
}: { minimal?: boolean
  isLight?: boolean
  className?: string }) {
  if (minimal) return (
    <div className="font-[Phudu] text-[5px] text-center font-bold">
      <span className="text-accent">Auto</span>

      <span className={cn(isLight ? "text-white" : "text-primary")}>Ranker</span>

    </div>
  )

  return (

    <div className="font-[Phudu] font-semibold flex flex-col items-center">
      <div className={
        cn(
          "size-32", className
        )
      }
      >
        <ImageView
          src="/images/logo/logo.png"
          alt="auto-ranker"
          width={1000}
          height={1000}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* <div className="text-xl">
        <span className="text-accent">Auto</span>

        <span className={cn(isLight ? "text-white" : "text-primary")}>Ranker</span>
      </div> */}

    </div>
  )
}
