# CPQ阶段3目录与操作：正式回传核对

状态：LOCAL IMPLEMENTED / AUTOMATED VERIFIED / BOUNDED ENQUIRIES STATIC BROWSER VERIFIED / BATCH BROWSER CLOSEOUT PENDING / INDEPENDENT ACCEPTANCE PENDING。

## 来源与实际核验

已收到既有02的正式入站回传，并只读回读CPQ `docs/evidence/cpq-fluent-directory-actions-2026-09-06/README.md`。本源任务实际重新计算安装tgz和lock Hash，读取HEAD；没有重跑CPQ测试或修改CPQ文件。

- HEAD：`69b506f423e4078d7cc3f2194d194bfafd25410b`。
- tgz：`D:\Documents\Nidec Elevator CPQ\artifacts\nidec-ui-304a5d85.tgz`，SHA256 `304a5d85e96c42d941a1c602dbc98c9927d7ecd0513d735678402292d27f7ea0`，报告6066字节，与共享候选一致。
- 最终lock：`b4fd2a8225e5cd655c10a6af6cb090f66051335334d7256b05cf294b5dec783f`。
- 02记录单一React/DOM19.2.7、Fluent9.74.7；候选private development未发布。
- 五页面指定消费点和局部NidecDirectoryControls已实现；未全局替换仍有活动引用的旧directory primitives。

## 自动验证（02执行，本任务回读）

focused7文件28测试，串行client source80文件464测试，应用TypeScript通过，DS19代表页通过，build separation3/3，build:app通过。保留large-chunk、JSDOM Gallery受控属性/零尺寸chart告警及首次Vitest误收Node测试的失败，不把重跑写成首轮零失败。

当前产物CSS199.87kB/gzip29.73kB、JS1585.93kB/gzip428.22kB；没有同工具链直接前置基线，因此不虚构增量。安装报告0漏洞，不等于新做独立安全验收。

## 浏览器范围必须纠正

详细README表明四尺寸采用Enquiries静态GET-only fixture的固定宽iframe：720下doc/body705、table682<854仅表格内滚动；900为885；1280为1265；1440为1425。不能写成浏览器外层viewport被切换，也不能写成五页面均已浏览器验证。

客户Combobox、图标动作、禁用和键盘合同主要由真实共享组件JSDOM测试证明；其余Quotes/pendingOnly、Reviews、Project BOM及商业附加项浏览器操作尚未提供。console捕获未暴露，未声称console-zero。共享包浏览器资格不能补写成应用场景已完成。

下一步是同批本地模拟浏览器收尾，不重新安装、改业务或创建任务。02需补上述场景的关键交互和实际宿主CSS证据，若未执行则明确保留未完成；现有范围授权涵盖该验证。无需真实API、登录、OS IME或部署来完成这个本地收尾，但这些限制继续公开。

## 边界

无新worktree/分支/commit/push/deploy/真实业务写入。独立应用验收、生产CSP、真实身份/RBAC/业务、OS IME、Sites运行未做。Gallery及旧组件不能凭本批安装提前全部退役。下一共享能力准备可继续，但本批浏览器收尾未完成前不标记阶段3完整结束。
