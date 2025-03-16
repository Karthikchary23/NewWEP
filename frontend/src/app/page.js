"use client"
import React from 'react'
import Link from 'next/link'

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-2xl w-96 max-w-md">
        <h2 className="text-3xl mb-6 text-center text-white font-semibold">Welcome</h2>
        
        <div className="flex gap-4">
          <Link href="/serviceprovider/signin" className="flex-1">
            <button className="w-full py-3 border-2 border-blue-400 text-white rounded-lg font-medium transition duration-300 hover:bg-blue-400 hover:text-gray-900 cursor-pointer">
            Employee
            </button>
          </Link>
          <Link href="/customer/signin" className="flex-1">
            <button className="w-full py-3 border-2 border-blue-400 text-white rounded-lg font-medium transition duration-300 hover:bg-blue-400 hover:text-gray-900 cursor-pointer">
            Customer
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
