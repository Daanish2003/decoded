import Link from 'next/link'
import React from 'react'

const EmailVerificationTemplate = (confirmLink: string) => {
  return (
    <p>Click <a href={confirmLink}>here</a> to confirm email.</p>
  )
}

export default EmailVerificationTemplate