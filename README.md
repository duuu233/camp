# camp

这是 uni-app（Vue 3）项目。`pages.json` 管理页面和窗口配置，`manifest.json` 管理平台配置；微信小程序的 `app.json`、`app.js`、页面 `.wxml` 和 `.wxss` 均由编译器生成。

## 微信小程序开发

首次运行：

```sh
npm install
npm run dev:mp-weixin
```

看到编译成功后，在微信开发者工具中导入本项目根目录 `D:\work\camp`。根目录的 `project.config.json` 已通过 `miniprogramRoot` 指向 `unpackage/dist/dev/mp-weixin/`，云函数目录仍为根目录下的 `cloudfunctions/`。

开发时保持该命令运行，修改源码后会自动重新编译。重新打开项目或换电脑后，也需要先运行编译命令，因为 `unpackage/` 是生成目录，不提交到 Git。

也可以使用 HBuilderX 打开项目，选择“运行 → 运行到小程序模拟器 → 微信开发者工具”，生成相同的开发目录。

不要在源码根目录手写 `app.json`。仅补该文件不能让微信工具运行 `.vue` 页面；后续页面和窗口配置应修改 `pages.json` 后重新编译。

## 发布版本

```sh
npm run build:mp-weixin
```

发布产物位于 `unpackage/dist/build/mp-weixin/`，需在微信开发者工具中单独导入这个目录，确认后再上传。云函数部署继续使用根目录开发项目中的 `cloudfunctions/`。

官方说明：[uni-app 命令行开发与项目结构](https://uniapp.dcloud.net.cn/quickstart-cli.html)。

## 复制地址失败排查

复制失败时，开发者工具控制台会输出 `[PickupLocationCard] setClipboardData failed` 和微信返回的原始错误。请根据 `errMsg` / `errno` 定位原因。

若出现 `setClipboardData:fail api scope is not declared in the privacy agreement`，需在微信小程序管理后台配置用户隐私保护指引，声明剪贴板用途（向剪贴板写入用户主动复制的自提地址），并审核通过。页面内的《隐私政策》不能替代微信后台的声明。

自提卡片提供复制地址按钮和长按地址手动复制。仅在剪贴板接口成功后提示“地址已复制”。

官方说明：[uni-app 剪贴板 API 注意事项](https://uniapp.dcloud.net.cn/api/system/clipboard.html#注意)。
