# 消费应用采用与旧体系退役记录合同

状态：SHARED GOVERNANCE TOOL IMPLEMENTED / APPLICATION RECORDS NOT YET SUPPLIED。

## 目的与责任

本合同为所有采用应用提供同一套可机读的迁移证据结构，避免以“共享包存在组件”“页面看起来接近”或“自测构建通过”代替真实采用、独立验收和旧实现退役。

Design System拥有字段结构、状态顺序和通用校验器。采用应用拥有实际文件、业务合同、验收证据、旧引用审计、回退记录及其结论。校验器只检查记录是否完整且状态声明具备所需证据，不验证证据内容真实性，也不批准安装、发布、部署或Production。

## 状态模型

状态只能使用：

1. `inventoried`
2. `contract-qualified`
3. `package-qualified`
4. `integrated-self-tested`
5. `independently-accepted`
6. `legacy-retired`

记录可以停在任一状态，但不得跳过该状态所要求的字段。状态顺序不是自动升级流程；每一步仍由责任方提供事实。

## 核心规则

- 技术采用记录允许绑定精确的`0.0.0-development`候选及64位小写SHA-256，以记录真实集成、测试和物理旧代码清理；Git URL、`main`、`latest`和版本范围始终禁止。
- 每个迁移项必须有稳定ID、旧实现名称、目标公共能力、应用责任人和非空源码位置。
- `contract-qualified`起必须记录保留的语义/交互合同。
- `package-qualified`起必须记录包级证据路径。
- `integrated-self-tested`起必须记录应用自测、构建和回退证据。
- `independently-accepted`起必须记录独立验收证据；共享构建或实施者自测不能填充该字段。
- `legacy-retired`必须绑定不可变非开发版本，证明活动引用为零、动态入口已检查、测试/样例已检查，并提供移除及回退记录。候选上的物理清理可以记录在`integrated-self-tested`并附带同样的审计字段，但不能提前升级为正式退役。
- 例外不能伪装成退役；保留旧实现时应停在实际状态并说明限制。

## 工具

- 校验器：`scripts/verify-adoption-record.mjs`。
- 合格中立样例：`fixtures/governance/consumer-adoption.valid.json`。
- 负向用例由自动测试构造，覆盖版本范围、缺少独立验收、仍有旧引用和未检查动态入口。

应用交接与记录填写归`Nidec App UI Deployment`；共享主线只维护此通用合同和校验器。
