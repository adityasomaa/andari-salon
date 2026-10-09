/**
 * SAMPLE PRODUCT GROUPS.
 *
 * The salon has not said which products it uses or sells. These are the
 * ordinary kinds of take-home hair care a salon stocks, with no brands, no
 * prices and no claims, and the page labels them as a sample
 * (COPY.products.sampleNotice).
 *
 * When the real list arrives, replace the groups and set PRODUCTS_ARE_SAMPLE
 * to false.
 */

import type { Localized } from "./services";

export const PRODUCTS_ARE_SAMPLE = true;

export type ProductGroup = {
  id: string;
  number: string;
  name: Localized;
  note: Localized;
};

export const PRODUCT_GROUPS: ProductGroup[] = [
  {
    id: "shampoo-kondisioner",
    number: "01",
    name: { id: "Sampo dan Kondisioner", en: "Shampoo and Conditioner" },
    note: { id: "Untuk mencuci dan merawat rambut sehari-hari.", en: "For everyday washing and care." },
  },
  {
    id: "masker",
    number: "02",
    name: { id: "Masker Rambut", en: "Hair Masks" },
    note: { id: "Perawatan berkala di rumah, di antara kunjungan.", en: "Regular care at home, between visits." },
  },
  {
    id: "serum-minyak",
    number: "03",
    name: { id: "Serum dan Minyak Rambut", en: "Serums and Hair Oils" },
    note: { id: "Dipakai pada batang rambut setelah dicuci.", en: "Applied to the lengths after washing." },
  },
  {
    id: "penataan",
    number: "04",
    name: { id: "Produk Penataan", en: "Styling Products" },
    note: { id: "Untuk membentuk dan menahan tatanan rambut.", en: "For shaping and holding a style." },
  },
];
