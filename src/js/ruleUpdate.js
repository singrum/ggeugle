import { Rule, DegreeClass, WordClass, CharManager, WordManager } from "../js/WordChain"

function decimalToArr(decimal, map){
  const binaryArr = decimal.toString(2).padStart(map.length,'0').split("")
  
  const result = []
  for (let i = 0; i < map.length; i++) {
    if (binaryArr[i] === "1") {
      result.push(map[map.length - 1 - i])
    }
  }
  return result
}

function decode(params) {
  const result = { ...params }
  const map = {
    pos: ["명사", "의존명사", "대명사", "수사", "부사", "관형사", "감탄사"],
    cate: ['일반어', "방언", "북한어", "옛말"],
    len: [2, 3, 4, 5, 6, 7, 8, 9, -1]
  }

  result.pos = decimalToArr(params.pos, map.pos)
  result.cate = decimalToArr(params.cate, map.cate)
  result.len = decimalToArr(params.len, map.len)
  return result

}


async function getData(rule) {
  const params = decode(rule)
  

  let wordList = []
  if (params.dict == 0) {
    for (let pos of params.pos) {
      let response = await fetch(`https://singrum.github.io/ggeugle/olddictfilter/db2/olddict${encodeURI(pos)}`);
      let text = await response.text();
      
      wordList = wordList.concat(text.split('\n').map(x => x.trim("\r")));

    }
  }


  else if (params.dict == 1) {
    for (let cate of params.cate) {
      for (let pos of params.cate) {
        response = await fetch(`https://singrum.github.io/ggeugle/opendict_db/db/${cate}/${encodeURI(pos)}`);
        text = await response.text();
        wordList = wordList.concat(text.split('\n').map(x => x.trim("\r")));
      }
    }
  }

  else if (params.dict == 2) {
    for (let pos of params.pos) {
      let response = await fetch(`https://singrum.github.io/ggeugle/elementarydict/db/${encodeURI(pos)}`);
      let text = await response.text();
      wordList = wordList.concat(text.split('\n').map(x => x.trim("\r")));

    }
  }


  let r = new Rule(wordList, {
    changable : params.chan,
    len_filter : (w)=>{
      for(let e of params.len){
        if(e === -1 && w.length > 10 || w.length === e){
          return true;
        }
      }
      return false;
    },
    head_index : params.headDir === 0 ? params.headIdx - 1 : -params.headIdx,
    tail_index : params.tailDir === 0 ? params.tailIdx - 1 : -params.tailIdx
  });
  let wm = new WordManager(r);
  return wm

}




export {decode, getData}