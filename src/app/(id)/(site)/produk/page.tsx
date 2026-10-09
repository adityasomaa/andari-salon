import type { Metadata } from "next";

import { ProductsPage } from "@/components/pages/products-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("products", "id");

export default function Page() {
  return <ProductsPage />;
}
