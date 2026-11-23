import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const LangContext = createContext({ lang: 'pt', setLang: () => {}, t: (v) => v })

const UI = {
  nav: {
    about: { pt: 'Sobre mim', en: 'About' },
    projects: { pt: 'Projetos', en: 'Projects' },
    experience: { pt: 'Experiências', en: 'Experience' },
    contact: { pt: 'Contato', en: 'Contact' },
  },
  skip: { pt: 'Ir para o conteúdo', en: 'Skip to content' },
  menu: { pt: 'Menu', en: 'Menu' },
  hello: { pt: 'Olá, eu sou', en: "Hi, I'm" },
  seeProjects: { pt: 'Ver projetos', en: 'View projects' },
  downloadCv: { pt: 'Baixar currículo', en: 'Download résumé' },
  talk: { pt: 'Vamos conversar', en: "Let's talk" },
  about: {
    title: { pt: 'Sobre mim', en: 'About me' },
    eyebrow: { pt: 'Quem sou eu', en: 'Who I am' },
    interests: { pt: 'Interesses', en: 'Interests' },
    objective: { pt: 'Objetivo profissional', en: 'Career goal' },
    education: { pt: 'Formação', en: 'Education' },
    skills: { pt: 'Competências técnicas', en: 'Technical skills' },
    skillsNote: { pt: 'Níveis autoavaliados.', en: 'Self-assessed levels.' },
    tools: { pt: 'Ferramentas', en: 'Tools' },
    soft: { pt: 'Competências comportamentais', en: 'Soft skills' },
    languages: { pt: 'Idiomas', en: 'Languages' },
  },
  projects: {
    title: { pt: 'Projetos', en: 'Projects' },
    eyebrow: { pt: 'Linha do tempo', en: 'Timeline' },
    intro: {
      pt: 'Do mais antigo ao mais recente. Os repositórios públicos do meu GitHub aparecem aqui automaticamente.',
      en: 'From oldest to newest. My public GitHub repositories show up here automatically.',
    },
    tech: { pt: 'Tecnologias', en: 'Technologies' },
    repo: { pt: 'Ver no GitHub', en: 'View on GitHub' },
    live: { pt: 'Ver online', en: 'Live demo' },
    loading: { pt: 'Carregando repositórios do GitHub…', en: 'Loading GitHub repositories…' },
    error: {
      pt: 'Não consegui carregar os repositórios agora (limite da API do GitHub). Veja todos direto no perfil.',
      en: "Couldn't load repositories right now (GitHub API limit). See them all on my profile.",
    },
    all: { pt: 'Ver todos os repositórios', en: 'See all repositories' },
    noImage: { pt: 'Prévia do repositório', en: 'Repository preview' },
  },
  experience: {
    title: { pt: 'Experiências', en: 'Experience' },
    eyebrow: { pt: 'Trajetória', en: 'Journey' },
    intro: {
      pt: 'Ainda não tenho experiência profissional em empresas. Aqui estão minha formação, o aprendizado prático e o que venho construindo até agora.',
      en: "I don't have professional work experience yet. Here are my education, hands-on learning and what I've been building so far.",
    },
    open: {
      pt: 'Em busca da primeira oportunidade em desenvolvimento de software. Estágio, projeto ou colaboração open source: vamos conversar!',
      en: "Looking for my first opportunity in software development. Internship, project or open source collaboration: let's talk!",
    },
  },
  contact: {
    title: { pt: 'Contato', en: 'Contact' },
    eyebrow: { pt: 'Vamos conversar', en: "Let's talk" },
    intro: {
      pt: 'Quer conversar sobre uma oportunidade, projeto ou só trocar uma ideia? Me chame por qualquer canal ou use o formulário.',
      en: 'Want to talk about an opportunity, a project or just exchange ideas? Reach out on any channel or use the form.',
    },
    name: { pt: 'Nome', en: 'Name' },
    email: { pt: 'E-mail', en: 'Email' },
    message: { pt: 'Mensagem', en: 'Message' },
    send: { pt: 'Enviar mensagem', en: 'Send message' },
    sending: { pt: 'Enviando…', en: 'Sending…' },
    ok: { pt: 'Mensagem enviada! Obrigado, respondo em breve.', en: 'Message sent! Thank you, I will reply soon.' },
    fail: { pt: 'Não foi possível enviar agora. Tente de novo ou me escreva direto por e-mail.', en: "Couldn't send right now. Please try again or email me directly." },
    fallback: { pt: 'Abrimos seu app de e-mail para finalizar o envio.', en: 'We opened your email app to finish sending.' },
    errRequired: { pt: 'Campo obrigatório.', en: 'Required field.' },
    errEmail: { pt: 'Informe um e-mail válido.', en: 'Enter a valid email.' },
    errMin: { pt: 'Escreva pelo menos 10 caracteres.', en: 'Write at least 10 characters.' },
    namePh: { pt: 'Seu nome', en: 'Your name' },
    emailPh: { pt: 'voce@exemplo.com', en: 'you@example.com' },
    messagePh: { pt: 'Como posso ajudar?', en: 'How can I help?' },
    direct: { pt: 'Canais diretos', en: 'Direct channels' },
  },
  footer: {
    made: { pt: 'Feito com React + Vite.', en: 'Built with React + Vite.' },
    retro: { pt: 'Ver a versão 3D', en: 'See the 3D version' },
    top: { pt: 'Voltar ao topo', en: 'Back to top' },
  },
}

export const ui = UI

const initialLang = () => {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'pt' || saved === 'en') return saved
  } catch { /* sem localStorage */ }
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)

  const setLang = useCallback((l) => {
    setLangState(l)
    try { localStorage.setItem('lang', l) } catch { /* ignora */ }
  }, [])

  useEffect(() => { document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en' }, [lang])

  // t({pt, en}) devolve o texto do idioma atual.
  const t = useCallback((v) => (v && typeof v === 'object' && !Array.isArray(v) && 'pt' in v ? v[lang] : v), [lang])
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
