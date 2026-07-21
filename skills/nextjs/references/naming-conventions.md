---
name: naming-conventions
description: Next.js file, folder, component, hook, and prop naming conventions — PascalCase components, kebab-case files, camelCase props/hooks, and Next.js reserved file names (page.tsx, layout.tsx, proxy.ts, etc.) for the current App Router version.
---

# Naming conventions (mandatory, no exceptions)

## Components — PascalCase

```jsx
✅ <MyComponent>...</MyComponent>
❌ <my-component>...</my-component>
```

Why: React and JSX already use capitalization to distinguish a custom component from a native HTML tag — `<Button>` is your component, `<button>` is the DOM element. PascalCase also gets its own color from every syntax highlighter, so a component reads differently from a tag at a glance, before you even know what it does.

## Props — camelCase

```jsx
✅ <MyComponent userId="7" />
❌ <MyComponent user-Id="7" />
❌ <MyComponent user-id="7" />
❌ <MyComponent UserId="7" />
```

Why: camelCase is already the convention for every other identifier in JS/TS — variables, function names, object keys. Keeping props camelCase means there's exactly one casing convention to remember for "things that aren't components or files," not three.

## Files & folders — kebab-case

```
✅ my-component.tsx
✅ my-components/my-component.tsx
❌ MyComponent.tsx
❌ MyComponents/MyComponent.tsx
❌ myComponent.tsx
❌ mycomponent.tsx
```

Why: kebab-case filenames are safe on case-insensitive filesystems and URL-safe, which matters directly in a framework where folder names _become_ URL segments. It also sidesteps a nastier problem: **git does not reliably track case-only renames**, especially on the case-insensitive filesystems that ship by default on macOS and Windows. Rename `MyComponent.tsx` → `my-component.tsx` in place and you risk git silently treating it as "no change," which corrupts history or leaves two versions of the file depending on the machine.

**If you inherit a folder that isn't kebab-case yet:** don't rename in place. Create a new, correctly-cased folder (the parent and every child folder, matching the full nesting), then move each file into it one at a time. This sidesteps the git case-rename problem entirely instead of fighting it.

## Catch-all and optional catch-all segments

Bracket syntax follows the same "contents are a JS identifier → camelCase" rule as regular dynamic segments — the extra dots are just Next.js syntax on top:

pp/shop/[...slug]/page.tsx     → matches /shop/a, /shop/a/b, /shop/a/b/c
app/shop/[[...slug]]/page.tsx   → matches the above AND /shop (optional)

```
✅ `[...slug]`, `[...productPath]`
❌ `[...Slug]`, `[...product-path]`
```

## CSS Modules

Same kebab-case rule as any other file, with the `.module.css` (or `.module.scss`) suffix appended:

```
✅my-component.module.css
❌ MyComponent.module.css
❌ myComponent.module.css
```

Import it like any other module — the imported object itself follows normal camelCase usage (`styles.wrapper`, `styles.activeTab`), since that's just object property access, not a filename.

### Config files — fixed names, not kebab-case violations

Like the `app/` reserved files, these are framework/tool-mandated exact names. Don't rename them and don't flag them as violations:

```
next.config.ts
tailwind.config.ts
postcss.config.mjs
eslint.config.mjs
tsconfig.json
package.json
```

If a tool's docs specify the exact filename, use it exactly — these sit outside the kebab-case rule the same way `page.tsx` and `layout.tsx` do.

## How this interacts with Next.js's own files

Next.js reserves a set of exact, lowercase filenames inside `app/` that you cannot rename: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `template.tsx`, `default.tsx`, `global-error.tsx`, `global-not-found.tsx`, `proxy.ts`. These are already single lowercase words — use them exactly as Next.js requires and don't treat them as a kebab-case violation; there's nothing to convert.

Route segment **folders** still follow the kebab-case rule normally, and it's what gives you clean URLs for free:

```
app/user-settings/page.tsx        → /user-settings
app/products/[productId]/page.tsx → /products/123   (bracket contents are a JS identifier → camelCase)
```

**Hooks** get a small, deliberate exception baked in, not a contradiction of the rule: the _file_ is still kebab-case, prefixed with `use-`; the _exported hook_ is camelCase starting with `use`, because React's rules of hooks require that:

```
✅ use-cart.ts       exporting  useCart()
✅ use-debounce.ts   exporting  useDebounce()
```

**Everything else** (utilities, constants, types, API clients, contexts) is kebab-case for the filename, with the exported identifier following normal JS/TS casing for what it _is_ — camelCase for functions/variables, PascalCase for types/classes/contexts:

```
format-currency.ts     exporting  formatCurrency()
api-client.ts          exporting  apiClient
auth-context.tsx       exporting  AuthContext, AuthProvider
user-profile.types.ts  exporting  type UserProfile
```

**Tests** mirror the file under test and live next to it: `my-component.test.tsx` beside `my-component.tsx`. See the **Testing and Tooling** section below.

**`index.ts`/`index.tsx`** barrel files are the one filename kebab-case can't meaningfully apply to (it's already a single lowercase word). See the **Component Architecture** section below for when a barrel file is the right call and when it isn't.


---