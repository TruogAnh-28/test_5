import React from "react"

import {
  Info,
} from "lucide-react"

import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"

interface ErrorCardProps {
  title: string
  message: string
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title, message,
}) => {
  return (
    <Card className="my-6 border-neutral-200 dark:border-neutral-800">
      <CardHeader className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <CardTitle className="text-foreground flex items-center">
          <Info className="mr-2 size-5" />

          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <Info className="text-muted-foreground size-12" />

          <p className="text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  )
}
