import { WCengine, Rule} from "../js/WordChain"



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


async function getData(rule) {
  const params = decode(rule)
  

  let wordList = []
  if (params.dict == 0) {
    for (let pos of params.pos) {
      let response = await fetch(`https://singrum.github.io/KoreanDict/oldict/db/${encodeURI(pos)}`);
      let text = await response.text();
      wordList = wordList.concat(text.split('\n').map(x => x.trim("\r")));
      
    }
  }


  else if (params.dict == 1) {
    for (let cate of params.cate) {
      for (let pos of params.pos) {
        let response = await fetch(`https://singrum.github.io/KoreanDict/opendict/db/${cate}/${encodeURI(pos)}`);
        
        let text = await response.text();
        wordList = wordList.concat(text.split('\n').map(x => x.trim("\r")));
      }
    }
  }

  else if (params.dict == 2) {
    for (let pos of params.pos) {
      let response = await fetch(`https://singrum.github.io/ggeugle-legacy/elementarydict/db/${encodeURI(pos)}`);
      let text = await response.text();
      wordList = wordList.concat(text.split('\n').map(x => x.trim("\r")));

    }
  }

  else if (params.dict == 3){
    for (let pos of params.pos) {
      let response = await fetch(`https://singrum.github.io/KoreanDict/stdict/db/${encodeURI(pos)}`);
      let text = await response.text();
      wordList = wordList.concat(text.split('\n').map(x => x.trim("\r")));
    }
  }

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
  // console.log(wm)
  wm.word_list = Array.from(new Set(wordList.filter(x => x && lenFilter(x))));
  wm.update()
  wm.getRouteComp()
  return wm
}

function printDict(wm){
  let dict_str = ""
  let char_list = wm.char_list.sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b)))
  // for(let char of char_list){
  //     if (wm.win_char_set.has(char)){
  //       dict_str += char
        
  //       dict_str += " : "
  //       let wc = wm.win_word_class.get(char).content
  //       for (let i of Object.keys(wc).filter(e => parseInt(e) >= 0)){
  //         dict_str += Array.from(wc[i]).sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).join(", ")
  //         dict_str += ", "
  //       }
  //       dict_str += '\n'
  //     }
  // }
  
  // dict_str = ""
  // char_list = wm.char_list.sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b)))
  // for(let char of char_list){
  //     if (wm.winCirChar.has(char)){
  //       dict_str += char
  //       dict_str += " : "
  //       let wc = wm.win_cir_word_class.get(char).content
  //       dict_str += Array.from(wc['win']).sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).join(", ")
  //       dict_str += ", "
        
  //       dict_str += '\n'
  //     }
  // }


  dict_str = ""
  char_list = wm.char_list.sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b)))
  for(let char of char_list){
      if (wm.maxRouteComp.includes(char)){
        dict_str += char
        dict_str += " : "
        let wc = wm.route_cir_word_class.get(char).content
        if(wc["route"]){
          dict_str += Array.from(wc['route']).sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).join(", ")
          dict_str += ", "
        }
        if(wc["returning"]){
          dict_str += Array.from(wc['returning']).sort((a, b) => wm.rule.tail(a).localeCompare(wm.rule.tail(b))).join("(돌림), ")
        }
        dict_str += '\n'
        
        
      }
  }
  console.log(dict_str)
}



export { decode, getData}