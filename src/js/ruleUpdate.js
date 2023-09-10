import { Rule, DegreeClass, WordClass, CharManager, WordManager } from "../js/WordChain"

function decode(params) {
  const result = { ...params }
  const map = {
    pos: ["명사", "의존명사", "대명사", "수사", "부사", "관형사", "감탄사"],
    cate: ['일반어', "방언", "북한어", "옛말"],
    len: [2, 3, 4, 5, 6, 7, 8, 9, -1]
  }

  function toArr(decimal, map){
    const binaryArr = decimal.toString(2).padStart(map.length,'0').split("")
    
    const result = []
    for (let i = 0; i < map.length; i++) {
      if (binaryArr[i] === "1") {
        result.push(map[map.length - 1 - i])
      }
    }
    return result
  }

  result.pos = toArr(params.pos, map.pos)
  result.cate = toArr(params.cate, map.cate)
  result.len = toArr(params.len, map.len)


  
  const headIdxDir = params.idx % 2;
  const tailIdxDir = (params.idx % 4) / 2;
  const headIdxNum = Math.floor(params.idx / 4) % 10
  const tailIdxNum = Math.floor(Math.floor(params.idx / 4) / 10)
  const headIdx = headIdxDir === 0? headIdxNum : -headIdxNum - 1
  const tailIdx = tailIdxDir === 0? tailIdxNum : -tailIdxNum - 1

  result.idx = [headIdx, tailIdx]
  return result

}


async function getData() {
  let params = Object.fromEntries(
    new URLSearchParams(window.location.search)
  )
  
  if (Object.keys(params).length === 0) {
    params = {
      dict: 0,
      pos: 1,
      cate: 15,
      len: 1023,
      chan: 1,
      idx: 2
    }
  }
  params = decode(params)
  

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
    head_index : params.idx[0],
    tail_index : params.idx[1]
  });
  let wm = new WordManager(r);
  return wm

}




export {decode, getData}