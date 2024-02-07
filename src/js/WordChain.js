import * as Hangul from 'hangul-js';
const sc = (char) => char.charCodeAt(0);//string to charcode
const cs = (code) => String.fromCharCode(code);//code to string

const f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ','ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ','ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const s = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ','ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ','ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ','ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ','ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ','ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const ga = 44032;

function getConstantVowel(kor) {
  let uni = kor.charCodeAt(0);
  uni = uni - ga;
  if(uni < 0){
    return {
      f:undefined,
      s:undefined,
      t:undefined
    }
  }
  let fn = parseInt(uni / 588);
  let sn = parseInt((uni - (fn * 588)) / 28);
  let tn = parseInt(uni % 28);
  
  return [f[fn],s[sn],t[tn]]
}

function size(obj){
  return Object.keys(obj).length
}
function isEmpty(obj){
  return size(obj) === 0
}

const banjeonMap = {
  "ㅏ" : "ㅓ",
  "ㅑ" : "ㅕ",
  "ㅓ" : "ㅏ",
  "ㅕ" : "ㅑ",
  "ㅗ" : "ㅜ",
  "ㅛ" : "ㅠ",
  "ㅜ" : "ㅗ",
  "ㅠ" : "ㅛ"
}

const changableMap = {
  0:function (char) { return [char] },
  1:function (char) {
    let code = sc(char)
    if (code >= sc("랴") && code <= sc("럏") ||
      code >= sc("려") && code <= sc("렿") ||
      code >= sc("료") && code <= sc("룧") ||
      code >= sc("류") && code <= sc("륳") ||
      code >= sc("리") && code <= sc("맇") ||
      code >= sc("례") && code <= sc("롛"))
      return [char, cs(code + sc("아") - sc("라"))];
    else if (code >= sc("라") && code <= sc("랗") ||
      code >= sc("래") && code <= sc("랳") ||
      code >= sc("로") && code <= sc("롷") ||
      code >= sc("루") && code <= sc("뤃") ||
      code >= sc("르") && code <= sc("릏") ||
      code >= sc("뢰") && code <= sc("뢰"))
      return [char, cs(code + sc('나') - sc("라"))];
    else if (code >= sc("녀") && code <= sc("녛") ||
      code >= sc("뇨") && code <= sc("눃") ||
      code >= sc("뉴") && code <= sc("늏") ||
      code >= sc("니") && code <= sc("닣"))
      return [char, cs(code + sc('아') - sc("나"))];
    return [char];
  },
  2:function (char) {
    let code = sc(char)
    if (code >= sc("라") && code <= sc("맇"))
      return [char, cs(code + sc('나') - sc("라")), cs(code + sc("아") - sc("라"))];
    else if (code >= sc("나") && code <= sc("닣"))
      return [char, cs(code + sc('아') - sc("나"))];
    return [char]
  },
  3:function (char) {
    let code = sc(char)
    if (code >= sc("라") && code <= sc("맇"))
      return [char, cs(code + sc('나') - sc("라")), cs(code + sc("아") - sc("라"))];
    else if (code >= sc("나") && code <= sc("닣"))
      return [char, cs(code + sc('라') - sc("나")), cs(code + sc("아") - sc("나"))];
    else if (code >= sc("아") && code <= sc("잏"))
      return [char, cs(code + sc('라') - sc("아")), cs(code + sc("나") - sc("아"))];
    return [char]
  },
  4:function(char){
    let code = sc(char)
    let result = [char]
    if (code >= sc("랴") && code <= sc("럏") ||
    code >= sc("려") && code <= sc("렿") ||
    code >= sc("료") && code <= sc("룧") ||
    code >= sc("류") && code <= sc("륳") ||
    code >= sc("리") && code <= sc("맇") ||
    code >= sc("례") && code <= sc("롛"))
    result.push(cs(code + sc("아") - sc("라")));
    else if (code >= sc("라") && code <= sc("랗") ||
    code >= sc("래") && code <= sc("랳") ||
    code >= sc("로") && code <= sc("롷") ||
    code >= sc("루") && code <= sc("뤃") ||
    code >= sc("르") && code <= sc("릏") ||
    code >= sc("뢰") && code <= sc("뢰"))
    result.push(cs(code + sc("나") - sc("라")));
    else if (code >= sc("녀") && code <= sc("녛") ||
    code >= sc("뇨") && code <= sc("눃") ||
    code >= sc("뉴") && code <= sc("늏") ||
    code >= sc("니") && code <= sc("닣"))
    result.push(cs(code + sc("아") - sc("나")));
    
    
    let disassembled = getConstantVowel(char)
    let jung = disassembled[1]
    
    if(jung && jung in banjeonMap){
      disassembled[1] = banjeonMap[jung]
      result.push(Hangul.assemble(disassembled))
    }
    return result
  },
  5:function(char){
    let code = sc(char)
    let result = [char]
    if (code >= sc("랴") && code <= sc("럏") ||
    code >= sc("려") && code <= sc("렿") ||
    code >= sc("료") && code <= sc("룧") ||
    code >= sc("류") && code <= sc("륳") ||
    code >= sc("리") && code <= sc("맇") ||
    code >= sc("례") && code <= sc("롛"))
    result.push(cs(code + sc("아") - sc("라")));
    else if (code >= sc("라") && code <= sc("랗") ||
    code >= sc("래") && code <= sc("랳") ||
    code >= sc("로") && code <= sc("롷") ||
    code >= sc("루") && code <= sc("뤃") ||
    code >= sc("르") && code <= sc("릏") ||
    code >= sc("뢰") && code <= sc("뢰"))
    result.push(cs(code + sc("나") - sc("라")));
    else if (code >= sc("녀") && code <= sc("녛") ||
    code >= sc("뇨") && code <= sc("눃") ||
    code >= sc("뉴") && code <= sc("늏") ||
    code >= sc("니") && code <= sc("닣"))
    result.push(cs(code + sc("아") - sc("나")));
    
    
    let disassembled = getConstantVowel(char)
    let cho = disassembled[0]
    
    let jong = disassembled[2]
    if(cho && jong && Hangul.isCho(cho) && Hangul.isJong(jong)){
      disassembled[0] = jong
      disassembled[2] = cho
      result.push(Hangul.assemble(disassembled))
    }
    return result
  },
  6:function(char){
    let result = [];
    let disassembled = getConstantVowel(char)
    let cho = disassembled[0]
    let jung = disassembled[1]
    let jong = disassembled[2]
    
    let choChan;
    let jongChan;
    if(!jung){
      return [char]
    }
    if(cho && (cho === "ㄹ" || cho === "ㄴ" || cho === "ㅇ" )){
      choChan = ["ㄹ", "ㄴ","ㅇ"]
    }
    else{
      choChan = [cho]
    }
     
    if(jong && (jong === "ㄹ" || jong === "ㄴ" || jong === "ㅇ" )){
      jongChan = ["ㄹ", "ㄴ","ㅇ"]
    }
    else{
      jongChan = [jong]
    }

    for(let chan1 of choChan){
      for(let chan2 of jongChan){
        result.push(Hangul.assemble([chan1, jung, chan2]))
      }
    }
    
    
    return result
  }
}


