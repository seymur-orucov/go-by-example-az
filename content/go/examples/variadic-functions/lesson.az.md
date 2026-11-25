Bəzi funksiyalar əvvəlcədən bilinməyən sayda arqument qəbul edir. `fmt.Println`-ə bir dəyər də, beş dəyər də vermək olur, `append(cart, "cheese", "tea")` isə slice-a bir dəfəyə iki element əlavə edir. Belə funksiyalara variadic deyilir. Adi parametrdə arqumentlərin sayı sabitdir, variadic parametr isə sıfır və ya daha çox dəyəri bir yerə toplayır.

Bu dərsdə qaçış izləyicisi yazırıq: hər qaçışın məsafəsi kilometrlə tam ədəd kimi verilir.

## Üç nöqtə ilə elan {#declare}

`runs ...int` "istənilən sayda `int`" deməkdir. Çağıranda dəyərlər vergüllə sadalanır: `totalKm(5, 3, 8)`. Heç bir dəyər verməmək də olar: `totalKm()` `0` qaytarır, çünki dövr bir dəfə də işləmir.

## İçəridə — slice {#slice}

Funksiyanın içində `runs` adi `[]int` slice-dır: onu `range` ilə gəzmək, `len` ilə saymaq, indekslə oxumaq olar. Go çağırışdakı dəyərlərdən yeni slice düzəldir və onu funksiyaya ötürür. Arqument verilməyəndə `runs` `nil` slice olur: çap olunanda `[]` görünür, `len` isə `0` qaytarır.

## Adi və variadic parametr birlikdə {#mixed}

Variadic parametrdən əvvəl adi parametrlər yazmaq olar: `report(name string, runs ...int)`. Birinci arqument `name`-ə düşür, qalanların hamısı `runs`-a toplanır. Variadic parametr yalnız sonuncu ola bilər, yoxsa Go hansı dəyərin hansı parametrə aid olduğunu bilməzdi.

## Hazır slice-ı ötürmək {#spread}

Həftənin qaçışları artıq `week` slice-ındadırsa, onu `totalKm(week)` kimi ötürmək olmaz: funksiya ayrı-ayrı `int` dəyərlər gözləyir, `[]int` yox. Slice-dan sonra `...` yazırıq: `totalKm(week...)` "slice-ı açıb elementlərini arqument kimi ver" deməkdir. Variadic hissə ya tamamilə sadalanır, ya da tamamilə slice-dan gəlir: `totalKm(1, week...)` kompilyasiya olunmur.

> **Diqqət:** `week...` yeni slice yaratmır, funksiya eyni elementləri alır. Funksiya `runs[0]`-ı dəyişsə, `week[0]` da dəyişəcək.

> **Bilgi:** Eyni yazılışla iki slice-ı birləşdirmək olar: `all := append(week, extra...)`.
