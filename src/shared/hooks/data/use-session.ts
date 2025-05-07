import {
  type Session,
} from "next-auth"
import {
  create,
} from "zustand"

interface ConfirmAlertStore {
  session?: Session
  onInitialSession: (session: Session) => void
  getUserSession: () => Session["user"]
  getBranchIDUser: () => string
}

export const useSessionStore = create<ConfirmAlertStore>()((
  set, get
) => ({
  session: undefined,
  onInitialSession: (session: Session) => {
    if (session) {
      set({
        session,
      })
    }
  },
  getUserSession: () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    return get().session?.user!
  },
  getBranchIDUser: () => {
    return "" // only admin
    // return get().getUserSession()?.branch_id
  },
}))

export const getBranchIDUser = useSessionStore.getState().getBranchIDUser
export const getUserSession = useSessionStore.getState().getUserSession