const reverseChangableMap = {
  0:function (char) { return [char] },
  1:function (char) {
    let code = sc(char)
    if (code >= sc("야") && code <= sc("얗") ||
      code >= sc("예") && code <= sc("옣"))
      return [char, cs(code + sc("라") - sc("아"))];
    else if (code >= sc("나") && code <= sc("낳") ||
      code >= sc("내") && code <= sc("냏") ||
      code >= sc("노") && code <= sc("놓") ||
      code >= sc("누") && code <= sc("눟") ||
      code >= sc("느") && code <= sc("늫") ||
      code >= sc("뇌") && code <= sc("뇧"))
      return [char, cs(code + sc('라') - sc("나"))];
    else if (code >= sc("여") && code <= sc("옇") ||
      code >= sc("요") && code <= sc("욯") ||
      code >= sc("유") && code <= sc("윻") ||
      code >= sc("이") && code <= sc("잏"))
      return [char, cs(code + sc('나') - sc("아")), cs(code + sc('라') - sc("아"))];
    return [char];
  },
  2:function (char) {
    let code = sc(char)
    if (code >= sc("아") && code <= sc("잏"))
      return [char, cs(code + sc('나') - sc("아")), cs(code + sc("라") - sc("아"))];
    else if (code >= sc("나") && code <= sc("닣"))
      return [char, cs(code + sc('라') - sc("나"))];
    return [char]
  },
  3:function (char) {
    let code = sc(char)
    if (code >= sc("라") && code <= sc("맇"))
      return [char, cs(code + sc('나') - sc("라")), cs(code + sc("아") - sc("라"))];
    else if (code >= sc("나") && code <= sc("닣"))
      return [char, cs(code + sc('라') - sc("나")), cs(code + sc("아") - sc("나"))];
    else if (code >= sc("아") && code <= sc("잏"))
      return [char, cs(code + sc('라') - sc("아")), cs(code + sc("나") - sc("아"))];
    return [char]
  },
  4:function(char){
    let code = sc(char)
    let result = [char]
    if (code >= sc("야") && code <= sc("얗") ||
      code >= sc("예") && code <= sc("옣"))
      result.push(cs(code + sc("라") - sc("아")))
    else if (code >= sc("나") && code <= sc("낳") ||
      code >= sc("내") && code <= sc("냏") ||
      code >= sc("노") && code <= sc("놓") ||
      code >= sc("누") && code <= sc("눟") ||
      code >= sc("느") && code <= sc("늫") ||
      code >= sc("뇌") && code <= sc("뇧"))
      result.push(cs(code + sc('라') - sc("나")))
    else if (code >= sc("여") && code <= sc("옇") ||
      code >= sc("요") && code <= sc("욯") ||
      code >= sc("유") && code <= sc("윻") ||
      code >= sc("이") && code <= sc("잏"))
      result.push(cs(code + sc('나') - sc("아")),cs(code + sc('라') - sc("아")))

    let disassembled = getConstantVowel(char)
    let jung = disassembled[1]
    
    if(jung && jung in banjeonMap){
      disassembled[1] = banjeonMap[jung]
      result.push(Hangul.assemble(disassembled))
    }
    return result
  },
  5:function(char){
    let code = sc(char)
    let result = [char]
    if (code >= sc("야") && code <= sc("얗") ||
      code >= sc("예") && code <= sc("옣"))
      result.push(cs(code + sc("라") - sc("아")))
    else if (code >= sc("나") && code <= sc("낳") ||
      code >= sc("내") && code <= sc("냏") ||
      code >= sc("노") && code <= sc("놓") ||
      code >= sc("누") && code <= sc("눟") ||
      code >= sc("느") && code <= sc("늫") ||
      code >= sc("뇌") && code <= sc("뇧"))
      result.push(cs(code + sc('라') - sc("나")))
    else if (code >= sc("여") && code <= sc("옇") ||
      code >= sc("요") && code <= sc("욯") ||
      code >= sc("유") && code <= sc("윻") ||
      code >= sc("이") && code <= sc("잏"))
      result.push(cs(code + sc('나') - sc("아")),cs(code + sc('라') - sc("아")))

      let disassembled = getConstantVowel(char)
      let cho = disassembled[0]
      let jong = disassembled[2]
      if(cho && jong && cho !== jong && Hangul.isCho(cho) && Hangul.isJong(jong)){
        disassembled[0] = jong
        disassembled[2] = cho
        result.push(Hangul.assemble(disassembled))
      }
      return result
  },
  6: changableMap[6]
}


