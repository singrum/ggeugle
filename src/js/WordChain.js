const sc = (char) => char.charCodeAt(0);//string to charcode
const cs = (code) => String.fromCharCode(code);//code to string
const changableMap = {
  0:function (char) { return [char] },
  1:function (char) {
    if (sc(char) >= sc("랴") && sc(char) <= sc("럏") ||
      sc(char) >= sc("려") && sc(char) <= sc("렿") ||
      sc(char) >= sc("료") && sc(char) <= sc("룧") ||
      sc(char) >= sc("류") && sc(char) <= sc("륳") ||
      sc(char) >= sc("리") && sc(char) <= sc("맇") ||
      sc(char) >= sc("례") && sc(char) <= sc("롛"))
      return [char, cs(sc(char) + sc("아") - sc("라"))];
    if (sc(char) >= sc("라") && sc(char) <= sc("랗") ||
      sc(char) >= sc("래") && sc(char) <= sc("랳") ||
      sc(char) >= sc("로") && sc(char) <= sc("롷") ||
      sc(char) >= sc("루") && sc(char) <= sc("뤃") ||
      sc(char) >= sc("르") && sc(char) <= sc("릏") ||
      sc(char) >= sc("뢰") && sc(char) <= sc("뢰"))
      return [char, cs(sc(char) + sc('나') - sc("라"))];
    if (sc(char) >= sc("녀") && sc(char) <= sc("녛") ||
      sc(char) >= sc("뇨") && sc(char) <= sc("눃") ||
      sc(char) >= sc("뉴") && sc(char) <= sc("늏") ||
      sc(char) >= sc("니") && sc(char) <= sc("닣"))
      return [char, cs(sc(char) + sc('아') - sc("나"))];
    return [char];
  },
  2:function (char) {
    if (sc(char) >= sc("라") && sc(char) <= sc("맇"))
      return [char, cs(sc(char) + sc('나') - sc("라")), cs(sc(char) + sc("아") - sc("라"))];
    if (sc(char) >= sc("나") && sc(char) <= sc("닣"))
      return [char, cs(sc(char) + sc('아') - sc("나"))];
    return [char]
  },
  3:function (char) {
    if (sc(char) >= sc("라") && sc(char) <= sc("맇"))
      return [char, cs(sc(char) + sc('나') - sc("라")), cs(sc(char) + sc("아") - sc("라"))];
    if (sc(char) >= sc("나") && sc(char) <= sc("닣"))
      return [char, cs(sc(char) + sc('라') - sc("나")), cs(sc(char) + sc("아") - sc("나"))];
    if (sc(char) >= sc("아") && sc(char) <= sc("잏"))
      return [char, cs(sc(char) + sc('라') - sc("아")), cs(sc(char) + sc("나") - sc("아"))];
    return [char]
  }
}
const reverseChangableMap = {
  0:function (char) { return [char] },
  1:function (char) {
    if (sc(char) >= sc("야") && sc(char) <= sc("얗") ||
      sc(char) >= sc("예") && sc(char) <= sc("옣"))
      return [char, cs(sc(char) + sc("라") - sc("아"))];
    if (sc(char) >= sc("나") && sc(char) <= sc("낳") ||
      sc(char) >= sc("내") && sc(char) <= sc("냏") ||
      sc(char) >= sc("노") && sc(char) <= sc("놓") ||
      sc(char) >= sc("누") && sc(char) <= sc("눟") ||
      sc(char) >= sc("느") && sc(char) <= sc("늫") ||
      sc(char) >= sc("뇌") && sc(char) <= sc("뇧"))
      return [char, cs(sc(char) + sc('라') - sc("나"))];
    if (sc(char) >= sc("여") && sc(char) <= sc("옇") ||
      sc(char) >= sc("요") && sc(char) <= sc("욯") ||
      sc(char) >= sc("유") && sc(char) <= sc("윻") ||
      sc(char) >= sc("이") && sc(char) <= sc("잏"))
      return [char, cs(sc(char) + sc('나') - sc("아")), cs(sc(char) + sc('라') - sc("아"))];
    return [char];
  },
  2:function (char) {
    if (sc(char) >= sc("아") && sc(char) <= sc("잏"))
      return [char, cs(sc(char) + sc('나') - sc("아")), cs(sc(char) + sc("라") - sc("아"))];
    if (sc(char) >= sc("나") && sc(char) <= sc("닣"))
      return [char, cs(sc(char) + sc('라') - sc("나"))];
    return [char]
  },
  3:function (char) {
    if (sc(char) >= sc("라") && sc(char) <= sc("맇"))
      return [char, cs(sc(char) + sc('나') - sc("라")), cs(sc(char) + sc("아") - sc("라"))];
    if (sc(char) >= sc("나") && sc(char) <= sc("닣"))
      return [char, cs(sc(char) + sc('라') - sc("나")), cs(sc(char) + sc("아") - sc("나"))];
    if (sc(char) >= sc("아") && sc(char) <= sc("잏"))
      return [char, cs(sc(char) + sc('라') - sc("아")), cs(sc(char) + sc("나") - sc("아"))];
    return [char]
  }
}
const deepcopy = (obj) => {
  if(typeof obj !== "object" || obj === null){
    return obj;
  }
  
  const deepCopyObj = {};
  
  for(let key in obj){
    deepCopyObj[key] = deepcopy(obj[key]);
  }
  
  return deepCopyObj;
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
  head(word) { return word[this.head_index >= 0 ? this.head_index : word.length + this.head_index]; }
  tail(word) { return word[this.tail_index >= 0 ? this.tail_index : word.length + this.tail_index]; }
}

