/**
 * Preview-tooling switch.
 *
 * `/` (the chooser) and the floating template switcher exist only so the
 * client can compare the three directions. Once a direction is picked and the
 * project becomes the real site, flip PREVIEW_MODE to false. That:
 *
 *   - removes the floating template switcher from every page
 *   - removes the chooser cards from `/` and redirects `/` to LIVE_TEMPLATE
 *   - drops the preview routes from the sitemap and disallows them in robots
 *   - stops the booking WhatsApp message from tagging which template was used
 *
 * Nothing else needs editing. The chosen template's own pages keep working.
 */
export const PREVIEW_MODE = true;

/** Which template `/` serves once PREVIEW_MODE is false. */
export const LIVE_TEMPLATE = "template-1" as const;
