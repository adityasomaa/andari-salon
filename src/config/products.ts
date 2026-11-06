/**
 * THE PRODUCTS THE SALON USES.
 *
 * Brands from the partnership proposal's product list, with the client's own
 * product photos (Drive folder "produk", converted into
 * public/photos/products/). Each line names only what the photo shows. No
 * prices, and no claim that a product is sold: the page routes availability
 * questions to WhatsApp.
 *
 * Brands from the proposal that have no photo yet are listed in OTHER_BRANDS.
 * When a photo arrives, move the brand into PRODUCT_GROUPS.
 */

import type { Localized } from "./services";

/** True while the list is a placeholder. The sample banner follows it. */
export const PRODUCTS_ARE_SAMPLE = false;

export type ProductGroup = {
  id: string;
  brand: string;
  /** What the photo shows, in one line. */
  note: Localized;
  /** public/photos/products/{photo}.webp, square. */
  photo: string;
  alt: Localized;
};

export const PRODUCT_GROUPS: ProductGroup[] = [
  {
    id: "cbd",
    brand: "CBD Professional",
    note: {
      id: "Rangkaian Keratin Pro, Collagen, Bio Peptide, dan Color: sampo, masker, dan serum.",
      en: "The Keratin Pro, Collagen, Bio Peptide and Color ranges: shampoos, masks and serums.",
    },
    photo: "cbd",
    alt: { id: "Produk perawatan rambut CBD Professional", en: "CBD Professional hair care products" },
  },
  {
    id: "loreal",
    brand: "L'Oréal Professionnel",
    note: {
      id: "Serie Expert: Pro Longer, Silver, Vitamino Color, Serioxyl Advanced, dan Hair Spa.",
      en: "Serie Expert: Pro Longer, Silver, Vitamino Color, Serioxyl Advanced and Hair Spa.",
    },
    photo: "loreal",
    alt: { id: "Produk L'Oréal Professionnel Serie Expert", en: "L'Oréal Professionnel Serie Expert products" },
  },
  {
    id: "matrix-care",
    brand: "Matrix",
    note: {
      id: "Perawatan dan pelurusan: Food For Soft, So Silver, SoColor Sync, dan Opti Straight.",
      en: "Care and straightening: Food For Soft, So Silver, SoColor Sync and Opti Straight.",
    },
    photo: "matrix",
    alt: { id: "Produk perawatan dan pelurusan rambut Matrix", en: "Matrix hair care and straightening products" },
  },
  {
    id: "matrix-colour",
    brand: "Matrix SoColor",
    note: {
      id: "Pewarnaan: SoColor Pre-Bonded, SoColor Beauty, dan Opti Smooth.",
      en: "Colour: SoColor Pre-Bonded, SoColor Beauty and Opti Smooth.",
    },
    photo: "matrix-2",
    alt: { id: "Produk pewarnaan rambut Matrix SoColor", en: "Matrix SoColor hair colour products" },
  },
  {
    id: "makarizo",
    brand: "Makarizo Professional",
    note: {
      id: "Salon Daily Professional Creambath.",
      en: "Salon Daily Professional Creambath.",
    },
    photo: "makarizo",
    alt: { id: "Creambath Makarizo Professional Salon Daily", en: "Makarizo Professional Salon Daily creambath" },
  },
  {
    id: "mastaka",
    brand: "Mastaka",
    note: {
      id: "Shampoo Salon Daily dalam beberapa varian aroma.",
      en: "Salon Daily shampoo in several scents.",
    },
    photo: "mastaka",
    alt: { id: "Shampoo Salon Daily Mastaka", en: "Mastaka Salon Daily shampoo" },
  },
  {
    id: "pro-techs",
    brand: "Pro-Techs",
    note: {
      id: "Protein Gold II untuk perawatan keratin.",
      en: "Protein Gold II for keratin treatments.",
    },
    photo: "gold-keratin",
    alt: { id: "Botol Pro-Techs Protein Gold II", en: "A bottle of Pro-Techs Protein Gold II" },
  },
];

/** From the proposal's product list, without photos yet. */
export const OTHER_BRANDS = ["Jihoda Gel Perm Set", "NR", "Ordeve", "Sinko", "Absolut Repair Hair Oil"];
