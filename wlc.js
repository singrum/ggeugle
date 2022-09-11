class Rule{
    constructor(word_list, {changable = 1, len_filter = (w)=>w.length>=2, head_index = 0, tail_index = -1, is_misere = false}){

        this.word_list = word_list;
        this.changable = this.setChangable(changable);
        this.len_filter = len_filter;
        this.lenFilt();
        this.head_index = head_index;
        this.tail_index = tail_index;
        this.word_dict = this.setWordDict(this.word_list);
        this.is_misere = is_misere;
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
        // let h,t;
        // for(let word of this.rule.word_list){
        //     h = this.rule.head(word);
        //     t = this.rule.tail(word);
        //     if(!graph.has(h)){graph.set(h,[])}
        //     if(!graph.has(t)){graph.set(t,[])}
        //     graph.get(h).push(t);
        // }

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

async function getText(){
    let response = await fetch('https://singrum.github.io/ggeugle/olddict');
    let text = await response.text();
    return text;
}

async function func1(rule_object = {}){
    let text = await getText()
    let word_list = text.split('\n');
    let r = new Rule(word_list, rule_object);
    let wm = new WordManager(r);
    document.querySelector("#char-button-set").innerHTML=`
    <div class="col win-menu center">
        <div class="d-grid gap-2">
            <button class="btn btn-outline-primary" type="button">승리음절</button>
        </div>
    </div>
    <div class="col los-menu center">
        <div class="d-grid gap-2">
            <button class="btn btn-outline-danger" type="button">패배음절</button>
        </div>
    </div>
    <div class="col cir-menu center">
        <div class="d-grid gap-2">
            <button class="btn btn-outline-success" type="button">순환음절</button>
        </div>
    </div>`
        let search = function(){
        let val = document.querySelector('#search-box').value;
        let val_button_HTML;
        let val_result_HTML;
        if(wm.cir_char_set.has(val)){
            val_button_HTML = `<div class="char-button-set" style="margin-top:20px;margin-bottom:20px"><span class="char-button cir-char-button" style="font-size: 30px; padding : 5px 14px;">${val}</span><br></div>`;
            val_result_HTML = "";
            val_result_HTML += `<div class="char-button-set">`;
            wm.nextCirWordList(val).forEach(x=>{val_result_HTML += `<span class="char-button cir-char-button">${x}</span>`});
            val_result_HTML += `</div>`;
        }
        else if(wm.win_char_set.has(val)){
            let i = wm.win_char_class.findDegree(val);
            val_button_HTML = `<span class="badge bg-secondary">${i}턴 후 승리</span><div class="char-button-set" style="margin-top:5px; margin-bottom:10px"><span class="char-button win-char-button${i <= 3? i: 3}" style="font-size: 30px; padding : 5px 14px;">${val}</span><br></div>`;
            val_result_HTML = "";
            for(let i in wm.win_word_class.get(val).content){
                val_result_HTML += `<span class="badge bg-secondary">${i}턴 후 승리</span>`;
                val_result_HTML += `<div class="char-button-set">`;
                wm.win_word_class.get(val).get(i).forEach(x=>{val_result_HTML += `<span class="char-button win-char-button${i <= 3? i: 3}">${x}</span>`});
                val_result_HTML += `</div>`;
            }
        }
        else if(wm.los_char_set.has(val)){
            let i = wm.los_char_class.findDegree(val);
            val_button_HTML = `<span class="badge bg-secondary">${i}턴 후 패배</span><div class="char-button-set" style="margin-top:5px; margin-bottom:10px"><span class="char-button los-char-button${i <= 3? i: 3}" style="font-size: 30px; padding : 5px 14px;">${val}</span><br></div>`;
            val_result_HTML = "";
            for(let i in wm.los_word_class.get(val).content){
                val_result_HTML += `<span class="badge bg-secondary">${i}턴 후 패배</span>`;
                val_result_HTML += `<div class="char-button-set">`;
                wm.los_word_class.get(val).get(i).forEach(x=>{val_result_HTML += `<span class="char-button los-char-button${i <= 3? i: 3}">${x}</span>`});
                val_result_HTML += `</div>`;
            }
        }
        else if(!val){
            val_button_HTML = "";
            val_result_HTML = "";
        }
        else{
            val_button_HTML = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
            <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </symbol>
          </svg>
          <div class="alert alert-danger d-flex align-items-center" style="margin-top:20px" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
            <div>
              존재하지 않는 음절입니다!
            </div>
          </div>`
            val_result_HTML = ""
        }

        document.querySelector("#search-val-area").innerHTML = val_button_HTML;
        document.querySelector("#search-val-result").innerHTML = val_result_HTML;

        let char_button_list = document.querySelectorAll(".char-button")
        char_button_list.forEach(button => {button.addEventListener("click", ()=>{
            document.querySelector("#search-box").value = button.innerText.length === 1?button.innerText : wm.rule.tail(button.innerText);
            document.querySelector('#search-button').click();
            window.scrollTo({ left: 0, top: document.querySelector("#scroll-flag").offsetTop, behavior: "smooth" });
        })})
    }
    document.querySelector('#search-button').addEventListener("click", search);
    document.querySelector('#search-box').addEventListener("keypress", (e)=>{if (e.keyCode === 13) search()});
    document.querySelector(".win-menu").addEventListener("click", function(){
        
        let win_buttons_HTML = "";
        for(let i in wm.win_char_class.content){
            win_buttons_HTML += `<span class="badge bg-secondary">${i}턴 후 승리</span>`;
            win_buttons_HTML += `<div class="char-button-set">`;
            let arr = Array.from(wm.win_char_class.get(i));
            arr.sort()
            arr.forEach(x=>{win_buttons_HTML += `<span class="char-button win-char-button${i <= 3? i: 3}">${x}</span>`});
            win_buttons_HTML += `</div>`;
        }
        document.querySelector("#button-area").innerHTML = win_buttons_HTML;
        let char_button_list = document.querySelectorAll(".char-button")
        char_button_list.forEach(button => {button.addEventListener("click", ()=>{
            document.querySelector("#search-box").value = button.innerText.length === 1?button.innerText : wm.rule.tail(button.innerText);
            document.querySelector('#search-button').click();
            window.scrollTo({ left: 0, top: document.querySelector("#scroll-flag").offsetTop, behavior: "smooth" });
        })})
    });
    document.querySelector(".los-menu").addEventListener("click", function(){
        let los_buttons_HTML = "";
        for(let i in wm.los_char_class.content){
            los_buttons_HTML += "" + `<span class="badge bg-secondary">${i}턴 후 패배</span>`;
            los_buttons_HTML += `<div class="char-button-set">`;
            let arr = Array.from(wm.los_char_class.get(i));
            console.log(arr)
            arr.sort();
            arr.forEach(x=>{los_buttons_HTML += `<span class="char-button los-char-button${i <= 3? i: 3}">${x}</span>`});
            los_buttons_HTML += `</div>`;

        }
        document.querySelector("#button-area").innerHTML = los_buttons_HTML;
        let char_button_list = document.querySelectorAll(".char-button")
        char_button_list.forEach(button => {button.addEventListener("click", ()=>{
            document.querySelector("#search-box").value = button.innerText.length === 1?button.innerText : wm.rule.tail(button.innerText);
            document.querySelector('#search-button').click();
            window.scrollTo({ left: 0, top: document.querySelector("#scroll-flag").offsetTop, behavior: "smooth" });
        })})
    });


    document.querySelector(".cir-menu").addEventListener("click", function(){
        let cir_buttons_HTML = "";
        cir_buttons_HTML += `<div class="char-button-set">`;
        let arr = Array.from(wm.cir_char_set);
        arr.sort();
        arr.forEach(char=>{cir_buttons_HTML += `<span class="char-button cir-char-button">${char}</span>`});
        cir_buttons_HTML += `</div>`;
        
        document.querySelector("#button-area").innerHTML = cir_buttons_HTML;
        let char_button_list = document.querySelectorAll(".char-button")
        char_button_list.forEach(button => {button.addEventListener("click", ()=>{
            document.querySelector("#search-box").value = button.innerText.length === 1?button.innerText : wm.rule.tail(button.innerText);
            document.querySelector('#search-button').click();
            window.scrollTo({ left: 0, top: document.querySelector("#scroll-flag").offsetTop, behavior: "smooth" });
        })})
    });
    document.querySelector("#stat-button").addEventListener("click", function(){
        document.querySelector("#stat-alert-area").innerHTML=`<div class="alert alert-light alert-dismissible fade show " role="alert" style = "margin:20px 0px">
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        <table class="table table-hover">
        <tbody>
            <tr><th scope="row">단어 수</th><td>${wm.rule.word_list.length}</td></tr>
            <tr><th scope="row">음절 수</th><td>${wm.char_list.length}</td></tr>
            <tr><th scope="row">승리음절 수</th><td>${wm.win_char_set.size}</td></tr>
            <tr><th scope="row">패배음절 수</th><td>${wm.los_char_set.size}</td></tr>
            <tr><th scope="row">순환음절 수</th><td>${wm.cir_char_set.size}</td></tr>
            <tr><th scope="row">평균 순환단어 수</th><td>${Math.round((function(){let i=0; wm.cir_char_set.forEach((x)=>{i += wm.nextCirWordList(x).length;}); return i;}())/(wm.cir_char_set.size) * 10000)/10000}</td></tr>
        </tbody>

        </table>
      </div>`
    })

}
func1()

function ruleUpdate(){
    let changable;
    let i;
    let minlen;
    for(i = 0; i <= 3; i++){
        if(document.querySelector(`#chan${i}`).checked) {changable = i; break;}
    }
    let available_length_set = new Set()
    let len10up = document.querySelector("#length10up").checked;
    for(i = 2; i <= 9; i++){
        if(document.querySelector(`#length${i}`).checked){
            available_length_set.add(i);
            if(!minlen)minlen = i;
        }
    }
    let len_filter = function (word){
        if (available_length_set.has(word.length) || (len10up?(word.length >= 10):false)) return true;
        return false;
    }
    let head_index, tail_index
    let head_query_val = document.querySelector("#index-head").value.replace(/[^0-9]/g,'');
    let tail_query_val = document.querySelector("#index-tail").value.replace(/[^0-9]/g,'');
    if(head_query_val > minlen || tail_query_val > minlen){
        document.querySelector("#index-alert").innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
        인덱스값이 글자수의 최솟값보다 크면 안됩니다!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`
      return;
    }

    document.querySelector("#search-val-area").innerHTML= "";
    document.querySelector("#search-val-result").innerHTML = "";
    document.querySelector("#button-area").innerHTML = "";
    document.querySelector("#stat-alert-area").innerHTML = "";
    document.querySelector(".accordion-button").click();
    document.querySelector("#char-button-set").innerHTML=`<div class="col win-menu center">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>    
    </div>
    <div class="col los-menu center">
        <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div class="col cir-menu center">
        <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>`;


    if(document.querySelector("#index-head-forward").selected){head_index = head_query_val - 1}
    else{head_index = - head_query_val}
    if(document.querySelector("#index-tail-forward").selected){tail_index = tail_query_val - 1}
    else{tail_index = - tail_query_val}
    let rule_object = {changable, len_filter, head_index, tail_index};
    console.log(rule_object)
    func1(rule_object);
}
