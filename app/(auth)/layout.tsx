import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-1 justify-center items-center min-h-screen py-10'>
      {children}
    </div>
  )
}

export default Layout