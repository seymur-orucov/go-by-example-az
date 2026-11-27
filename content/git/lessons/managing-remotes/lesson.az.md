Clone edilən repository-də `origin`-i Git özü yaradır. `git init` ilə başlanan repository-nin isə remote-u yoxdur. Remote-ları `git remote` komandası idarə edir: onunla remote əlavə edir, adını və ya URL-ni dəyişir və silirsiniz.

Nümunə velosiped təmiri qeydləridir: `bike-notes/` qovluğunda `brakes.md` və `tools.txt` faylları var, bir commit də edilib.

## Remote əlavə etmək {#add}

İlk `git remote` heç nə çap etmir: repository-nin hələ remote-u yoxdur. `git remote add <ad> <URL>` yeni remote yazır. Ad istənilən ola bilər, amma əsas server üçün `origin` adı qəbul olunub. Komanda serverə qoşulmur, yalnız adı və URL-ni yadda saxlayır.

`git remote -v` hər remote-u URL ilə göstərir. `(fetch)` və `(push)` sətirlərini clone dərsində gördünüz. Commit-ləri serverə göndərməyi bu modulun "push və upstream" dərsində keçəcəyik.

Burada server bu kompüterdəki qovluqdur, ona görə URL `/home/sam/server/bike-notes.git` kimi yoldur. GitHub-da repository yaradanda sayt URL-ni özü göstərir: `https://github.com/sam/bike-notes.git` və ya SSH ilə `git@github.com:sam/bike-notes.git`. Onu `git remote add origin`-dən sonra yazırsınız.

## Remote .git/config faylında {#config}

`git remote add` remote-u repository-nin `.git/config` faylına yazır. `git config --get-regexp remote` adında `remote` sözü olan parametrləri göstərir. Parametrin adı üç hissədir: bölmə (`remote`), remote-un adı (`origin`) və açar (`url`). Faylın özündə bu iki sətir `[remote "origin"]` başlığının altındadır: `url = ...` və `fetch = ...`.

`url` remote-un ünvanıdır. `fetch` sətri serverdən gələn branch-ların lokal olaraq hansı adla saxlanacağını deyir: serverdəki `main` sizdə `origin/main` olacaq. Clone dərsində gördüyünüz remote-tracking branch-ların adı buradan gəlir.

## Adı dəyişmək: rename {#rename}

Velosiped klubu ortaq server açdı və Sam qeydləri ora da yükləmək istəyir. Klub serveri əsas olacaq, ona görə `origin` adı ona lazımdır. Ev serverinə `home` adı verilir: `git remote rename origin home`. Komanda uğurla işləyəndə heç nə çap etmir.

`git config` çıxışında hər iki sətir dəyişib. Parametrlər artıq `remote.home` ilə başlayır, `fetch` sətrində də `refs/remotes/home/*` yazılıb. Yəni serverdən gələn branch-lar da yeni adla saxlanacaq: `home/main`.

Sonra `origin` adı ilə klub serveri əlavə olunur. `git remote -v` indi iki remote göstərir, hər birinin `(fetch)` və `(push)` sətri var.

## URL-ni dəyişmək: set-url {#set-url}

Ev serverindəki repository yeni diskə köçürüldü və ünvanı dəyişdi. Remote-u silib yenidən əlavə etmək lazım deyil. `git remote set-url home <yeni URL>` yalnız URL-ni dəyişir. `git remote -v`-də `home` artıq `/home/sam/nas/bike-notes.git`-i göstərir, `origin` isə olduğu kimi qalıb.

GitHub-da HTTPS-dən SSH-a da eyni komanda ilə keçirsiniz: `git remote set-url origin git@github.com:sam/bike-notes.git`. Remote-un adı dəyişmir, yalnız ünvanı dəyişir.

## Silmək: remove {#remove}

Sam ev serverini daha işlətmir. `git remote remove home` remote-u `.git/config`-dən silir. Onun remote-tracking branch-ları da (`home/main` kimi) silinir. Serverdəki repository-yə isə toxunulmur: orada heç nə silinmir. `git remote -v`-də yalnız `origin` qalıb.

> **Bilgi:** `git remote rm home` eyni komandanın qısa yazılışıdır.
