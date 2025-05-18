import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  attendanceRecords: [],
  attendanceRecord: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get all attendance records
export const getAttendanceRecords = createAsyncThunk(
  'attendance/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(
        'http://localhost:5000/api/attendance',
        config
      );
      
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get attendance records by employee ID
export const getAttendanceByEmployeeId = createAsyncThunk(
  'attendance/getByEmployeeId',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(
        `http://localhost:5000/api/attendance/employee/${id}`,
        config
      );
      
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get attendance records by date
export const getAttendanceByDate = createAsyncThunk(
  'attendance/getByDate',
  async (date, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(
        `http://localhost:5000/api/attendance/date/${date}`,
        config
      );
      
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new attendance record
export const createAttendance = createAsyncThunk(
  'attendance/create',
  async (attendanceData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(
        'http://localhost:5000/api/attendance',
        attendanceData,
        config
      );
      
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update attendance record
export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async ({ id, attendanceData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(
        `http://localhost:5000/api/attendance/${id}`,
        attendanceData,
        config
      );
      
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete attendance record
export const deleteAttendance = createAsyncThunk(
  'attendance/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(
        `http://localhost:5000/api/attendance/${id}`,
        config
      );
      
      return id;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearAttendanceRecord: (state) => {
      state.attendanceRecord = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttendanceRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendanceRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendanceRecords = action.payload;
      })
      .addCase(getAttendanceRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAttendanceByEmployeeId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendanceByEmployeeId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendanceRecords = action.payload;
      })
      .addCase(getAttendanceByEmployeeId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAttendanceByDate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendanceByDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendanceRecords = action.payload;
      })
      .addCase(getAttendanceByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendanceRecords.push(action.payload);
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendanceRecords = state.attendanceRecords.map((record) =>
          record.attendanceId === action.payload.attendanceId ? action.payload : record
        );
        state.attendanceRecord = action.payload;
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendanceRecords = state.attendanceRecords.filter(
          (record) => record.attendanceId !== action.payload
        );
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearAttendanceRecord } = attendanceSlice.actions;
export default attendanceSlice.reducer;
