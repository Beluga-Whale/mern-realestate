import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';

import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../../firebase';

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

export const loginWithGoogle = createAsyncThunk(
    'user/loginWithGoogle',
    async (_, thunkAPI) => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            console.log('GOOGLE', result.user);
            await axios.post('/api/auth/google', {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
            });
            window.closed;
            return result.user;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ formData, id }: { formData: object; id: string }, thunkAPI) => {
        try {
            const res = await axios.put(`/api/user/update/${id}`, formData);

            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (id: number, thunkAPI) => {
        try {
            const res = await axios.delete(`/api/user/delete/${id}`);
            return res.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

export const signOutUser = createAsyncThunk(
    'user/signOutuser',
    async (_, thunkAPI) => {
        try {
            const res = axios.get('/api/auth/signOut');
            console.log('RES SIGNOUT', res);

            return res;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);

type UserState = {
    currentUserDatabase: object | null;
    currentUserGoogle: object | null;
    error: any;
    loading: boolean;
    loginMethod: 'database' | 'google' | null;
};

const initialState: UserState = {
    currentUserDatabase: null,
    currentUserGoogle: null,
    error: null,
    loading: false,
    loginMethod: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(loginUser.pending, state => {
            state.loading = true;
            state.loginMethod = 'database';
        });
        builder.addCase(
            loginUser.fulfilled,
            (state, action: PayloadAction<object>) => {
                state.currentUserDatabase = action.payload;
                state.currentUserGoogle = null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addCase(
            loginUser.rejected,
            (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.loading = false;
                state.loginMethod = null;
            }
        );
        builder.addCase(loginWithGoogle.pending, state => {
            state.loading = true;
            state.loginMethod = 'google';
        });
        builder.addCase(
            loginWithGoogle.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.currentUserGoogle = action.payload;
                state.currentUserDatabase = null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addCase(
            loginWithGoogle.rejected,
            (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.loading = false;
                state.loginMethod = null;
            }
        );
        builder.addCase(updateUser.pending, state => {
            state.loading = true;
            state.loginMethod = 'database';
        });
        builder.addCase(
            updateUser.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.currentUserDatabase = action.payload;
                state.currentUserGoogle = null;
                state.loading = false;
                state.error = null;
            }
        );
        builder.addCase(
            updateUser.rejected,
            (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.loading = false;
                state.loginMethod = null;
            }
        );
        builder.addCase(deleteUser.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteUser.fulfilled, state => {
            state.error = null;
            state.currentUserDatabase = null;
            state.currentUserGoogle = null;
            state.loginMethod = null;
            state.loading = false;
        });
        builder.addCase(
            deleteUser.rejected,
            (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.loading = false;
            }
        );
        builder.addCase(signOutUser.pending, state => {
            state.loading = true;
        });
        builder.addCase(signOutUser.fulfilled, state => {
            state.error = null;
            state.currentUserDatabase = null;
            state.currentUserGoogle = null;
            state.loginMethod = null;
            state.loading = false;
        });
        builder.addCase(
            signOutUser.rejected,
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
