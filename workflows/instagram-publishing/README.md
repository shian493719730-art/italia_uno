# Instagram 品牌发布工作流

如需先创建项目邮箱，可选用[协助创建邮箱流程](../email-setup/README.md)。邮箱注册、Instagram 注册和发布授权分别处理；此模块不会自动创建账号或启动发布。

这是 Italia Uno 店铺项目内的 Instagram 内容发布队列。它把已审核的品牌素材、发布前确认和发布后的实际链接复核记录在本地 SQLite 账本中，避免排程重复发帖。

它**不会**登录 Instagram、生成内容、绕过平台限制或自行点击发布；最后的浏览器操作必须由已获店主授权的操作者完成。发布默认为暂停，配置、媒体、证据和账本均不会提交到 Git。

## 适用范围

- 将店铺官网或本项目的活动、菜单、故事转化为经审核的单图 Feed 帖。
- 在每天至多一帖的节奏下，记录一次可验证的发布过程。
- 网络、浏览器或平台结果不明确时停在 `VERIFY_REQUIRED`，先核对真实帖子而非盲目重发。

不适用于自动生成虚构价格、营业时间、优惠、顾客评价、合作关系或无权使用的图片；不要把密码、Cookie、令牌或截图证据提交到仓库。

## 首次设置

在本目录运行：

```sh
python3 agent.py init your_instagram_handle
```

编辑本地生成的 `config.json`：填写品牌名、时区和正式内容规则。确认真实素材、文案和事实均已审核后，才将 `production_content_ready` 设为 `true`。`publishing_enabled` 仍应保持 `false`，直到店主明确授权本次发布。

将 `examples/post.example.json` 复制为 `inbox/2026-11-08-lunch.json`，替换账号、带时区的发布时间、图片路径、准确替代文本、文案与来源；审核完成后才设置 `ready: true`。支持 PNG/JPEG 单图 Feed 帖。

## 每次发布

1. 执行 `python3 agent.py status`，先处理所有 `PUBLISHING` 或 `VERIFY_REQUIRED` 记录。
2. 需要发布时执行 `python3 agent.py resume`，接着运行 `python3 agent.py tick`。
3. 仅在返回 `due_production_job` 时，执行 `python3 agent.py claim POST_ID`。
4. 在浏览器中确认正确的已授权账号、原图比例、文案和 alt text；点击 Share 前执行 `python3 agent.py check POST_ID`。
5. Share 只点击一次。重新打开实际帖子，核对账号、图片、文案及规范 permalink；把真实信息填入本地证据 JSON，再执行 `python3 agent.py record POST_ID evidence/result.json`。
6. 若结果不确定，执行 `python3 agent.py uncertain POST_ID`；先在 Instagram 核对，绝不因为没看到回执而再次 Share。

完成后可运行 `python3 agent.py pause`。日常排程只应唤醒一次上述受限循环；它不等于已成功发布。

## 质量门槛

- 只使用店主授权且有使用权的图片与文案；保留事实来源和素材权利记录。
- 发布前检查菜单、营业时间、价格和活动信息；无确认则不要声称。
- 文字应包含准确的替代文本、明确行动引导及必要的地点/语言信息。
- 账本只减少重复尝试，不能保证平台端“恰好一次”发布；实际帖子复核才是完成标准。

## 验证

```sh
python3 -m unittest -v test_agent.py
```

该测试完全离线，不会访问 Instagram 或发布内容。

## 来源

此模块基于同一组织维护的 [instagram-publishing-agent](https://github.com/shian493719730-art/instagram-publishing-agent)（同步提交 `24122776bb980b0986f38ae40e5e0469d8e84c0d`）整理而来。上游尚未选择项目许可证；在重新分发或抽离本模块前，应先在上游明确许可证与归属。

## More documentation

- [操作协议 / Operations protocol](docs/OPERATIONS.md): how an authorised browser agent publishes and verifies a post.
- [Loop Engineering](docs/LOOP_ENGINEERING.md): the state → decide → claim → act → verify → persist design.
- [Daily automation prompt](docs/AUTOMATION_PROMPT.md): the prompt a scheduler sends each day.
- [简体中文说明](README.zh-CN.md) · [Third-party notices](THIRD_PARTY_NOTICES.md).
- Offline demo (never touches Instagram): `python3 tools/demo.py`. Example image: `node render-example.cjs`.
