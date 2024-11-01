import React from 'react'

const TwoFactorEmailTemplate = (token: string) => {
  return (
    <p>Your 2FA code: ${token}</p>
  )
}

export default TwoFactorEmailTemplate