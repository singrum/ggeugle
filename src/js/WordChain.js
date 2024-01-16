
class Rule {
  constructor(word_list, { changable = 1, len_filter = (w) => w.length >= 2, head_index = 0, tail_index = -1 }) {

    this.word_list = Array.from(new Set(word_list));
    this.changable = this.setChangable(changable);
    this.reverse_changable = this.setReverseChangable(changable);
    this.len_filter = len_filter;
    this.lenFilt();
    this.head_index = head_index;
    this.tail_index = tail_index;
    this.word_dict = this.setWordDict(this.word_list);

  }


  setChangable(changable) {
    let sc = (char) => char.charCodeAt(0);//string to charcode
    let cs = (code) => String.fromCharCode(code);//code to string
    switch (changable) {
      case 0: //두법 없음
        return function (char) { return [char] };
      case 1: //표준
        return function (char) {
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
        }
      case 2: //ㄹㄴㅇ 일방향
        return function (char) {
          if (sc(char) >= sc("라") && sc(char) <= sc("맇"))
            return [char, cs(sc(char) + sc('나') - sc("라")), cs(sc(char) + sc("아") - sc("라"))];
          if (sc(char) >= sc("나") && sc(char) <= sc("닣"))
            return [char, cs(sc(char) + sc('아') - sc("나"))];
          return [char]
        }
      case 3: //ㄹㄴㅇ 쌍방향
        return function (char) {
          if (sc(char) >= sc("라") && sc(char) <= sc("맇"))
            return [char, cs(sc(char) + sc('나') - sc("라")), cs(sc(char) + sc("아") - sc("라"))];
          if (sc(char) >= sc("나") && sc(char) <= sc("닣"))
            return [char, cs(sc(char) + sc('라') - sc("나")), cs(sc(char) + sc("아") - sc("나"))];
          if (sc(char) >= sc("아") && sc(char) <= sc("잏"))
            return [char, cs(sc(char) + sc('라') - sc("아")), cs(sc(char) + sc("나") - sc("아"))];
          return [char]
        }
    }
  }
  setReverseChangable(changable) {
    let sc = (char) => char.charCodeAt(0);//string to charcode
    let cs = (code) => String.fromCharCode(code);//code to string
    switch (changable) {
      case 0: //두법 없음
        return function (char) { return [char] };
      case 1: //표준
        return function (char) {
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
        }
      case 2: //ㄹㄴㅇ 일방향
        return function (char) {
          if (sc(char) >= sc("아") && sc(char) <= sc("잏"))
            return [char, cs(sc(char) + sc('나') - sc("아")), cs(sc(char) + sc("라") - sc("아"))];
          if (sc(char) >= sc("나") && sc(char) <= sc("닣"))
            return [char, cs(sc(char) + sc('라') - sc("나"))];
          return [char]
        }
      case 3: //ㄹㄴㅇ 쌍방향
        return function (char) {
          if (sc(char) >= sc("라") && sc(char) <= sc("맇"))
            return [char, cs(sc(char) + sc('나') - sc("라")), cs(sc(char) + sc("아") - sc("라"))];
          if (sc(char) >= sc("나") && sc(char) <= sc("닣"))
            return [char, cs(sc(char) + sc('라') - sc("나")), cs(sc(char) + sc("아") - sc("나"))];
          if (sc(char) >= sc("아") && sc(char) <= sc("잏"))
            return [char, cs(sc(char) + sc('라') - sc("아")), cs(sc(char) + sc("나") - sc("아"))];
          return [char]
        }
    }
  }


  lenFilt() {

    this.word_list = this.word_list.filter(x => x && this.len_filter(x));
  }

  head(word) { return word[this.head_index >= 0 ? this.head_index : word.length + this.head_index]; }

  tail(word) { return word[this.tail_index >= 0 ? this.tail_index : word.length + this.tail_index]; }

  setWordDict(word_list) {
    let dict = new Map();
    let h, t;
    for (let word of word_list) {
      h = this.head(word);
      t = this.tail(word);
      if (!dict.has(h)) { dict.set(h, []); }
      if (!dict.has(t)) { dict.set(t, []); }
      dict.get(h).push(word);
    }
    return dict;
  }
}

