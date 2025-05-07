import {
  create,
} from "zustand"

import {
  type Employee,
} from "~/features/employee/type/employee"

interface SessionState {
  sessionEmployee: Employee | null
  setSessionEmployee: (employee: Employee | null) => void
  getEmployeeSession: () => Employee | null
}

// Tạo Zustand store
const useSession = create<SessionState>((
  set, get
) => ({
  sessionEmployee: null,
  getEmployeeSession: () => {
    return get().sessionEmployee
  },
  setSessionEmployee: employee => set({
    sessionEmployee: employee,
  }),
}))

export {
  useSession,
}
