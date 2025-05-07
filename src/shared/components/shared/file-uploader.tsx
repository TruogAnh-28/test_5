/* eslint-disable no-restricted-syntax */
"use client"

import {
  type ChangeEvent,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react"

import {
  FileTextIcon,
} from "@radix-ui/react-icons"
import {
  Slot,
} from "@radix-ui/react-slot"
import {
  useDropzone,
  type DropzoneOptions,
  type DropzoneState,
  type FileRejection,
} from "react-dropzone"
import {
  toast,
} from "sonner"

import {
  useControllableState,
} from "~/shared/hooks/state/use-controllable-state"

import {
  chain,
} from "~/shared/utils/chain"

import {
  ImageView,
} from "~/shared/components/shared/image"
import {
  cn,
} from "~/shared/utils"

export interface FileUploaderProps extends DropzoneOptions {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example defaultValue={files}
   */
  defaultValue?: File[]

  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[]

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: (files: File[]) => void

  children: ReactNode

  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

interface FileUploaderContextValue extends DropzoneState {
  files: File[]
  maxFiles: number
  maxSize: number
  setFiles: (files: File[]) => void
  onDelete: (index: number) => void
  disabled: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const FileUploaderContext = createContext<FileUploaderContextValue | null>(null)

function useFileUploader() {
  const context = useContext(FileUploaderContext)
  if (!context) {
    throw new Error("useFileUploader must be used within a FileUploader")
  }
  return context
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string"
}

const FileUploader = ({
  defaultValue,
  value: valueProp,
  onValueChange,
  children,
  accept = {
    "image/*": [],
  },
  maxSize = 1024 * 1024 * 4, // 4MB
  maxFiles = 1,
  multiple = false,
  disabled = false,
  onChange,
  ...props
}: FileUploaderProps) => {
  const [
    files,
    setFiles,
  ] = useControllableState({
    defaultProp: defaultValue,
    prop: valueProp,
    onChange: onValueChange,
  })

  const onDrop = useCallback(
    (
      acceptedFiles: File[], rejectedFiles: FileRejection[]
    ) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error("Cannot upload more than 1 file at a time")
        return
      }

      if (
        ((files?.length ?? 0) + acceptedFiles.length > maxFiles)
        || rejectedFiles.length > maxFiles
      ) {
        toast.error(`Cannot upload more than ${maxFiles} files`)
        return
      }

      if (acceptedFiles.length > 0) {
        const newFiles = acceptedFiles.map(file =>
          Object.assign(
            file, {
              preview: URL.createObjectURL(file),
            }
          ),)

        const updatedFiles = files ? [
          ...files,
          ...newFiles,
        ] : newFiles

        setFiles(updatedFiles)
      }

      if (rejectedFiles.length > 0) {
        const names = rejectedFiles.map(({ file }) => file.name).join(", ")

        toast.error(`File(s): ${names} was rejected`)
      }
    },

    [
      files,
      maxFiles,
      multiple,
      setFiles,
    ],
  )

  const onDelete = useCallback(
    (index: number) => {
      if (!files) return
      const newFiles = files.filter((
        _, i
      ) => i !== index)
      setFiles(newFiles)
    }, [files]
  )

  // Revoke preview url when component unmounts
  useEffect(
    () => {
      return () => {
        if (!files) return
        files.forEach((file) => {
          if (isFileWithPreview(file)) {
            URL.revokeObjectURL(file.preview)
          }
        })
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []
  )

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles

  const dropzone = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple,
    disabled: isDisabled,
    ...props,
  })

  return (
    <FileUploaderContext.Provider
      value={
        {
          files: files ?? [],
          maxFiles,
          maxSize,
          setFiles,
          onDelete,
          disabled: isDisabled,
          onChange,
          ...dropzone,
        }
      }
    >
      {children}
    </FileUploaderContext.Provider>
  )
}

interface FileUploaderTriggerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode | ((props: FileUploaderContextValue) => ReactNode)
}

