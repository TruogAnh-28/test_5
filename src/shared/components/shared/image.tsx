/* eslint-disable jsx-a11y/alt-text */
"use client"

import React from "react"

import Image, {
  type StaticImageData,
  type ImageProps,
} from "next/image"

// import {
//   getConfigs,
// } from "~/shared/hooks/data/use-config"

export interface ImageViewProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | false
  defaultSrc?: string
  isAvatar?: boolean
}

export const ImageView = React.memo(({
  src, defaultSrc: defaultSrcProp, isAvatar, ...props
}: ImageViewProps) => {
  // const configsRef = useLazyRef(getConfigs)

  const defaultSrc = defaultSrcProp
    ? defaultSrcProp
    : isAvatar
      ? "/images/profile/user-1.jpg"
      : "/images/default-image.jpg"
  return (
    <Image
      src={src ? src : defaultSrc}
      {...props}
    />
  )
})
ImageView.displayName = "ImageView"