class Rule {
  constructor(changable_index , head_index , tail_index , manner = false) {
    this.changable_index =  changable_index
    this.changable = changableMap[this.changable_index]
    this.reverse_changable = reverseChangableMap[this.changable_index];
    this.head_index = head_index;
    this.tail_index = tail_index;
    this.manner = manner
    
  }
  getRuleObj(){
    return {
      head_index : this.head_index,
      tail_index : this.tail_index,
      changable_index : this.changable_index
    }
  }
  head(word) { return word[this.head_index >= 0 ? this.head_index : word.length + this.head_index]; }
  tail(word) { return word[this.tail_index >= 0 ? this.tail_index : word.length + this.tail_index]; }
}

const LOS = 1
const WIN = 2
const WINCIR = 3
const LOSCIR = 4
const ROUTE = 5
const IDK = 6

class WCengine{
  constructor(rule){
    this.rule = rule
  }
  _setKeys(char){
    if(!this.charMap[char]){
      this.charMap[char] = {}
      this.charMap[char].successors = new Set()
      this.charMap[char].predecessors = new Set()
      this.charMap[char].outWords = []
      // this.charMap[char].inWords = []
      this.charMap[char].wordClass = {}
    }
  }

  _sortWord(){
    for(let char in this.charMap){
      if(this.charMap[char].sorted === WIN){
        
        for (let word of this.charMap[char].outWords) {
          let type = this.charMap[this.rule.tail(word)].sorted
          let tail = this.rule.tail(word)
          switch(type){
            case WIN:
            case LOS:
              if(!this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1]){
                this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1] = []
              }
              this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1].push(word)
              break;
            case WINCIR:
              if(!this.charMap[char].wordClass["LOSCIR"]){
                this.charMap[char].wordClass["LOSCIR"] = []
              }
              this.charMap[char].wordClass["LOSCIR"].push(word)
              break;
            case LOSCIR:
              if(!this.charMap[char].wordClass["WINCIR"]){
                this.charMap[char].wordClass["WINCIR"] = []
              }
              this.charMap[char].wordClass["WINCIR"].push(word)
              break;
            case ROUTE:
              if(!this.charMap[char].wordClass["ROUTE"]){
                this.charMap[char].wordClass["ROUTE"] = []
              }
              this.charMap[char].wordClass["ROUTE"].push(word)
              break;
          }
        }
        
      }


      else if(this.charMap[char].sorted === LOS){
        for (let word of this.charMap[char].outWords) {
          let tail = this.rule.tail(word)
          let type = this.charMap[tail].sorted
          switch(type){
            case WIN:
              if(!this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1]){
                this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1] = []
              }
              this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1].push(word)
              
          }
          
        }
      }


      else if(this.charMap[char].sorted === WINCIR){
        
        for (let word of this.charMap[char].outWords) {
          let tail = this.rule.tail(word)
          let type = this.charMap[tail].sorted
          
          if(type === WIN){
            if(!this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1]){
              this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1] = []
            }
            this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1].push(word)
            
          }
          else if(this.charMap[char].winCirWords && this.charMap[char].winCirWords.includes(word)){
            if(!this.charMap[char].wordClass["WINCIR"]){
              this.charMap[char].wordClass["WINCIR"] = []
            }
            this.charMap[char].wordClass["WINCIR"].push(word)
          }
          else if(!this.charMap[char].winCirWords && this.charMap[char].loopWords.has(word)){
            if(!this.charMap[char].wordClass["WINCIR"]){
              this.charMap[char].wordClass["WINCIR"] = []
            }
            this.charMap[char].wordClass["WINCIR"].push(word)
          }
          else if(this.charMap[char].returnWords.has(word)){
            if(!this.charMap[char].wordClass["RETURN"]){
              this.charMap[char].wordClass["RETURN"] = []
            }
            this.charMap[char].wordClass["RETURN"].push(word)
          }
          else if(this.charMap[char].losCirWords && this.charMap[char].losCirWords.includes(word)){
            if(!this.charMap[char].wordClass["LOSCIR"]){
              this.charMap[char].wordClass["LOSCIR"] = []
            }
            this.charMap[char].wordClass["LOSCIR"].push(word)
          }
          else{
            if(!this.charMap[char].wordClass["ROUTE"]){
              this.charMap[char].wordClass["ROUTE"] = []
            }
            this.charMap[char].wordClass["ROUTE"].push(word)
          }
        }
      }

      else if(this.charMap[char].sorted === LOSCIR){
        
        for (let word of this.charMap[char].outWords) {
          let tail = this.rule.tail(word)
          let type = this.charMap[tail].sorted
          if(type === WIN){
            if(!this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1]){
              this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1] = []
            }
            this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1].push(word)
            
          }
          else if(this.charMap[char].returnWords.has(word)){
            if(!this.charMap[char].wordClass["RETURN"]){
              this.charMap[char].wordClass["RETURN"] = []
            }
            this.charMap[char].wordClass["RETURN"].push(word)
          }
          else{
            if(!this.charMap[char].wordClass["LOSCIR"]){
              this.charMap[char].wordClass["LOSCIR"] = []
            }
            this.charMap[char].wordClass["LOSCIR"].push(word)
          }
        }
      }

      else if(this.charMap[char].sorted === ROUTE){
        
        for (let word of this.charMap[char].outWords) {
          let tail = this.rule.tail(word)
          let type = this.charMap[tail].sorted
          
          if(type === WIN){
            if(!this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1]){
              this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1] = []
            }
            this.charMap[char].wordClass[this.charMap[tail].degree > 0 ? -this.charMap[tail].degree : -this.charMap[tail].degree + 1].push(word)
            
          }
          else if(this.charMap[char].losCirWords && this.charMap[char].losCirWords.includes(word)){
            if(!this.charMap[char].wordClass["LOSCIR"]){
              this.charMap[char].wordClass["LOSCIR"] = []
            }
            this.charMap[char].wordClass["LOSCIR"].push(word)
          }
          else if(this.charMap[char].returnWords.has(word)){
            if(!this.charMap[char].wordClass["RETURN"]){
              this.charMap[char].wordClass["RETURN"] = []
            }
            this.charMap[char].wordClass["RETURN"].push(word)
          }
          else{
            if(!this.charMap[char].wordClass["ROUTE"]){
              this.charMap[char].wordClass["ROUTE"] = []
            }
            this.charMap[char].wordClass["ROUTE"].push(word)
          }
        }
      }
    }


  }

  update(){
    this.charMap = {}
    
    for(let word of this.word_list){
      let head = this.rule.head(word)  
      let tail = this.rule.tail(word)
      this._setKeys(head)
      this._setKeys(tail)
    }

    // changable
    for(let char in this.charMap){
      this.charMap[char].changable = this.rule.changable(char).filter(e=>e in this.charMap)
      this.charMap[char].reverseChangable = this.rule.reverse_changable(char).filter(e=>e in this.charMap)
      
    }


    // graph
    for(let word of this.word_list){
      let head = this.rule.head(word)  
      let headChangable = this.charMap[head].reverseChangable

      let tail = this.rule.tail(word)
      let tailChangable = this.charMap[tail].changable
      
      // changable 처리
      for(let headChan of headChangable){
        this.charMap[headChan].outWords.push(word)
        this.charMap[headChan].successors.add(tail)
        this.charMap[tail].predecessors.add(headChan)
      }
      // for(let tailChan of tailChangable){
      //   this.charMap[tailChan].inWords.push(word)
      // }
    }

    // WIN, LOS
    this._sortChar()

    if(this.rule.manner){
      this.remove_hanbang()
      this.rule.manner = false
      this.update()
      
      return
    }
    
    // WINCIR, LOSCIR
    this._sortCirChar()
    
    // ROUTE
    this._sortRouteChar()

    // wordClass
    this._sortWord()

    // 음절 분류
    this.winChars = Object.keys(this.charMap).filter(e=>this.charMap[e].sorted === WIN)
    
    this.winCharClass = {}
    for(let char of this.winChars){
      if(!this.winCharClass[this.charMap[char].degree]){
        this.winCharClass[this.charMap[char].degree] = []
      }
      this.winCharClass[this.charMap[char].degree].push(char)
    }
    this.losChars = Object.keys(this.charMap).filter(e=>this.charMap[e].sorted === LOS)
    this.losCharClass = {}
    for(let char of this.losChars){
      if(!this.losCharClass[this.charMap[char].degree]){
        this.losCharClass[this.charMap[char].degree] = []
      }
      this.losCharClass[this.charMap[char].degree].push(char)
    }

    this.winCirChars = Object.keys(this.charMap).filter(e=>this.charMap[e].sorted === WINCIR)
    this.losCirChars = Object.keys(this.charMap).filter(e=>this.charMap[e].sorted === LOSCIR)
    

  }
  _sortChar(){
    // WIN 이면 +degree
    // LOS 면 -degree

    let degree = 0;
    let updatedChars = []
    
    // seed 찾기
    for(let char in this.charMap){
      this.charMap[char].cnt = this.charMap[char].successors.size
      if(this.charMap[char].cnt > 0){
        continue
      }
      this.charMap[char].sorted = LOS
      this.charMap[char].degree = -degree
      this.charMap[char].hanbang = true
      updatedChars.push(char)
    }
    
    
    while(updatedChars.length !== 0){
      degree++;
      let newUpdatedWinChars = []
      let newUpdatedLosChars = []
      for(let losChar of updatedChars){
        for(let winChar of this.charMap[losChar].predecessors){
          if (this.charMap[winChar].sorted){
            continue
          }
          this.charMap[winChar].sorted = WIN
          this.charMap[winChar].degree = degree
          newUpdatedWinChars.push(winChar)  
        }
      }

      for(let winChar of newUpdatedWinChars){
        for(let losChar of this.charMap[winChar].predecessors){
          if(this.charMap[losChar].sorted){
            continue
          }
          this.charMap[losChar].cnt--
          if(this.charMap[losChar].cnt > 0){
            continue
          }
          this.charMap[losChar].sorted = LOS
          this.charMap[losChar].degree = -degree
          newUpdatedLosChars.push(losChar)
        }
      }

      updatedChars = newUpdatedLosChars
    }
  }

  _sortCirChar(){
    
    this.cirChars = Object.keys(this.charMap).filter(char => !this.charMap[char].sorted)
    this.cirWords = this.word_list.filter(word=>
      !this.charMap[this.rule.head(word)].sorted && 
      !this.charMap[this.rule.tail(word)].sorted)

  
    // .outCirWords
    for(let char of this.cirChars){
      this.charMap[char].outCirWords = this.charMap[char].outWords.filter(word=>!this.charMap[this.rule.tail(word)].sorted)
    }
    
    let updatedChars = []

    // console.log("시드 분류중") 
    // .loopWords .returnWords
    for(let cirChar of this.cirChars){
      this.charMap[cirChar].loopWords = new Set()
      this.charMap[cirChar].returnWords = new Set()
      for(let cirWords of this.charMap[cirChar].outCirWords){
        if(this.charMap[cirChar].changable.includes(this.rule.tail(cirWords))){
          this.charMap[cirChar].loopWords.add(cirWords)
          continue
        }
        let reverseChan = this.charMap[cirChar].reverseChangable
        if(reverseChan.includes(this.rule.tail(cirWords)) && 
          this.charMap[this.rule.tail(cirWords)].outCirWords.length === this.charMap[cirChar].outCirWords.length){
            this.charMap[cirChar].loopWords.add(cirWords)
          continue
        }
        for(let next_next of this.charMap[this.rule.tail(cirWords)].outCirWords){
          if(this.charMap[cirChar].returnWords.has(next_next)){
            continue
          }
          if(this.charMap[cirChar].changable.includes(this.rule.tail(next_next))){
            this.charMap[cirChar].returnWords.add(cirWords);
            this.charMap[cirChar].returnWords.add(next_next);
            break
          }
          if(this.charMap[cirChar].reverseChangable.includes(this.rule.tail(next_next)) && 
          this.charMap[this.rule.tail(next_next)].outCirWords.length === this.charMap[cirChar].outCirWords.length){
            this.charMap[cirChar].returnWords.add(cirWords);
            this.charMap[cirChar].returnWords.add(next_next);
            break
          }
        }
      }
    }

    // .cirPredecessors
    for(let cirChar of this.cirChars){
      this.charMap[cirChar].cirPredecessors = new Set()
    }
    for(let cirWord of this.cirWords){
      let head = this.rule.head(cirWord)
      
      let headChangable = this.charMap[head].reverseChangable
      let tail = this.rule.tail(cirWord)

      for(let headChan of headChangable.filter(e => !this.charMap[e].sorted)){  
        this.charMap[tail].cirPredecessors.add(headChan)
      }
    }
    
    // .sorted, .path
    for(let cirChar of this.cirChars){
      let returnWordsNum = this.charMap[cirChar].returnWords.size / 2
      let loopWordsNum = this.charMap[cirChar].loopWords.size
      let outCirWordsNum = this.charMap[cirChar].outCirWords.length

      if(returnWordsNum + loopWordsNum !== outCirWordsNum){
        continue
      }  
      if(loopWordsNum % 2 === 1){
        this.charMap[cirChar].solution = [...this.charMap[cirChar].loopWords][0]
        this.charMap[cirChar].sorted = WINCIR
      }
      else{
        this.charMap[cirChar].sorted = LOSCIR
      }
      updatedChars.push(cirChar)
      this.charMap[cirChar].path = this.charMap[cirChar].returnWords
    }
    // console.log("시드 분류 완료")



    
    // .CIRWIN, .CIRLOS
    // console.log("CIRWIN, CIRLOS 분류 중") 

    let i = 0
    while(updatedChars.length !== 0 ){
      i ++;
      // console.log("깊이 : " + i)

      let newUpdatedChars = []
      let predecessors = new Set()
      for(let char of updatedChars){
        for(let cirChar of this.charMap[char].cirPredecessors){
          if(this.charMap[cirChar].sorted){
            continue
          }
          predecessors.add(cirChar)
        }
      }
      

      for(let char of predecessors){
        
        for(let next of this.charMap[char].outCirWords){

          let nextPath = this.charMap[this.rule.tail(next)].path

          if (this.charMap[this.rule.tail(next)].sorted === LOSCIR && !nextPath.has(next)){
            this.charMap[char].sorted = WINCIR
            newUpdatedChars.push(char)
            this.charMap[char].path = new Set([...nextPath, next])
            if(!this.charMap[char].winCirWords){
              this.charMap[char].winCirWords = []
            }
            this.charMap[char].winCirWords.push(next)
            this.charMap[char].solution = next

            break
          }
        }
      }
      
      
      for(let char of newUpdatedChars){
        for(let cirChar of this.charMap[char].cirPredecessors){
          if(this.charMap[cirChar].sorted){
            continue
          }
          predecessors.add(cirChar)
        }
      }

      
      for(let char of predecessors){
        
        let lose = true
        let path = new Set();
                

        for(let next of this.charMap[char].outCirWords){
          
          
          
          
          
          let nextPath = this.charMap[this.rule.tail(next)].path
          if(this.charMap[char].loopWords.has(next)){
            continue
          }
          if(this.charMap[char].returnWords.has(next)){
            continue
          }
          if(!(this.charMap[this.rule.tail(next)].sorted === WINCIR && !nextPath.has(next))){
            lose = false
            break
          }
          else{
            
            path = new Set([...nextPath, ...this.charMap[char].returnWords, next, ...path])
          }
        }
        
        if(lose){
          
          this.charMap[char].path = path
          if(this.charMap[char].loopWords.size % 2 === 0){
            this.charMap[char].sorted = LOSCIR
          }
          else{
            this.charMap[char].solution = [...this.charMap[char].loopWords][0]
            this.charMap[char].sorted = WINCIR
          }
          newUpdatedChars.push(char)
        }
        
        
      }


      
      updatedChars = newUpdatedChars

    }
    

    
    for(let char of this.cirChars){
      // .losCirWords
      if(!this.charMap[char].sorted || this.charMap[char].sorted === WINCIR){

        for(let next of this.charMap[char].outCirWords){

          
          let nextPath = this.charMap[this.rule.tail(next)].path
          
          if(this.charMap[this.rule.tail(next)].sorted === WINCIR && !nextPath.has(next)){
              
            if(!this.charMap[char].losCirWords){
              this.charMap[char].losCirWords = []
            }
            this.charMap[char].losCirWords.push(next)
          }
        }
      }
      // .winCirWords
      if(this.charMap[char].sorted === WINCIR){
        for(let next of this.charMap[char].outCirWords){
          let nextPath = this.charMap[this.rule.tail(next)].path
          if(this.charMap[this.rule.tail(next)].sorted ==LOS && ! nextPath.includes(next)){
            if(!this.charMap[char].winCirWords){
              this.charMap[char].winCirWords = []
            }
            this.charMap[char].winCirWords.push(next)
          }
        }
      }
    }
    


  }

  _sortRouteChar(){
    // 루트 음절 : 202개
    this.routeChars = this.cirChars.filter(char => !this.charMap[char].sorted)
    this.routeWords = this.cirWords.filter(word=>
      !this.charMap[this.rule.head(word)].sorted && 
      !this.charMap[this.rule.tail(word)].sorted)
    
    // .outRouteWords
    for(let char of this.routeChars){
      this.charMap[char].outRouteWords = this.charMap[char].outCirWords.filter(word=>!this.charMap[this.rule.tail(word)].sorted)
      this.charMap[char].routeSuccessors = new Set(this.charMap[char].outRouteWords.map(e=>this.rule.tail(e)))
    }
    for(let char of this.routeChars){
      this.charMap[char].sorted = ROUTE
      
    }

    
    
    

  }

  getSCC(graph) {
    // Helper function to perform DFS traversal on the graph
    function dfs(graph, node, visited, stack) {
      visited.add(node);
      
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          dfs(graph, neighbor, visited, stack);
        }
      }
      
      stack.push(node);
    }
  
    // Transpose the graph (reverse the direction of edges)
    const transposeGraph = graph => {
      const transposedGraph = {};
      for(const char of this.cirChars){
        transposedGraph[char] = new Set();
      }
      
      for (const [node, neighbors] of Object.entries(graph)) {
        for (const neighbor of neighbors) {
          
          transposedGraph[neighbor].add(node);
        }
      }
      return transposedGraph;
    }
  
    const visited = new Set();
    const stack = [];
  
    // Perform DFS on the original graph and fill the stack
    for (const node of Object.keys(graph)) {
      if (!visited.has(node)) {
        
        dfs(graph, node, visited, stack);
      }
    }
  
    const transposedGraph = transposeGraph(graph);
    const sccs = [];
  
    // Perform DFS on the transposed graph and get strongly connected components
    visited.clear();
    while (stack.length > 0) {
      const node = stack.pop();
  
      if (!visited.has(node)) {
        const scc = [];
        dfs(transposedGraph, node, visited, scc);
        sccs.push(scc);
      }
    }



    function findSCCIndex(node, sccs) {
      for (let i = 0; i < sccs.length; i++) {
        if (sccs[i].includes(node)) {
          return i;
        }
      }
      return -1;
    }
    // return sccs;
    const connectionsData = {};

    // Calculate the connections between SCCs
    for (let i = 0; i < sccs.length; i++) {
      const connections = [];
      const currentSCC = sccs[i];
  
      for (const node of currentSCC) {
        for (const neighbor of graph[node]) {
          const neighborSCCIndex = findSCCIndex(neighbor, sccs);
          if (neighborSCCIndex !== i && !connections.includes(neighborSCCIndex)) {
            connections.push(neighborSCCIndex);
          }
        }
      }
  
      connectionsData[i] = connections;
    }
  
    return [sccs, connectionsData];
  }
  
  classifyWeaklyConnectedComponents(graph) {
    function explore(vertex, visited, graph, component) {
      visited[vertex] = true;
      component.push(vertex);
    
      const neighbors = graph[vertex] || [];
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          explore(neighbor, visited, graph, component);
        }
      }
    }
    const visited = {};
    const components = [];
  
    for (const vertex in graph) {
      if (!visited[parseInt(vertex)]) {
        const component = [];
        explore(parseInt(vertex), visited, graph, component);
        components.push(component);
      }
    }
  
    return components;
  }
  
  directedToUndirected(directedGraph) {
    const undirectedGraph = {};
  
    for (const vertex in directedGraph) {
      undirectedGraph[vertex] = []
    }
    for(const vertex in directedGraph){
      for(const neighbor of directedGraph[vertex]){
        undirectedGraph[vertex].push(neighbor)
        undirectedGraph[neighbor].push(parseInt(vertex))
      }
    }
    
    return undirectedGraph;
  }
  getRouteComp(){
    let routeGraph = {}
    for(let routeChar of this.routeChars){
      routeGraph[routeChar] = new Set(this.charMap[routeChar].routeSuccessors)
    }
    for(let char of this.routeChars){
      let chan = this.charMap[char].changable
      if(chan.length >= 2){
        for (let c of chan){
          if(this.charMap[c].sorted === ROUTE){
            routeGraph[char].add(c)
            routeGraph[c].add(char)
          }
        }
      }
    }

    const [sccs, connection] = this.getSCC(routeGraph)
    this.maxRouteComp = sccs.filter(e=>e.length >=4).flat()
    this.restRouteComp = sccs.filter(e=>e.length < 4).flat()
    
  }
  
  // win : true
  // los : arr / false
  // unknown : -1

  winWord(char, depth, except, first = false){
    if(depth < 0){
      return -1
    }
    let map = this.charMap[char]
    if(!map){
      let chan = this.rule.changable(char)
      char = chan[chan.length - 1]
    }
    if(!map){
      return false
    }
    if (map.sorted === WIN){
      let wc = map.wordClass
      let key = Math.min(...Object.keys(wc).filter(e=>!isNaN(e) && Number(e) >= 0).map(e=>Number(e)))
      let next = wc[key]
      return next[Math.floor(Math.random() * next.length)]
    }
    if (map.sorted === WINCIR){
      return map.solution
    }
    if (map.sorted === LOS){
      return false
    }
    if (map.sorted === LOSCIR){
      return false
    }

    
      
      

      let nextRoute = map.wordClass["ROUTE"].sort((a,b)=>
      this.charMap[this.rule.tail(a)].wordClass["ROUTE"].length - 
      this.charMap[this.rule.tail(b)].wordClass["ROUTE"].length).
      filter(e=>!except.includes(e))

    // 루프 단어 홀수 개이면 하나만 남기고, 짝수 개이면 전부 삭제
    if(map.loopWords && map.loopWords.size % 2 === 0){
      nextRoute = nextRoute.filter(word => !map.loopWords.has(word))
    }
    nextRoute = nextRoute.filter(word => nextRoute.find(e=>this.rule.tail(e) === this.rule.tail(word)) === word)
    
    let unknown = false
    let losWords = []

    let breaking = false;
    
    depth = depth - (breaking ? 0 : 1)
    
    // 하위 두법 음절에 대해 next route length가 1이면 breaking = true
    for(let chan of map.changable){
      breaking = nextRoute.filter(e => this.rule.head(e) === chan).length === 1
      if(breaking){
        break
      }
    }

    if(!breaking){
      for(let word of nextRoute){
        let ww = this.winWord(this.rule.tail(word), depth, [...except, word])
        if (ww === false){
          return word
        }
        if(ww === -1){
          unknown = true
          continue
        }
      }
    }
    else{
      if(depth < 0){
        return - 1
      }
      let nextWord = nextRoute[0]
      let nextWm = new WCengine(this.rule)
      nextWm.word_list = this.routeWords.filter(
        e=>!except.includes(e) && e !== nextWord)
      
      nextWm.update()
      let ww = nextWm.winWord(nextWm.rule.tail(nextWord), depth, [])
      if (ww === false){
        return nextWord
      }
      if(ww === -1){
        unknown = true
      }
    }

    if(unknown){
      return first ? losWords : -1
    }

    return first ? losWords : false
  }
  winWord2(char){
    let mcts = new MCTS(new Turn(undefined, char,this, []), 1000)
    return mcts
  }
  remove_hanbang(){
    this.word_list = this.word_list.filter(word=>!this.charMap[this.rule.tail(word)].hanbang)
    
  }

  copy(except = []){
    let c = new WCengine(this.rule)
    c.word_list = this.word_list.filter(e=>!except.includes(e))
    c.update(except = except)

    return c
  }
}



