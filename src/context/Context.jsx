import { createContext, useState, useEffect } from "react";
import { auth, db } from "../config/firebaseConfig"; // ✅ Import Firebase Firestore
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import run from "../config/gemini";

const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState(""); // Save the input data
  const [recentPrompt, setRecentPrompt] = useState(""); // The input data will be saved in recent prompt
  const [previousPrompt, setPreviousPrompt] = useState([]); // To use it in the recent tab
  const [showResult, setShowResult] = useState(false); // True: hide the current text
  const [loading, setLoading] = useState(false); // True: Loading animation
  const [resultData, setResultData] = useState(""); // To display response on webpage

  // ✅ Fetch search history from Firestore when the user logs in
  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (!auth.currentUser) return;
      const q = query(
        collection(db, "searchHistory"),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const searches = querySnapshot.docs.map((doc) => doc.data().query);
      setPreviousPrompt(searches); // ✅ Load past searches
    };

    fetchSearchHistory();
  }, [auth.currentUser]); // Fetch when the user logs in

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPreviousPrompt((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await run(input);
    }

    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i == 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += `<b id="para-${i}">${responseArray[i]}</b>`;
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }

    // ✅ Save search query to Firestore
    if (auth.currentUser) {
      await addDoc(collection(db, "searchHistory"), {
        userId: auth.currentUser.uid,
        query: prompt || input,
        timestamp: new Date(),
      });
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    previousPrompt,
    setPreviousPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export { Context, ContextProvider };