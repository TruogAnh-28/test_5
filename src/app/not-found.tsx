"use client"

import React from "react"

import Image from "next/image"
import Link from "next/link"

import ErrorImg from "/public/images/backgrounds/errorimg.svg"

import {
  Button,
} from "~/shared/components/ui/button"

export default function NotFound() {
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
          This page you are looking for could not be found.
        </h6>

        <Button
          asChild
          color="primary"
          className="w-fit mt-6 mx-auto"
        >
          <Link
            href="/"
          >
            Go Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
