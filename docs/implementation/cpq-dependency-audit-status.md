# CPQ安装漏洞提示：只读核查状态

## 最新结论：CPQ包A/B已完成，原7项记录是历史快照

本源任务已只读核验CPQ包B的`audit-after.json`（total0）和02正式工作流记录；当前CPQ lock SHA256为`2e51a9304fc12a43336755f2d6248d1c60f158bb8fdb49bbaae6133399c6fe82`。这是回读既有证据，不是本源任务重新执行npm audit。包B已回传01/02，App/Sites构建通过；Miniflare alpha和未做真实运行/独立安全验收的限制仍保留。依赖修复不归功于共享UI任务。

Locke确认02已归档一个重复Sites盘点任务，仅保留一个。共享任务不新建Sites任务、不重新启动已完成包B；新增版本声明或安装隔离建议由CPQ总控安排，不自动扩展为本轮UI工作。

## 历史查询：当时已获明确授权并完成查询

Locke明确同意向registry.npmjs.org发送依赖名称/版本做只读审计后，以新的`cpq-dependency-audit-2`运行执行；未安装、升级、audit fix或修改CPQ。当前/HEAD两次均得到完整npm审计结果，exit1表示检出漏洞，不是本次请求失败。原被拒/失败记录不覆盖。

| 同次查询的锁快照 | low | moderate | high | critical | npm受影响包条目总数 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 当前工作树 | 1 | 2 | 4 | 0 | 7 |
| HEAD基线 | 1 | 2 | 8 | 0 | 11 |

计数包含依赖传播的元漏洞包条目，不等于独立CVE数量。例如miniflare的high由子依赖传播，undici一个包又关联多条公告，不能简单相加。

当前锁SHA256为`7b264a45a2354e187618f67dcbdfbd9251f9dfb3320a06d88ea15931ba21b3da`，已经不同于02前次回传`21c9f850…`。查询前快照已包含Vite8.1.4→8.2.2、react-router/dom7.18.1→7.18.3、postcss8.5.17→8.5.28、nanoid3.3.15→3.3.18等变化；本任务没有执行这些升级，不归功于本次审计。脚本验证审计期间CPQ锁哈希未变。下方早期“新增0/版本变化0”仅描述旧快照，不能再用于当前工作树。

## 当前受影响依赖及归因

| 包 | 锁定版本 | 审计级别 | 锁中归属 |
| --- | --- | --- | --- |
| @cloudflare/vite-plugin | 1.37.1 | moderate（传播） | dev，直接依赖 |
| wrangler | 4.92.0 | moderate（传播） | dev，直接依赖 |
| miniflare | 4.20260515.0 | high（传播） | dev，两者下游 |
| sharp | 0.34.5 | high | dev，miniflare下游 |
| undici | 7.24.8 | high | dev，miniflare内部独立副本 |
| ws | 8.18.0 | high | dev，Cloudflare插件/miniflare使用 |
| esbuild | 0.27.3 | low | dev，wrangler内部副本 |

本次报告没有指向Fluent/Nidec共享包；现有受影响条目集中在Cloudflare/Wrangler本地工具链。此前HEAD还报告nanoid、postcss、react-router和react-router-dom；当前查询不再列这四项。该结果只说明本次公告库对相应锁定版本的检测，不证明所有未知漏洞不存在。

## 影响与建议

- dev=true只说明依赖分类，不能等同于无风险；开发服务器、本地Workers模拟、处理不可信图片、WebSocket或HTTP代理/缓存仍可能触发对应漏洞。没有执行目标环境利用性测试或生产bundle排查。
- [sharp公告](https://github.com/advisories/GHSA-f88m-g3jw-g9cj)说明不可信输入处理受影响，修补范围起点0.35.0；不能盲目越过miniflare的兼容版本要求强制override。
- [ws公告](https://github.com/advisories/GHSA-96hv-2xvq-fx4p)涉及分片导致内存耗尽；[undici公告示例](https://github.com/advisories/GHSA-4cwx-7wf7-3272)涉及缓存指令处理。undici尚有多条公告，完整来源/range见原audit JSON，不以单条链接代表全部。
- 不建议npm audit fix --force。应由CPQ负责工具链的工作流先确认是否继续使用Cloudflare/Sites路径，再为插件、Wrangler及下游整体选兼容修复版本，单独回归构建分离/开发服务；本任务不删除工具链、不修改CPQ依赖。
- 共享阶段3可继续本地实现和资格验证，但不得把这份查询当作CPQ安全验收通过或生产批准。

证据目录：`.qualification/runs/cpq-dependency-audit-2/`，包括两套manifest/lock、完整audit JSON、stderr和execution.json。

## 历史过程（保留，不代表当前仍被阻断）

02报告11 vulnerabilities（1 low/2 moderate/8 high），目前未获得各条公告/受影响包明细，不能直接判定生产可利用性或“全部只是开发依赖”。也不把它们当作large-chunk warning。

本地已将CPQ当前和HEAD的package.json/package-lock.json复制到本仓库`.tmp/cpq-dependency-audit-1`；证据在`.qualification/runs/cpq-dependency-audit-1`，未修改CPQ、未install/audit fix/升级。

本地比较：当前锁相对HEAD新增package路径0，已有package版本变化0。这说明本轮共享包替换没有改变锁中的依赖版本集合；同版本本地tarball字节仍可能变化，不能据此证明包内容无变更或当前11项均为历史已知。漏洞数量也受公告时间影响，归因仍需实际审计明细。

首次npm审计在受限环境未取得结果，官方endpoint请求报错，原stdout/stderr保留。扩大网络访问的申请被自动审查拒绝，理由是需要将CPQ依赖名称/版本元数据发送到公共registry.npmjs.org，尚未得到该外发的明确授权。没有绕过拒绝、换代理或使用别的工具转发。下一步需Locke明确允许该目的地的只读审计；不发送源代码或凭证、不安装或自动修复。确认前不得再试外发。