const FileUploaderTrigger = forwardRef<
  HTMLDivElement,
  FileUploaderTriggerProps
>((
  {
    children, ...props
  }, ref
) => {
  const fileUploader = useFileUploader()

  return (
    <div
      ref={ref}
      data-state={
        fileUploader.isDragActive
          ? "active"
          : fileUploader.isDragAccept
            ? "accept"
            : fileUploader.isDragReject
              ? "reject"
              : undefined
      }
      data-disabled={fileUploader.disabled ? "" : undefined}
      {...props}
      {...fileUploader.getRootProps()}
    >
      <input
        {...fileUploader.getInputProps()}
        onChange={
          chain(
            fileUploader.onChange, fileUploader.getInputProps().onChange
          )
        }
      />

      {children instanceof Function ? children(fileUploader) : children}
    </div>
  )
})
FileUploaderTrigger.displayName = "FileUploaderTrigger"

interface FileUploaderContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode | ((props: FileUploaderContextValue) => ReactNode)
}

const FileUploaderContent = forwardRef<
  HTMLDivElement,
  FileUploaderContentProps
>((
  {
    children, ...props
  }, ref
) => {
  const fileUploader = useFileUploader()

  return (
    <div
      ref={ref}
      {...props}
    >
      {children instanceof Function ? children(fileUploader) : children}
    </div>
  )
})
FileUploaderContent.displayName = "FileUploaderContent"

interface FileUploaderItemContextValue {
  file: File
  index: number
}

const FileUploaderItemContext
  = createContext<FileUploaderItemContextValue | null>(null)

function useFileUploaderItem() {
  const context = useContext(FileUploaderItemContext)
  if (!context) {
    throw new Error("useFileUploaderItem must be used within a FileUploaderItem",)
  }
  return context
}

interface FileUploaderItemProps extends HTMLAttributes<HTMLDivElement> {
  file: File
  index: number
  asChild?: boolean
}

const FileUploaderItem = forwardRef<HTMLDivElement, FileUploaderItemProps>((
  {
    file, index, asChild, ...props
  }, ref
) => {
  const Comp = asChild ? Slot : "div"

  return (
    <FileUploaderItemContext.Provider
      value={
        {
          file,
          index,
        }
      }
    >
      <Comp
        ref={ref}
        {...props}
      />
    </FileUploaderItemContext.Provider>
  )
},)
FileUploaderItem.displayName = "FileUploaderItem"

const FileUploaderPreview = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((
  {
    className, ...props
  }, ref
) => {
  const { file } = useFileUploaderItem()

  return (
    <div
      ref={ref}
      className={
        cn(
          "grid place-content-center", className
        )
      }
      {...props}
    >
      {
        isFileWithPreview(file) && file.type.startsWith("image/") ? (
          <ImageView
            src={file.preview}
            alt={file.name}
            width={0}
            height={0}
            loading="lazy"
            className="w-full h-auto object-cover"
          />
        ) : (
          <FileTextIcon
            className="size-10 text-muted-foreground"
            aria-hidden="true"
          />
        )
      }
    </div>
  )
})
FileUploaderPreview.displayName = "FileUploaderPreview"

const FileUploaderDelete = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>((
  {
    onClick, asChild, className, ...props
  }, ref
) => {
  const { index } = useFileUploaderItem()
  const { onDelete } = useFileUploader()

  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      onClick={
        chain(
          onClick, (e) => {
            e.stopPropagation()
            onDelete(index)
          }
        )
      }
      ref={ref}
      title="Delete"
      type="button"
      className={
        cn(
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm", className
        )
      }
      {...props}
    />
  )
},)
FileUploaderDelete.displayName = "FileUploaderDelete"

export {
  FileUploader,
  FileUploaderTrigger,
  FileUploaderContent,
  FileUploaderItem,
  FileUploaderPreview,
  FileUploaderDelete,
}
