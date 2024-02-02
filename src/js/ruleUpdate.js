import { WCengine, Rule, MCTS, Turn} from "./WordChain"



function decode(params) {
  const result = { ...params }
  const map = {
    pos: ["명사", "의존명사", "대명사", "수사", "부사", "관형사", "감탄사", "구"],
    cate: ['일반어', "방언", "북한어", "옛말"],
    len: [2, 3, 4, 5, 6, 7, 8, 9, -1]
  }

  result.pos = params.pos.map(e=>map.pos[e])
  result.cate = params.cate.map(e=>map.cate[e])
  result.len = params.len.map(e=>map.len[e])
  result.manner = params.manner
  
  return result

}

async function makeWordList(url){
  let response = await fetch(url);
  let text = await response.text();
  return text.split('\n').map(x => x.trim("\r"))
}

async function getData(rule) {
  const params = decode(rule)
  

  let wordList;
  if (params.dict == 0) {
    const wordLists = await Promise.all(params.pos.map(pos=>makeWordList(`https://singrum.github.io/KoreanDict/oldict/db/${encodeURI(pos)}`)))
    wordList = wordLists.reduce((a,b)=>a.concat(b), [])
  }

  else if (params.dict == 1) {
    let wordLists = []
    for (let cate of params.cate) {
      for (let pos of params.pos) {
        wordLists.push(makeWordList(`https://singrum.github.io/KoreanDict/opendict/db/${cate}/${encodeURI(pos)}`))
      }
    }
    wordLists = await Promise.all(wordLists)
    wordList = wordLists.reduce((a,b)=>a.concat(b), [])
  }
  else if (params.dict == 3){
    const wordLists = await Promise.all(params.pos.map(pos=>makeWordList(`https://singrum.github.io/KoreanDict/stdict/db/${encodeURI(pos)}`)))
    wordList = wordLists.reduce((a,b)=>a.concat(b), [])
  }
  console.log("데이터 로드 완료")
  const lenFilter = (w)=>{
    for(let e of params.len){
      if(e === -1 && w.length >= 10 || w.length === e){
        return true;
      }
    }
    return false;
  }

  let r = new Rule(
    params.chan,
    params.headDir === 0 ? params.headIdx - 1 : -params.headIdx,
    params.tailDir === 0 ? params.tailIdx - 1 : -params.tailIdx,
    params.manner
  );
  let wm = new WCengine(r);
  wm.word_list = Array.from(new Set(wordList.filter(x => x && lenFilter(x))));
  wm.update()
  wm.getRouteComp()
  console.log("단어 분류 완료")

  return wm
}




export { decode, getData}