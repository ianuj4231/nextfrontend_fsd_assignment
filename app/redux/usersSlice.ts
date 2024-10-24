import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id?: number ;
  username: string;
  phone: string;
  email: string;
  gender: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

export interface CounterState {
  data: User[];
  loading: boolean;
  error: string;
}

const initialState: CounterState = {
  data: [],
  loading: false,
  error: "",
};

export const getAllUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('http://localhost:3001/api/users');
      console.log('Response from fetchUsers:', response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch users');
    }
  }
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    deleteUserLocally: (state, action: PayloadAction<number>) => {
        state.data = state.data.filter((x) => x.id !== action.payload);
      },
      updateUserLocally: (state, action: PayloadAction<User>) => {
        const idx = state.data.findIndex((x) => x.id === action.payload.id);
        if (idx>=0) {
          state.data[idx] = action.payload;
        }
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.error = "";
        state.data = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
        state.data = [];
      });
  },
});

export const { deleteUserLocally, updateUserLocally } = usersSlice.actions;

export default usersSlice.reducer;
