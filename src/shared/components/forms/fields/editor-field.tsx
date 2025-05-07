// import {
//   useFormContext,
// } from "react-hook-form"

// import {
//   chain,
// } from "~/shared/utils/chain"

// import {
//   TinyEditor,
// } from "~/shared/components/inputs/tiny-editor"
// import {
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "~/shared/components/ui/form"

// export function EditorField({
//   name, label, onValueChange, description,
// }: {
//   name: string
//   label?: string
//   onValueChange?: (value: string) => void
//   description?: string
// }) {
//   const { control } = useFormContext()

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={
//         ({ field }) =>
//           (
//             <FormItem>
//               {
//                 label ? (
//                   <FormLabel>{label}</FormLabel>
//                 ) : null
//               }

//               <FormControl>
//                 <TinyEditor
//                   value={field.value}
//                   onEditorChange={
//                     chain(
//                       str => field.onChange(str),
//                       str => onValueChange?.(str),
//                     )
//                   }
//                 />
//               </FormControl>

//               {
//                 description ? (
//                   <FormDescription>{description}</FormDescription>
//                 ) : null
//               }

//               <FormMessage />
//             </FormItem>
//           )
//       }
//     />
//   )
// }
