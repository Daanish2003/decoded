import Link from 'next/link'
import React from 'react'

const passwordResetTemplate = (resetLink: string) => {
  return (
    <p>Click <a href={resetLink}>here</a> to reset password.</p>
  )
}

export default passwordResetTemplate