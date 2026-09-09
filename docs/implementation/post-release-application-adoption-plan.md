# Nidec App UI `0.1.0-rc.1` 发布后渠道验证与应用接入顺序

日期：2026-09-10  
责任任务：`Nidec App UI Deployment`  
状态：`POST-RELEASE CHANNEL VERIFIED / CPQ EXACT VERSION INSTALLED / TARGETED HOST CHECK PASSED / FULL REGRESSION NOT COMPLETED`

## 1. 接管和权限边界

Deployment任务已依据`nidec-app-ui-deployment-handoff.md`接管发布后渠道验证、采用应用排序、应用门禁、回退和独立验收协调。

Design System共享主线仍负责设计原则、主题、公共组件、接口合同、包级测试和后续包版本。本文不授权修改、安装、提交、推送或部署CPQ、EIDC、EPM，也不授权Production发布。每个应用必须在自身责任工作流取得明确实施授权。

唯一可安装身份：

- `@phantasywind/nidec-app-ui-design@0.1.0-rc.1`；必须使用完整版本号，不得安装`rc`、`latest`或版本范围；
- Git tag `v0.1.0-rc.1`，发布提交`d7445e562ed0b7e43131474a81e22b05567c42c5`；
- Release和Packages共同制品SHA-256：`66f199f1b66b34968851cd020d31be7a0b731d44457fc5135ef7f148bfeae91c`；
- Fluent必须固定`9.74.7`；React与React DOM由消费者固定为同一精确19.2.x版本；
- 已拒绝的历史SHA及`0.0.0-development`本地tgz不得作为新安装合同。

## 2. 发布后渠道验证结果

验证在`.tmp/deployment-channel-verification/`隔离消费者中进行，没有修改任何应用仓库。

### 2.1 远端身份回读

- GitHub Release为非draft的pre-release，tag为`v0.1.0-rc.1`；
- Release附件`phantasywind-nidec-app-ui-design-0.1.0-rc.1.tgz`为16,621字节，远端digest与权威SHA一致；
- `SHA256SUMS.txt`记录同一文件名和SHA；
- GitHub Packages返回精确版本`0.1.0-rc.1`、npm shasum `fb413c37204a97a7891a1ebd15196594d55bcf8e`和权威integrity；
- Packages与Release分别下载的tgz逐字节一致，SHA-256均为`66f199f1b66b34968851cd020d31be7a0b731d44457fc5135ef7f148bfeae91c`。

### 2.2 隔离消费者恢复与构建

- 消费者只声明精确`0.1.0-rc.1`、Fluent `9.74.7`、React/React DOM `19.2.7`；
- lock已冻结，SHA-256为`61a9d853c88d4e14667c58174a373a2a740bd6bffd2f06b5571ef11210de09ac`；
- lock的resolved URL、shasum路径和integrity均指向GitHub Packages正式版本；
- `npm ci`恢复113个包；`npm ls`确认单一React、React DOM和Fluent解析；
- `@fluentui/react-icons@2.0.339`由Fluent传递解析，消费者不需要直接声明；
- Navigation真实导入的TypeScript和Vite生产构建通过：2,129 modules，JS 405.48 kB / gzip 116.75 kB，CSS 6.89 kB / gzip 1.24 kB。

执行说明：首次安装调用未正确等待后台会话，随后重试造成两个npm进程短暂并发写同一隔离目录。两进程已精确停止，仅本轮临时`node_modules`和lock被安全清理。之后按“单独生成lock→单一`npm ci`→类型/构建”串行重做并通过。前述失败不属于包或应用失败，也不从证据中删除。

结论：发布渠道、下载身份、认证读取、精确锁定、恢复和最小React/Navigation生产构建已通过。该结果不替代任何应用宿主验证。

## 3. 应用接入顺序

### 1. CPQ：首个正式版本升级与真实宿主基准

理由：CPQ已经完成最广的run3接入和应用自测，是发现正式包与复杂宿主CSS、真实路由、表单、Drawer/Dialog及旧体系共存问题的最高价值消费者。

当前只读基线：

- `main`，HEAD `6a3cd217f00c8235b6ff1eb4500471517338889c`，检查时工作树干净；
- 仍消费`file:../artifacts/nidec-ui-33aa856d.tgz`；
- Fluent已固定`9.74.7`，但React、React DOM及部分工具在manifest中仍写为`latest`，即使lock当前可解析19.2.7，也必须在实施前决定精确版本治理，不得让安装顺便漂移工具链。

获批后的实施边界：由现有`02 UI设计与前端实现`在现有`main`执行；禁止新worktree。只把本地tgz切换为精确`0.1.0-rc.1`渠道依赖并冻结lock，保护业务/API/RBAC/路由/状态机。先复跑既有run3门禁，再补真实宿主CSP、四视口、键盘/焦点、表单误提交、弹层主题、混合皮肤、生产构建和体积差异。通过自测后进入独立验收，不能直接部署。

### 2. EPM：第二个消费者与正式包原生起步

理由：Locke将EPM调整为CPQ之后的下一应用。EPM尚未接入共享包或Fluent，且项目仍处于低修改成本阶段，适合直接以正式包建立UI基线，避免继承本地候选tgz和CPQ过渡适配器。

当前只读基线：

- `master`，HEAD `3fc3e7ec4e338d5072bd5493538e4dbe528cca06`；存在两份未跟踪EIDC/测试治理文档，必须保护；
- 当前未消费`@phantasywind/nidec-app-ui-design`、Fluent或`NidecProvider`；
- Web消费者已精确固定React/React DOM `19.2.8`，符合共享包`>=19.2.0 <20`的peer合同；Vite `8.2.2`、TypeScript `5.9.3`，本次不需要借安装改动工具链。

