import { create } from 'zustand'

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
export const useStore = create((set, get) => ({
  power: 'off',
  focused: false,
  lampOn: true,
  ready: false,

  setReady: () => set({ ready: true }),
  setFocused: (focused) => set({ focused }),
  toggleLamp: () => set((s) => ({ lampOn: !s.lampOn })),

  powerOn: () => {
    const { power } = get()
    if (power !== 'off') return
    clearTimers()
    set({ power: 'warming', focused: true })
    timers.push(setTimeout(() => set({ power: 'booting' }), POWER_ON_MS))
    timers.push(setTimeout(() => set({ power: 'on' }), POWER_ON_MS + BOOT_MS))
  },

  powerOff: () => {
    const { power } = get()
    if (power === 'off' || power === 'shutting') return
    clearTimers()
    set({ power: 'shutting' })
    timers.push(setTimeout(() => set({ power: 'off', focused: false }), POWER_OFF_MS))
  },

  togglePower: () => {
    const { power, powerOn, powerOff } = get()
    if (power === 'off') powerOn()
    else powerOff()
  },
}))
