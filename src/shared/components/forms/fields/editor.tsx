/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import React, {
  useRef, useState, useMemo, useCallback,
} from "react"

import ReactQuill from "react-quill"

import "react-quill/dist/quill.snow.css"
import {
  uploadImage,
} from "~/features/image/api/image"
// import { Tabs, TabsContent, TabsTrigger, TabsContent, TabsList} from "~/shared/components/ui/tabs"

interface EditorProps {
  defaultValue?: string
  onChange: (value: string) => void
}

const Editor = ({
  defaultValue, onChange,
}: EditorProps) => {
  const [
    value,
    setValue,
  ] = useState(defaultValue ?? "")
  const quillRef = useRef<ReactQuill | null>(null) // Quill reference
  const fileInputRef = useRef<HTMLInputElement | null>(null) // File input reference

  // Handle image upload
  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        const response = await uploadImage(file) // Upload image to server
        const imageUrl = response.data.link // Get the image URL

        const quill = quillRef.current?.getEditor() // Get the Quill editor instance

        if (quill) {
          const range = quill.getSelection() // Get the cursor position
          if (range && typeof range.index === "number") {
            quill.insertEmbed(
              range.index, "image", imageUrl
            ) // Insert image at cursor
          }
          else {
            // console.error("Invalid range or selection.")
          }
        }
      }
      catch (error) {
        console.error(
          "Error uploading image:", error
        )
      }
    }, []
  )

  // Handle change in editor
  const handleChange = (newValue: string) => {
    setValue(newValue)
    onChange(newValue)
  }

  // Modules for the Quill editor with image handler
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [
            {
              header: [
                1,
                2,
                false,
              ],
            },
          ],
          [
            {
              align: [],
            },
          ],
          [
            "bold",
            "italic",
            "underline",
          ],
          ["image"],
        ],
        handlers: {
          image: () => {
          // Trigger the file input manually without using document.createElement
            if (fileInputRef.current) {
              fileInputRef.current.click()
            }
          },
        },
      },
    }), []
  )
  React.useEffect(
    () => {
      if (defaultValue) {
        setValue(defaultValue)
      }
    }, [defaultValue]
  )

  return (

    <div className="h-96">
      <ReactQuill
        ref={quillRef}
        value={value}
        className="h-80"
        theme="snow"
        id="quill"
        onChange={handleChange}
        modules={modules}
        formats={
          [
            "header",
            "bold",
            "italic",
            "underline",
            "image",
          ]
        }
      />

      {/* Hidden file input for image upload */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={
          {
            display: "none",
          }
        } // Hide file input
        onChange={
          (e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleImageUpload(file) // Upload image when selected
            }
          }
        }
      />
    </div>

  )
}

export {
  Editor,
}
