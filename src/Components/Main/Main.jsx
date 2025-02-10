import { useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import "./Main.css";
import useSpeechRecognition from "../../Hooks/SpeechRecognition";
const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);
  const { transcript, isListening, startListening } = useSpeechRecognition();
  useEffect(() => {
    if (transcript) {
      setInput(transcript); // ✅ Set the recognized text in the input field
    }
  }, [transcript, setInput]);

  return (
    <div className="main">
      <div className="nav">
        <p>Autobot</p>
        <img src={assets.user_icon} alt=""></img>
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Human</span>
              </p>
              <p>How can i help you today?</p>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt=""></img>
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon}></img>
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSent()}
              type="text"
              value={input}
              placeholder="Enter your query"
            />
            <div>
              <img
                src={assets.mic_icon}
                onClick={startListening} // Start voice input when clicked
                style={{ cursor: "pointer", opacity: isListening ? 0.5 : 1 }}
              />
              {/* {input && (
                <img onClick={onSent} src={assets.send_icon} alt="Send" />
              )} */}
              {input ? (
                <img onClick={() => onSent()} src={assets.send_icon}></img>
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Autobot may have accurate info. It is still on training. (Works only on Google Chrome)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
