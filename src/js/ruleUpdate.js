import { Rule, DegreeClass, WordClass, CharManager, WordManager } from "../js/WordChain"



function decode(params) {
  const result = { ...params }
  const map = {
    pos: ["명사", "의존명사", "대명사", "수사", "부사", "관형사", "감탄사"],
    cate: ['일반어', "방언", "북한어", "옛말"],
    len: [2, 3, 4, 5, 6, 7, 8, 9, -1]
  }

  result.pos = params.pos.map(e=>map.pos[e])
  result.cate = params.cate.map(e=>map.cate[e])
  result.len = params.len.map(e=>map.len[e])
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
      for (let pos of params.pos) {
        let response = await fetch(`https://singrum.github.io/ggeugle/opendict_db/db/${cate}/${encodeURI(pos)}`);
        let text = await response.text();
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




export { decode, getData}