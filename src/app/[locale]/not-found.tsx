"use client"

import React from "react"

import Image from "next/image"
import Link from "next/link"

import {
  useTranslations,
} from "next-intl"

import ErrorImg from "/public/images/backgrounds/errorimg.svg"

import {
  Button,
} from "~/shared/components/ui/button"

export default function LocalizedNotFound() {
  // Since this is a client component, we can safely use next-intl here
  // Make sure you have the appropriate translations in your locales files
  const t = useTranslations("common")

  return (
    <div
      className="h-svh bg-background container mx-auto p-4 md:p-8 grid place-content-center"
    >
      <div
        className="text-center"
      >
        <Image
          src={ErrorImg}
          alt="error"
          className="mb-4"
        />

        <h1
          className="text-ld text-4xl mb-6"
        >
          Opps!!!
        </h1>

        <h6
          className="text-xl text-ld"
        >
          {
            t("notFound",)
          }
        </h6>

        <Button
          asChild
          color="primary"
          className="w-fit mt-6 mx-auto"
        >
          <Link
            href="/"
          >
            {
              t("backToHome",)
            }
          </Link>
        </Button>
      </div>
    </div>
  )
}
