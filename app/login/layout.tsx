import "@/app/dashboard/dashboard.css"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="login-wrapper">
      {children}
    </div>
  )
}
