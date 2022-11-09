# -*- coding: utf-8 -*-
import re

reg = re.compile(r'[^가-힣ㄱ-ㅎ]')
def get_lines():
    with open("opendict.txt", "r", encoding="UTF-8") as f:
        return [a.split("\t") for a in f.readlines()]

def write_file(word_type):
    lst = get_lines()
    lst = [a for a in lst if word_type == a[1].strip("\n").strip("\r")]
    lst = list(map(lambda x: x[0].replace('-', ""), lst))
    lst = [a for a in lst if not reg.findall(a)]
    lst = list(set(lst))
    lst.sort()
    with open("db\\품사\\opendict"+word_type, "w", encoding="UTF-8") as f:
        f.write("\n".join(lst))

lst = get_lines()
lst = list(set(map(lambda x:x[1].strip('\n'), lst)))
[write_file(a) for a in lst]