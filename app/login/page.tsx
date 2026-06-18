import { Suspense } from "react";
import { LoginForm } from "./components/login-form";

export const metadata = {
  title: "Login — CVG Dashboard",
  description: "Sign in to your CVG Dashboard",
};

export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-[100dvh] overflow-hidden">
      {/* Full-page background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/bgprocess.jpg')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#1E1E1E]/72" />

      {/* Subtle orange glow at bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#F68620]/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 py-12">
        {/* Logo */}
        <img
          src="/img/logo.png"
          alt="CVG"
          className="h-12 w-auto mb-10 drop-shadow-md"
        />

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-white/25 text-xs tracking-widest uppercase">
          CVG Construction
        </p>
      </div>
    </div>
  );
}
