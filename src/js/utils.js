export const MENU_ID = 'auto-mark'

export async function getLocal() {
  const res = await chrome.storage.local.get(MENU_ID)
  return res[MENU_ID] || {}
}

export async function setLocal(local) {
  return await chrome.storage.local.set({ [MENU_ID]: local })
}
