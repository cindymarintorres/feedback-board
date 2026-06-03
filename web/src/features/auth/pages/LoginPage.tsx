import { Link } from 'react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginPage() {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex flex-row gap-4 justify-center mb-2 items-center">
          <div className="rounded-lg p-2 flex items-center justify-center text-primary-foreground font-bold text-lg">
            <img src="/public/feedback-loop.png" alt="Logo"  className='w-15 h-15'/>
          </div>
          <CardTitle className="text-xl md:text-2xl text-primary">Feedback Board</CardTitle>
        </div>
        
        <CardDescription className='font-semibold text-xl'>Inicia sesión en tu cuenta</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
        <div className='text-center p-3 font-medium'>
          <p className="text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
        </div>
      </CardContent>
    </Card>
  )
}
