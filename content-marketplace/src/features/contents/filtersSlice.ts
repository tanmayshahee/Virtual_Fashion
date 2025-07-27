import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  pricing: string[]; // Example: ['Paid', 'Free']
  search: string;
  sortBy: "name" | "high" | "low"; // 'name' = Item Name, 'high' = Higher Price, 'low' = Lower Price
  priceRange: [number, number]; // min, max
}

const initialState: FiltersState = {
  pricing: [],
  search: "",
  sortBy: "name",
  priceRange: [0, 999],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setPriceRange(state, action: PayloadAction<[number, number]>) {
      state.priceRange = action.payload;
    },
    setPricingFilter(state, action: PayloadAction<string[]>) {
      state.pricing = action.payload;
    },
    setSearchKeyword(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setSortBy(state, action: PayloadAction<"name" | "high" | "low">) {
      state.sortBy = action.payload;
    },
    resetFilters(state) {
      state.pricing = [];
      state.search = "";
      state.sortBy = "name";
    },
  },
});

export const {
  setPricingFilter,
  setSearchKeyword,
  setSortBy,
  setPriceRange,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
