import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  payrollRecords: [],
  payrollRecord: null,
  report: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get all payroll records
export const getPayrollRecords = createAsyncThunk(
  'payroll/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(
        'http://localhost:5000/api/payroll',
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

// Get payroll records by employee ID
export const getPayrollByEmployeeId = createAsyncThunk(
  'payroll/getByEmployeeId',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(
        `http://localhost:5000/api/payroll/employee/${id}`,
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

// Get payroll records by period
export const getPayrollByPeriod = createAsyncThunk(
  'payroll/getByPeriod',
  async (period, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(
        `http://localhost:5000/api/payroll/period/${period}`,
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

// Create new payroll record
export const createPayroll = createAsyncThunk(
  'payroll/create',
  async (payrollData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(
        'http://localhost:5000/api/payroll',
        payrollData,
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

// Process payroll for all employees
export const processPayroll = createAsyncThunk(
  'payroll/process',
  async (payPeriod, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(
        'http://localhost:5000/api/payroll/process',
        { payPeriod },
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

// Generate payroll report
export const generatePayrollReport = createAsyncThunk(
  'payroll/generateReport',
  async (period, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(
        `http://localhost:5000/api/payroll/report/${period}`,
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

// Update payroll record
export const updatePayroll = createAsyncThunk(
  'payroll/update',
  async ({ id, payrollData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(
        `http://localhost:5000/api/payroll/${id}`,
        payrollData,
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

// Delete payroll record
export const deletePayroll = createAsyncThunk(
  'payroll/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(
        `http://localhost:5000/api/payroll/${id}`,
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

export const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearPayrollRecord: (state) => {
      state.payrollRecord = null;
    },
    clearReport: (state) => {
      state.report = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayrollRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPayrollRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payrollRecords = action.payload;
      })
      .addCase(getPayrollRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPayrollByEmployeeId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPayrollByEmployeeId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payrollRecords = action.payload;
      })
      .addCase(getPayrollByEmployeeId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPayrollByPeriod.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPayrollByPeriod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payrollRecords = action.payload;
      })
      .addCase(getPayrollByPeriod.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPayroll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPayroll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payrollRecords.push(action.payload);
      })
      .addCase(createPayroll.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(processPayroll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(processPayroll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload.results && action.payload.results.length > 0) {
          state.payrollRecords = [...state.payrollRecords, ...action.payload.results];
        }
      })
      .addCase(processPayroll.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(generatePayrollReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generatePayrollReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.report = action.payload;
      })
      .addCase(generatePayrollReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updatePayroll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePayroll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payrollRecords = state.payrollRecords.map((record) =>
          record.payrollId === action.payload.payrollId ? action.payload : record
        );
        state.payrollRecord = action.payload;
      })
      .addCase(updatePayroll.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePayroll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePayroll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payrollRecords = state.payrollRecords.filter(
          (record) => record.payrollId !== action.payload
        );
      })
      .addCase(deletePayroll.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearPayrollRecord, clearReport } = payrollSlice.actions;
export default payrollSlice.reducer;
