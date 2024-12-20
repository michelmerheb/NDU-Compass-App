import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  User,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthPayload {
  email: string;
  password: string;
}

interface UserState {
  user: Partial<User> | null;
  isLoading: boolean;
  error: string | null;
  isAuth: boolean;
}

const transformUser = (user: User): Partial<User> => ({
  uid: user.uid,
  email: user.email,
  emailVerified: user.emailVerified,
  displayName: user.displayName,
  isAnonymous: user.isAnonymous,
  phoneNumber: user.phoneNumber,
  photoURL: user.photoURL,
  providerData: user.providerData,
});

export const loginUser = createAsyncThunk<
  Partial<User>,
  AuthPayload,
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, thunkAPI) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    const user = transformUser(userCredential.user);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Incorrect email/password");
  }
});

export const signupUser = createAsyncThunk<
  Partial<User>,
  AuthPayload,
  { rejectValue: string }
>("auth/signupUser", async ({ email, password }, thunkAPI) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    const user = transformUser(userCredential.user);
    await sendEmailVerification(userCredential.user);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue("User already exists");
  }
});

export const resetPassword = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("auth/resetPassword", async ({ email }, thunkAPI) => {
  try {
    await sendPasswordResetEmail(FIREBASE_AUTH, email);
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      return thunkAPI.rejectWithValue(
        "Email not found in the database. Please enter a valid email."
      );
    }
    return thunkAPI.rejectWithValue("Error sending password reset email.");
  }
});

export const delete_User = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/deleteUser", async (_, thunkAPI) => {
  try {
    await deleteUser(FIREBASE_AUTH.currentUser!);
    await AsyncStorage.removeItem("user");
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.error = null;
      AsyncStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthState: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuth = false;
      })
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuth = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(delete_User.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(delete_User.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuth = false;
      })
      .addCase(delete_User.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setAuthState } = authSlice.actions;
export default authSlice.reducer;
