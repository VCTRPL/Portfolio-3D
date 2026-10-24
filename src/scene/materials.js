import * as THREE from 'three'

// Materiais compartilhados entre os modelos (um por "tipo" de superfície).
export const beige = new THREE.MeshStandardMaterial({ color: '#d9cfb6', roughness: 0.55, metalness: 0 })
export const beigeDark = new THREE.MeshStandardMaterial({ color: '#b9ae94', roughness: 0.6 })
export const keyLight = new THREE.MeshStandardMaterial({ color: '#e9e2cf', roughness: 0.5 })
export const keyDark = new THREE.MeshStandardMaterial({ color: '#a39b8a', roughness: 0.55 })
export const plasticBlack = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.45 })
export const slot = new THREE.MeshStandardMaterial({ color: '#0d0d0d', roughness: 0.8 })
export const metal = new THREE.MeshStandardMaterial({ color: '#9aa0a6', roughness: 0.3, metalness: 0.9 })
export const lampPaint = new THREE.MeshStandardMaterial({ color: '#2f5a4a', roughness: 0.35, metalness: 0.5 })
export const cable = new THREE.MeshStandardMaterial({ color: '#c8bfa9', roughness: 0.6 })
export const paper = new THREE.MeshStandardMaterial({ color: '#f4f1ea', roughness: 0.9 })
