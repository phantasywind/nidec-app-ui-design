Breadcrumb shows where a record sits relative to its parents. It is built from `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbDivider` and `BreadcrumbButton`, re-exported from Fluent unchanged.

Use it for location only, never for workflow state. The current item is marked with `current` and is not a jump to itself.

Breadcrumb: `size` (`small`, `medium`, `large`; default `medium`) and `focusMode` (`tab` or `arrow`; default `tab`). BreadcrumbButton takes `current` (default `false`) and, for a link, `href`.

- Give the Breadcrumb an `aria-label` such as "Location".
- Put a `BreadcrumbDivider` between items.
- The consumer provides the labels and routes.

```tsx
<Breadcrumb aria-label="Location">
  <BreadcrumbItem><BreadcrumbButton href="/records">Records</BreadcrumbButton></BreadcrumbItem>
  <BreadcrumbDivider />
  <BreadcrumbItem><BreadcrumbButton current>Example Alpha</BreadcrumbButton></BreadcrumbItem>
</Breadcrumb>
```
