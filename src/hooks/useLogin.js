import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { appAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

const useLogin = () => {
  // 에러 정보 저장
  const [error, setError] = useState(null);
  //현재 서버, 통신 상태 저장
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = (email, password) => {
    setError(null); // 아직 에러가 없음
    setIsPending(true); // 통신중

    // 1) 회원 가입 진행
    signInWithEmailAndPassword(appAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        dispatch({ type: "login", payload: user });
        setError(null);
        setIsPending(false); // 정보를 받아온 상태이므로 통신x

        if (!user) {
          throw new Error("회원가입 실패");
        }

        // 2) 회원 정보 업데이트 : displayName
        /* updateProfile(appAuth.currentUser, { displayName })
          .then(() => {
            dispatch({ type: "login", payload: user });
            setError(null);
            setIsPending(false);
          })
          .catch((error) => 
            setError(error.message);
            setIsPending(false);
            console.log(error.message);
          });*/
      })
      .catch((error) => {
        setError(error.message);
        setIsPending(false);
        console.log(error.message);
      });
  };
  return { error, isPending, login };
};

export default useLogin;
