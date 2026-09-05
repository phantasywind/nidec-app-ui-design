# CPQ 配色来源与共享主题选择

2026-09-05 只读查看CPQ当前 `AGENTS.md`、`client/src/styles/tokens.css` 和 `client/src/design-system/styles.css`。已向02请求权威说明；任务状态/回复工具本轮超时，不能声称已收到其新确认。以下来自直接源码核查。

| 用途 | 旧全局变量 | Design System变量 | 判断 |
| --- | --- | --- | --- |
| 品牌主绿 | --brand `#009b4a` | --ds-brand-500 `#009b4a` | 一致；CPQ AGENTS明确Nidec Green |
| 深一档品牌 | --brand-hover `#00833f` | --ds-brand-600 `#007f3d` | 值及命名语义不完全相同；不能无依据认定为同一hover角色 |
| 浅品牌底 | --brand-soft `#eaf7f0` | --ds-brand-100 `#dff3e8` | 不同 |
| 信息 | --info `#0f6cbd` | --ds-info `#1769aa` | 不同 |
| 成功 | --success `#107c41` | --ds-success `#08783b` | 不同 |
| 警告 | --warning `#c86b00` | --ds-warning `#9a5600` | 不同 |
| 错误 | --danger `#d13438` | --ds-danger `#b4232c` | 不同 |
| 焦点 | :focus-visible引用--info | --ds-focus `#1769aa` | 两者均蓝色；不能因品牌变绿而默认改绿 |
| 主要文字 | body引用--grey-800 `#252825` | --ds-ink-900 `#17211c` | 不同 |
| 画布 | body引用--white `#fff` | --ds-surface-canvas `#f5f7f6` | 不同且作用域不同 |
| 基础表面 | --white `#fff` | --ds-surface-base `#ffffff` | 等价 |
| 边框 | --grey-200 `#d9dbda`（原始灰，不等同唯一边框角色） | --ds-border `#d7ddd9` | 不应把原始灰直接冒充语义边框 |

Design System另外提供 ink700/500、surface-subtle、border-strong；这些可作为语义完整性更好的候选。旧表和新表均仍有CSS直接色值，例如selection背景、半透明白色topbar；不能声称CPQ已经完全消除硬编码。

## 建议与待确认

建议以 `client/src/design-system/styles.css` 的 `--ds-*` 色表作为**共享浅色主题的候选基准**，保留主绿 `#009B4A`。理由是它对文字层级、表面、边框和反馈角色的定义更完整；这是一项建议，不是已批准品牌标准。

pressed/selected、on-brand文字、各状态的foreground/background/stroke组合和深色主题仍没有从这两段变量声明中得到完整一对一依据；下一步在选定基准后形成集中映射提案，不能假称直接复制CPQ即可覆盖Fluent全部token。

**需要 Locke 确认：是否以这套 `--ds-*` 配色作为共享浅色主题基准，旧全局色表只保留为历史来源？** 通过前不混用、不换绿、不实施CPQ接入。通过后以该基准完成完整状态映射并统一展示，必要派生色明确标注，不作为官方原始色值。

## 本轮实施结果

演示四个外壳色已集中到palette.css；Fluent测试主题入口集中到themes.ts；页面/共享src的常见直接色值检查已接入css:check。原始视觉值保持原样，生产品牌映射未实施。

验证完成：Node24.20.0完整verify通过，9文件/41测试，含新增颜色检查的正负向用例；类型、build、CSS、公共边界通过。Node22.22.0既有真实tarball消费者使用相同锁文件完成新演示源码typecheck/build，无新增依赖。证据目录 `.qualification/runs/color-governance-1/` 保留CPQ参考CSS及哈希、修改源码、原消费者源码、原始输出与生产dist；27个文件按SHA256回读一致。

这是既有安装上的颜色归属重构验证，不是新的独立clean install/打包资格验证，未复跑浏览器矩阵或宣布新主题视觉通过。现有57763预览继续使用此前封存的批次01制品，未替换其资源，也未修改原234文件证据。新CSS仅将四个原值移入变量；Fluent仍使用同一官方主题。

本轮未commit/push/publish，未改CPQ或创建worktree。`git diff --check`通过（只有LF/CRLF提示）。停在上文唯一色表选择门，确认后继续正式映射，不把本次治理检查称为绿色主题已完成。
