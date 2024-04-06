import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useReducer } from "react";
import { appFireStore, timestamp } from "../firebase/config";

const initState = {
  document: null,
  isPending: false,
  error: null,
  success: false,
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case "isPending":
      return { document: null, isPending: true, error: null, success: false };
    case "addDoc":
      return {
        document: action.payload,
        isPending: false,
        error: null,
        success: true,
      };
    case "error":
      return {
        document: null,
        isPending: false,
        error: action.payload,
        success: false,
      };
    case "deleteDoc":
      return {
        document: action.payload,
        isPending: false,
        error: null,
        success: true,
      };
    default:
      return state;
  }
};

// 저장할 컬랙션을 인자로 전달한다
export const useFirestore = (transaction) => {
  const [response, dispatch] = useReducer(storeReducer, initState);

  // colRef : 컬렉션의 참조를 요구한다
  // 없으면 자동 생성
  const colRef = collection(appFireStore, transaction);

  // 컬렉션에 문서를 추가한다
  const addDocument = async (doc) => {
    dispatch({ type: "isPending" });

    try {
      const createdTime = timestamp.fromDate(new Date());
      const docRef = await addDoc(colRef, { ...doc, createdTime });
      console.log(docRef);
      dispatch({ type: "addDoc", payload: docRef });
    } catch (error) {
      dispatch({ type: "error", payload: error.message });
    }
  };

  // 컬렉션에서 문서를 제거한다
  const deleteDocument = async (id) => {
    dispatch({ type: "isPending" });

    try {
      const docRef = await deleteDoc(doc(colRef, id));
      // console.log(docRef);
      dispatch({ type: "deleteDoc", payload: docRef });
    } catch (error) {
      dispatch({ type: "error", payload: error.message });
    }
  };
  return { addDocument, deleteDocument, response };
};
