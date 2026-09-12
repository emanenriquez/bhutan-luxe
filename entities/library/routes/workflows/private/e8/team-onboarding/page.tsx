import { gatedMetadata, gatedPage } from '../../gate'
import { Inter } from 'next/font/google'
import TeamOnboardingDeck from './TeamOnboardingDeck'

const inter = Inter({ subsets: ['latin'] })

export const generateMetadata = gatedMetadata({
  title: 'Edge8 AI · Team Onboarding',
  description: 'Onboarding deck for new Edge8 AI team members.',
  robots: { index: false, follow: false },
})

export default gatedPage(function TeamOnboardingPage() {
  return <TeamOnboardingDeck fontClassName={inter.className} />
})
