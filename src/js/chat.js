import {
  temperature,
  functionName,
  functionDescription,
  paramName,
  paramDescription,
  systemPrompt,
  userPrompt
} from './config'

export async function chat(config, folderPaths, title) {
  try {
    const payload = generatePayload(config, folderPaths, title)
    const response = await fetch(config.chatUrl, payload)
    return await parseResponse(response)
  } catch (err) {
    throw err
  }
}

function generatePayload(config, folderPaths, title) {
  const { apiKey, model } = config
  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: `${userPrompt}:${title}`
    }
  ]
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
  }

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
  const json = await response.json()
  if (json.error) throw new Error(`ChatGPT 调用失败：${json.error.message}`)
  try {
    const fn = json.choices[0].message.tool_calls[0].function
    const arg = JSON.parse(fn.arguments)
    if (fn.name === functionName && arg[paramName]) {
      return arg[paramName]
    } else {
      throw new Error('no function call')
    }
  } catch (err) {
    throw err
  }
}
