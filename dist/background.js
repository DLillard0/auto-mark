// chatgpt prompt 配置
const temperature = 0.2;
const systemPrompt = 'Please classify the website into the most appropriate folder path based on the title of the website and the meaning of the folder name.';
const userPrompt = 'The website title is:';
const functionName = 'classify_the_website';
const functionDescription = 'Automatically match the best folder path based on the website title';
const paramName = 'folder_path';
const paramDescription = 'Folder path separated by /';

async function chat(config, folderPaths, title) {
  try {
    const payload = generatePayload(config, folderPaths, title);
    const response = await fetch(config.chatUrl, payload);
    return await parseResponse(response)
  } catch (err) {
    throw err
  }
}

function generatePayload(config, folderPaths, title) {
  const { apiKey, model } = config;
  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: `${userPrompt}:${title}`
    }
  ];
  const body = {
    model,
    temperature,
    messages,
    tools: [{
      type: 'function',
      function: {
        name: functionName,
        description: functionDescription,
        parameters: {
          type: 'object',
          properties: {
            [paramName]: {
              description: paramDescription,
              type: 'string',
              enum: folderPaths
            }
          },
          required: [paramName]
        }
      }
    }],
    tool_choice: {
      type: 'function',
      function: {
        name: functionName
      }
    }
  };

  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    method: 'POST',
    body: JSON.stringify(body)
  }
}

async function parseResponse(response) {
  const json = await response.json();
  if (json.error) throw new Error(`ChatGPT 调用失败：${json.error.message}`)
  try {
    const fn = json.choices[0].message.tool_calls[0].function;
    const arg = JSON.parse(fn.arguments);
    if (fn.name === functionName && arg[paramName]) {
      return arg[paramName]
    } else {
      throw new Error('no function call')
    }
  } catch (err) {
    throw err
  }
}

const MENU_ID = 'auto-mark';

async function getLocal() {
  const res = await chrome.storage.local.get(MENU_ID);
  return res[MENU_ID] || {}
}

async function setLocal(local) {
  return await chrome.storage.local.set({ [MENU_ID]: local })
}

/// <reference path="../node_modules/chrome-types/index.d.ts" />

chrome.runtime.onInstalled.addListener(async () => {
  const local = await getLocal();
  if (!local.chatUrl) local.chatUrl = 'https://api.openai.com/v1/chat/completions';
  if (!local.model) local.model = 'gpt-3.5-turbo-1106';
  await setLocal(local);
  chrome.contextMenus.create({
    id: MENU_ID,
    title: '自动收藏',
    type: 'normal'
  });
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  if (item.menuItemId !== MENU_ID || !tab) return
  const local = await getLocal();
  let message = '';
  if (!local.chatUrl) {
    message = '请先设置 chatgpt api 地址！';
  } else if (!local.apiKey) {
    message = '请先设置 chatgpt api key！';
  } else if (!local.model) {
    message = '请先设置 chatgpt model！';
  } else {
    try {
      const { title, url } = tab;
      const tree = await chrome.bookmarks.getTree();
      const folders = getFolders('', tree);
      const path = await chat(local, folders.map(i => i.path), title);
      const folder = folders.find(i => i.path === path);
      if (!folder) {
        message = `书签栏中未发现合适的网站目录，ChatGPT 推荐目录路径为: ${path}`;
      } else {
        const id = folder.id;
        await chrome.bookmarks.create({
          parentId: id,
          title,
          url
        });
        message = `已收藏至：${path}`;
      }
    } catch (err) {
      console.error(err);
      message = `收藏失败！\n${err.valueOf()}`;
    }
  }
  chrome.tabs.sendMessage(tab.id, { id: MENU_ID, message });
});

function getFolders(prePath, tree) {
  const folders = [];
  tree.forEach(i => {
    if (i.url) return
    const path = prePath + i.title;
    if (path) folders.push({ id: i.id, path });
    if (i.children) folders.push(...getFolders(path && path + '/', i.children));
  });
  return folders
}
