// chatgpt prompt 配置
const temperature = 0.2
const systemPrompt = 'Please classify the website into the most appropriate folder path based on the title of the website and the meaning of the folder name.'
const userPrompt = 'The website title is:'
const functionName = 'classify_the_website'
const functionDescription = 'Automatically match the best folder path based on the website title'
const paramName = 'folder_path'
const paramDescription = 'Folder path separated by /'

export {
  temperature,
  functionName,
  functionDescription,
  paramName,
  paramDescription,
  systemPrompt,
  userPrompt
}
