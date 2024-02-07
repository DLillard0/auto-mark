# Auto Mark

基于 chatgpt 实现的一个自动收藏网站到最佳书签栏的谷歌浏览器插件。

## 使用前提

由于本插件依赖 chatgpt 接口，所以需要 **科学上网** 以及 **openai key**。

## 安装方式

1. 将本仓库 clone 到本地文件夹

2. 在谷歌浏览器中输入 chrome://extensions 进入扩展程序管理页面

3. 开启扩展程序的开发者模式，点击 **加载已解压的扩展程序** 按钮，选择 clone 到本地的文件夹完成安装

## 使用方式

1. 安装完成后点击浏览器界面右上角的扩展程序图标，配置 chatgpt 的 url、key 和 model

![config](/img/config.png)

2. 直接在网页点击鼠标右键，选择 自动收藏

![use](/img/use.gif)

## 二次开发

参考[谷歌插件开发文档](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn)
