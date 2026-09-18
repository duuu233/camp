import { onMounted, readonly, shallowRef } from 'vue'
import { createLocalProfileStore } from './localProfileStore.js'

const profile = shallowRef(null)
const isSaving = shallowRef(false)
let hydrated = false

function hydrate() {
  if (hydrated || typeof uni === 'undefined') return
  try {
    profile.value = createLocalProfileStore(uni).read()
    hydrated = true
  } catch {
    // Keep the rest of the application usable if device storage is unavailable.
    profile.value = null
  }
}

export function useLocalProfile() {
  hydrate()
  onMounted(hydrate)

  async function saveProfile(changes) {
    if (isSaving.value) return profile.value
    isSaving.value = true
    try {
      profile.value = await createLocalProfileStore(uni).save(profile.value, changes)
      hydrated = true
      return profile.value
    } finally { isSaving.value = false }
  }

  function clearProfile() {
    if (isSaving.value) return
    createLocalProfileStore(uni).clear(profile.value)
    profile.value = null
  }

  return { profile: readonly(profile), isSaving: readonly(isSaving), saveProfile, clearProfile }
}
