import {
  getCsrfToken,
} from "next-auth/react"

import {
  type LoginUser,
} from "~/features/auth/type/auth"

export const updateSession = async (newSession: Partial<LoginUser>) => {
  await fetch(
    "/api/auth/session", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        csrfToken: await getCsrfToken(),
        data: newSession,
      }),
    }
  )
}
