import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';
import { useNavigate } from 'react-router-dom';

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (fromData: object, thunkAPI) => {
        try {
            const res = await axios.post('/api/auth/signin', fromData);
            console.log('userSlice:', res.data);

            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

type UserState = {
    currentUser: object | null;
    error: any;
    loading: boolean;
};

const initialState: UserState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(loginUser.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            loginUser.fulfilled,
            (state, action: PayloadAction<object>) => {
                state.currentUser = action.payload;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addCase(
            loginUser.rejected,
            (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.loading = false;
            }
        );
    },
});

export const {} = userSlice.actions;
export const userSelector = (store: RootState) => store.user;
export default userSlice.reducer;
