import type { Product, ProductCommercialState } from "./types";

export const createDefaultCommercialState = (): ProductCommercialState => ({
  price: "quote",
  availability: "unknown",
});

export const products: readonly Product[] = [];

export const getPublishedProducts = (): readonly Product[] =>
  products.filter((product) => product.status === "published");
