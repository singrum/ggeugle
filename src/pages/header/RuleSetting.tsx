import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  useReducer,
  useCallback,
} from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ToggleButton from "react-bootstrap/ToggleButton";
import { Settings, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { getEngine } from "@/lib/wc/ruleUpdate";
import { RuleForm, useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { MenuBtn } from "@/App";

export function RuleSetting() {
  const rule = useWC((state) => state.rule);
  const setRule = useWC((state) => state.setRule);
  const worker = useWC((state) => state.worker);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [ruleForm, setRuleForm] = useState<RuleForm>({ ...rule });
  const [isHeadValid, setIsHeadValid] = useState(true);
  const [isTailValid, setIsTailValid] = useState(true);
  const [disabled, setDisabled] = useState(
    rule.dict === 0 || rule.dict === 2 || rule.dict === 3
  );
  useEffect(() => {
    makeWC();
  }, []);
  useEffect(() => {
    const minLen = ruleForm.len.findIndex((e) => e === true) + 2;

    setIsHeadValid(
      typeof ruleForm.headIdx === "number" &&
        ruleForm.headIdx <= minLen &&
        ruleForm.headIdx > 0
    );
    setIsTailValid(
      typeof ruleForm.tailIdx === "number" &&
        ruleForm.tailIdx <= minLen &&
        ruleForm.tailIdx > 0
    );
  }, [ruleForm.len, ruleForm.headIdx, ruleForm.tailIdx]);

  useEffect(() => {
    if (ruleForm.dict === 0 || ruleForm.dict === 2 || ruleForm.dict === 3) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [ruleForm.dict]);

  async function makeWC() {
    if (!isHeadValid || !isTailValid) return;

    setRule(ruleForm);
    setModalOpen(false);

    worker!.postMessage({ action: "getEngine", data: ruleForm });
  }
  return (
    <Dialog
      onOpenChange={(e) => {
        setModalOpen(e);
        setRuleForm({ ...rule });
      }}
    >
      <DialogTrigger>
        <MenuBtn icon={<Settings2 strokeWidth={1.5} />} name={"룰 변경"} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>룰 설정</DialogTitle>
        </DialogHeader>
        <DialogDescription>끝말잇기 룰 설정</DialogDescription>
        <div className="">
          <Setting1 ruleForm={ruleForm} setRuleForm={setRuleForm} />
          <Setting9 ruleForm={ruleForm} setRuleForm={setRuleForm} />
          <Setting2 ruleForm={ruleForm} setRuleForm={setRuleForm} />
          <Setting3
            ruleForm={ruleForm}
            setRuleForm={setRuleForm}
            disabled={disabled}
          />
          <Setting4 ruleForm={ruleForm} setRuleForm={setRuleForm} />
          <Setting8 ruleForm={ruleForm} setRuleForm={setRuleForm} />

          <Setting5 ruleForm={ruleForm} setRuleForm={setRuleForm} />
          <Setting6
            ruleForm={ruleForm}
            setRuleForm={setRuleForm}
            isHeadValid={isHeadValid}
            isTailValid={isTailValid}
          />
          <Setting7 ruleForm={ruleForm} setRuleForm={setRuleForm} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Setting1({
  ruleForm,
  setRuleForm,
}: {
  ruleForm: RuleForm;
  setRuleForm: React.Dispatch<React.SetStateAction<RuleForm>>;
}) {
  return (
    <div className="setting-wrap">
      <div className="setting-select" id="dict">
        <span className="title">사전</span>
        <Form.Select
          aria-label="Default select example"
          value={ruleForm.dict}
          onChange={(e) => {
            setRuleForm({ ...ruleForm, dict: parseInt(e.target.value) });
          }}
        >
          <option value="0">(구)표준국어대사전</option>
          <option value="3">(신)표준국어대사전</option>
          <option value="1">우리말샘</option>
          {/* <option value="2">한국어기초사전</option> */}
        </Form.Select>
      </div>
    </div>
  );
}

function ToggleBtn({
  value,
  defaultChecked,
  onChange,
  className,
  disabled,
  children,
}: {
  value: any;
  defaultChecked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <ToggleButton
      id={`toggle-check${value}`}
      type="checkbox"
      variant="outline-dark"
      checked={checked}
      onChange={(e) => {
        setChecked(e.currentTarget.checked);
        onChange(e);
      }}
      value={value}
      className={className}
      disabled={disabled}
    >
      {children}
    </ToggleButton>
  );
}

function Setting2({
  ruleForm,
  setRuleForm,
}: {
  ruleForm: RuleForm;
  setRuleForm: React.Dispatch<React.SetStateAction<RuleForm>>;
}) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const resultLen = [...ruleForm.len];
    resultLen[parseInt(e.target.value)] = e.target.checked;
    setRuleForm({ ...ruleForm, pos: resultLen });
  };
  return (
    <div className="setting-wrap">
      <div className="setting-toggle" id="pos">
        <div className="title">품사</div>
        <div className="toggle-box">
          <ToggleBtn
            value="0"
            defaultChecked={ruleForm.pos[0]}
            onChange={onChange}
          >
            명사
          </ToggleBtn>
          <ToggleBtn
            value="1"
            defaultChecked={ruleForm.pos[1]}
            onChange={onChange}
          >
            의존명사
          </ToggleBtn>
          <ToggleBtn
            value="2"
            defaultChecked={ruleForm.pos[2]}
            onChange={onChange}
          >
            대명사
          </ToggleBtn>
          <ToggleBtn
            value="3"
            defaultChecked={ruleForm.pos[3]}
            onChange={onChange}
          >
            수사
          </ToggleBtn>
          <ToggleBtn
            value="4"
            defaultChecked={ruleForm.pos[4]}
            onChange={onChange}
          >
            부사
          </ToggleBtn>
          <ToggleBtn
            value="5"
            defaultChecked={ruleForm.pos[5]}
            onChange={onChange}
          >
            관형사
          </ToggleBtn>
          <ToggleBtn
            value="6"
            defaultChecked={ruleForm.pos[6]}
            onChange={onChange}
          >
            감탄사
          </ToggleBtn>
          <ToggleBtn
            value="7"
            defaultChecked={ruleForm.pos[7]}
            onChange={onChange}
          >
            구
          </ToggleBtn>
        </div>
      </div>
    </div>
  );
}

function Setting3({
  ruleForm,
  setRuleForm,
  disabled,
}: {
  ruleForm: RuleForm;
  setRuleForm: React.Dispatch<React.SetStateAction<RuleForm>>;
  disabled: boolean;
}) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const resultLen = [...ruleForm.len];
    resultLen[parseInt(e.target.value)] = e.target.checked;
    setRuleForm({ ...ruleForm, cate: resultLen });
  };

  return (
    <div className="setting-wrap">
      <div className="setting-toggle" id="cate">
        <div className="title">범주</div>
        <div className="toggle-box">
          <ToggleBtn
            value="10"
            disabled={disabled}
            defaultChecked={ruleForm.cate[0]}
            onChange={onChange}
          >
            일반어
          </ToggleBtn>
          <ToggleBtn
            value="11"
            disabled={disabled}
            defaultChecked={ruleForm.cate[1]}
            onChange={onChange}
          >
            방언
          </ToggleBtn>
          <ToggleBtn
            value="12"
            disabled={disabled}
            defaultChecked={ruleForm.cate[2]}
            onChange={onChange}
          >
            북한어
          </ToggleBtn>
          <ToggleBtn
            value="13"
            disabled={disabled}
            defaultChecked={ruleForm.cate[3]}
            onChange={onChange}
          >
            옛말
          </ToggleBtn>
        </div>
      </div>
    </div>
  );
}

function Setting4({
  ruleForm,
  setRuleForm,
}: {
  ruleForm: RuleForm;
  setRuleForm: React.Dispatch<React.SetStateAction<RuleForm>>;
}) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const resultLen = [...ruleForm.len];
    resultLen[parseInt(e.target.value)] = e.target.checked;
    setRuleForm({ ...ruleForm, len: resultLen });
  };

  return (
    <div className="setting-wrap">
      <div className="setting-range" id="len">
        <div className="title">글자수</div>
        <div className="range-box">
          <ToggleBtn
            value="20"
            defaultChecked={ruleForm.len[0]}
            onChange={onChange}
          >
            2
          </ToggleBtn>
          <ToggleBtn
            value="21"
            defaultChecked={ruleForm.len[1]}
            onChange={onChange}
          >
            3
          </ToggleBtn>
          <ToggleBtn
            value="22"
            defaultChecked={ruleForm.len[2]}
            onChange={onChange}
          >
            4
          </ToggleBtn>
          <ToggleBtn
            value="23"
            defaultChecked={ruleForm.len[3]}
            onChange={onChange}
          >
            5
          </ToggleBtn>
          <ToggleBtn
            value="24"
            defaultChecked={ruleForm.len[4]}
            onChange={onChange}
          >
            6
          </ToggleBtn>
          <ToggleBtn
            value="25"
            defaultChecked={ruleForm.len[5]}
            onChange={onChange}
          >
            7
          </ToggleBtn>
          <ToggleBtn
            value="26"
            defaultChecked={ruleForm.len[6]}
            onChange={onChange}
          >
            8
          </ToggleBtn>
          <ToggleBtn
            value="27"
            defaultChecked={ruleForm.len[7]}
            onChange={onChange}
          >
            9
          </ToggleBtn>
          <ToggleBtn
            value="28"
            defaultChecked={ruleForm.len[8]}
            onChange={onChange}
          >
            ...
          </ToggleBtn>
        </div>
      </div>
    </div>
  );
}

