'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function Logo() {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return null
  }

  return (
    <Image
      src="/configs/Images/logo.png"
      alt="Logo"
      width={200}
      height={200}
      className="object-contain"
      onError={(e) => {
        console.error('Logo failed to load:', e)
        setImageError(true)
      }}
      unoptimized
      priority
    />
  )
}
