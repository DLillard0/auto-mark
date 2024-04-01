/// <reference path="../node_modules/chrome-types/index.d.ts" />
import { chat } from './js/chat'
import { MENU_ID, getLocal, setLocal } from './js/utils'

chrome.runtime.onInstalled.addListener(async () => {
  const local = await getLocal()
  if (!local.chatUrl) local.chatUrl = 'https://api.openai.com/v1/chat/completions'
  if (!local.model) local.model = 'gpt-3.5-turbo-1106'
  await setLocal(local)
  chrome.contextMenus.create({
    id: MENU_ID,
    title: '自动收藏',
    type: 'normal'
  })
})

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  if (item.menuItemId !== MENU_ID || !tab) return
  const local = await getLocal()
  let message = ''
  if (!local.chatUrl) {
    message = '请先设置 chatgpt api 地址！'
  } else if (!local.apiKey) {
    message = '请先设置 chatgpt api key！'
  } else if (!local.model) {
    message = '请先设置 chatgpt model！'
  } else {
    try {
      const { title, url } = tab
      const tree = await chrome.bookmarks.getTree()
      const folders = getFolders('', tree)
      const path = await chat(local, folders.map(i => i.path), title)
      const folder = folders.find(i => i.path === path)
      if (!folder) {
        message = `书签栏中未发现合适的网站目录，ChatGPT 推荐目录路径为: ${path}`
      } else {
        const id = folder.id
        await chrome.bookmarks.create({
          parentId: id,
          title,
          url
        })
        message = `已收藏至：${path}`
      }
    } catch (err) {
      console.error(err)
      message = `收藏失败！\n${err.valueOf()}`
    }
  }
  chrome.tabs.sendMessage(tab.id, { id: MENU_ID, message })
})

function getFolders(prePath, tree) {
  const folders = []
  tree.forEach(i => {
    if (i.url) return
    const path = prePath + i.title
    if (path) folders.push({ id: i.id, path })
    if (i.children) folders.push(...getFolders(path && path + '/', i.children))
  })
  return folders
}
