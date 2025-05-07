// /* eslint-disable no-restricted-syntax */
// /* eslint-disable custom-rules/encourage-object-params */
// import {
//   useEffect,
//   useRef,
//   useState,
// } from "react"

// import {
//   ChevronDown,
//   Plus,
//   Trash2,
// } from "lucide-react"
// import {
//   useFieldArray,
//   useFormContext,
// } from "react-hook-form"

// import {
//   FileManagerSelect,
// } from "~/features/file-manager/components/inputs/file-manager-select"
// import {
//   type FileManager,
// } from "~/features/file-manager/type/file-manager"
// import {
//   TextAreaField,
// } from "~/shared/components/forms/fields/text-area-field"
// import {
//   TextField,
// } from "~/shared/components/forms/fields/text-field"
// import {
//   Combobox,
// } from "~/shared/components/inputs/combobox"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "~/shared/components/ui/accordion"
// import {
//   Button,
//   buttonVariants,
// } from "~/shared/components/ui/button"
// import {
//   Card,
//   CardDescription,
//   CardHeader,
// } from "~/shared/components/ui/card"
// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "~/shared/components/ui/form"
// import {
//   cn,
// } from "~/shared/utils"
// import {
//   type Seo,
//   type MetaSocialInput,
//   type SeoInput,
//   type MetaSocial,
// } from "~/types/seo"

// const MetaSocialTypeOptions = [
//   {
//     label: "Facebook",
//     value: "Facebook",
//   },
//   {
//     label: "X (Twitter)",
//     value: "Twitter",
//   },
// ]

// export function SeoField({ seo }: { seo?: Seo }) {
//   const { control } = useFormContext<{ seo: SeoInput }>()

//   return (
//     <FormField
//       control={control}
//       name="seo"
//       render={
//         () => (
//           <FormItem>
//             <FormLabel>SEO</FormLabel>

//             <div className="grid lg:grid-cols-2 gap-6">
//               <TextField
//                 name="seo.meta_title"
//                 label="Meta title"
//               />

//               <TextField
//                 name="seo.meta_description"
//                 label="Meta description"
//               />

//               <FormField
//                 control={control}
//                 name="seo.meta_image"
//                 render={
//                   ({ field }) => (
//                     <FormItem>
//                       <FormLabel>Meta image</FormLabel>

//                       <FileManagerSelect
//                         uploadFilesProps={
//                           {
//                             mode: "single",
//                             maxFiles: 1,
//                             accept: {
//                               "image/*": [],
//                             },
//                           }
//                         }
//                         mode="single"
//                         defaultFiles={
//                           seo?.meta_image
//                           && seo.meta_image > 0
//                             ? [
//                               {
//                                 _id: seo.meta_image,
//                                 url: seo.meta_image_link,
//                                 name: seo.meta_title,
//                               } as FileManager,
//                             ]
//                             : undefined
//                         }
//                         onFilesChange={
//                           (value) => {
//                             if (value.length && value[0]) {
//                               field.onChange(value[0]?._id)
//                             }
//                           }
//                         }
//                       />

//                       <FormMessage />
//                     </FormItem>
//                   )
//                 }
//               />

//               <TextField
//                 name="seo.keywords"
//                 label="Keywords"
//               />

//               <div className="lg:col-span-2">
//                 <MetaSocialField metaSocial={seo?.meta_social} />
//               </div>

//               <TextField
//                 name="seo.metaRobots"
//                 label="Meta robots"
//               />

//               <TextAreaField
//                 name="seo.structuredData"
//                 label="Structured data"
//               />

//               <TextField
//                 name="seo.metaViewport"
//                 label="Meta viewport"
//               />

//               <TextField
//                 name="seo.canonicalURL"
//                 label="Canonical URL"
//               />
//             </div>
//           </FormItem>
//         )
//       }
//     />
//   )
// }

// function MetaSocialField({ metaSocial }: { metaSocial?: MetaSocial[] }) {
//   const { control } = useFormContext<{ seo: { meta_social: MetaSocialInput[] } }>()
//   const [
//     accordionValue,
//     setAccordionValue,
//   ] = useState<string>()
//   // cần để khi xóa không tự set lại accordion
//   const prevFieldsCount = useRef(0)

//   const {
//     fields, append, remove,
//   } = useFieldArray({
//     control,
//     name: "seo.meta_social",
//   })

//   useEffect(
//     () => {
//       if (fields.length > 0 && fields.length > prevFieldsCount.current) {
//         setAccordionValue(fields[fields.length - 1]?.id)
//         prevFieldsCount.current = fields.length
//       }
//       else {
//         prevFieldsCount.current = 0
//       }
//     }, [fields]
//   )

//   return (
//     <FormField
//       control={control}
//       name="seo.meta_social"
//       render={
//         () =>
//           (
//             <FormItem>
//               <FormLabel>Meta social</FormLabel>

