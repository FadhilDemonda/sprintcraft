import React from 'react'

export const BrandLogo = ({ className = 'w-8 h-8' }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M28.5 10C19.9396 10 13 16.7157 13 25C13 33.2843 19.9396 40 28.5 40C37.0604 40 43 32.5 50 25C57 17.5 62.9396 10 71.5 10C80.0604 10 87 16.7157 87 25C87 33.2843 80.0604 40 71.5 40C62.9396 40 57 32.5 50 25C43 17.5 37.0604 10 28.5 10Z" 
        stroke="currentColor" 
        strokeWidth="14" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}
