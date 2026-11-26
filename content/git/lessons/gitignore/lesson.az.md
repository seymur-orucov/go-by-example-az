Layihə qovluğunda commit olunmamalı fayllar da yaranır: açarlar və parollar, loglar, build nəticələri. `.gitignore` faylı Git-ə bu faylları görməməyi deyir: onlar `git status`-da görünmür və `git add .` onları götürmür. `.gitignore` adi fayldır və digər fayllar kimi commit olunur. Nümunə kiçik saytdır.

## Lazımsız fayllar {#problem}

Saytı build edəndə `build/` qovluğu yaranıb, `.env` faylında isə API açarı var. Hər ikisi `??` ilə görünür. `build/` qovluqdur: içindəki hər şey untracked olanda Git yalnız qovluğun adını göstərir. Bir `git add .` bu faylları commit-ə salar. Açar tarixçəyə düşsə, onu oradan təmizləmək çətindir.

## .gitignore yazmaq {#ignore}

`.gitignore`-da hər sətir bir pattern-dir, yəni fayl adlarına uyğun gələn nümunədir:

- `.env`: bu adda fayl;
- `build/`: sondakı `/` yalnız qovluğa uyğun gəlir, içindəki hər şey kənarda qalır;
- `*.log`: `*` istənilən simvollar deməkdir, yəni `.log` ilə bitən bütün fayllar.

İndi `git status` yalnız `.gitignore`-un özünü göstərir. Onu commit edirik ki, qaydalar repository-ni istifadə edən hər kəsdə işləsin.

> **Bilgi:** `#` ilə başlayan sətir şərhdir. `!` qaydanı ləğv edir (`!keep.log`). Əvvəldəki `/` isə pattern-i yalnız kök qovluğa bağlayır (`/config.json`).

## Hansı qayda işlədi? {#check}

Yeni `error.log` faylı yarandı, amma `git status` heç nə göstərmir: `*.log` onu kənarda saxlayır. `git check-ignore -v` hər fayl üçün onu kənarda saxlayan qaydanı göstərir: `.gitignore`, sətir nömrəsi, pattern və faylın yolu. Fayl gözlənilmədən görünəndə və ya görünməyəndə səbəbi belə tapmaq olur.

## İzlənən fayl kənarda qalmır {#tracked}

`debug.log` `.gitignore`-dan əvvəl commit olunmuşdu. `*.log` qaydasına baxmayaraq, onun dəyişikliyi ` M` kimi görünür. `.gitignore` yalnız untracked fayllara təsir edir. Git artıq izlədiyi faylı izləməyə davam edir.

## git rm --cached {#untrack}

`git rm --cached` faylı staging area-dan çıxarır, diskdə isə saxlayır. `D ` kodu (*deleted*, sol sütunda) deyir ki, növbəti commit-də fayl repository-dən silinəcək. Commit-dən sonra `ls` göstərir ki, `debug.log` diskdə qalıb. İndi o, untracked fayldır və `*.log` onu kənarda saxlayır.

> **Diqqət:** `--cached` olmadan `git rm` faylı diskdən də silir. Fayl köhnə commit-lərdə isə qalır: açar və ya parol commit olunubsa, onu dəyişmək lazımdır.
