import React, { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { assets } from "./../../assets/assets";
import { Context } from "../../context/Context";
import { auth, db } from "../../config/firebaseConfig"; // ✅ Import Firestore
import { collection, getDocs, query, where } from "firebase/firestore";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const {
    onSent,
    previousPrompt,
    setPreviousPrompt,
    setRecentPrompt,
    newChat,
  } = useContext(Context);

  // ✅ Fetch past searches from Firestore when the Sidebar loads
  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (!auth.currentUser) {
        console.log("User not logged in");
        return;
      }

      try {
        const q = query(
          collection(db, "searchHistory"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const searches = querySnapshot.docs.map((doc) => doc.data().query);
        setPreviousPrompt(searches);
        console.log("Fetched search history:", searches);
      } catch (error) {
        console.error("Error fetching search history:", error);
      }
    };

    fetchSearchHistory();
  }, []);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  const changeState = (extended, setExtended) => {
    setExtended(!extended);
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => changeState(extended, setExtended)}
          className="menu"
          src={assets.menu_icon}
          alt="Menu Icon"
        />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="New Chat Icon" />
          {extended ? <p>New Chat</p> : null}
        </div>

        {/* ✅ Display past searches from Firestore */}
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {previousPrompt.length > 0 ? (
              previousPrompt.map((item, index) => (
                <div
                  key={index}
                  onClick={() => loadPrompt(item)}
                  className="recent-entry"
                >
                  <img src={assets.message_icon} alt="Message Icon" />
                  <p>{item.slice(0, 18)}...</p>
                </div>
              ))
            ) : (
              <p className="no-history">No recent searches</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Sidebar;