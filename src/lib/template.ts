/**
 * The site's design scope.
 *
 * The project started as three competing designs; the client chose the second
 * ("warm and friendly"). Its tokens are the `[data-template="t2"]` block in
 * src/styles/templates.css, and this is the one key the site renders with.
 *
 * Some shared components still carry branches for the other two scopes.
 * They are unreachable now and safe to prune.
 */

export type TemplateKey = "t1" | "t2" | "t3";

export const TEMPLATE_KEY: TemplateKey = "t2";

export type TemplateInfo = { key: TemplateKey };
