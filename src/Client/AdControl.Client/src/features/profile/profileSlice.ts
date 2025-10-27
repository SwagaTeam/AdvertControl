import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {apiClient} from "../../api/apiClient";

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get("/user/me");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Ошибка загрузки профиля");
        }
    }
);

export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.put("/user/update", data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Ошибка обновления профиля");
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.data = action.payload;
            });
    },
});

export default profileSlice.reducer;
