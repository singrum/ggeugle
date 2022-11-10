# -*- coding: utf-8 -*-
import re
import json 
import time
import traceback

def ErrorLog(error: str):
    current_time = time.strftime("%Y.%m.%d/%H:%M:%S", time.localtime(time.time()))
    with open("Log.txt", "w") as f:
        f.write(f"[{current_time}] - {error}\n")



reg = re.compile(r'[^가-힣ㄱ-ㅎ]')
def get_lines():
    with open("opendict.txt", "r", encoding="UTF-8") as f:
        lst = [e.strip("\n").strip("\r").split("\t") for e in f.readlines()]
        for e in lst:
            e[0] = e[0].replace('-', "")
        lst = [a for a in lst if not reg.findall(a[0])]
    return lst

def write_file():
    words = get_lines()
    cate_set = ['일반어', '옛말', '북한어', '방언']
    pos_set = ['명사', '의존명사', '대명사', '수사', '부사', '관형사', '감탄사']
    for word in words:
        cate = word[2] if (word !="") else "일반어"
        pos = False
        change = {'명·부' : ["명사", "부사"], '대·부' : ['대명사', '부사'], '대·감' : ['대명사', '감탄사'], '부·감' : ['부사', '감탄사'], '관·명' :['관형사', '명사'], '관·감': ['관형사', '감탄사'], '의명·조' : ['의존명사'], '의존 명사' : ['의존명사'], '감·명':['감탄사', '명사'], '수·관·명':['수사','관형사','명사'], '대·관':['대명사','관형사'], '수·관':['수사','관형사']}
        if word[1] in pos_set:
            pos = [word[1]]
        elif word[1] in change:
            pos = change[word[1]]
        if pos:
            for p in pos:
                with open(f"db\\{cate}\\{p}", "a+", encoding = "UTF-8") as f:
                    f.write(word[0] + "\n")

            
cate_set = ['일반어', '옛말', '북한어', '방언']
pos_set = ['명사', '의존명사', '대명사', '수사', '부사', '관형사', '감탄사']
# lst = get_lines()
# lst = list(set(map(lambda x:x[1].strip('\n'), lst)))
# [write_file(a) for a in lst]


try:
    for cate in cate_set:
        for pos in pos_set:
            with open(f"db\\{cate}\\{pos}", "r", encoding = "UTF-8") as f:
                text = f.read()
                lst = text.split()
                lst = sorted(list(set(lst)))
                text = '\n'.join(lst)
            with open(f"db\\{cate}\\{pos}", "w", encoding = "UTF-8") as f:
                f.write(text)
            

            
except Exception:
    err = traceback.format_exc()
    ErrorLog(str(err))