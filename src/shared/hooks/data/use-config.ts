// import {
//   create,
// } from "zustand"

// import {
//   type Configuration,
// } from "~/features/setting/type/option"

// interface ConfigsStore {
//   configs?: Configuration
//   setConfigs: (configs: Configuration) => void
//   getConfigs: () => Configuration | undefined
// }

// export const useConfigsStore = create<ConfigsStore>()((
//   set, get
// ) => ({
//   configs: undefined,
//   setConfigs: (configs) => {
//     set({
//       configs,
//     })
//   },
//   getConfigs: () => {
//     return get().configs!
//   },
// }))

// export const getConfigs = useConfigsStore.getState().getConfigs
