import { useEffect } from 'react'
import { LangProvider, useLang, ui } from './i18n'
import Header from './components/Header'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'

function Page() {
  const { t } = useLang()
  useEffect(() => {
    document.body.classList.add('pf-body')
    return () => document.body.classList.remove('pf-body')
  }, [])
  return (
    <div className="pf">
      <a className="skip" href="#conteudo">{t(ui.skip)}</a>
      <Header />
      <main id="conteudo">
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default function SiteApp() {
  return <LangProvider><Page /></LangProvider>
}
