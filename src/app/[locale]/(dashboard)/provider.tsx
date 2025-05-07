// "use client"

// import { useQuery } from "@tanstack/react-query"
// import { useEffect } from "react"
// import { getMe } from "~/features/user/api/user"
// import { useSession } from "~/features/user/store/use-session"
// import { useRouter } from "next/navigation"
// import { Loading } from "~/shared/components/shared/loading"
// export function DashboardProvider ({children}: {children: React.ReactNode}){
//   const { setSessionUser } = useSession()
//   const router = useRouter()
//   const {data: user, isError, isLoading} = useQuery({
//     queryKey: ["getMe"],
//     queryFn: getMe,
//   })
//   useEffect(() => {
//     if (user) {
//       setSessionUser(user.data)
//     }
//     if (isError) router.push("/login")
//   }, [user,isError])
//   if (isLoading) return <Loading />
//   return (
//     <>
//       {children}
//     </>
//   )
// }
