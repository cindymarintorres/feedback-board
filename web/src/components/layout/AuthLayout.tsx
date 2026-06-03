import { Outlet } from 'react-router'
import { ThemeToggle } from '@/components/shared'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header mínimo solo con el toggle */}
      <header className="flex justify-end p-4">
        <ThemeToggle />
      </header>

      {/* Contenido centrado */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

    </div>
  )
}