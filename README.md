# Portfolio
Portfolio - Victor Reis Silva de Paula

Um escritório em 3D à noite, com um computador retrô dos anos 80 em cima da mesa. Quando você liga o computador, o currículo aparece dentro da tela do monitor CRT como um site de verdade, que dá para clicar, rolar e usar.

Feito com [Three.js](https://threejs.org/), usando [React Three Fiber](https://r3f.docs.pmnd.rs/) e [drei](https://drei.docs.pmnd.rs/), com [Vite](https://vite.dev/) no build. O deploy é na Vercel.

## O que dá para fazer

- **Ligar/desligar o computador**: clique no monitor, no botão ⏻ do gabinete ou do monitor, ou no botão "ligar" do topo, com som de clique. A tela tem a animação de CRT ligando (linha branca abrindo), um boot estilo BIOS e o colapso num ponto quando desliga.
- **Área de trabalho retrô**: depois do boot aparece o "VictorOS", com papel de parede de campo, barra de tarefas, menu iniciar e um único app: o **Portfólio**. Clique duas vezes nele para abrir o terminal do currículo numa janela.
- **Usar o site dentro da janela**: tem abas, rolagem, os repositórios do GitHub carregados ao vivo e um shell interativo (`help`, `pdf`, `lampada`, `desligar`…). A tela fica de verdade atrás do vidro do monitor: a moldura, o post-it e o reflexo do vidro ficam por cima dela.
- **Currículo em PDF**: abre pela folha em cima da mesa, pelo botão "currículo PDF" ou pelos links do site.
- **Luminária**: clique nela para acender ou apagar (com som de interruptor).
- **Teclado e mouse**: as teclas do teclado 3D afundam quando você digita, e o mouse acompanha o ponteiro e "clica".
- **Cursor retrô** em pixel art (seta e mãozinha).
- **Versão simples** (botão no topo ou `?simples` na URL): o mesmo site sem 3D. Ela também é usada automaticamente quando o navegador não tem WebGL. Sem aceleração de hardware, a cena 3D abre na qualidade mais baixa. No celular, depois que o computador liga, o site abre em tela cheia para ficar legível.

## Desempenho

A cena foi feita para rodar em qualquer computador:

- só é redesenhada quando algo se mexe (câmera, mouse, teclas, liga/desliga). Parada, desenha um quadro por segundo, só para o relógio da parede;
- sem pós-processamento: os brilhos (LEDs, lâmpada) são sprites leves;
- sombras calculadas uma vez só, e desligadas em máquinas fracas e celulares, que também usam resolução 1x (`src/scene/quality.js`);
- teclado e estante desenhados com `InstancedMesh` (poucas chamadas de desenho).

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Estrutura

```
public/
  Curriculo_Victor_Reis_Silva_de_Paula.pdf
  cursors/            cursor retrô (seta / mão)
  textures/resume.jpg prévia do PDF usada na folha em cima da mesa
src/
  content.js          todo o texto do currículo (site, shell e versão simples leem daqui)
  store.js            estado: liga/desliga, foco da câmera, luminária
  App.jsx             HUD, atalhos, versão simples / mobile
  screen/             o site que roda dentro do monitor + efeitos de CRT
  scene/              a cena 3D: Computer, Keyboard, Mouse, Lamp, Desk, Room, Props, CameraRig
```

Para mudar algum texto do currículo, edite `src/content.js`. Para trocar o PDF, substitua o arquivo em `public/` e gere de novo a prévia (`pdftoppm -r 110 -jpeg -singlefile <pdf> public/textures/resume`).

### Sobre os modelos 3D

Todos os modelos (computador, teclado, mouse, luminária, móveis e o escritório) foram modelados em código, com a geometria do próprio Three.js, e as texturas são geradas num `<canvas>`. Nenhum arquivo de modelo é baixado, então a cena carrega rápido e não tem pendência de licença. Cada objeto é um componente separado em `src/scene/`. Para usar um modelo `.glb` de um site como Poly Pizza, Poly Haven ou Sketchfab, coloque o arquivo em `public/models/` e carregue com `useGLTF` no componente correspondente.
