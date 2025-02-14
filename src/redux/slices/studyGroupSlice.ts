// redux/studyGroupSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../config/firebaseConfig";

export interface StudyRequest {
  id?: string;
  course: string;
  availableTimes: string;
  note?: string;
  createdAt: Date;
}

// Create a payload type that includes the current user’s uid
export interface CreateStudyRequestPayload {
  userId: string;
  course: string;
  availableTimes: string;
  note?: string;
  createdAt: Date;
}

interface StudyGroupState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StudyGroupState = {
  status: "idle",
  error: null,
};

export const createStudyRequest = createAsyncThunk(
  "studyGroup/createStudyRequest",
  async (data: CreateStudyRequestPayload) => {
    // Use the userId to reference the user's document
    const { userId, course, availableTimes, note } = data;
    const userDocRef = doc(FIREBASE_DB, "users", userId);
    // Now get a reference to the studyRequests subcollection
    const studyRequestsRef = collection(userDocRef, "studyRequests");
    // Add the new study request
    const docRef = await addDoc(studyRequestsRef, {
      course,
      availableTimes,
      note,
      createdAt: new Date(), // using current timestamp
    });
    // Return the newly created request (you could also include userId if desired)
    return {
      id: docRef.id,
      course,
      availableTimes,
      note,
      createdAt: new Date(),
    } as StudyRequest;
  }
);

const studyGroupSlice = createSlice({
  name: "studyGroup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStudyRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createStudyRequest.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createStudyRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add study request";
      });
  },
});

export default studyGroupSlice.reducer;
