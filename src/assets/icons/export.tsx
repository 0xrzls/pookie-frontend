import React from 'react'

function Icon({ size = '24' }: { size?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13 11l8.2-8.2M22 6.8V2h-4.8M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2"
      ></path>
    </svg>
  )
}

export default Icon
