# 暮山川露营小程序

本项目使用 uni-app（Vue 3），可通过项目内的 npm 依赖构建微信小程序，无需安装 HBuilderX。

## 安装与构建

使用 Node.js 20.11 或更新版本。首次安装依赖：

```sh
npm ci
```

构建发布版本并检查本地素材、分包大小及云服务依赖：

```sh
npm run build:mp-weixin
```

构建产物位于 `unpackage/dist/build/mp-weixin/`，在微信开发者工具中导入该目录后即可预览、上传。页面配置使用根目录的 `pages.json`，平台配置使用 `manifest.json`，不要手动修改生成文件。

## 验证

```sh
npm test
```

构建方式参考 [uni-app 官方 CLI 文档](https://uniapp.dcloud.net.cn/quickstart-cli.html)。
