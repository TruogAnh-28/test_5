// /* eslint-disable no-restricted-syntax */
// "use client"

// import React from "react"

// import {
//   zodResolver,
// } from "@hookform/resolvers/zod"
// import {
//   type SubmitHandler, useForm,
// } from "react-hook-form"
// import {
//   toast,
// } from "sonner"

// import {
//   createRolePermission, updateRolePermission,
// } from "~/features/role-permission/api/role-permission"
// import {
//   type RolePermission, type RolePermissionInput, rolePermissionInputSchema,
// } from "~/features/role-permission/type/role-permission"

// import {
//   AppForm, type BaseAppFormProps,
// } from "~/shared/components/forms/app-form"
// import {
//   TextInput,
// } from "~/shared/components/inputs/text-input"

// import {
//   FormControl,
//   FormField, FormItem, FormLabel, FormMessage,
// } from "~/shared/components/ui/form"

// export interface RolePermissionFormProps extends BaseAppFormProps {
//   onSubmitSuccess?: () => void
//   values?: RolePermission
// }

// export function RolePermissionForm({
//   onSubmitSuccess, ...props
// }: RolePermissionFormProps) {

//   const form = useForm<RolePermissionInput>({
//     resolver: zodResolver(rolePermissionInputSchema),
//     defaultValues: {
//       role_id: "",
//     },
//     values: props.values,
//   })

//   const handleSubmit: SubmitHandler<RolePermissionInput> = React.useCallback(
//     async (data) => {
//       try {
//         if (props.isCreate) {
//           const response = await createRolePermission(data)

//           toast.success(response.message || "Tạo thành công")

//           onSubmitSuccess?.()
//           return
//         }

//         const response = await updateRolePermission(props.values?.id || 0,data)

//         toast.success(response.message || "Cập nhật thành công")

//         onSubmitSuccess?.()
//       }
//       catch (error) {
//         form.setError(
//           "root", {
//             message: (error as Error).message ?? "Yêu cầu thất bại",
//           }
//         )
//       }
//     }, [
//       onSubmitSuccess,
//       props,
//     ]
//   )

//   return (
//     <AppForm
//       {...props}
//       form={form}
//       onSubmit={handleSubmit}
//       title="chức vụ"
//     >
//       <div className="grid lg:grid-cols-2 gap-6">
//         <FormField
//           control={form.control}
//           name="name"
//           render={
//             ({ field }) =>
//               (
//                 <FormItem>
//                   <FormLabel required>Tên chức vụ</FormLabel>

//                   <FormControl>
//                     <TextInput
//                       {...field}
//                     />
//                   </FormControl>

//                   <FormMessage />
//                 </FormItem>
//               )
//           }
//         />

//       </div>
//     </AppForm>
//   )
// }
