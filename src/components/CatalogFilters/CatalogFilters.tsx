"use client";

import type { FormEvent } from "react";
import { LuMap, LuX } from "react-icons/lu";
import type { CamperFilters } from "@/types/camper";
import styles from "./CatalogFilters.module.css";

interface CatalogFiltersProps {
  onSearch: (filters: CamperFilters) => void;
}

const emptyFilters: CamperFilters = {
  location: "",
  form: "",
  engine: "",
  transmission: "",
};

const filterGroups = [
  {
    name: "form",
    title: "Camper form",
    options: [
      { value: "alcove", label: "Alcove" },
      { value: "panel_van", label: "Panel Van" },
      { value: "integrated", label: "Integrated" },
      { value: "semi_integrated", label: "Semi Integrated" },
    ],
  },
  {
    name: "engine",
    title: "Engine",
    options: [
      { value: "diesel", label: "Diesel" },
      { value: "petrol", label: "Petrol" },
      { value: "hybrid", label: "Hybrid" },
      { value: "electric", label: "Electric" },
    ],
  },
  {
    name: "transmission",
    title: "Transmission",
    options: [
      { value: "automatic", label: "Automatic" },
      { value: "manual", label: "Manual" },
    ],
  },
] as const;

export default function CatalogFilters({ onSearch }: CatalogFiltersProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSearch({
      location: String(formData.get("location") ?? "").trim(),
      form: (formData.get("form") ?? "") as CamperFilters["form"],
      engine: (formData.get("engine") ?? "") as CamperFilters["engine"],
      transmission: (formData.get("transmission") ??
        "") as CamperFilters["transmission"],
    });
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onReset={() => onSearch({ ...emptyFilters })}
    >
      <div className={styles.locationGroup}>
        <label className={styles.label} htmlFor="location">
          Location
        </label>

        <div className={styles.inputWrapper}>
          <LuMap size={20} aria-hidden="true" />

          <input
            className={styles.input}
            id="location"
            name="location"
            type="text"
            placeholder="City"
          />
        </div>
      </div>

      <h2 className={styles.title}>Filters</h2>

      <div className={styles.groups}>
        {filterGroups.map((group) => (
          <fieldset className={styles.group} key={group.name}>
            <legend className={styles.legend}>{group.title}</legend>

            <div className={styles.options}>
              {group.options.map((option) => (
                <label className={styles.option} key={option.value}>
                  <input
                    className={styles.radio}
                    type="radio"
                    name={group.name}
                    value={option.value}
                  />

                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.searchButton} type="submit">
          Search
        </button>

        <button className={styles.clearButton} type="reset">
          <LuX size={18} aria-hidden="true" />
          Clear filters
        </button>
      </div>
    </form>
  );
}
