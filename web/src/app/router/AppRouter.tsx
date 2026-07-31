import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import { PageLoader } from "@/components/shared";

//guards
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { RoleGuard } from "../guards/RoleGuard";

// Layouts
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages — importar cuando existan
// Lazy pages

const GettingStartedPage = lazy(() =>
  import("@/features/GettingStartedPage").then((m) => ({
    default: m.GettingStartedPage,
  })),
);

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  })),
);
const ProfilePage = lazy(() =>
  import("@/features/users/pages/ProfilePage").then((m) => ({
    default: m.ProfilePage,
  })),
);
const ForgotPassword = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const PasswordResetPage = lazy(() =>
  import("@/features/auth/pages/PasswordResetPage").then((m) => ({
    default: m.PasswordResetPage,
  })),
);
// const BoardPage = lazy(() => import('@/features/board/pages/BoardPage').then(m => ({ default: m.BoardPage })));
const RegisterCommercePage = lazy(() =>
  import("@/features/commerces/pages/RegisterCommercePage").then((m) => ({
    default: m.RegisterCommercePage,
  })),
);
const CommerceVerifyPage = lazy(() =>
  import("@/features/commerces/pages/CommerceVerifyPage").then((m) => ({
    default: m.CommerceVerifyPage,
  })),
);

const FeedbackPage = lazy(() =>
  import("@/features/reviews/pages/FeedbackPage").then((m) => ({
    default: m.FeedbackPage,
  })),
);

const RatingsPage = lazy(() =>
  import("@/features/reviews/pages/RatingsPage").then((m) => ({
    default: m.RatingsPage,
  })),
);

const CommercesPage = lazy(() =>
  import("@/features/commerces/pages/CommercesPage").then((m) => ({
    default: m.CommercesPage,
  })),
);

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Públicas */}
      <Route element={<AuthLayout />}>
        <Route path="/getting-started" element={<GettingStartedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/member/register" element={<RegisterPage />} />
        <Route path="/commerce/register" element={<RegisterCommercePage />} />
        <Route path="/commerce/verify" element={<CommerceVerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
      </Route>

      {/* Pública, con lógica de auth propia */}
      <Route path="/feedback/:slug" element={<FeedbackPage />} />

      {/* Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/board" replace />} />
          <Route path="/board" element={<div>Aqui va el board page</div>} />
          <Route path="settings/profile" element={<ProfilePage />} />

          {/* Todos los roles autenticados — cada uno ve sus propios datos */}
          <Route path="/ratings" element={<RatingsPage />} />
          {/* COMMERCE_ADMIN y ADMIN */}
          <Route
            element={<RoleGuard allowedRoles={["ADMIN", "COMMERCE_ADMIN"]} />}
          >
            <Route path="/commerces" element={<CommercesPage />} />
          </Route>

          {/* Solo ADMIN */}
          <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
            <Route path="/users" element={<div>Aqui va Users</div>} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
