import "./gesture-handler";
import React, { useEffect } from "react";
import Navigationcontainer from "./src/navigations/NavigationContainer";
import { Provider, useDispatch } from "react-redux";
import { store } from "./src/redux/store";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./src/config/firebaseConfig";
import { setAuthState, logout } from "./src/redux/slices/authSlice";

// Create a component to listen to auth state changes.
const AuthStateListener: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        // If a user is logged in, update Redux state with user info.
        dispatch(
          setAuthState({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            isAnonymous: user.isAnonymous,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            role: "user", // You can adjust this if needed.
          })
        );
      } else {
        // If the user signs out, clear the state.
        dispatch(logout());
      }
    });

    // Clean up the listener on unmount.
    return () => unsubscribe();
  }, [dispatch]);

  return null; // This component does not render anything visible.
};

export default function App() {
  return (
    <Provider store={store}>
      <AuthStateListener />
      <Navigationcontainer />
    </Provider>
  );
}
