
let menu_flag = 1;

async function main(dict_num = 0, pos_list = ["명사"], cate_list = ["일반어", "방언", "북한어", "옛말"], rule_object = {}){



    let word_list = [];
    if(dict_num == 0){
        for(let pos of pos_list){
            let response = await fetch(`https://singrum.github.io/ggeugle/olddictfilter/db2/olddict${encodeURI(pos)}`);
            let text = await response.text();
            word_list = word_list.concat(text.split('\n').map(x=>x.trim("\r")));
            
    }
    }


    else if(dict_num == 1){
        for(let cate of cate_list){
            for (let pos of pos_list){
                response = await fetch(`https://singrum.github.io/ggeugle/opendict_db/db/${cate}/${encodeURI(pos)}`);
                text = await response.text();
                word_list = word_list.concat(text.split('\n').map(x=>x.trim("\r")));
            }
        }
    }

    else if(dict_num == 2){
        for(let pos of pos_list){
            let response = await fetch(`https://singrum.github.io/ggeugle/elementarydict/db/${encodeURI(pos)}`);
            let text = await response.text();
            word_list = word_list.concat(text.split('\n').map(x=>x.trim("\r")));
            
        }
    }

    let r = new Rule(word_list, rule_object);
    let wm = new WordManager(r);
    
    function searchLengthRestrict(){
        if(document.querySelector("#search-box").value.length > 3){
            document.querySelector("#search-box").value = document.querySelector("#search-box").value[3];
        }
    }
    function search(){
        let val = document.querySelector('#search-box').value;
        let val_button_HTML = "";
        let val_result_HTML = "";
        if(wm.cir_char_set.has(val)){
            val_button_HTML = `<div class="char-button-set" style="margin-top:20px;margin-bottom:20px"><span class="char-button cir-char-button" style="font-size: 30px; padding : 5px 14px;">${val}</span><br></div>`;
            
            val_result_HTML += `<div class="char-button-set">`;
            let sorted_array = wm.nextCirWordList(val).sort((a,b) => {
            if (wm.rule.tail(a) > wm.rule.tail(b)) return 1;
            if (wm.rule.tail(a) < wm.rule.tail(b)) return -1;
            return 0;});
            sorted_array.forEach(x=>{val_result_HTML += `<span class="char-button cir-char-button">${x}</span>`});
            val_result_HTML += `</div>`;
            val_result_HTML += `<span class="badge bg-secondary">${val}(으)로 끝나는 순환단어</span>`
            val_result_HTML += `<div class="char-button-set"">`
            let result = [];
            for(let char of wm.cir_char_set){
                result = result.concat(wm.nextCirWordList(char).filter(e => wm.rule.reverse_changable(val).includes(wm.rule.tail(e))))
            }
            
            sorted_array = Array.from(new Set(result)).sort((a,b) => {
                if(wm.rule.head(a) > wm.rule.head(b)) return 1;
                if (wm.rule.head(a) < wm.rule.head(b)) return -1;
                return 0;});
            sorted_array.forEach(x=>{val_result_HTML += `<span class="char-button cir-char-button">${x}</span>`});
            val_result_HTML += `</div>`;
        }
        else if(wm.win_char_set.has(val)){
            let i = wm.win_char_class.findDegree(val);
            val_button_HTML = `<span class="badge bg-secondary">${i}턴 후 승리</span><div class="char-button-set" style="margin-top:5px; margin-bottom:10px"><span class="char-button win-char-button${i <= 3? i: 3}" style="font-size: 30px; padding : 5px 14px;">${val}</span><br></div>`;
            
            for(let i in wm.win_word_class.get(val).content){
                val_result_HTML += `<span class="badge bg-secondary">${i}턴 후 승리</span>`;
                val_result_HTML += `<div class="char-button-set">`;
                let sorted_array = Array.from(wm.win_word_class.get(val).get(i)).sort((a,b) => {
                    if (wm.rule.tail(a) > wm.rule.tail(b)) return 1;
                    if (wm.rule.tail(a) < wm.rule.tail(b)) return -1;
                    return 0;});
                
                sorted_array.forEach(x=>{val_result_HTML += `<span class="char-button win-char-button${i <= 3? i: 3}">${x}</span>`});
                val_result_HTML += `</div>`;
            }

        }
        else if(wm.los_char_set.has(val)){
            let i = wm.los_char_class.findDegree(val);
            val_button_HTML = `<span class="badge bg-secondary">${i}턴 후 패배</span><div class="char-button-set" style="margin-top:5px; margin-bottom:10px"><span class="char-button los-char-button${i <= 3? i: 3}" style="font-size: 30px; padding : 5px 14px;">${val}</span><br></div>`;
            
            for(let i in wm.los_word_class.get(val).content){
                val_result_HTML += `<span class="badge bg-secondary">${i}턴 후 패배</span>`;
                val_result_HTML += `<div class="char-button-set">`;
                let sorted_array = Array.from(wm.los_word_class.get(val).get(i)).sort((a,b) => {
                    if (wm.rule.tail(a) > wm.rule.tail(b)) return 1;
                    if (wm.rule.tail(a) < wm.rule.tail(b)) return -1;
                    return 0;});
                sorted_array.forEach(x=>{val_result_HTML += `<span class="char-button los-char-button${i <= 3? i: 3}">${x}</span>`});
                val_result_HTML += `</div>`;
            }
            val_result_HTML += `<span class="badge bg-secondary">${val}(으)로 끝나는 단어</span>`
            val_result_HTML += `<div class="char-button-set"">`
            let sorted_array = wm.rule.word_list.filter((e) => wm.rule.reverse_changable(val).filter(e=>wm.los_char_set.has(e)).includes(wm.rule.tail(e))).sort((a,b) => {if(wm.rule.head(a) > wm.rule.head(b)) return 1;
                if (wm.rule.head(a) < wm.rule.head(b)) return -1;
                return 0;});
            sorted_array.forEach(x=>{val_result_HTML += `<span class="char-button win-char-button${i <= 3? i: 3}">${x}</span>`});
            val_result_HTML += `</div>`;

        }
        else if(!val){
            val_button_HTML = "";
            
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
            
        }

        document.querySelector("#search-val-area").innerHTML = val_button_HTML;
        document.querySelector("#search-val-result").innerHTML = val_result_HTML;

        
        addEventtoButtons();
    }
    

    let foo = function(){
        document.querySelector("#search-box").value = this.innerText.length === 1?this.innerText : wm.rule.tail(this.innerText);
        search();
    }
    
    search();
    
    function addEventtoButtons(){

        let char_button_list = document.querySelectorAll(".char-button");

        char_button_list.forEach(button => {
            button.removeEventListener("click", foo);
            button.addEventListener("click", foo);})
    }
    let search_event = function(){searchLengthRestrict();search();};
    
    document.querySelector('#search-box').addEventListener("keyup", search_event);
    
    function make_offcanvas(){
        
        let win_buttons_HTML = "";
        for(let i in wm.win_char_class.content){
            win_buttons_HTML += `<span class="badge bg-secondary">${i}턴 후 승리</span>`;
            win_buttons_HTML += `<div class="char-button-set">`;
            let arr = Array.from(wm.win_char_class.get(i));
            arr.sort()
            arr.forEach(x=>{win_buttons_HTML += `<span class="char-button win-char-button${i <= 3? i: 3}">${x}</span>`});
            win_buttons_HTML += `</div>`;
        }
        document.querySelector("#win-button-area").innerHTML = win_buttons_HTML;
        
        let los_buttons_HTML = "";
        for(let i in wm.los_char_class.content){
            los_buttons_HTML += "" + `<span class="badge bg-secondary">${i}턴 후 패배</span>`;
            los_buttons_HTML += `<div class="char-button-set">`;
            let arr = Array.from(wm.los_char_class.get(i));
            arr.sort();
            arr.forEach(x=>{los_buttons_HTML += `<span class="char-button los-char-button${i <= 3? i: 3}">${x}</span>`});
            los_buttons_HTML += `</div>`;
        }
        document.querySelector("#los-button-area").innerHTML = los_buttons_HTML;
        
        let cir_buttons_HTML = "";
        cir_buttons_HTML += `<div class="char-button-set">`;
        let arr = Array.from(wm.cir_char_set);
        arr.sort();
        arr.forEach(char=>{cir_buttons_HTML += `<span class="char-button cir-char-button">${char}</span>`});
        cir_buttons_HTML += `</div>`;
        
        document.querySelector("#cir-button-area").innerHTML = cir_buttons_HTML;
        addEventtoButtons();
    }
    make_offcanvas();
    

    let win_menu_event = ()=>{
        if(menu_flag !== 1){
            menu_flag = 1;
            document.querySelector("#win-button-area").style.display = "block";
            document.querySelector("#los-button-area").style.display = "none";
            document.querySelector("#cir-button-area").style.display = "none";
        }
    }
    let los_menu_event = ()=>{
        if(menu_flag !== 2){
            menu_flag = 2;
            document.querySelector("#win-button-area").style.display = "none";
            document.querySelector("#los-button-area").style.display = "block";
            document.querySelector("#cir-button-area").style.display = "none";
        }
    }
    let cir_menu_event = ()=>{
        if(menu_flag !== 3){
            menu_flag = 3;
            document.querySelector("#win-button-area").style.display = "none";
            document.querySelector("#los-button-area").style.display = "none";
            document.querySelector("#cir-button-area").style.display = "block";
        }
    }

    document.querySelector(".win-menu").addEventListener("click", win_menu_event);
    document.querySelector(".los-menu").addEventListener("click", los_menu_event);
    document.querySelector(".cir-menu").addEventListener("click", cir_menu_event);

    document.querySelector(".subsearch-keyboard").addEventListener("click", function(){
            document.querySelector(".offcanvas-close").click();
            document.querySelector(".search-box").click();
        }
    )


    document.querySelector(".subsearch-shuffle").addEventListener("click", function(){
        let random_char = wm.char_list[Math.floor(Math.random() * wm.char_list.length)]
        document.querySelector("#search-box").value = random_char;
        search();
    })
    document.querySelector("#stat-button").addEventListener("click", function(){
        document.querySelector("#alert-area").innerHTML=`
            <table class="table table-hover">
            <tbody>
                <tr><th scope="row">단어 수</th><td>${wm.rule.word_list.length}</td></tr>
                <tr><th scope="row">음절 수</th><td>${wm.char_list.length}</td></tr>
                <tr><th scope="row">승리음절 수</th><td>${wm.win_char_set.size}</td></tr>
                <tr><th scope="row">패배음절 수</th><td>${wm.los_char_set.size}</td></tr>
                <tr><th scope="row">순환음절 수</th><td>${wm.cir_char_set.size}</td></tr>
                <tr><th scope="row">평균 순환단어 수</th><td>${Math.round((function(){let i=0; wm.cir_char_set.forEach((x)=>{i += wm.nextCirWordList(x).length;}); return i;}())/(wm.cir_char_set.size) * 10000)/10000}</td></tr>
            </tbody>

            </table>`;
        }
    )
    document.querySelector(".backdrop").style.display = "none";


}
main()

