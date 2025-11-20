import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunks – gọi API
export const fetchActivities = createAsyncThunk(
  "activity/fetchActivities",
  async (khoaId = null, { rejectWithValue }) => {
    try {
      const res = await api.get("/activities", { params: { khoaId } });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Lỗi tải danh sách hoạt động"
      );
    }
  }
);

export const fetchMyRegistrations = createAsyncThunk(
  "activity/fetchMyRegistrations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/registrations/my");
      return res.data;
    } catch (err) {
      return rejectWithValue("Lỗi tải hoạt động đã đăng ký");
    }
  }
);

export const fetchPendingEvidences = createAsyncThunk(
  "activity/fetchPendingEvidences",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/evidences/pending");
      return res.data;
    } catch (err) {
      return rejectWithValue("Lỗi tải minh chứng chờ duyệt");
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    activities: [],
    myRegistrations: [],
    pendingEvidences: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Activities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // My Registrations
      .addCase(fetchMyRegistrations.fulfilled, (state, action) => {
        state.myRegistrations = action.payload;
      })

      // Pending Evidences
      .addCase(fetchPendingEvidences.fulfilled, (state, action) => {
        state.pendingEvidences = action.payload;
      });
  },
});

export const { clearError } = activitySlice.actions;
export default activitySlice.reducer;
