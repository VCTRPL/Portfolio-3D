// Troca o cursor retrô (seta → mãozinha) sobre objetos clicáveis da cena
// e dispara a ação no clique. Uso: <mesh {...clickable(acao)} />
export function clickable(onClick) {
  return {
    onClick: (e) => {
      e.stopPropagation()
      onClick(e)
    },
    onPointerOver: (e) => {
      e.stopPropagation()
      document.body.classList.add('is-pointer')
    },
    onPointerOut: () => document.body.classList.remove('is-pointer'),
  }
}
