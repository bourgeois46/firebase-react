import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuthContext = () => {
  const context = useContext(AuthContext);

  return context; // state와 dispatch 함수가 들어있다
};

export { useAuthContext };
