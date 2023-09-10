class Rule{
    constructor(word_list, {changable = 1, len_filter = (w)=>w.length>=2, head_index = 0, tail_index = -1}){

        this.word_list = Array.from(new Set(word_list));
        this.changable = this.setChangable(changable);
        this.reverse_changable = this.setReverseChangable(changable);
        this.len_filter = len_filter;
        this.lenFilt();
        this.head_index = head_index;
        this.tail_index = tail_index;
        this.word_dict = this.setWordDict(this.word_list);
        
    }


    setChangable(changable){
        let sc = (char)=>char.charCodeAt(0);//string to charcode
        let cs = (code)=>String.fromCharCode(code);//code to string
        switch(changable){
            case 0: //두법 없음
                return function(char){return [char]};
            case 1: //표준
                return function(char){
                    if(sc(char) >= sc("랴") && sc(char) <= sc("럏") ||
                    sc(char) >= sc("려") && sc(char) <= sc("렿") ||
                    sc(char) >= sc("료") && sc(char) <= sc("룧") ||
                    sc(char) >= sc("류") && sc(char) <= sc("륳") ||
                    sc(char) >= sc("리") && sc(char) <= sc("맇") ||
                    sc(char) >= sc("례") && sc(char) <= sc("롛")) 
                        return [char, cs(sc(char) + sc("아") - sc("라"))];
                    if(sc(char) >= sc("라") && sc(char) <= sc("랗") ||
                    sc(char) >= sc("래") && sc(char) <= sc("랳") ||
                    sc(char) >= sc("로") && sc(char) <= sc("롷") ||
                    sc(char) >= sc("루") && sc(char) <= sc("뤃") ||
                    sc(char) >= sc("르") && sc(char) <= sc("릏") ||
                    sc(char) >= sc("뢰") && sc(char) <= sc("뢰")) 
                        return [char, cs(sc(char) + sc('나') - sc("라"))];
                    if(sc(char) >= sc("녀") && sc(char) <= sc("녛") ||
                    sc(char) >= sc("뇨") && sc(char) <= sc("눃") ||
                    sc(char) >= sc("뉴") && sc(char) <= sc("늏") ||
                    sc(char) >= sc("니") && sc(char) <= sc("닣")) 
                        return [char, cs(sc(char) + sc('아') - sc("나"))];
                    return [char];
                }
            case 2: //ㄹㄴㅇ 일방향
                return function(char){
                    if(sc(char) >= sc("라") && sc(char) <= sc("맇"))
                        return [char, cs(sc(char) + sc('나') - sc("라")), cs(sc(char) + sc("아") - sc("라"))];
                    if(sc(char) >= sc("나") && sc(char) <= sc("닣"))
                        return [char, cs(sc(char) + sc('아') - sc("나"))];
                    return [char]
                }
            case 3: //ㄹㄴㅇ 쌍방향
                return function(char){
                    if(sc(char) >= sc("라") && sc(char) <= sc("맇"))
                        return [char, cs(sc(char) + sc('나') - sc("라")), cs(sc(char) + sc("아") - sc("라"))];
                    if(sc(char) >= sc("나") && sc(char) <= sc("닣"))
                        return [char, cs(sc(char) + sc('라') - sc("나")), cs(sc(char) + sc("아") - sc("나"))];
                    if(sc(char) >= sc("아") && sc(char) <= sc("잏"))
                        return [char, cs(sc(char) + sc('라') - sc("아")), cs(sc(char) + sc("나") - sc("아"))];
                    return [char]
                }
        }
    }
    setReverseChangable(changable){
        let sc = (char)=>char.charCodeAt(0);//string to charcode
        let cs = (code)=>String.fromCharCode(code);//code to string
        switch(changable){
            case 0: //두법 없음
                return function(char){return [char]};
            case 1: //표준
                return function(char){
                    if(sc(char) >= sc("야") && sc(char) <= sc("얗") ||
                    sc(char) >= sc("예") && sc(char) <= sc("옣")) 
                        return [char, cs(sc(char) + sc("라") - sc("아"))];
                    if(sc(char) >= sc("나") && sc(char) <= sc("낳") ||
                    sc(char) >= sc("내") && sc(char) <= sc("냏") ||
                    sc(char) >= sc("노") && sc(char) <= sc("놓") ||
                    sc(char) >= sc("누") && sc(char) <= sc("눟") ||
                    sc(char) >= sc("느") && sc(char) <= sc("늫") ||
                    sc(char) >= sc("뇌") && sc(char) <= sc("뇧")) 
                        return [char, cs(sc(char) + sc('라') - sc("나"))];
                    if(sc(char) >= sc("여") && sc(char) <= sc("옇") ||
                    sc(char) >= sc("요") && sc(char) <= sc("욯") ||
                    sc(char) >= sc("유") && sc(char) <= sc("윻") ||
                    sc(char) >= sc("이") && sc(char) <= sc("잏")) 
                        return [char, cs(sc(char) + sc('나') - sc("아")), cs(sc(char) + sc('라') - sc("아"))];
                    return [char];
                }
            case 2: //ㄹㄴㅇ 일방향
                return function(char){
                    if(sc(char) >= sc("아") && sc(char) <= sc("잏"))
                        return [char, cs(sc(char) + sc('나') - sc("아")), cs(sc(char) + sc("라") - sc("아"))];
                    if(sc(char) >= sc("나") && sc(char) <= sc("닣"))
                        return [char, cs(sc(char) + sc('라') - sc("나"))];
                    return [char]
                }
            case 3: //ㄹㄴㅇ 쌍방향
                return function(char){
                    if(sc(char) >= sc("라") && sc(char) <= sc("맇"))
                        return [char, cs(sc(char) + sc('나') - sc("라")), cs(sc(char) + sc("아") - sc("라"))];
                    if(sc(char) >= sc("나") && sc(char) <= sc("닣"))
                        return [char, cs(sc(char) + sc('라') - sc("나")), cs(sc(char) + sc("아") - sc("나"))];
                    if(sc(char) >= sc("아") && sc(char) <= sc("잏"))
                        return [char, cs(sc(char) + sc('라') - sc("아")), cs(sc(char) + sc("나") - sc("아"))];
                    return [char]
                }
        }
    }
    

    lenFilt(){

        this.word_list = this.word_list.filter(x => x&&this.len_filter(x));
    }

    head(word){return word[this.head_index >= 0? this.head_index:word.length + this.head_index];}

    tail(word){return word[this.tail_index >= 0? this.tail_index:word.length + this.tail_index];}

    setWordDict(word_list){
        let dict = new Map();
        let h,t;
        for(let word of word_list){
            h = this.head(word);
            t = this.tail(word);
            if(!dict.has(h)){dict.set(h, []);}
            if(!dict.has(t)){dict.set(t, []);}
            dict.get(h).push(word);
        }
        return dict;
    }
}

