import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";
import { search, SearchCondition } from "apis/user-api";
import { User } from "schema";

const STORE_NAME = "randomuser";

export interface UserState {
  status: "idle" | "loading" | "failed";
  user: User;
}

const initialState: UserState = {
  status: "idle",
  user: {
    id: {
      name: "",
      value: "",
    },
    name: {
      title: "",
      first: "",
      last: "",
    },
    gender: "",
    picture: {
      large: "",
      medium: "",
      thumbnail: "",
    },
    email: "",
  },
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const searchAsync = createAsyncThunk(
  STORE_NAME + "/search",
  async (condition: SearchCondition) => {
    const response = await search(condition);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const userSlice = createSlice({
  name: STORE_NAME,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(searchAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.data;
      })
      .addCase(searchAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
