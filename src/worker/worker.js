import { WCengine, Rule, MCTS, Turn, WIN, LOS, WINCIR, LOSCIR, ROUTE } from "../js/WordChain"

const heuristic = (currChar, wc)=>{ 
  if (!currChar){
    return
  }
  let word;
  if (wc.charMap[currChar].sorted === WIN) {
    let mapClass = wc.charMap[currChar].wordClass
    let key = Math.min(...Object.keys(mapClass).filter(e => !isNaN(e) && Number(e) >= 0).map(e => Number(e)))
    let next = mapClass[key]
    word = next[Math.floor(Math.random() * next.length)]
    return {word, win : true}
  }
  else if (wc.charMap[currChar].sorted === LOS) {
    let mapClass = wc.charMap[currChar].wordClass
    if(Object.keys(mapClass).length === 0){
      return {word : undefined, win : false}  
    }
    let key = Math.min(...Object.keys(mapClass))
    let next = mapClass[key]
    word = next[Math.floor(Math.random() * next.length)]
    return {word, win : false}
  }
  else if (wc.charMap[currChar].sorted === LOSCIR) {
    if (wc.charMap[currChar].wordClass["RETURN"]) {
      let next = wc.charMap[currChar].wordClass["RETURN"]
      word = next[Math.floor(Math.random() * next.length)]
      return {word, win : false}
    } else {
      let next = wc.charMap[currChar].wordClass["LOSCIR"]

      word = next[Math.floor(Math.random() * next.length)]
      return {word, win : false}
    }
  }
  else if (wc.charMap[currChar].sorted === WINCIR) {
    word = wc.charMap[currChar].solution
    return {word, win : true}
  }
  else{
    let nextRoute = wc.charMap[currChar].wordClass["ROUTE"]
    nextRoute = nextRoute.filter(word => nextRoute.find(e=>wc.rule.tail(e) === wc.rule.tail(word)) === word)
    if(nextRoute.length === 1){
      word = nextRoute[0]
      return {word, win : "ROUTE"}
    }
  }
}


const analysis = (data)=>{
  const r = new Rule(
    data.rule.changable_index,
    data.rule.head_index,
    data.rule.tail_index,
  );
  const wc = new WCengine(r)
  wc.word_list = data.word_list
  wc.update()

  const heuristicWord = heuristic(data.currChar, wc)
  if(heuristicWord && heuristicWord.win !== "ROUTE"){
    if(!heuristicWord.word){
      self.postMessage({chart : {}, num : 0, terminate : true})   
    }
    
    self.postMessage({chart : {[heuristicWord.word] : heuristicWord.win ? 1 : 0}, num : 0, terminate : true}) 

    
    return 
  }
  

  wc.word_list = wc.routeWords
  wc.update()
  const mcts = new MCTS(new Turn(undefined, data.currChar, wc, []))
  
  for(let i = 0; i < 100000; i++){
    for(let j = 0;j<100;j++){
      mcts.learn()
    }
    const chart = mcts.getChart()
    self.postMessage({chart, num : (i + 1) * 100, terminate : false})  
  }
  
}



const getWinWord = (data, diff)=>{
  const r = new Rule(
    data.rule.changable_index,
    data.rule.head_index,
    data.rule.tail_index,
  );
  const wc = new WCengine(r)
  wc.word_list = data.word_list
  wc.update()

  const heuristicWord = heuristic(data.currChar, wc)
  if(heuristicWord){
    self.postMessage({word : heuristicWord.word, terminate : true})
    return 
  }
  
  let word;
  if(diff === 1){
    const nextRoute = wc.charMap[data.currChar].wordClass["ROUTE"]
    word = nextRoute[Math.floor(Math.random() * nextRoute.length)]
  }

  else if(diff === 2){
    wc.word_list = wc.routeWords
    wc.update()
    
    const mcts = new MCTS(new Turn(undefined, data.currChar, wc, []))
    
    for(let j = 0;j<500;j++){
      mcts.learn()
    }
    word = mcts.getWinWord()
  }
  
  self.postMessage({word, terminate : true})
  

  
}



self.onmessage = ({data}) => {
  switch (data.action) {
    case 'analysis':
      analysis(data)
      break;
    case 'getWinWordMidium':
      
      getWinWord(data, 1)
      break;
    case 'getWinWordHard':
      getWinWord(data, 2)
      break;
  }
  
}