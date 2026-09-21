# Authentication entry pattern

## Purpose

Use this pattern for a dedicated application entry surface that asks a user to authenticate before reaching the application shell. It governs visual hierarchy, layout and interaction presentation only. It does not define authentication technology or business access rules.

## Governed anatomy

1. A quiet full-page background using the active light theme.
2. One centered panel with a bounded readable width.
3. A consumer-supplied application brand area. The shared package does not embed, reconstruct or recolor an application logo.
4. One concise page title and optional supporting sentence.
5. A visible boundary between identity and credential areas.
6. Labelled credential fields using Fluent `Field` and `Input`.
7. One full-width primary submit action. Secondary help, SSO or recovery actions may follow only when the application owns them.
8. Validation and authentication feedback placed close to the relevant field or at the start of the form; errors must not rely on color alone.

## Interaction and accessibility contract

- The form uses one semantic heading and a real `form` submit path.
- Every field has a persistent visible label. Placeholder text is not a label.
- Use `autocomplete="username"` and the appropriate password autocomplete value when those credentials exist.
- Pressing Enter follows the same submit path as the primary button; loading disables duplicate submission without removing the button label.
- Focus order follows the visible order. Focus must remain visible under the active theme.
- Authentication failure must not clear a valid username or unexpectedly move focus.
- At narrow widths, retain page padding and let the panel fill the available width; do not horizontally scroll the credential form.

## Consumer ownership

The adopting application owns SSO, MFA, password policy, account recovery, rate limiting, session creation, API calls, security logging, error wording, privacy notices, routing and authorization. Record unresolved semantics as `Business Rule Pending` in that application. The Design System owns only the reusable presentation guidance and Fluent-backed visual roles.

## Prohibited combinations

- Do not copy credentials, authentication state or security policy into this package.
- Do not embed a CPQ-, EPM- or EIDC-specific logo or product message in the shared source.
- Do not layer a legacy input/button skin over Fluent controls.
- Do not place unrelated dashboards, navigation or promotional cards beside the primary credential form unless a separately approved application requirement justifies the distraction.
- Do not treat the local preview as evidence that a real authentication service, account, RBAC model or Production environment has passed acceptance.

The local `Authentication sample` demonstrates the composition with synthetic, non-submitting fields. It is a governed pattern, not a new public authentication component or protocol.
