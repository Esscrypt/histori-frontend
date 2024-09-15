import React from 'react'

function SocialLogin() {
  return (
    <div className="space-y-3">
    <button className="btn-sm p-0 text-white bg-rose-500 hover:bg-rose-600 w-full relative flex items-stretch">
      <div className="flex items-center bg-rose-600 mr-4">
        <svg className="w-4 h-4 fill-current text-rose-100 shrink-0 mx-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
        </svg>
      </div>
      <span className="flex-auto text-rose-50 text-sm py-2 pl-14 pr-8 -ml-14">Login with Google</span>
    </button>
    <button className="btn-sm p-0 text-white bg-blue-600 hover:bg-blue-700 w-full relative flex items-stretch">
      <div className="flex items-center bg-blue-700 mr-4">
        <svg className="w-4 h-4 fill-current text-blue-100 shrink-0 mx-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.023 16 6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023Z" />
        </svg>
      </div>
      <span className="flex-auto text-blue-50 text-sm py-2 pl-14 pr-8 -ml-14">Login with Facebook</span>
    </button>
  </div>
  )
}

export default SocialLogin
