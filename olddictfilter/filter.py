import re

reg = re.compile(r'[^가-힣ㄱ-ㅎ]')
print(reg.findall("ㄱㄱ"))
with open("raw_olddict.txt", "r") as f:
    lst = [a.split("	") for a in f.readlines()]

lst = [a for a in lst if "명사" in a[-1]]
lst = list(map(lambda x: x[0].replace('-', ""), lst))
lst = [a for a in lst if not reg.findall(a)]
lst = list(set(lst))
lst.sort()
with open("filtered_olddict.txt", "w") as f:
    f.write("\n".join(lst))