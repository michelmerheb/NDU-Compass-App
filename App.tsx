import "./gesture-handler";
import React, { useEffect } from "react";
import Navigationcontainer from "./src/navigations/NavigationContainer";
import { Provider, useDispatch } from "react-redux";
import { store } from "./src/redux/store";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./src/config/firebaseConfig";
import { setAuthState, logout } from "./src/redux/slices/authSlice";
import { getDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "./src/config/firebaseConfig";

// Create a component to listen to auth state changes.
const AuthStateListener: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        // Force a user data refresh to get latest emailVerified status
        await user.reload();

        // Get user role from Firestore
        const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : "user";

        dispatch(
          setAuthState({
            uid: user.uid,
            emailVerified: user.emailVerified,
            role: role,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

export default function App() {
  return (
    <Provider store={store}>
      <AuthStateListener />
      <Navigationcontainer />
    </Provider>
  );
}
