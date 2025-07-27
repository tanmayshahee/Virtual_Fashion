import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppSelector } from "../app/hooks";
import { ContentItem } from "../features/contents/contentsSlice";
import { PricingOption } from "../types/enums";

const ITEMS_PER_PAGE = 12;

const enumValueToLabel: Record<PricingOption, string> = {
  [PricingOption.PAID]: "Paid",
  [PricingOption.FREE]: "Free",
  [PricingOption.VIEW_ONLY]: "View Only",
};

const labelToEnumValue: Record<string, PricingOption> = {
  Paid: PricingOption.PAID,
  Free: PricingOption.FREE,
  "View Only": PricingOption.VIEW_ONLY,
};

const ContentGrid = () => {
  const { data, status } = useAppSelector((state) => state.contents);
  const { pricing, search, sortBy, priceRange } = useAppSelector(
    (state) => state.filters
  );

  const filtered = data.filter((item: ContentItem) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.creator.toLowerCase().includes(search.toLowerCase());

    const selectedEnumValues = pricing.map((label) => labelToEnumValue[label]);
    const matchPricing =
      pricing.length === 0 || selectedEnumValues.includes(item.pricingOption);

    const matchPriceRange =
      item.pricingOption !== PricingOption.PAID ||
      ((item.price ?? 0) >= priceRange[0] &&
        (item.price ?? 0) <= priceRange[1]);

    return matchSearch && matchPricing && matchPriceRange;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "high") {
      return (b.price ?? 0) - (a.price ?? 0);
    } else if (sortBy === "low") {
      return (a.price ?? 0) - (b.price ?? 0);
    }
    return 0;
  });

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const visibleData = sorted.slice(0, visibleCount);

  const fetchMoreData = () => {
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    }, 500);
  };

  if (status === "loading") return <p className="text-white">Loading...</p>;
  if (status === "failed")
    return <p className="text-red-500">Error loading data.</p>;
  if (sorted.length === 0)
    return <p className="text-gray-400">No matching results found.</p>;

  return (
    <InfiniteScroll
      dataLength={visibleData.length}
      next={fetchMoreData}
      hasMore={visibleData.length < sorted.length}
      loader={<p className="text-white mt-4">Loading more...</p>}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleData.map((item: ContentItem, idx: number) => (
          <div
            key={`${item.title}-${idx}`}
            className="bg-gray-800 text-white rounded p-4 shadow-md"
          >
            <img
              src={item.imagePath}
              alt={item.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-gray-400">{item.creator}</p>
            <p className="mt-2">
              {item.pricingOption === PricingOption.PAID ? (
                <span className="text-green-400 font-semibold">
                  ${item.price}
                </span>
              ) : (
                <span className="text-yellow-400">
                  {enumValueToLabel[item.pricingOption]}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default ContentGrid;
