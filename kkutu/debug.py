with open("kkutu/origin/노인정.txt", "r", encoding="UTF-8") as f:
    lines1 = set([line.strip() for line in f.readlines()])

with open("kkutu/origin/노인정_debug.txt", "r", encoding="UTF-8") as f:
    lines2 = set([line.strip() for line in f.readlines()])

diff1 = lines1 - lines2
diff2 = lines2 - lines1
print(diff1, diff2)
