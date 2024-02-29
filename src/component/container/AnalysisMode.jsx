import { useContext } from "react";
import { WCcontext } from "../../context/WCcontext";
import { useState, useRef, useCallback } from "react";
import CharButtonCard from "../presentation/CharButtonCard";
import WordBox from "../presentation/WordBox";
import CharButton from "../presentation/CharButton";
import Search from "./Search";
import { Button } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form";

export default function AnalysisMode({ display }) {
  const { WC, setWC } = useContext(WCcontext);
  const [wordInput, setWordInput] = useState("");
  const [charInput, setCharInput] = useState("");
  const [exceptWords, setExceptWords] = useState([]);
  const [chart, setChart] = useState([]);
  const [isAnalysis, setIsAnalysis] = useState(false);
  const [simulNum, setSimulNum] = useState(0);
  const [simulTrail, setSimulTrail] = useState([]);
  const [engine, setEngine] = useState(0);
  const id = useRef(0);
  const WCworker = useRef();
  const currRunningEngine = useRef(0);
  const onWordInputChange = (e) => {
    if (e.target.value[e.target.value.length - 1] !== " ") {
      setWordInput(e.target.value);
      return;
    }
    const inputWords = wordInput.trim().split(" ");
    setWordInput("");
    for (let inputWord of inputWords) {
      if (inputWord.length === 0) {
        continue;
      }
      if (WC.word_list.includes(inputWord)) {
        addExceptWord(inputWord);
      }
    }
  };

  const addExceptWord = useCallback((wordText) => {
    const word = { text: wordText, id: id.current++ };

    setExceptWords((curr) => [...curr, word]);
    setCharInput(WC.rule.tail(wordText));
  });

  const analysisStart = () => {
    if (isAnalysis === false) {
      setIsAnalysis(true);
      setChart([]);
      setSimulTrail([]);
      currRunningEngine.current = engine;
      const excepts = exceptWords.map((e) => e.text);
      WCworker.current = new Worker(
        new URL("../../worker/worker.js", import.meta.url),
        {
          type: "module",
        }
      );

      const data = {
        rule: WC.rule.getRuleObj(),
        word_list: WC.word_list.filter((e) => !excepts.includes(e)),
        currChar: charInput,
        action: engine === 0 ? "analysis-mcts" : "analysis-exhaustive",
      };

      WCworker.current.postMessage(data);

      if (engine === 0) {
        WCworker.current.onmessage = ({ data }) => {
          setChart(getChart(data.chart));
          setSimulNum(data.num);
          setSimulTrail(data.trail);
          if (data.num >= 1000000 || data.terminate === true) {
            setIsAnalysis(false);
            WCworker.current.terminate();
          }
        };
      } else if (engine === 1) {
        WCworker.current.onmessage = ({ data }) => {
          if (data.word) {
            setChart((curr) => [
              ...curr,
              <div className="chart-item" key={data.word}>
                <CharButton key={`${data.word}`} type="cir" strength={`${0}`}>
                  {data.word}
                  <img
                    className="delete-icon"
                    onClick={() => {
                      if (data.word.length === 1) {
                        setCharInput(data.word);
                        return;
                      }
                      addExceptWord(data.word);
                    }}
                    src="icon/add_FILL0_wght400_GRAD0_opsz24.svg"
                  />
                </CharButton>
                <span className="analysis-exhaustive-result">
                  {data.win ? "승" : "패"}
                </span>
              </div>,
            ]);
          }
          if (data.trail) {
            setSimulTrail(data.trail);
          }
          if (data.terminate) {
            setIsAnalysis(false);
            setSimulTrail([]);
            WCworker.current.terminate();
          }
        };
      }
    }
    if (isAnalysis === true) {
      setIsAnalysis(false);
      WCworker.current.terminate();
    }
  };
  const getChart = (chartData) => {
    if (engine === 0) {
      const words = Object.keys(chartData).sort(
        (a, b) => chartData[b] - chartData[a]
      );
      const chart = words.map((word) => (
        <div className="chart-item" key={word}>
          <CharButton key={`${word}`} type="cir" strength={`${0}`}>
            {word}
            <img
              className="delete-icon"
              onClick={() => {
                if (word.length === 1) {
                  setCharInput(word);
                  return;
                }
                addExceptWord(word);
              }}
              src="icon/add_FILL0_wght400_GRAD0_opsz24.svg"
            />
          </CharButton>
          <span className="progress-bar-wrap">
            <ProgressBar
              className="analysis-bar"
              now={chartData[word] * 100}
              label={`${Math.round(chartData[word] * 10000) / 100}%`}
            />
          </span>
        </div>
      ));
      return chart;
    } else if (engine === 1) {
      return;
    }
  };

  return (
    WC && (
      <div style={{ display: display ? "block" : "none" }}>
        <div className="analysis-setting">
          <div className="setting-body">
            <div className="analysis-box">
              <div className="title">
                제외할 단어{" "}
                <span style={{ fontWeight: "500", color: "gray" }}>
                  (공백으로 구분)
                </span>
              </div>
              <WordBox>
                <CharButtonCard>
                  {exceptWords.map((word) => (
                    <CharButton
                      key={`${word.id}`}
                      type="cir"
                      strength={`${0}`}
                      delete="true"
                    >
                      {word.text}
                      <img
                        className="delete-icon"
                        onClick={() =>
                          setExceptWords(
                            exceptWords.filter((e) => e.id != word.id)
                          )
                        }
                        src="icon/close_FILL1_wght400_GRAD0_opsz24.svg"
                      />
                    </CharButton>
                  ))}
                  <input
                    className="analysis-input"
                    type="search"
                    placeholder="제외할 단어를 입력해주세요."
                    value={wordInput || ""}
                    onChange={onWordInputChange}
                  />
                </CharButtonCard>
              </WordBox>
            </div>

            <div className="analysis-box">
              <div className="title">시작 글자</div>
              <Search input={charInput} setInput={setCharInput}></Search>
            </div>
            <div className="analysis-box">
              <div className="title">분석 방법</div>
              <Form.Select
                aria-label="Default select example"
                value={engine}
                onChange={(e) => {
                  setEngine(parseInt(e.target.value));
                }}
              >
                <option value="0">MCTS</option>
                <option value="1">완전탐색</option>
              </Form.Select>
            </div>
          </div>

          <div className="setting-foot">
            <Button
              className="analysis-btn"
              variant="primary"
              onClick={analysisStart}
            >
              {isAnalysis ? "분석 중지" : "분석 시작"}
              {isAnalysis ? (
                <img
                  className="analysis-icon"
                  src="icon/stop_FILL1_wght400_GRAD0_opsz24.svg"
                />
              ) : (
                <img
                  className="analysis-icon"
                  src="icon/play_arrow_FILL1_wght400_GRAD0_opsz24.svg"
                />
              )}
            </Button>
          </div>
        </div>
        <div className="analysis-result">
          {currRunningEngine.current === 0 ? (
            <>
              <div className="analysis-num">
                <span className="title">시뮬레이션</span> : {simulNum} 회
              </div>
              <div className="analysis-trail overflow">
                {simulTrail.join(" - ")}
              </div>
              <div className="chart-wrap">{chart}</div>
            </>
          ) : (
            <>
              <div className="chart-wrap">{chart}</div>
              <div className="analysis-trail">{simulTrail.join(" - ")}</div>
            </>
          )}
        </div>
        <div className="padding"></div>
      </div>
    )
  );
}