function Setting5({
  ruleForm,
  setRuleForm,
}: {
  ruleForm: RuleForm;
  setRuleForm: React.Dispatch<React.SetStateAction<RuleForm>>;
}) {
  return (
    <div className="setting-wrap">
      <div className="setting-select" id="chan">
        <div className="title">두음법칙</div>
        <Form.Select
          aria-label="Default select example"
          value={ruleForm.chan}
          onChange={(e) => {
            setRuleForm({ ...ruleForm, chan: parseInt(e.target.value) });
          }}
        >
          <option value="0">없음</option>
          <option value="1">표준</option>
          <option value="2">ㄹ&#8594;ㄴ&#8594;ㅇ</option>
          <option value="3">ㄹ&#8644;ㄴ&#8644;ㅇ</option>
          <option value="4">반전룰</option>
          <option value="5">첸룰</option>
          <option value="6">듭2룰</option>
        </Form.Select>
      </div>
    </div>
  );
}

function Setting6({
  ruleForm,
  setRuleForm,
  isHeadValid,
  isTailValid,
}: {
  ruleForm: RuleForm;
  setRuleForm: React.Dispatch<React.SetStateAction<RuleForm>>;
  isHeadValid: boolean;
  isTailValid: boolean;
}) {
  return (
    <>
      <div className="setting-wrap">
        <div className="setting-select-index" id="head">
          <span className="title">첫글자</span>
          <Form.Select
            defaultValue={`${ruleForm.headDir}`}
            aria-label="Default select example"
            onChange={(e) => {
              setRuleForm({
                ...ruleForm,
                headDir: parseInt(e.target.value) as 0 | 1,
              });
            }}
            name="headDir"
          >
            <option value="0">앞에서</option>
            <option value="1">뒤에서</option>
          </Form.Select>

          <div className="form-control-wrap">
            <Form.Control
              type="number"
              name="headIdx"
              defaultValue={`${ruleForm.headIdx}`}
              onChange={(e) => {
                setRuleForm({
                  ...ruleForm,
                  headIdx: parseInt(e.target.value),
                });
              }}
              isInvalid={!isHeadValid}
            />
            <span className="index-text">번째</span>
            <Form.Control.Feedback type="invalid">
              글자수의 최솟값보다 작거나 같아야 합니다!
            </Form.Control.Feedback>
          </div>
        </div>
      </div>
      <div className="setting-wrap">
        <div className="setting-select-index" id="tail">
          <span className="title">끝글자</span>
          <Form.Select
            defaultValue={`${ruleForm.tailDir}`}
            aria-label="Default select example"
            onChange={(e) => {
              setRuleForm({
                ...ruleForm,
                tailDir: parseInt(e.target.value) as 0 | 1,
              });
            }}
            name="tailDir"
          >
            <option value="0">앞에서</option>
            <option value="1">뒤에서</option>
          </Form.Select>
          <div className="form-control-wrap">
            <Form.Control
              type="number"
              name="tailIdx"
              defaultValue={`${ruleForm.tailIdx}`}
              onChange={(e) => {
                setRuleForm({
                  ...ruleForm,
                  tailIdx: parseInt(e.target.value),
                });
              }}
              isInvalid={!isTailValid}
            />
            <span className="index-text">번째</span>
            <Form.Control.Feedback type="invalid">
              글자수의 최솟값보다 작거나 같아야 합니다!
            </Form.Control.Feedback>
          </div>
        </div>
      </div>
    </>
  );
}