class MCTS{
  constructor(rootTurn){
    this.root = rootTurn
  }
  getWinWord(){
    const winTurn = this.root.children.reduce((prev, curr)=>(curr.w/curr.n > prev.w / prev.n) ? prev : curr)
    return winTurn.prevWord
  }
  getTrail(){
    const trail = []
    let turn = this.root
    let winTurn;
    while(turn.children.length > 0){
      winTurn = turn.children.reduce((prev, curr)=>(curr.n < prev.n) ? prev : curr)
      if(turn.prevWord){
        trail.push(turn.prevWord)
      }
      turn = winTurn
    }
    return trail
  }
  
  getChart(){
    let chart = {}
    for(let child of this.root.children){
      chart[child.prevWord] = (1 - child.w / child.n)
    }
    return chart
  }
  learn(){
    
    let selected = this.root
    let stack = [selected]
    
    // stack의 마지막 원소의 children 개수와 가능한 다음 수의 개수가 같으면 UTC최대값 selected에 대입

    while((selected.children.length === selected.nextRoute.length) && (selected.nextRoute.length !== 0)){
      selected = selected.select()
      stack.push(selected)
    }
    
    if(selected.nextRoute.length === 0){
      let type = selected.WCengine.charMap[selected.currChar].sorted
      let win;
      if(type === WINCIR || type === WIN){
        win = true
      }
      else if (type === LOSCIR || type === LOS){
        win = false
      }
      this.backprop(stack, win)
    }
    
    else{
      // 다를 때까지 수행 후 가능한 다음 수 중 하나를 children에 추가하고 stack에 추가
      let newSelected = selected.expand()
      stack.push(newSelected)

      // 방금 추가한 것에서 simulation, backprop
      let win = newSelected.simulate() // true : win, false : los
      this.backprop(stack, win)
      
    }
    
    
    

  }
  
