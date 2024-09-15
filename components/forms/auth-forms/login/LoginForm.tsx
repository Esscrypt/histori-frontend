import Link from 'next/link'
import React from 'react'

const Login = () => {
  return (
    <form>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">Email <span className="text-rose-500">*</span></label>
        <input id="email" className="form-input py-2 w-full" type="email" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="password">Password <span className="text-rose-500">*</span></label>
        <input id="password" className="form-input py-2 w-full" type="password" autoComplete="on" required />
      </div>
    </div>
    <div className="mt-6">
      <button className="btn-sm w-full text-sm text-white bg-blue-600 hover:bg-blue-700 group">
        Sign In <span className="tracking-normal text-blue-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
      </button>
    </div>
    <div className="text-center mt-5">
      <Link className="text-blue-600 hover:underline" href="/reset-password">Forgot your password?</Link>
    </div>
  </form>
  )
}

export default Login