const LOS = 1
const WIN = 2
const WINCIR = 3
const LOSCIR = 4
const ROUTE = 5



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
    // console.log(this.winChars)
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
    // this.routeChars = new Set(Object.keys(this.charMap).filter(e=>this.charMap[e].sorted === ROUTE))

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
        for(let next_next of this.charMap[this.rule.tail(cirWords)].outCirWords){
          if(this.charMap[cirChar].changable.includes(this.rule.tail(next_next)) &&
          !this.charMap[cirChar].returnWords.has(next_next)){
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
        this.charMap[cirChar].solution = this.charMap[cirChar].loopWords[0]
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
          // console.log(char, path)
          if(this.charMap[char].loopWords.size % 2 === 0){
            this.charMap[char].sorted = LOSCIR
          }
          else{
            this.charMap[char].solution = this.charMap[char].loopWords[0]
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
  

  winWord(char, depth, first = false){
    // console.log(this)
    if (depth < 0){
      return -1;
    }

    
    if(!this.charMap[char]){
      let chan = this.rule.changable(char)
      char = chan[chan.length - 1]
    }
    
    
    
    if (this.charMap[char].sorted === WIN){
      let wc = this.charMap[char].wordClass
      let key = Math.min(...Object.keys(wc).filter(e=>!isNaN(e) && Number(e) >= 0).map(e=>Number(e)))
      let next = wc[key]
      return next[Math.floor(Math.random() * next.length)]
    }
    if (this.charMap[char].sorted === WINCIR){
      return this.charMap[char].solution
    }
    if (this.charMap[char].sorted === LOS){
      return false
    }
    if (this.charMap[char].sorted === LOSCIR){
      return false
    }
    
    let nextRoute = this.charMap[char].wordClass["ROUTE"].sort((a,b)=>
      this.charMap[this.rule.tail(a)].wordClass["ROUTE"].length - 
      this.charMap[this.rule.tail(b)].wordClass["ROUTE"].length)
    nextRoute = nextRoute.filter(word => nextRoute.find(e=>this.rule.tail(e) === this.rule.tail(word)) === word)

    

    let unknown = false
    let losWords = []
    for(let word of nextRoute){
      let nextWm = new WCengine(this.rule)
      nextWm.word_list = this.routeWords.filter(e=>e !== word)
      nextWm.update()
      


      // 다음 단어가 2개 이하면 depth 안줄임
      let ww = nextWm.winWord(nextWm.rule.tail(word), depth - (nextRoute.length <= 2 ? 0 : 1))
      if (ww === false){
        return word
      }
      if(ww === -1){
        unknown = true
        continue
      }
      losWords.push(word)
    }
    if(unknown){
      return first ? losWords : -1
    }

    return first ? losWords : false
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

class Turn{
  constructor(pos, graph){
    this.pos = pos
    this.graph = graph
  }
  removeWords(){

  }
}




export { LOS, WIN, LOSCIR, WINCIR, ROUTE, Rule, WCengine }
