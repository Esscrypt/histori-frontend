export const metadata = {
  title: 'About - Tidy',
  description: 'Page description',
}

import Hero from '@/components/hero/hero-about'
import Stats from '@/components/stats-02'
import Content from './content'
import Team from '@/components/staff/team'
import TeamMembers from '@/components/staff/team-members'
import Clients from '@/components/clients/clients'
import Cta from '@/components/cta/cta'


export default function About() {
  return (
    <>
      <Hero />
      <Stats />
      <Content />
      <Team />
      <TeamMembers />
      <Clients />
      <Cta />
    </>
  )
}
