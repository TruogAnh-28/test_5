"use client"

import React, {
  useState, useRef,
} from "react"

import {
  useSession,
} from "next-auth/react"
import {
  toast,
} from "sonner"

// import {
//   updateAvatar,
// } from "~/features/employee/api/employee"
import {
  uploadImage,
} from "~/features/image/api/image"
import {
  ImageView,
} from "~/shared/components/shared/image"
import {
  Loading,
} from "~/shared/components/shared/loading"
// import {
//   Button,
// } from "~/shared/components/ui/button"
import {
  Input,
} from "~/shared/components/ui/input"

export function ProfileAvatarForm() {
  const { data: session } = useSession()

  const fileImageInputRef = useRef<HTMLInputElement | null>(null)
  const [
    avatarUrl,
    setAvatarUrl,
  ] = useState(session?.user.image_link)

  const [
    isLoading,
    setIsLoading,
  ] = useState(false)
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setIsLoading(true)
    try {
      if (file) {
        const response = await uploadImage(file)
        toast.success(response.message)
        setAvatarUrl(response.data.link)
        // setValue(name, file);
        // const reader = new FileReader();
        // reader.onloadend = () => setPreview(reader.result as string);
        // reader.readAsDataURL(file);
      }
    }
    catch (err) {
      toast.error((err as Error).message || "Upload thất bại")
    }
    finally {
      setIsLoading(false)
    }
  }
  // const handleUpdateAvatar = async () => {
  //   setIsLoading(true)
  //   try {
  //     const response = await updateAvatar({
  //       image_link: avatarUrl,
  //     })
  //     toast.success(response.message)
  //     updateSession({
  //       user: {
  //         ...session?.user,
  //         image_link: avatarUrl,
  //       },

  //     })
  //   }
  //   catch (err) {
  //     toast.error((err as Error).message || "Lỗi upload")
  //   }
  //   finally {
  //     setIsLoading(false)
  //   }
  // }
  return (
    <div
      className="h-full grid place-content-center gap-6"
    >
      <div className="flex flex-col gap-6 items-center">

        <div
          className="rounded-full size-32 overflow-hidden"
        >

          {
            isLoading
              ? <Loading />
              : (
                <ImageView
                  src={avatarUrl || "/images/logo/logo.png"}
                  isAvatar
                  alt="logo"
                  height="300"
                  width="300"
                  className="size-full object-cover"
                />
              )
          }

        </div>

        {/* <div className="space-x-4">

          <Button onClick={() => fileImageInputRef.current?.click()}>
            Tải ảnh mới
          </Button>

          {
            avatarUrl !== session?.user?.image_link
            && (
              <React.Fragment>
                <Button
                  className="bg-error"
                  disabled={isLoading}
                  onClick={() => setAvatarUrl(session?.user?.image_link)}
                >
                  Xóa
                </Button>

                <Button
                  className="bg-success"
                  disabled={isLoading}
                  onClick={() => handleUpdateAvatar()}
                >
                  Lưu
                </Button>

              </React.Fragment>
            )
          }

        </div> */}

        <Input
          ref={fileImageInputRef}
          type="file"
          accept="image/*"
          className="opacity-0 size-px"
          onChange={handleImageChange}
        />

        <p className="text-muted-foreground">Các file ảnh JPG or PNG. Kích thước tối đa 800KB</p>
      </div>
    </div>
  )
}
