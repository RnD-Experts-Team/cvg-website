import type { Metadata } from "next"
import { Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { LoginForm } from "./components/login-form"

export const metadata: Metadata = {
  title: "Login — First Team Trucking",
  description: "Sign in to your First Team Trucking dashboard",
}

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // const cookieStore = await cookies()
  // const isAuthenticated = cookieStore.get("ftt_session")?.value === "1"
  // const params = await searchParams

  // if (isAuthenticated) {
  //   redirect(params.next || "/dashboard")
  // }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <span className="text-lg font-semibold">First Team Trucking</span>
        </a>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