class DegreeClass {
  constructor() {
    this.content = [];
  }
  add(i, char) {
    if (!this.content[i]) { this.content[i] = new Set; }
    this.content[i].add(char);
  }
  get(i) {
    return this.content[i];
  }
  findDegree(char) {
    let i;
    for (i = 0; i < this.content.length; i++) {
      if (this.get(i).has(char)) {
        return i;
      }
    }
  }
}

class WordClass {
  constructor(char_set) {
    this.content = {};
    char_set.forEach(x => this.content[x] = new DegreeClass());
  }
  add(char, deg, word) {
    this.content[char].add(deg, word);
  }
  get(char) {
    return this.content[char]
  }

}

class CharManager {
  constructor(rule) {
    this.rule = rule;
    this.graph = this.setGraph();
    this.char_list = Array.from(this.graph.keys());
    this.win_char_set = new Set();
    this.los_char_set = new Set();
    this.cir_char_set = new Set(this.graph.keys());
    this.win_char_class = new DegreeClass();
    this.los_char_class = new DegreeClass();
    this._classifyChar();
  }
  setGraph() {
    let graph = new Map();
    for (let [key, val] of this.rule.word_dict.entries()) {
      graph.set(key, val.map(x => this.rule.tail(x)));
    }
    return graph;
  }
  nextCharList(char) {
    let result = [];
    for (let c of this.rule.changable(char)) { if (this.graph.get(c)) result = result.concat(this.graph.get(c)) };
    return result;
  }

  _isLosChar(char) { return this.nextCharList(char).every(x => this.win_char_set.has(x)); }
  _isWinChar(char) { return this.nextCharList(char).some(x => this.los_char_set.has(x)); }
  _classifyChar() {
    let i = 0;
    let updated_char = new Set();
    let is_updated = true;
    while (is_updated) {
      is_updated = false;
      for (let char of this.cir_char_set) {
        if (updated_char.has(char))
          continue;
        if (this._isLosChar(char)) {
          this.los_char_set.add(char);
          is_updated = true;
          updated_char.add(char);
          this.los_char_class.add(i, char);
          continue;
        }
      }

      for (let char of updated_char) {
        this.cir_char_set.delete(char);
      }
      updated_char = new Set();

      for (let char of this.cir_char_set) {

        if (updated_char.has(char))
          continue;

        if (this._isWinChar(char)) {
          this.win_char_set.add(char);
          is_updated = true;
          updated_char.add(char);
          this.win_char_class.add(i, char);
        }
      }

      for (let char of updated_char) {
        this.cir_char_set.delete(char);
      }
      updated_char = new Set()

      i++;
    }
    this.degree = i - 1;
  }
  LWCof(char) {
    if (this.Lchar.has(char)) return "L";
    if (this.Wchar.has(char)) return "W";
    return "C"
  }
}








class WordManager extends CharManager {
  constructor(rule) {
    super(rule);
    this.win_word_class = new WordClass(this.win_char_set);
    this.los_word_class = new WordClass(this.los_char_set);
    this.cir_word_class = new WordClass(this.cir_char_set);
    
    this.setWordClass()
    
    this.classifyCirChar();
  }

  nextWordList(char) {
    let result = [];
    for (let c of this.rule.changable(char)) {
      if (this.rule.word_dict.get(c))
        result = result.concat(this.rule.word_dict.get(c))
    }
    return result;
  }

  setWordClass() {

    for (let char of this.win_char_set) {

      for (let word of this.nextWordList(char)) {
        if (this.los_char_set.has(this.rule.tail(word))) {

          let i = this.los_char_class.findDegree(this.rule.tail(word));
          this.win_word_class.add(char, i, word);
        }
        if (this.win_char_set.has(this.rule.tail(word))) {
          let i = this.win_char_class.findDegree(this.rule.tail(word));
          this.win_word_class.add(char, -i - 1, word);
        }
        if (this.cir_char_set.has(this.rule.tail(word))) {
          this.win_word_class.add(char, "cir", word);
        }
      }

    }
    for (let char of this.los_char_set) {
      for (let word of this.nextWordList(char)) {
        let i = this.win_char_class.findDegree(this.rule.tail(word));
        this.los_word_class.add(char, i, word);
      }
    }
    for (let char of this.cir_char_set) {
      for (let word of this.nextWordList(char)) {
        if (this.cir_char_set.has(this.rule.tail(word))) {
          this.cir_word_class.add(char, "cir", word);
        }
        if (this.win_char_set.has(this.rule.tail(word))) {
          let i = this.win_char_class.findDegree(this.rule.tail(word));
          this.cir_word_class.add(char, -i - 1, word);
        }
      }
    }
    
  }

