import re

reg = re.compile(r'[^가-힣ㄱ-ㅎㅏ-ㅣ]')
type_range_no_injeong = set([0, 1, 2, 3, 7, 8, 9, 11, 15, 16, 17, 18, 19, 20])
type_range_injeong = set(
    [0, 1, 2, 3, 7, 8, 9, 11, 15, 16, 17, 18, 19, 20, "INJEONG"])

words = []

with open("kkutu/origin/db.txt", "r", encoding="UTF-8") as f:
    lines = f.readlines()
    temp = []
    for line in lines:
        word, t = line.split()
        word = word[1:-1]
        t = [int(e) if e.isdigit() else e for e in t.strip()[1:-1].split(",")]
        t = [e for e in t if e in type_range_no_injeong]
        if len(t) == 0:
            continue
        if len(word) == 1:
            continue
        words.append(word)

with open("kkutu/db/노인정", "w", encoding="UTF-8") as f:
    f.write("\n".join(sorted(list(set(words)))))
