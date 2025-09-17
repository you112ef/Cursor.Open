import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to dashboard for better UX
  redirect('/dashboard')
}