// Todo o conteúdo do site fica em src/site/data. Textos bilíngues: { pt, en }.

export const GITHUB_USER = 'VCTRPL'
export const RESUME_PDF = '/Curriculo_Victor_Reis_Silva_de_Paula.pdf'

export const profile = {
  name: 'Victor Reis Silva de Paula',
  shortName: 'Victor Paula',
  location: 'Betim, MG, Brasil',
  role: {
    pt: 'Estudante de Engenharia de Software',
    en: 'Software Engineering student',
  },
  tagline: {
    pt: 'Crio soluções digitais modernas, funcionais e com boa experiência de usuário.',
    en: 'I build modern, functional digital solutions with a great user experience.',
  },
  about: {
    pt: [
      'Sou desenvolvedor com foco na criação de soluções digitais modernas, funcionais e com boa experiência de usuário. Estudo Engenharia de Software na PUC Minas, atualmente no 2º período.',
      'Tenho conhecimentos em HTML, CSS, JavaScript e Python, estou estudando Java e uso Git, GitHub, Visual Studio Code e o terminal nos meus projetos acadêmicos e pessoais. Sou fluente em inglês, com diploma Cambridge.',
    ],
    en: [
      'I am a developer focused on building modern, functional digital solutions with a great user experience. I study Software Engineering at PUC Minas and I am currently in my 2nd semester.',
      'I know HTML, CSS, JavaScript and Python, I am learning Java, and I use Git, GitHub, Visual Studio Code and the terminal in my academic and personal projects. I am fluent in English, holding a Cambridge diploma.',
    ],
  },
  objective: {
    pt: 'Obter a primeira oportunidade profissional na área de desenvolvimento de software, aplicando e aprofundando, na prática, os conhecimentos técnicos adquiridos durante a graduação.',
    en: 'To land my first professional opportunity in software development, applying and deepening in practice the technical knowledge I am gaining during my degree.',
  },
  interests: {
    pt: ['Desenvolvimento web', 'Interfaces e experiência de usuário', 'Python', 'Gráficos 3D na web'],
    en: ['Web development', 'Interfaces and user experience', 'Python', '3D graphics on the web'],
  },
}

export const education = {
  school: 'PUC Minas',
  schoolFull: 'Pontifícia Universidade Católica de Minas Gerais',
  degree: { pt: 'Bacharelado em Engenharia de Software', en: "Bachelor's in Software Engineering" },
  status: { pt: 'Em andamento (2º período)', en: 'In progress (2nd semester)' },
  conclusion: { pt: 'Previsão de conclusão: 2029', en: 'Expected graduation: 2029' },
}

export const skills = [
  { name: 'HTML & CSS', level: { pt: 'Introdutório', en: 'Introductory' }, dots: 2 },
  { name: 'JavaScript', level: { pt: 'Básico', en: 'Basic' }, dots: 2 },
  { name: 'Python', level: { pt: 'Inicial', en: 'Beginner' }, dots: 2 },
  { name: 'Java', level: { pt: 'Em estudo', en: 'Learning' }, dots: 1 },
]

export const tools = ['Visual Studio Code', 'Git', 'GitHub', 'Terminal']

export const softSkills = {
  pt: ['Aprendizado rápido', 'Organização', 'Trabalho em equipe', 'Comunicação', 'Pensamento analítico', 'Resolução de problemas', 'Proatividade'],
  en: ['Fast learner', 'Organization', 'Teamwork', 'Communication', 'Analytical thinking', 'Problem solving', 'Proactivity'],
}

export const languages = [
  { name: { pt: 'Português', en: 'Portuguese' }, level: { pt: 'Nativo', en: 'Native' } },
  { name: { pt: 'Inglês', en: 'English' }, level: { pt: 'Fluente · diploma Cambridge', en: 'Fluent · Cambridge diploma' } },
  { name: { pt: 'Espanhol', en: 'Spanish' }, level: { pt: 'Básico', en: 'Basic' } },
]
