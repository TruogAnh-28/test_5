"use client"

import React from "react"

import {
  useQueries,
} from "@tanstack/react-query"
import {
  type Session,
} from "next-auth"

import {
  useSessionStore,
} from "~/shared/hooks/data/use-session"

import {
  type LoginUser,
} from "~/features/auth/type/auth"
import {
  getMe,
} from "~/features/user/api/user"
import {
  type ApiResponse,
} from "~/types/api"

// import {
//   MAINTENANCE_CODE,
// } from "~/shared/constants"

interface AppInitializerProps {
  children: React.ReactNode
  session: Session
}

export function AppInitializer({
  children, session,
}: AppInitializerProps) {
  const { isPending } = useQueries({
    queries: [
      {
        queryKey: ["getMe"],
        queryFn: getMe,
        select: (data: ApiResponse<LoginUser>) => {
          if (data.data && !useSessionStore.getState().session) {
            useSessionStore.setState({
              session: {
                user: data.data,
                expires: session.expires,
              },
            })
          }
        },
      },
    ],
    combine: (results) => {
      return {
        isPending: results.some(result => result.isPending),
        // isMaintenance: results.some((result) => {

        //   return result.error?.statusCode === MAINTENANCE_CODE
        // }),
      }
    },
  })

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-32 animate-spin rounded-full border-y-2 border-gray-900" />
      </div>
    )
  }

  return children
}
