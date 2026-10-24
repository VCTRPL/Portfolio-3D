import { create } from 'zustand'
import { playLampClick, playPowerClick } from './sound'

// Tempos das animações do CRT (ms). O CSS em screen.css usa os mesmos valores.
export const POWER_ON_MS = 900
export const BOOT_MS = 2600
export const POWER_OFF_MS = 650

let timers = []
const clearTimers = () => {
  timers.forEach(clearTimeout)
  timers = []
}

// power: 'off' → 'warming' (linha branca abrindo) → 'booting' (BIOS) → 'on'
//        'on'  → 'shutting' (tela colapsando num ponto) → 'off'
// Com o computador ligado aparece a área de trabalho; appOpen diz se a
// janela do terminal do portfólio está aberta.
export const useStore = create((set, get) => ({
  power: 'off',
  focused: false,
  lampOn: true,
  appOpen: false,
  ready: false,

  setReady: () => set({ ready: true }),
  setFocused: (focused) => set({ focused }),
  setAppOpen: (appOpen) => set({ appOpen }),
  toggleLamp: () => {
    playLampClick()
    set((s) => ({ lampOn: !s.lampOn }))
  },

  skipBoot: () => {
    if (get().power !== 'booting') return
    clearTimers()
    set({ power: 'on' })
  },

  powerOn: () => {
    if (get().power !== 'off') return
    playPowerClick()
    clearTimers()
    set({ power: 'warming', focused: true, appOpen: false })
    timers.push(setTimeout(() => set({ power: 'booting' }), POWER_ON_MS))
    timers.push(setTimeout(() => set({ power: 'on' }), POWER_ON_MS + BOOT_MS))
  },

  powerOff: () => {
    const { power } = get()
    if (power === 'off' || power === 'shutting') return
    playPowerClick()
    clearTimers()
    set({ power: 'shutting' })
    timers.push(setTimeout(() => set({ power: 'off', focused: false, appOpen: false }), POWER_OFF_MS))
  },

  togglePower: () => {
    const { power, powerOn, powerOff } = get()
    if (power === 'off') powerOn()
    else powerOff()
  },
}))
