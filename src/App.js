import { useState, useEffect, useRef } from "react";
import randomWords from "random-words";

const NumbersOfWords = 250;
const SecondsCountDown = 3;

function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SecondsCountDown);
  const [currentInput, setCurrentInput] = useState("");
  const [currentWordIndex, setcurrentWordIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [currentChar, setCurrentChar] = useState("");
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  function generateWords() {
    return new Array(NumbersOfWords).fill(null).map(() => randomWords());
  }

  function StartCountDown() {
    if (status === "finished") {
      setWords(generateWords());
      setcurrentWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrentCharIndex(-1);
      setCurrentChar("");
    }

    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prevCountDown) => {
          if (prevCountDown === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrentInput("");
            return SecondsCountDown;
          } else {
            return prevCountDown - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeyDown({ keyCode, key }) {
    // 32 = spaceBar
    if (keyCode === 32) {
      checkMatch();
      setCurrentInput("");
      setcurrentWordIndex(currentWordIndex + 1);
      setCurrentCharIndex(-1);
    } else if (keyCode === 8) {
      // 8 = backspace
      setCurrentCharIndex(currentCharIndex + 1);
      setCurrentChar("");
    } else {
      setCurrentCharIndex(currentCharIndex + 1);
      setCurrentChar(key);
    }
  }

  function checkMatch() {
    const wordToCompare = words[currentWordIndex];
    const doesItMatch = wordToCompare === currentInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if (
      wordIdx === currentWordIndex &&
      charIdx === currentCharIndex &&
      currentChar &&
      status !== "finished"
    ) {
      if (char === currentChar) {
        return "has-background-success";
      } else if (
        wordIdx === currentWordIndex &&
        currentCharIndex >= words[currentWordIndex].lenght
      ) {
        return "has-background-danger";
      } else {
        return "has-background-danger";
      }
    } else {
      return "";
    }
  }

  return (
    <div className="App">
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countDown}</h2>
        </div>
      </div>

      <div className="control is-expanded section">
        <input
          type="text"
          className="input"
          onKeyDown={handleKeyDown}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          disabled={status !== "started"}
          ref={textInput}
        />
      </div>

      <div className="section">
        <button
          onClick={StartCountDown}
          className="button is-info is-fullwidth"
        >
          start
        </button>
      </div>

      {status === "started" && (
        <div className="section">
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words.map((word, i) => (
                  <span key={i}>
                    <span>
                      {word.split("").map((char, idx) => (
                        <span className={getCharClass(i, idx, char)} key={idx}>
                          {char}
                        </span>
                      ))}
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {status === "finished" && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">Words per minute:</p>
              <p className="has-text-primary is-size-1">{correct}</p>
            </div>
            <div className="column has-text-centered">
              <p className="is-size-5">Accuracy:</p>
              {correct !== 0 ? (
                <p className="has-text-info is-size-1">
                  {Math.round((correct / (correct + incorrect)) * 100)}%
                </p>
              ) : (
                <p className="has-text-info is-size-1">0%</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
