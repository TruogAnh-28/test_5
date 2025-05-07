import {
  create,
} from "zustand"

import {
  type User,
} from "~/features/user/type/user"

interface SessionState {
  sessionUser: User | null
  setSessionUser: (user: User | null) => void
  getUserSession: () => User | null
}

// Tạo Zustand store
const useSession = create<SessionState>((
  set, get
) => ({
  sessionUser: null,
  getUserSession: () => {
    return get().sessionUser
  },
  setSessionUser: user => set({
    sessionUser: user,
  }),
}))

export {
  useSession,
}
