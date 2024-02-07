/// <reference path="../node_modules/chrome-types/index.d.ts" />
import { MENU_ID } from './js/utils'

(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.id === MENU_ID) {
      window.alert(request.message)
    }
  })
})()