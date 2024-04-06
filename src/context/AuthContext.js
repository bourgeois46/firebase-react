import { createContext, useReducer, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { appAuth } from "../firebase/config";

// context 객체 생성
const AuthContext = createContext();

// State가 아닌 Reducer 사용하는 이유 -> state 훅은 단순한 형태의 데이터(문자열, 숫자형)을 다루는데 적합 / 객체x -> Reducer 훅
const authReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload };
    case "logout":
      return { ...state, user: null };
    case "isAuthReady":
      return { ...state, user: action.payload, isAuthReady: true };
    default:
      return state;
  }
};

// context를 구독할 컴포넌트의 묶음 범위를 설정한다
const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthReady: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(appAuth, (user) => {
      dispatch({ type: "isAuthReady", payload: user });
    });
    return unsubscribe;
  }, []);

  console.log("user state : ", state);

  return (
    // 확장성 고려해서 전개 연산자 사용
    // dispatch -> authReducer 호출 -> state 업데이트
    // dispatch 를 context에 담아서 전역에서 공유 -> 회원정보가 바뀔때마다 dispatch 실행 -> user 업데이트
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
