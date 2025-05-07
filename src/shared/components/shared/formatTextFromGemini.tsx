import React from "react"

export function FormatTextFromGemini({ plan }: { plan: string }) {
  const formattedPlan = plan
    .replace(
      /\n/g, "<br/>"
    )
    .replace(
      /\*\*(.*?)\*\*/g, "<strong>$1</strong>"
    )

  return (
    <div dangerouslySetInnerHTML={
      {
        __html: formattedPlan,
      }
    }
    />
  )
}