获批前只做Consumer Compatibility Profile、Node/构建/CSP盘点和UI范围设计。获批后由EPM `00 项目管理与全局协调`统一调度，`03 UI / 前端设计与实现`在当前checkout安装精确版本，从主题、表单、导航、反馈和布局底座开始；不得复制CPQ业务适配器或引入CPQ业务语义。

实施状态（2026-09-10）：`INTEGRATED / AUTOMATED SELF-TESTED / BROWSER CHECK PENDING / INDEPENDENT ACCEPTANCE PENDING / LEGACY NOT RETIRED / NOT DEPLOYED`。EPM已接入精确`0.1.0-rc.1`与Fluent `9.74.7`，保留React/React DOM `19.2.8`；单一根Provider、Nidec Light Theme、包CSS以及现有通用controls、surface、navigation、table、feedback和form适配已作为一个批次完成。focused `5 files / 20 tests`、typecheck、Design System check和`build:app`通过。浏览器验证未得出结论，不记为PASS；未创建branch/worktree，未commit、push或deploy。

EPM权威采用证据：`D:/Documents/ChatGPT/Nidec EPM/docs/ui-frontend/G5-Nidec-App-UI-0.1.0-rc.1-adoption-evidence-2026-09-10.md`，SHA-256 `92c9c7ce5a9ef7be34ae18d066266abdcd9efc52c223317997da8f8d0d6608d3`。

### 3. EIDC：第三个异构消费者与可移植性验证

理由：EIDC已经用同一run3建立独立工程工作台，可在CPQ与EPM完成后验证共享合同在第三种信息架构中的可移植性。

当前只读基线：

- `master`，HEAD `11b048a81eb7bba01022503ef6cfe4864044f46d`；存在两份未跟踪SLC-03C治理文档，实施前必须保护；
- 仍消费Design System本地run3 tgz；React/React DOM `19.2.7`、Fluent `9.74.7`；
- 保留`@fluentui/react-icons@2.0.339`直接pin，是否移除必须与正式包升级分开决策；
- 当前最多为`integrated-self-tested`，浏览器自测不能替代独立业务验收。

获批后由EIDC工作流把本地tgz切换为精确正式版本，保护现有合成数据和业务含义。

## 4. 每个应用的共同门禁

每个应用单独满足以下顺序，前一应用通过不能替代后一应用：

1. 冻结应用HEAD、工作树、文件占用、未提交保护范围和包级回退点；
2. 只安装完整版本`0.1.0-rc.1`，冻结lock并核对Packages resolved URL、integrity和单一React/Fluent解析；
3. 先复跑原实现合同，再验证正式包差异，不用源码alias或本地tgz冒充渠道安装；
4. 验证真实宿主CSS/伪元素、四视口、键盘、焦点、误提交、弹层、主题、CSP、生产构建、初始/交互资源和体积；
5. 建立应用自己的采用与回退记录；
6. 应用自测通过后进入独立验收；
7. 独立验收通过后仍需单独部署与Production批准。

发现共享缺陷时，只向Design System主线回传最小复现、公共合同和证据要求；应用侧不得用永久旧皮肤或全局CSS覆盖掩盖。

## 5. CPQ实施与定向复核

Locke已授权CPQ 02在现有`main`上执行正式包升级，不创建worktree，不提交、推送或部署。实施后只有`client/package.json`与`client/package-lock.json`变更：

- 共享包已从本地`file:` tgz切换为精确`0.1.0-rc.1`；
- React与React DOM已固定`19.2.7`，Fluent保持`9.74.7`；
- lock SHA-256为`8bc392d9b3a7063e430dcb7cac42adf62fe7d61c2ba08a7621ce61252a31a66d`；
- lock指向GitHub Packages正式版本，integrity与发布记录一致；
- `npm ls`确认单一React/React DOM `19.2.7`、Fluent `9.74.7`，icons `2.0.339`为传递依赖。

Deployment在已启动的CPQ真实本地宿主做了定向抽查：

- UI `5173`与API readiness `5080`均返回HTTP 200；
- Enquiries在1440/1280/900/720无页面级横向溢出；
- 搜索框使用Fluent字体栈和36px控件高度，键盘清空正常，不打开写入弹层；
- 目录Tab保留“方向键移动焦点，Enter显式激活”合同；
- 新建Enquiry Drawer的初始焦点、Tab/Shift+Tab循环、Escape关闭和触发器回焦正常，未提交表单；
- Fluent Select DOM只有一个SVG箭头；`::after`为Fluent底边绘制，不是旧箭头叠加；
- Dashboard、Quotes、Platform Governance、Field Governance和开发态Design System页面均可渲染，无页面级横向溢出。

已知限制：本地Vite响应未设置CSP响应头，因此本轮不构成Production CSP通过；开发态仍有已知Keyborg dispose信息。启动的完整Client串行回归已通过首批文件，但按Locke的资源优化要求主动停止，退出码`1`仅代表人工中断，不得记为全量PASS或产品FAIL。旧run3的`81 files / 466 tests`和旧`dist-app`产物不冒充本轮正式包结果。

当前可判定为：正式精确版本已安装，定向真实宿主复核通过；不声明全量回归、独立验收、Production CSP、部署或Production通过。

## 6. 当前授权门

CPQ正式版本升级与定向宿主复核已完成。EPM正式包与整批共享基础层接入及自动自测已完成，浏览器检查保留Pending。EIDC顺延为第三个消费者并保持只读等待；EPM的独立验收、提交、推送和部署均需后续单独授权。
