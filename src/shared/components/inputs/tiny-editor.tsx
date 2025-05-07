// /* eslint-disable react/destructuring-assignment */
// "use client"

// import React from "react"

// import {
//   Editor, type IAllProps,
// } from "@tinymce/tinymce-react"
// import {
//   CircleFadingPlus,
// } from "lucide-react"
// import {
//   useTheme,
// } from "next-themes"

// import {
//   FileManagerContent,
// } from "~/features/file-manager/components/dialogs/file-manager-content"
// import {
//   SheetContainer,
//   showSheet,
// } from "~/shared/components/dialogs/sheet-container"
// import {
//   Button,
// } from "~/shared/components/ui/button"

// export const TinyEditor = (props: IAllProps) => {
//   const editorRef = React.useRef<Editor | null>(null)
//   const { theme } = useTheme()
//   const id = React.useId()

//   return (
//     <div className="space-y-3">
//       <Button
//         onClick={() => showSheet(`show-file-manager-tiny-editor-${id}`)}
//         type="button"
//         variant="secondary"
//       >
//         <CircleFadingPlus />
//         Chọn ảnh
//       </Button>

//       <SheetContainer accessorKey={`show-file-manager-tiny-editor-${id}`}>
//         {
//           ({ onClose }) => (
//             <FileManagerContent
//               uploadFilesProps={
//                 {
//                   maxFiles: 1,
//                   accept: {
//                     "image/*": [],
//                   },
//                   mode: "single",
//                 }
//               }
//               mode="single"
//               onConfirm={
//                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                 (files: any) => {
//                   if (editorRef.current?.editor && files.length > 0) {
//                     editorRef.current?.editor?.insertContent(`<figure class="image">
// <img src="${files[0]?.url || files[0]?.location || ""}" alt="${files[0]?.name || files[0]?.originalname || ""}" height="200" style="object-fit: contain;" />
// </figure>`)
//                     editorRef?.current?.editor.editorUpload.uploadImagesAuto()
//                   }
//                   onClose()
//                 }
//               }
//             />
//           )
//         }
//       </SheetContainer>

//       <Editor
//         scriptLoading={
//           {
//             async: true,
//           }
//         }
//         ref={editorRef}
//         {...props}
//         tinymceScriptSrc="/tinymce/tinymce.min.js"
//         licenseKey="gpl"
//         init={
//           {
//             language_url: "/tinymce-langs/vi.js",
//             language: "vi",
//             min_height: 500,
//             plugins:
//       "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap emoticons accordion",
//             editimage_cors_hosts: ["picsum.photos"],
//             menubar: "file edit view insert format tools table help",
//             toolbar:
//       "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link mediaLibrary image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
//             promotion: false,
//             autosave_ask_before_unload: true,
//             autosave_interval: "30s",
//             autosave_restore_when_empty: false,
//             autosave_retention: "2m",
//             image_advtab: true,
//             image_caption: true,
//             noneditable_class: "mceNonEditable",
//             toolbar_mode: "sliding",
//             contextmenu: "link image table",
//             font_size_input_default_unit: "px",
//             font_size_formats: "8px 10px 12px 14px 16px 18px 24px 36px 48px",
//             ui_mode: "split",
//             setup(editor) {
//               editor.ui.registry.addButton(
//                 "mediaLibrary", {
//                   icon: "gallery",
//                   onAction: () => showSheet("show-file-manager-tiny-editor"),
//                 }
//               )
//             },
//             // Cập nhật đường dẫn skin và CSS
//             // skin_url: "/tinymce/skins/ui/oxide",
//             // content_css: "/tinymce/skins/ui/oxide/content.min.css",
//             skin: (theme === "dark" ? "oxide-dark" : undefined),
//             content_css: (theme === "dark" ? "dark" : undefined),
//             ...props.init,
//           }
//         }
//       />
//     </div>
//   )
// }
