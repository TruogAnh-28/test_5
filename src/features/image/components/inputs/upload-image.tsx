import {
  useState, useRef,
} from "react"

import Image from "next/image"

import {
  useFormContext,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  uploadImage,
} from "~/features/image/api/image"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Input,
} from "~/shared/components/ui/input"

type UploadImageProps = {
  fieldName: string
  value: string
  onValueChange?: (value: string) => void
}

export function UploadImage({
  fieldName, value, onValueChange,
}: UploadImageProps) {
  const {
    resetField, formState,
  } = useFormContext()
  const [
    preview,
    setPreview,
  ] = useState<string | null>(null)
  const [
    isLoading,
    setIsLoading,
  ] = useState<boolean>(false)

  // const imageFile = watch(name);
  const fileImageInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setIsLoading(true)
    try {
      if (file) {
        const response = await uploadImage(file)
        toast.success(response.message)
        onValueChange?.(response.data.link)
        // setValue(name, file);
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result as string)
        reader.readAsDataURL(file)
      }
    }
    catch (err) {
      toast.error((err as Error).message || "Upload thất bại")
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">

      <Input
        ref={fileImageInputRef}
        id={fieldName}
        type="file"
        accept="image/*"
        className="opacity-0"
        onChange={handleImageChange}
      />

      {
        isLoading ? <Loading />
          : preview
            ? (
              <div className="relative size-96 mx-auto">
                <Image
                  src={preview}
                  alt="Preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            )
            : value
              ? (
                <div className="relative size-96 mx-auto">
                  <Image
                    src={value}
                    alt="Preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )
              : (
                <div
                  className="relative size-96 border-gray-300 text-gray-600 border-4 rounded-lg flex flex-row justify-center items-center mx-auto cursor-pointer"
                  onClick={() => fileImageInputRef.current?.click()}
                >
                  Chưa chọn ảnh
                </div>
              )
      }

      {
        formState.dirtyFields[fieldName] || isLoading
          ? (
            <Button
              type="button"
              onClick={
                () => {
                  setPreview(null)
                  resetField(fieldName)
                  if (fileImageInputRef.current) {
                    fileImageInputRef.current.value = ""
                  }
                }
              }
              variant="outline"
            >
              Xóa
            </Button>
          )
          : null
      }

      {
        value
          ? (
            <Button
              className="bg-primary"
              onClick={() => fileImageInputRef.current?.click()}
            >
              Tải ảnh khác
            </Button>
          )
          : null
      }
    </div>
  )
}