class DegreeClass{
    constructor(){
        this.content = [];
    }
    add(i, char){
        if (!this.content[i]){this.content[i] = new Set;}
        this.content[i].add(char);
    }
    get(i){
        return this.content[i];
    }
    findDegree(char){
        let i;
        for(i = 0;i<this.content.length;i++){
            if (this.get(i).has(char)){
                return i;
            }
        }
    }
}

class WordClass{
    constructor(char_set){
        this.content = new Map();
        char_set.forEach(x=>this.content.set(x, new DegreeClass()));
    }
    add(char, deg, word){
        this.content.get(char).add(deg, word);
    }
    get(char){
        return this.content.get(char)
    }
    
}

class CharManager{
    constructor(rule){
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
    setGraph(){
        let graph = new Map();
        for(let [key, val] of this.rule.word_dict.entries()){
            graph.set(key, val.map(x=>this.rule.tail(x)));
        }
        return graph;
    }
    nextCharList(char){
        let result = [];
        for(let c of this.rule.changable(char)) {if (this.graph.get(c)) result = result.concat(this.graph.get(c))};
        return result;
    }
    
    _isLosChar(char){return this.nextCharList(char).every(x=>this.win_char_set.has(x));}
    _isWinChar(char){return this.nextCharList(char).some(x=>this.los_char_set.has(x));}
    _classifyChar(){
        let i = 0;
        let updated_char = new Set();
        let is_updated = true;
        while(is_updated){
            is_updated = false;
            for(let char of this.cir_char_set){
                if(updated_char.has(char))
                    continue;
                if(this._isLosChar(char)){
                    this.los_char_set.add(char);
                    is_updated = true;
                    updated_char.add(char);
                    this.los_char_class.add(i, char);
                    continue;
                }
            }

            for(let char of updated_char){
                this.cir_char_set.delete(char);
            }
            updated_char = new Set();

            for(let char of this.cir_char_set){

                if(updated_char.has(char))
                    continue;

                if(this._isWinChar(char)){
                    this.win_char_set.add(char);
                    is_updated = true;
                    updated_char.add(char);
                    this.win_char_class.add(i, char);
                }
            }

            for(let char of updated_char){
                this.cir_char_set.delete(char);
            }
            updated_char = new Set()

            i++;
        }
        this.degree = i-1;
    }
    LWCof(char){
        if(this.Lchar.has(char)) return "L";
        if(this.Wchar.has(char)) return "W";
        return "C"
    }
}

class WordManager extends CharManager{
    constructor(rule){
        super(rule);
        this.win_word_class = new WordClass(this.win_char_set);
        this.los_word_class = new WordClass(this.los_char_set);
        this.setWordClass()
    }

    nextWordList(char){
        let result = [];
        for(let c of this.rule.changable(char)){
            if(this.rule.word_dict.get(c))
                result = result.concat(this.rule.word_dict.get(c))
        }
        return result;
    }

    setWordClass(){
        let i;
        for(let char of this.win_char_set){
            
            for(let word of this.nextWordList(char)){
                if(this.los_char_set.has(this.rule.tail(word))){
                    i = this.los_char_class.findDegree(this.rule.tail(word));
                    this.win_word_class.add(char, i, word);
                }
            }
        }
        for(let char of this.los_char_set){
            for(let word of this.nextWordList(char)){
                i = this.win_char_class.findDegree(this.rule.tail(word));
                this.los_word_class.add(char, i, word);
            }
        }
    }

    nextCirWordList(char){
        return this.nextWordList(char).filter(x=>this.cir_char_set.has(this.rule.tail(x)));
    }
    
}

export {Rule, DegreeClass, WordClass, CharManager, WordManager}
