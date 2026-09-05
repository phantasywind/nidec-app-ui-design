# Nidec 共享浅色主题：集中映射

2026-09-05；起点提交 `3f90e9f3a76e9dc775dc263eb2906e60cc70a818`，实施前工作树干净。Locke 同意以CPQ的 `--ds-*` 色表为共享浅色主题基准并继续实施。本轮只在共享库，不修改CPQ/EPM、不新建worktree、不推送发布。

## 唯一颜色入口

原始值只在 `src/internal/light-palette.mjs` 的16个命名角色中登记，来自上一轮保存的DS色表。组件代码不直接写色值；主题映射位于公共入口的独立主题区，组件实现仍委托Fluent。只导出完整 `nidecLightTheme`，Provider仍必须显式传入theme。消费者不依赖内部palette路径。

演示的 `themes.ts` 选择共享浅色主题；`palette.css` 由 `build-theme-demo.mjs` 从同一源生成，不能手改。生成结果一致性及原始色值位置均由css:check检查。旧tokens/style子路径仍为scaffold，未偷偷变更为生产颜色输出。

## 原始值、角色与派生策略

| 角色 | 来源/映射 |
| --- | --- |
| 品牌原色 | brand `#009b4a`；Fluent brand80、静态品牌面/图形等 |
| 白字品牌按钮底 | brandStrong `#007f3d`；brand70，因为白字配原绿不足4.5:1 |
| hover/pressed/selected | brandStrong向text混合18%/50%/35%；为集中UI派生，不是新官方色值 |
| 品牌浅底 | brandSoft `#dff3e8`；brand160 |
| 文本/次要/辅助 | text/textSecondary/textMuted来自DS ink900/700/500 |
| 表面/画布/弱背景 | surface/canvas/surfaceSubtle来自DS同名角色 |
| 边框 | border/borderStrong用于表面装饰；可操作边界使用textMuted，避免弱边框被当成唯一识别线索 |
| 焦点 | focus `#1769aa`，内白外蓝；不因品牌绿而擅改焦点语义 |
| 成功/警告/错误 | success/warning/danger来自DS表；前景和实色底用原值，弱底向surface混合96%/90%，弱边框65%；反色前景50% |
| 信息 | info `#1769aa`，映射Fluent实际存在的Blue Foreground2/Background2/BorderActive；Fluent该版本没有独立StatusInfo族 |

品牌16级色阶由原绿、较深绿、浅底、文字和白色确定性生成，交由Fluent `createLightTheme` 管理完整品牌token和shadow引用。其他未重定义的中性状态、禁用状态、分类调色板等继承Fluent9.74.7，不宣称每个主题字段均源于CPQ。字体/间距/圆角/动画不随本轮换色改变。深色主题保持官方参照，不输出Nidec深色候选。

## 验证与失败历史

首轮集中预检：lint、类型、构建与颜色位置检查通过，45测试中44通过、1失败。失败正确发现给Blue调色族添加了该版本不存在的6个字段；已移除这些虚构字段，保留实际3个字段，并为对象增加`satisfies Theme`静态精确检查。没有放宽“完整主题字段与上游一致”的断言。此段是工具输出摘要，不冒充原始日志。

后续使用新运行目录 `.qualification/runs/nidec-light-theme-1` 保存冻结源、两次独立打包、Node22真实消费者及浏览器结果；未完成检查不预写PASS。旧制品和证据不覆盖。

## 集中结果：完成并等待主题评审

