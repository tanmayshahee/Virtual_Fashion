import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import {
  setPricingFilter,
  setSearchKeyword,
  resetFilters,
  setSortBy,
  setPriceRange,
} from "../features/contents/filtersSlice";

const pricingOptions = ["Paid", "Free", "View Only"];

const sortOptions = [
  { label: "Item Name", value: "name" },
  { label: "Higher Price", value: "high" },
  { label: "Lower Price", value: "low" },
];

const FiltersPanel = () => {
  const dispatch = useAppDispatch();
  const { pricing, search, sortBy, priceRange } = useAppSelector(
    (state) => state.filters
  );
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const filters = searchParams.get("filters");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    if (filters) dispatch(setPricingFilter(filters.split(",")));
    if (search) dispatch(setSearchKeyword(search));
    if (sort === "high" || sort === "low" || sort === "name") {
      dispatch(setSortBy(sort));
    }
  }, [dispatch]);

  const handleCheckbox = (option: string) => {
    const newFilters = pricing.includes(option)
      ? pricing.filter((p) => p !== option)
      : [...pricing, option];
    dispatch(setPricingFilter(newFilters));
    setSearchParams((prev) => {
      if (newFilters.length > 0) {
        prev.set("filters", newFilters.join(","));
      } else {
        prev.delete("filters");
      }
      return prev;
    });
  };

  const handleSearch = (value: string) => {
    dispatch(setSearchKeyword(value));
    setSearchParams((prev) => {
      if (value.trim()) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  };

  const handleSortChange = (value: "name" | "high" | "low") => {
    dispatch(setSortBy(value));
    setSearchParams((prev) => {
      prev.set("sort", value);
      return prev;
    });
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setSearchParams({});
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md mb-6">
      <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
        <h2 className="text-lg font-semibold whitespace-nowrap">
          Pricing Option:
        </h2>
        {pricingOptions.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <input
              type="checkbox"
              checked={pricing.includes(opt)}
              onChange={() => handleCheckbox(opt)}
              className="accent-green-500"
            />
            {opt}
          </label>
        ))}
        <input
          type="text"
          name="search"
          placeholder="Search by title or creator..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="ml-4 w-[350px] md:[w-400px] p-2 rounded bg-gray-800 text-white placeholder-gray-400"
        />
        {pricing.includes("Paid") && (
          <div className="mt-4 w-full">
            <label className="text-sm text-gray-300 mb-2 block">
              Price Range
            </label>
            <div className="flex items-center justify-between text-white mb-2 w-[400px]">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <div className="w-full w-[350px] md:w-[400px]">
              <RangeSlider
                min={0}
                max={999}
                step={1}
                value={priceRange}
                onInput={(value: [number, number]) =>
                  dispatch(setPriceRange(value))
                }
                className="appearance-none"
              />
            </div>
          </div>
        )}
        <button
          onClick={handleReset}
          className="ml-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center justify-end">
        <label className="mr-2">Sort by</label>
        <select
          value={sortBy}
          onChange={(e) =>
            handleSortChange(e.target.value as "name" | "high" | "low")
          }
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltersPanel;