function ruleUpdate(){
    
    let dict_num;
    let changable;
    let i;
    let minlen;
    for(i = 0; i <= 2; i++){
        if(document.querySelector(`#dict${i}`).checked) {dict_num = i; break;}
    }
    for(i = 0; i <= 3; i++){
        if(document.querySelector(`#chan${i}`).checked) {changable = i; break;}
    }

    let pos_list = [];
    for(i = 0; i <= 6; i++){
        if(document.querySelector(`#pos${i}`).checked){
            pos_list.push(i);
        }
    }
    pos_list = pos_list.map(x=>{
        switch(x){
            case 0:
                return "명사";
            case 1:
                return "의존명사"
            case 2:
                return "대명사";
            case 3:
                return "수사"
            case 4:
                return "부사";
            case 5:
                return "관형사";
            case 6:
                return "감탄사";
        }
    })

    let cate_list = [];
    for(i = 0; i<=3; i++){
        if(document.querySelector(`#cate${i}`).checked){
            cate_list.push(i);
        }
    }
    cate_list = cate_list.map(x=>{
        switch(x){
            case 0:
                return "일반어";
            case 1:
                return "방언";
            case 2:
                return "북한어";
            case 3:
                return "옛말";
        }
    })


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
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
        </button>
      </div>`
      return;
    }
    var modal = bootstrap.Modal.getInstance(document.querySelector("#rule-modal"))
    modal.hide();


    if(document.querySelector("#index-head-forward").selected){head_index = head_query_val - 1}
    else{head_index = - head_query_val}
    if(document.querySelector("#index-tail-forward").selected){tail_index = tail_query_val - 1}
    else{tail_index = - tail_query_val}




    let rule_object = {changable, len_filter, head_index, tail_index};

    let temp = document.querySelector(".search-box").value;
    document.querySelector(".search-set").innerHTML = `<input type="text" class="search-box form-control center" id = "search-box" placeholder="" maxlength='1'/>
            
    <span class="btn btn-outline-secondary subsearch-keyboard" type="button">
        <span class="material-symbols-outlined">
            keyboard
        </span>
    </span>
    <span class="btn btn-outline-secondary subsearch-selection" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">
        <span class="material-symbols-outlined">
            apps
        </span>
    </span>
    <span class="btn btn-outline-secondary subsearch-shuffle" type="button">
        <span class="material-symbols-outlined">
            shuffle
        </span>
    </span>`;

    document.querySelector(".search-box").value = temp;
    if(menu_flag == 1){
        document.querySelector(".menu-group").innerHTML = 
        `<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
        <label class="btn btn-outline-primary wlc-menu win-menu" for="btnradio1">승리음절</label>
    
        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
        <label class="btn btn-outline-danger wlc-menu los-menu" for="btnradio2">패배음절</label>
    
        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
        <label class="btn btn-outline-success wlc-menu cir-menu" for="btnradio3">순환음절</label>`;
    }
    else if(menu_flag == 2){
        document.querySelector(".menu-group").innerHTML = 
        `<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off">
        <label class="btn btn-outline-primary wlc-menu win-menu" for="btnradio1">승리음절</label>
    
        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked>
        <label class="btn btn-outline-danger wlc-menu los-menu" for="btnradio2">패배음절</label>
    
        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
        <label class="btn btn-outline-success wlc-menu cir-menu" for="btnradio3">순환음절</label>`;
    }
    else{
        document.querySelector(".menu-group").innerHTML = 
        `<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off">
        <label class="btn btn-outline-primary wlc-menu win-menu" for="btnradio1">승리음절</label>
    
        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
        <label class="btn btn-outline-danger wlc-menu los-menu" for="btnradio2">패배음절</label>
    
        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" checked>
        <label class="btn btn-outline-success wlc-menu cir-menu" for="btnradio3">순환음절</label>`;
    }

    document.querySelector(".stat-rule-btn-set").innerHTML = 
    `<button type="button" class="trans-bnt" id="stat-button" data-bs-toggle="modal" data-bs-target="#stat-modal"><span class="material-symbols-outlined" style="font-size:30px;">query_stats</span></button>
    <button type="button" class="trans-bnt" id="rule-button" data-bs-toggle="modal" data-bs-target="#rule-modal"><span class="material-symbols-outlined" style="font-size:30px;">settings</span></button>`;
    document.querySelector(".backdrop").style.display = "flex";
    main(dict_num, pos_list, cate_list, rule_object);
}