//               {
//                 fields.length === 0
//                   ? (
//                     <Card
//                       onClick={
//                         () => {
//                           append({
//                             description: "",
//                             image: 0,
//                             title: "",
//                             type: "",
//                           })
//                         }
//                       }
//                       className="border shadow-none cursor-pointer"
//                     >
//                       <CardHeader className="items-center">
//                         <Button
//                           type="button"
//                           variant="secondary"
//                           size="icon"
//                         >
//                           <Plus />
//                         </Button>

//                         <CardDescription>
//                           Chưa có mục nào. Bấm vào nút để thêm mục.
//                         </CardDescription>
//                       </CardHeader>
//                     </Card>
//                   )
//                   : (
//                     <div>
//                       <Accordion
//                         type="single"
//                         collapsible
//                         value={accordionValue}
//                         onValueChange={setAccordionValue}
//                       >
//                         {
//                           fields.map((
//                             field, index
//                           ) => (
//                             <AccordionItem
//                               key={field.id}
//                               value={field.id}
//                               className="border-b data-[state=open]:pb-3 group/collapsible"
//                             >
//                               <div className="flex items-center gap-3 [&>h3]:grow">
//                                 <AccordionTrigger className="[&>svg]:hidden gap-3">
//                                   <span className={
//                                     cn(buttonVariants({
//                                       variant: "secondary",
//                                       size: "icon",
//                                       className: "size-7 transition-transform group-data-[state=open]/collapsible:-rotate-90",
//                                     }))
//                                   }
//                                   >
//                                     <ChevronDown />
//                                   </span>

//                                   <span className="grow">{field.title || `Mục - ${index + 1}`}</span>
//                                 </AccordionTrigger>

//                                 <Button
//                                   onClick={
//                                     (e) => {
//                                       e.stopPropagation()
//                                       remove(index)
//                                     }
//                                   }
//                                   type="button"
//                                   variant="link"
//                                   size="icon"
//                                   className="text-foreground hover:text-destructive"
//                                 >
//                                   <Trash2 />
//                                 </Button>
//                               </div>

//                               <AccordionContent className="grid lg:grid-cols-2 gap-6 px-1">
//                                 <FormField
//                                   control={control}
//                                   name={`seo.meta_social.${index}.type`}
//                                   render={
//                                     ({ field }) => (
//                                       <FormItem>
//                                         <FormLabel>Mạng xã hội</FormLabel>

//                                         <Combobox
//                                           mode="single"
//                                           value={field.value}
//                                           onValueChange={value => field.onChange(value)}
//                                           options={MetaSocialTypeOptions}
//                                         />

//                                         <FormMessage />
//                                       </FormItem>
//                                     )
//                                   }
//                                 />

//                                 <TextField
//                                   name={`seo.meta_social.${index}.title`}
//                                   label="Tiều đề"
//                                 />

//                                 <TextField
//                                   name={`seo.meta_social.${index}.description`}
//                                   label="Mô tả"
//                                 />

//                                 <FormField
//                                   control={control}
//                                   name={`seo.meta_social.${index}.image`}
//                                   render={
//                                     ({ field }) => (
//                                       <FormItem>
//                                         <FormLabel>Image</FormLabel>

//                                         <FileManagerSelect
//                                           uploadFilesProps={
//                                             {
//                                               mode: "single",
//                                               maxFiles: 1,
//                                               accept: {
//                                                 "image/*": [],
//                                               },
//                                             }
//                                           }
//                                           mode="single"
//                                           defaultFiles={
//                                             metaSocial?.[index]?.image
//                                             && metaSocial?.[index]?.image > 0
//                                               ? [
//                                                 {
//                                                   _id: metaSocial?.[index]?.image,
//                                                   url: metaSocial?.[index]?.image_link,
//                                                   name: metaSocial?.[index]?.title,
//                                                 } as FileManager,
//                                               ]
//                                               : undefined
//                                           }
//                                           onFilesChange={
//                                             (value) => {
//                                               if (value.length && value[0]) {
//                                                 field.onChange(value[0]?._id)
//                                               }
//                                             }
//                                           }
//                                         />

//                                         <FormMessage />
//                                       </FormItem>
//                                     )
//                                   }
//                                 />
//                               </AccordionContent>
//                             </AccordionItem>
//                           ))
//                         }
//                       </Accordion>

//                       <div className="text-center my-6">
//                         <Button
//                           onClick={
//                             () => {
//                               append({
//                                 description: "",
//                                 image: 0,
//                                 title: "",
//                                 type: "",
//                               })
//                             }
//                           }
//                           type="button"
//                           variant="secondary"
//                         >
//                           <Plus />
//                           Thêm mục
//                         </Button>
//                       </div>
//                     </div>
//                   )
//               }
//             </FormItem>
//           )
//       }
//     />
//   )
// }
