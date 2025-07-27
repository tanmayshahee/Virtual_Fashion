import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PricingOption } from "../../types/enums";

// Define the content item type (you can extend this as needed)
export interface ContentItem {
  id: number;
  imagePath: string;
  creator: string;
  title: string;
  pricingOption: PricingOption;
  price?: number;
}

interface ContentsState {
  data: ContentItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state with proper typing
const initialState: ContentsState = {
  data: [],
  status: "idle",
  error: null,
};

// Async thunk to fetch contents from API
export const fetchContents = createAsyncThunk<ContentItem[]>(
  "contents/fetchContents",
  async () => {
    const res = await axios.get<ContentItem[]>(
      "https://closet-recruiting-api.azurewebsites.net/api/data"
    );
    return res.data;
  }
);

// Slice definition
const contentsSlice = createSlice({
  name: "contents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchContents.fulfilled,
        (state, action: PayloadAction<ContentItem[]>) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )
      .addCase(fetchContents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load content.";
      });
  },
});

export default contentsSlice.reducer;
