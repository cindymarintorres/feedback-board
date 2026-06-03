import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { PageLoader } from '@/components/shared';

//guards
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { RoleGuard } from "@/components/guards/RoleGuard";

// Layouts
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages — importar cuando existan
// Lazy pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import('@/features/users/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const PasswordResetPage = lazy(() => import('@/features/auth/pages/PasswordResetPage').then(m => ({ default: m.PasswordResetPage })));
// const BoardPage = lazy(() => import('@/features/board/pages/BoardPage').then(m => ({ default: m.BoardPage })));
// const BoardPage = lazy(() => import('@/features/board/pages/AdminPage').then(m => ({ default: m.AdminPage })));


const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Públicas */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
        </Route>

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/board" replace />} />
            {/* <Route path="/board" element={<BoardPage />} /> */}
            <Route path="/board" element={<div>Aqui va el board page</div>} />
            <Route path="settings/profile" element={<ProfilePage/>} />

            {/* Solo ADMIN */}
            <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
              {/* <Route path="/admin" element={<AdminPage />} /> */}
              <Route path="/admin" element={<div>Aqui va el admin page</div>} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
