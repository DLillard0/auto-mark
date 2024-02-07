import { getLocal, setLocal } from './js/utils'

const urlInput = document.getElementById('chatUrl')
const keyInput = document.getElementById('apiKey')
const modelInput = document.getElementById('model')
let local = {}

urlInput.addEventListener('change', (e) => change(e.target.value, 'chatUrl'))
keyInput.addEventListener('change', (e) => change(e.target.value, 'apiKey'))
modelInput.addEventListener('change', (e) => change(e.target.value, 'model'))

init()

async function init() {
  local = await getLocal()
  urlInput.value = local.chatUrl || ''
  keyInput.value = local.apiKey || ''
  modelInput.value = local.model || ''
}

function change(val, key) {
  local[key] = val
  setLocal(local)
}
