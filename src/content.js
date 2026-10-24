// Conteúdo do currículo, num lugar só. O site dentro do monitor,
// o shell interativo e o modo simples (2D) leem tudo daqui.

export const GITHUB_USER = 'VCTRPL'
export const RESUME_PDF = '/Curriculo_Victor_Reis_Silva_de_Paula.pdf'

export const profile = {
  name: 'Victor Reis Silva de Paula',
  shortName: 'Victor Paula',
  role: 'Estudante de Engenharia de Software',
  location: 'Betim, MG, Brasil',
  objective:
    'Obter a primeira oportunidade profissional na área de desenvolvimento de software, aplicando e aprofundando, na prática, os conhecimentos técnicos adquiridos durante a graduação.',
  summary: [
    'Sou desenvolvedor com foco na criação de soluções digitais modernas, funcionais e com boa experiência de usuário.',
    'Estudo Engenharia de Software na PUC Minas e estou no 2º período. Ainda estou no início da formação e não tenho experiência profissional prévia.',
    'Tenho conhecimentos em HTML, CSS, JavaScript e Python, estou estudando Java e uso Git, GitHub, Visual Studio Code e o terminal nos meus projetos acadêmicos e pessoais. Sou fluente em inglês, com diploma Cambridge.',
  ],
}

export const education = {
  school: 'Pontifícia Universidade Católica de Minas Gerais (PUC Minas)',
  degree: 'Bacharelado em Engenharia de Software',
  status: 'Em andamento (2º período)',
  conclusion: 'Previsão de conclusão: 2029',
}

export const skills = [
  { name: 'HTML e CSS', level: 'Conhecimento introdutório', pct: 40 },
  { name: 'JavaScript', level: 'Conhecimento básico', pct: 28 },
  { name: 'Python', level: 'Conhecimento inicial', note: 'estudado no 1º período', pct: 32 },
  { name: 'Java', level: 'Em estudo atualmente', pct: 18 },
]

export const tools = ['Visual Studio Code', 'Git', 'GitHub', 'Terminal / linha de comando']

export const softSkills = [
  'Aprendizado rápido',
  'Organização',
  'Trabalho em equipe',
  'Comunicação',
  'Pensamento analítico',
  'Resolução de problemas',
  'Proatividade',
]

export const languages = [
  { name: 'Português', level: 'Nativo', tone: 'native' },
  { name: 'Inglês', level: 'Fluente', note: 'diploma Cambridge, HC School (Betim, MG)', tone: 'fluent' },
  { name: 'Espanhol', level: 'Básico', tone: 'basic' },
]

export const contacts = [
  { key: 'email', label: 'victorrsdp@gmail.com', href: 'mailto:victorrsdp@gmail.com' },
  { key: 'linkedin', label: 'linkedin.com/in/victor-paula', href: 'https://www.linkedin.com/in/victor-paula-3b6a603b3/' },
  { key: 'github', label: 'github.com/VCTRPL', href: 'https://github.com/VCTRPL' },
  { key: 'whatsapp', label: '(31) 99777-7135', href: 'https://wa.me/5531997777135' },
]

export function openResume() {
  window.open(RESUME_PDF, '_blank', 'noopener,noreferrer')
}