  backprop(stack, win){
    
    
    let turn = stack.pop()
    let parity = false
    
    while(turn){
      turn.n += 1
      turn.w += (win === parity) ? 0 : 1
      
      turn = stack.pop()
      parity = !parity
    }
  }
  
}

class Turn{
  constructor(prevWord, currChar, WCengine, except){
    this.prevWord = prevWord
    this.WCengine = WCengine
    this.currChar = currChar
    if(!(this.currChar in this.WCengine.charMap)){
      let chan = this.WCengine.rule.changable(this.currChar)
      for(let c of chan){
        if(c in this.WCengine.charMap){
          this.currChar = c
          break
        }
      }
    }

    this.except = except
    this.n = 0
    this.w = 0
    this.children = []
    this.nextRoute = this.getNextRoute(this.currChar)
    this.parent = undefined
  } 
  UTC(){
    return 1- this.w / this.n + Math.sqrt(2 * Math.log(this.parent.n) / this.n)
  }

  select(){
    
    let selected = this.children.reduce(
      (prev, current) => {
        return prev.UTC() > current.UTC() ? prev : current
      }
    )
    return selected
  }
  expand(){
    let routes = this.nextRoute.filter(e=>!this.children.map(e=>e.prevWord).includes(e))
    
    let route = routes.reduce((a,b)=>(this.WCengine.charMap[this.WCengine.rule.tail(a)].wordClass["ROUTE"].length < this.WCengine.charMap[this.WCengine.rule.tail(b)].wordClass["ROUTE"].length) ? a : b)

    
    let expanded = this.getTurnFromRoute(route)
    this.children.push(expanded)
    expanded.parent = this
    return expanded
  }
  getTurnFromRoute(route){
    let head = this.WCengine.rule.head(route)
    let map = this.WCengine.charMap[head]
    
    let breaking = this.nextRoute.filter(e=>!map.loopWords.has(e)).filter(e=>map.changable.includes(this.WCengine.rule.head(e))).length === 1

    

    let nextTurn;
    
    if(breaking){
      
      let nextWm = new WCengine(this.WCengine.rule)
      nextWm.word_list = this.WCengine.routeWords.filter(
        e=>!this.except.includes(e) && e !== route)
      nextWm.update()
      
      nextTurn = new Turn(route, this.WCengine.rule.tail(route), nextWm, [])
    }
    else{
      nextTurn = new Turn(route, this.WCengine.rule.tail(route), this.WCengine, [...this.except, route])
    }

    return nextTurn
  }