  nextCirWordList(char) {
    return this.nextWordList(char).filter(x => this.cir_char_set.has(this.rule.tail(x)));
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
      for(const char of this.cir_char_set){
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

  classifyCirChar(){
    const cirGraph = {}
    let cirDict = {}
    for(let char of this.cir_char_set){
      let tails = new Set();
      this.cir_word_class.get(char).content["cir"].forEach((e)=>{tails.add(this.rule.tail(e))})
      cirDict[char] = {}
      cirDict[char].word = Array.from(this.cir_word_class.get(char).content["cir"])
      cirGraph[char] = tails
    }
    
    let cirChars = Array.from(this.cir_char_set)
    let cirWords = new Set()
    for(let char of cirChars){
      for(let word of cirDict[char].word){
        cirWords.add(word)
      }
    }
    cirWords = Array.from(cirWords)
    

    // looping
    for(let char of cirChars){
      cirDict[char].looping = []
      for(let next of cirDict[char].word){
        if (this.rule.changable(char).includes(this.rule.tail(next))){
          cirDict[char].looping.push(next)
        }
      }
      cirDict[char].allLooping = cirDict[char].word.length === cirDict[char].looping.length
    }

    // returning
    for(let char of cirChars){
      cirDict[char].returning = []
      for(let next of cirDict[char].word){
        for(let next_next of cirDict[this.rule.tail(next)].word){
          if(this.rule.changable(char).includes(this.rule.tail(next_next)) &&
          !cirDict[char].returning.includes(next_next) &&
          !cirDict[char].looping.includes(next)){
            cirDict[char].returning.push(next)
            cirDict[char].returning.push(next_next)
            break
          }
          
        }
      }
      cirDict[char].allReturning = cirDict[char].word.length === cirDict[char].returning.length / 2 
    }
    
    for(let char of cirChars){
      if(cirDict[char].returning.length/2 + cirDict[char].looping.length === cirDict[char].word.length){
          if (cirDict[char].looping.length % 2 === 1){
            cirDict[char].sorted = "win"
          }
          else if(cirDict[char].looping.length % 2 === 0){
            cirDict[char].sorted = "los"
          }
          
          cirDict[char].path = cirDict[char].looping.concat(cirDict[char].returning)
          
      } 
    }


  
    const filterLoop = ()=>{
      for(let char of cirChars){
        if(cirDict[char].sorted){
          continue
        }
        
        for(let next of cirDict[char].word){
          

          let nextPath = cirDict[this.rule.tail(next)].path
          if (cirDict[this.rule.tail(next)].sorted === "los" && !nextPath.includes(next)){
            cirDict[char].sorted = "win"
            cirDict[char].path = [next].concat(nextPath)
            if (!cirDict[char].toLos){
              cirDict[char].toLos = []
            }
            cirDict[char].toLos.push(next)
          }  
        } 
      }
      for(let char of cirChars){
        if(cirDict[char].sorted){
          continue
        }
        let lose = true
        let path = []
        
        for(let next of cirDict[char].word){
          let nextPath = cirDict[this.rule.tail(next)].path
          if(!(cirDict[this.rule.tail(next)].sorted === "win" && !nextPath.includes(next))){
            lose = false
          }
        }
        if(lose){
          cirDict[char].sorted = "los"
          cirDict[char].path = path
        }
      }
    }

    let length = 0
    let prev_length = -1
    let routeCirChars = cirChars.filter(e=>!cirDict[e].sorted)
    while(prev_length !== length){
      prev_length = length
      routeCirChars = cirChars.filter(e=>!cirDict[e].sorted)
      length = routeCirChars.length
      filterLoop()
    }

    // 루트음절, 승리순환음절에 대해서 패배순환단어 찾기

    for(let char of cirChars){
      if(!cirDict[char].sorted || cirDict[char].sorted === "win"){
        for(let next of cirDict[char].word){
          let nextPath = cirDict[this.rule.tail(next)].path
          if(cirDict[this.rule.tail(next)].sorted === "win" && !nextPath.includes(next)){
            if(!cirDict[char].toWin){
              cirDict[char].toWin = []
            }
            cirDict[char].toWin.push(next)
          }
        }
      }
    }
    




    let winning = cirChars.filter(e=>cirDict[e].sorted === "win")
    let losing = cirChars.filter(e=>cirDict[e].sorted === "los")
    

    for(let char of this.cir_char_set){
      let chan = this.rule.changable(char)
      if (chan.length >=2 ){
        if (this.cir_char_set.has(chan[1])){
          cirGraph[char].add(chan[1])
          cirGraph[chan[1]].add(char)
        }
      }
    }

    const routeGraph = {}
    for(let char of routeCirChars){

      routeGraph[char] = new Set()
      
      for (let circhar of cirGraph[char]){
        if(routeCirChars.includes(circhar)){
          routeGraph[char].add(circhar)
        }
      }
      
      
    }
    const [sccs, connection] = this.getSCC(routeGraph)

    this.winCirChar = new Set(cirChars.filter(e=>cirDict[e].sorted === "win"))
    this.losCirChar = new Set(cirChars.filter(e=>cirDict[e].sorted === "los"))
    this.routeCirChar = new Set(cirChars.filter(e=>!cirDict[e].sorted))
    this.win_cir_word_class = new WordClass(this.winCirChar)
    this.los_cir_word_class = new WordClass(this.losCirChar)
    this.route_cir_word_class = new WordClass(cirChars.filter(e=>!cirDict[e].sorted))

    this.maxRouteComp = sccs.filter(e=>e.length >=4).flat()
    this.restRouteComp = sccs.filter(e=>e.length < 4).flat()
    for (let char of this.winCirChar) {
      for (let word of this.nextWordList(char)) {
        if (cirDict[char].toLos && cirDict[char].toLos.includes(word)) {
          this.win_cir_word_class.add(char, "win", word)
        }
        else if (!cirDict[char].toLos && cirDict[char].looping.includes(word)) {
          this.win_cir_word_class.add(char, "win", word)
        }
        else if (cirDict[char].returning.includes(word)){
          this.win_cir_word_class.add(char, "returning", word)
        }
        else if (this.routeCirChar.has(this.rule.tail(word))) {
          this.win_cir_word_class.add(char, "route", word);
        }
        else if (cirDict[char].toWin && cirDict[char].toWin.includes(word)){
          this.win_cir_word_class.add(char, "los", word);
        }
        else if (this.win_char_set.has(this.rule.tail(word))) {
          let i = this.win_char_class.findDegree(this.rule.tail(word));
          this.win_cir_word_class.add(char, -i - 1, word);
        }
        // else{
        //   console.log(word)
        // }
      }
      

      
      

    }

    for (let char of this.losCirChar) {
      for (let word of this.nextWordList(char)) {
        if (cirDict[char].returning.includes(word)){
          this.los_cir_word_class.add(char, "returning", word)
        }
        else if (this.cir_char_set.has(this.rule.tail(word))) {
          this.los_cir_word_class.add(char, "los", word);
        }
        
        else if (this.win_char_set.has(this.rule.tail(word))) {
          let i = this.win_char_class.findDegree(this.rule.tail(word));
          this.los_cir_word_class.add(char, -i - 1, word);
        }
        // else{
        //   console.log(word)
        // }
      }
    }



    for (let char of this.routeCirChar) {
      for (let word of this.nextWordList(char)) {
        
        if (cirDict[char].toWin && cirDict[char].toWin.includes(word)){
          
          this.route_cir_word_class.add(char, "los", word);
        }
        else if (cirDict[char].returning.includes(word)){
          this.route_cir_word_class.add(char, "returning", word)
        }
        else if (this.cir_char_set.has(this.rule.tail(word))) {
          this.route_cir_word_class.add(char, "route", word);
        }
        
        else if (this.win_char_set.has(this.rule.tail(word))) {
          let i = this.win_char_class.findDegree(this.rule.tail(word));
          this.route_cir_word_class.add(char, -i - 1, word);
        }
        // else{
        //   console.log(word)
        // }
      }

    }

  }


}

export { Rule, DegreeClass, WordClass, CharManager, WordManager }
