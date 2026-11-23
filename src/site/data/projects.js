// Projetos curados. Os repositórios públicos de github.com/VCTRPL também são
// carregados ao vivo (veja useGithubProjects.js) e entram na linha do tempo.
//
// Para adicionar um projeto:
//  1. coloque a imagem/GIF em public/projects/ (ex.: public/projects/meu-app.gif)
//  2. acrescente um objeto abaixo. `date` no formato AAAA-MM define a ordem
//     (do mais antigo ao mais recente).
// Um repositório do GitHub com o mesmo `repo` é substituído pela versão curada.

export const projects = [
  {
    repo: 'Portfolio-3D',
    date: '2026-08',
    name: { pt: 'Portfólio 3D', en: '3D Portfolio' },
    description: {
      pt: 'Este portfólio. Um escritório em 3D à noite com um computador retrô: ao ligar a máquina, o currículo aparece dentro do monitor CRT como um site clicável, com boot estilo BIOS, terminal interativo e repositórios carregados ao vivo. Acesse com ?3d na URL.',
      en: 'This portfolio. A 3D night-time office with a retro computer: when you power it on, the résumé appears inside the CRT monitor as a clickable website, with a BIOS-style boot, an interactive terminal and live GitHub repositories. Open it with ?3d in the URL.',
    },
    tech: ['React', 'Three.js', 'React Three Fiber', 'Vite', 'Zustand'],
    github: 'https://github.com/VCTRPL/Portfolio-3D',
    image: '/projects/portfolio-3d.png',
    imageAlt: { pt: 'Escritório 3D com computador retrô ligado', en: '3D office with a retro computer turned on' },
  },
]
