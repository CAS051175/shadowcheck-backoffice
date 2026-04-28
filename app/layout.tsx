import './globals.css'
import Link from 'next/link'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es"><body className="bg-gray-50">
      <nav className="bg-white border-b px-6 py-3 flex gap-6">
        <Link href="/backoffice" className="font-bold text-lg">ShadowCheck</Link>
        <Link href="/backoffice/missions/new">+ Nueva Misión</Link>
      </nav>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </body></html>
  )
}
