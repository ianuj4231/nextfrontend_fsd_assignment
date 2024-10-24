import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CreateUserDto {
    id?: number;
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

const initialState: CreateUserDto = {
    username: '',
    phone: '',
    email: '',
    gender: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<CreateUserDto>) => {
            return { ...state, ...action.payload };
        },
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
