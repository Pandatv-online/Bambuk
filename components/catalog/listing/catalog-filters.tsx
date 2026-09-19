import Link from "next/link";

import type { CatalogFacetOption, CatalogFacets, CatalogQuery } from "@/lib/catalog/query";

import styles from "./catalog-listing.module.css";

type FilterGroupProps = Readonly<{
  legend: string;
  name: string;
  options: readonly CatalogFacetOption[];
  selected: readonly string[];
}>;

function FilterGroup({ legend, name, options, selected }: FilterGroupProps) {
  if (!options.length) return null;
  return (
    <fieldset className={styles.filterGroup}>
      <legend>{legend}</legend>
      <div className={styles.filterOptions}>
        {options.map((option) => (
          <label key={option.value}>
            <input
              defaultChecked={selected.includes(option.value)}
              name={name}
              type="checkbox"
              value={option.value}
            />
            <span>{option.label}</span>
            <small aria-label={`${option.count} tuotetta`}>{option.count}</small>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CatalogFilters({
  facets,
  query,
}: Readonly<{ facets: CatalogFacets; query: CatalogQuery }>) {
  const sortValue =
    query.sort === "catalog"
      ? "oletus"
      : query.sort === "name-asc"
        ? "nimi"
        : query.sort === "name-desc"
          ? "nimi-laskeva"
          : query.sort === "price-asc"
            ? "hinta"
            : "hinta-laskeva";

  return (
    <form action="/fi/tuotteet" className={styles.filterForm} method="get">
      <FilterGroup
        legend="Tuoteryhmä"
        name="kategoria"
        options={facets.categories}
        selected={query.categorySlugs}
      />
      <FilterGroup
        legend="Mallisto"
        name="mallisto"
        options={facets.collections}
        selected={query.collectionSlugs}
      />
      <FilterGroup
        legend="Sävy"
        name="vari"
        options={facets.colors}
        selected={query.colorValues}
      />
      <FilterGroup
        legend="Pinta"
        name="pinta"
        options={facets.surfaces}
        selected={query.surfaceValues}
      />
      <FilterGroup
        legend="Viimeistely"
        name="viimeistely"
        options={facets.finishes}
        selected={query.finishValues}
      />
      <fieldset className={styles.filterGroup}>
        <legend>Saatavuus</legend>
        <div className={styles.filterOptions}>
          <label>
            <input
              defaultChecked={query.availability === "inStock"}
              name="saatavuus"
              type="checkbox"
              value="varastossa"
            />
            <span>Varastossa</span>
          </label>
        </div>
      </fieldset>
      <label className={styles.sortControl}>
        <span>Järjestä</span>
        <select defaultValue={sortValue} name="jarjestys">
          <option value="oletus">Oletusjärjestys</option>
          <option value="nimi">Nimi A–Ö</option>
          <option value="nimi-laskeva">Nimi Ö–A</option>
          <option value="hinta">Hinta, edullisin ensin</option>
          <option value="hinta-laskeva">Hinta, korkein ensin</option>
        </select>
      </label>
      <div className={styles.filterActions}>
        <button type="submit">Näytä tuotteet</button>
        <Link href="/fi/tuotteet">Tyhjennä suodattimet</Link>
      </div>
    </form>
  );
}
