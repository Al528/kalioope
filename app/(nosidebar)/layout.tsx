import { ProtectedRoute } from "@/components/protected-route"


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 justify-center items-center min-h-screen py-10">
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </div>
  )
}

export default Layout