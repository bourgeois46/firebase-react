import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { appAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

const useLogout = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false); // 통신 상태
  const { dispatch } = useAuthContext();

  const logout = () => {
    setError(null);
    setIsPending(true);

    signOut(appAuth)
      .then(() => {
        // Sign-out successful.
        dispatch({ type: "logout" });
        setError(null);
        setIsPending(false);
      })
      .catch((error) => {
        // An error happened.
        setError(error.message);
        setIsPending(false);
      });
  };

  return { error, isPending, logout };
};

export default useLogout;
