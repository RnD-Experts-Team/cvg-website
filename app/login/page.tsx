import { Suspense } from "react";
import { LoginForm } from "./components/login-form";

export const metadata = {
  title: "Login — CVG Dashboard",
  description: "Sign in to your CVG Dashboard dashboard",
};

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}