- 两次独立Node24.20.0恢复均完成45测试、类型、构建、CSS/颜色来源和公共边界检查；分别约14分钟恢复211依赖。产物均9文件、5303 bytes，完整SHA256：`83d2722a704174850e040a54360d0e05d82c9725ab338aeb40affbc3063190f5`。
- 并行build-b完成较早，其首次编排在读取尚未落盘的build-a制品时报ENOENT，两个build本身已通过。改为两份完成后的独立compare-builds步骤，按字节比较通过；`build-comparison.json`与执行器保留。未删除或放宽一致性检查。
- Node22.22.0 token-only、既有React、整批表单均clean install/typecheck/build通过；token-only没有React/Fluent，两种React消费者为单一React/DOM19.2.7、Fluent9.74.7，并核对实际安装文件与tarball。
- 同时在既有隔离消费者中提前执行浏览器检查；其制品和最终clean消费者完全相同，最终HTML/JS/CSS逐项哈希一致（`warmBrowserBytesEqualCleanConsumer: true`），不靠源码别名。
- 1280/1440/900/720实际视口无整页溢出；Checkbox/Radio/Switch实际指示器为主绿，输入/选择/只读、ref focus-visible、显式提交及Dialog焦点循环/Escape返回完成有界观察。Portal继承浅色绿主题，官方深色对照不变。
- 同一原始绿配白色的对比度3.6286；较深交互绿配白色5.1180。自动测试检查主要文字、链接、各实色品牌交互面和反馈色组合，不代表所有页面/状态均已WCAG验收。
- 有界全局CSS干扰下外部对照受影响、内部代表控件仍保留主题。负向无名按钮被扫描检出，外连被CSP阻断；去掉nonce许可会丢失主题并产生明确应用样式拦截报告。

| 体积观察（bytes） | 上轮 | 本轮 | 增量 |
| --- | --- | --- | --- |
| 共享tgz | 4105 | 5303 | 1198 |
| 同一既有React fixture JS | 406018 | 407820 | 1802 |
| 上项本地gzip | 115126 | 115680 | 554 |
| 表单组合JS | 467091 | 470936 | 3845 |
| 表单CSS | 1102 | 1300 | 198 |

表单增量同时包含集中主题、外壳变量和说明文字变化，不是CPQ应用迁移增量。未批准体积预算，本轮不做“低于阈值”的虚构判定。服务端请求日志不是完整浏览器网络抓包；测试审计脚本不计入应用资源。

## 保留限制

自动扫描仍只有两个Tabster sentinel的 `aria-hidden-focus`，无incomplete；不扩大原ADR-0004豁免。正常页仍有line135无source-file的style-src-elem报告，与上轮无脚本控制页也复现的签名相同，来源未定，不称为CSP零告警或生产验收。没有加入unsafe-inline、关闭CSP或隐去失败。

真实OS输入法、屏幕阅读器、全浏览器矩阵、生产CSP/业务应用验收未执行；Textarea对象ref的上游严格类型限制仍存在，使用已验证callback ref。截图在浏览器工具输出中查看，不声称另存PNG。深色和品牌资产不在本轮批准范围。

审计服务51455已按精确命令/PID21672停止，逐请求日志已保存；测试标签清理，视口已恢复。旧57763蓝色演示和旧封存证据不覆盖。新绿色只读预览用 `scripts/preview-form-batch.mjs light-theme`，启动时核验制品及生产资源SHA；它不向封存证据写日志。

工程摘要、全主题值和浏览器观察分别在运行目录的 `engineering-summary.json`、`theme.json`、`browser-review.md`。发布阻断仍生效；未提交/推送/发布，也未通知02接入新制品。

封存完成：235个证据文件按SHA256回读一致。新绿色预览已启动并在浏览器打开：`http://127.0.0.1:65493/`。该地址是本机临时预览，重启命令会输出新端口；它不修改CPQ、不写业务数据，也不向封存目录追加日志。旧57763蓝色预览保留供对照。

## 退出与回退

Locke 已接受浅色绿色演示并要求继续，关闭本轮主题评审门；上述“等待评审”是完成时的历史状态。Dark Mode 明确排除，不作为后续任务或验收缺口。发布和应用独立验收不因演示接受而批准；CPQ 按整批交接流程确认具体落点。回退只撤销本轮palette/映射/export/检查/演示变更，依据上述起点与新证据恢复，不整仓强制重置。

继续交接记录见 `cpq-form-theme-handoff.md`。本次仅更新治理记录，不重跑或改写封存运行目录中的235份历史证据。