  simulate(){
    let turn = this
    let parity = false
    
    // console.log("simulate start")
    while(turn.nextRoute.length > 0){
      let probMap = turn.nextRoute.map(e=>1 / (this.getNextRoute(this.WCengine.rule.tail(e)).length))
      
      let route = randomSelectWithWeights(turn.nextRoute, probMap)
      turn = turn.getTurnFromRoute(route)
      parity = !parity
    }
    // 밑의 조건이 충족되는 경우 존재함 -> 버그
    if(!turn.WCengine.charMap[turn.currChar]){
      // console.log(Object.keys(turn.WCengine.charMap))
      console.log("error 2 (해결)")
      return parity
    }
    let type=turn.WCengine.charMap[turn.currChar].sorted
    if(type === WIN || type === WINCIR){
      return !parity
    }
    else if(type === LOS || type === LOSCIR){
      return parity
    }
    console.log("error 1 (해결)")
  }

  randomSimulate(){
    let parity = false
    
    // console.log("simulate start")
    const history = []
    let currChar = this.currChar

    while(true){
      let nextRoutes = this.getNextRoute(currChar).filter(e=>!history.includes(e))
      if(nextRoutes.length === 0) break;
      let nextRoute = nextRoutes[Math.floor(Math.random() * nextRoutes.length)]
      history.push(nextRoute)

      parity = !parity
      currChar = this.WCengine.rule.tail(nextRoute)
    }
    return parity


  }