function Setting7({
  ruleForm,
  setRuleForm,
}: {
  ruleForm: RuleForm;
  setRuleForm: React.Dispatch<React.SetStateAction<RuleForm>>;
}) {
  return (
    <div className="setting-wrap">
      <div className="setting-check" id="menner">
        <div className="title">
          <Form.Check
            reverse
            onChange={(e) => {
              setRuleForm({
                ...ruleForm,
                manner: e.target.checked,
              });
            }}
            defaultChecked={ruleForm.manner}
            inline
            label="한방단어 금지"
            name="manner"
            type="checkbox"
            id="manner"
          />
          <div
            className="manner-warning"
            style={{ display: ruleForm.manner ? "block" : "none" }}
          >
            로딩 시간이 길어질 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
function Setting8({
  ruleForm,
  setRuleForm,
}: {
  ruleForm: RuleForm;
  setRuleForm: React.Dispatch<React.SetStateAction<RuleForm>>;
}) {
  const [isShowGuide, setIsShowGuide] = useState(false);
  return (
    <div className="setting-wrap">
      <div className="setting-range" id="len">
        <div className="title">
          단어 필터 <span style={{ fontSize: "0.8rem" }}>(정규표현식)</span>
        </div>
        <div className="input-box">
          <Form.Control
            type="text"
            name="regexFilter"
            className="regex-form"
            defaultValue={`${ruleForm.regexFilter}`}
            onChange={(e) => {
              setRuleForm({ ...ruleForm, regexFilter: e.target.value });
            }}
            value={ruleForm.regexFilter}
            // isInvalid={!isTailValid}
          />
        </div>
        <div className="regex-ex-box">
          <div
            className="guide-btn"
            onClick={() => setIsShowGuide(!isShowGuide)}
          >
            예시 보기
            {isShowGuide ? (
              <img
                className="analysis-icon"
                src="icon/arrow_drop_up_FILL0_wght400_GRAD0_opsz24.svg"
              />
            ) : (
              <img
                className="analysis-icon"
                src="icon/arrow_drop_down_FILL0_wght400_GRAD0_opsz24.svg"
              />
            )}
          </div>
          {isShowGuide && (
            <>
              <div
                className=""
                onClick={() => {
                  setRuleForm({ ...ruleForm, regexFilter: ".*" });
                }}
              >
                모든 단어: <span className="regex-ex-regex">.*</span>
              </div>
              <div
                className=""
                onClick={() => {
                  setRuleForm({ ...ruleForm, regexFilter: ".*[^a]" });
                }}
              >
                a로 끝나지 않는 단어:{" "}
                <span className="regex-ex-regex">.*[^a]</span>
              </div>
              <div
                className=""
                onClick={() => {
                  setRuleForm({ ...ruleForm, regexFilter: ".*[^abc]" });
                }}
              >
                a,b,c로 끝나지 않는 단어:{" "}
                <span className="regex-ex-regex">.*[^abc]</span>
              </div>
              <div
                className=""
                onClick={() => {
                  setRuleForm({ ...ruleForm, regexFilter: "[^a].*" });
                }}
              >
                a로 시작하지 않는 단어:{" "}
                <span className="regex-ex-regex">[^a].*</span>
              </div>
              <div
                className=""
                onClick={() => {
                  setRuleForm({ ...ruleForm, regexFilter: "[^abc].*" });
                }}
              >
                a,b,c로 시작하지 않는 단어:{" "}
                <span className="regex-ex-regex">[^abc].*</span>
              </div>
              <div
                className=""
                onClick={() => {
                  setRuleForm({ ...ruleForm, regexFilter: "(.).*(?!\\1)." });
                }}
              >
                첫 글자와 끝 글자가 다른 단어:{" "}
                <span className="regex-ex-regex">(.).*(?!\1).</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Setting9({
  ruleForm,
  setRuleForm,
}: {
  ruleForm: RuleForm;
  setRuleForm: React.Dispatch<React.SetStateAction<RuleForm>>;
}) {
  return (
    <div className="setting-wrap">
      <div className="setting-range" id="len">
        <div className="title">
          단어 추가 <span style={{ fontSize: "0.8rem" }}>(공백으로 구분)</span>
        </div>
        <div className="input-box">
          <Form.Control
            type="text"
            name="addedWords"
            className="addedWords-form"
            defaultValue={ruleForm.addedWords}
            onChange={(e) => {
              setRuleForm({ ...ruleForm, addedWords: e.target.value });
            }}
            value={ruleForm.addedWords}
          />
        </div>
      </div>
    </div>
  );
}