  getNextRoute(char){
    if(!char){
      let nextRoute = this.WCengine.routeChars  
      return nextRoute
    }

    if(!(char in this.WCengine.charMap)){
      let chan = this.WCengine.rule.changable(char)
      for(let c of chan){
        if(c in this.WCengine.charMap){
          char = c
          break
        }
      }
    }

    let map = this.WCengine.charMap[char]

    if(!map || map.sorted !== ROUTE){
      return []
    }

    let nextRoute = map.wordClass["ROUTE"].filter(e=>!this.except.includes(e))
    if(map.loopWords && map.loopWords.size % 2 === 0){
      nextRoute = nextRoute.filter(word => !map.loopWords.has(word))
    }
    nextRoute = nextRoute.filter(word => nextRoute.find(e=>this.WCengine.rule.tail(e) === this.WCengine.rule.tail(word)) === word)
    return nextRoute
  }

}


function randomSelectWithWeights(arr, weights){
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const randomValue = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  let index;
  for (index = 0; index < weights.length; index++) {
    cumulativeWeight += weights[index];
    if (randomValue <= cumulativeWeight) {
      break
    }
  }
  return arr[index]
}





// WCgraph : 두법 무시한 단어 그래프(다중 유향 그래프)
// chanGraph : 두법 그래프(단순 유향 그래프)
class WCengine2{
  constructor(rule){
    this.rule = rule
  }
  update(){
    this.chars = new Set()
    for(let word of this.word_list){
      let head = this.rule.head(word)
      let tail = this.rule.tail(word)
      this.chars.add(head).add(tail)
    } 
    this.chars = Array.from(this.chars)
    // WCgraph
    this.WCgraph = {}
    
    for(let char of this.chars){
      this.WCgraph[char] = {}
      this.WCgraph[char].successors = {}
      this.WCgraph[char].predecessors = {}
    }
    for(let word of this.word_list){
      let head = this.rule.head(word)
      let tail = this.rule.tail(word)
      this.WCgraph[head].successors[tail] = this.WCgraph[head].successors[tail] || 0
      this.WCgraph[head].successors[tail]++
      this.WCgraph[tail].predecessors[head] = this.WCgraph[tail].predecessors[head] || 0
      this.WCgraph[tail].predecessors[head]++
    } 
    
    // chanGraph
    this.chanGraph = {}
    for(let char of this.chars){
      this.chanGraph[char] = {}
    }
    for(let char of this.chars){
      this.chanGraph[char].successors = this.rule.changable(char).filter(e=>this.chanGraph[e])
      this.chanGraph[char].predecessors = [] 
    }
    for(let char of this.chars){
      for(let chan of this.chanGraph[char].successors){
        if(this.chanGraph[chan]){
          this.chanGraph[chan].predecessors.push(char)
        }    
      }
    }
    // charMap
    this.charMap = {}
    for(let char of this.chars){
      
      
      this.charMap[char] = {cnt : 
        this.chanGraph[char].successors.reduce((a,b)=>a + size(this.WCgraph[b].successors), 0)}
    }
    this._sortChar()
    this._sortCirChar()
  }
  _sortChar(){
    let degree = 0 
    let updatedLosChars = this.chars.filter(e=>isEmpty(this.WCgraph[e].successors))
    updatedLosChars = updatedLosChars.filter(e=>this.chanGraph[e].successors.every(e=>updatedLosChars.includes(e)))
    for(let char of updatedLosChars){
      this.charMap[char].sorted = LOS
      this.charMap[char].degree = degree
      this.charMap[char].hanbang = true
    }
    
    while(updatedLosChars.length !==0){
      degree ++
      let updatedWinChars = []
      let predecessors = new Set()
      for(let los of updatedLosChars){
        for(let pred in this.WCgraph[los].predecessors){
          predecessors.add(pred)
        }
      }
      for(let win of predecessors){
        for(let chan of this.chanGraph[win].predecessors){
          if(this.charMap[chan].sorted){
            continue
          } 
          updatedWinChars.push(chan)
          this.charMap[chan].sorted = WIN
          this.charMap[chan].degree = degree
        }
      }
      updatedLosChars = []
      for(let win of updatedWinChars){
        for(let los in this.WCgraph[win].predecessors){
          for(let chan of this.chanGraph[los].predecessors){
            if(this.charMap[chan].sorted){
              continue
            }
            this.charMap[chan].cnt--
            if(this.charMap[chan].cnt > 0){
              continue
            }
            this.charMap[chan].sorted = LOS
            this.charMap[chan].degree = -degree
            updatedLosChars.push(chan)
          }
        }
      }
    }
    
  }
  _sortCirChar(){

  }
}




export { LOS, WIN, LOSCIR, WINCIR, ROUTE, Rule, WCengine, Turn, MCTS}
