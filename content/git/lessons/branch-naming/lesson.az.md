Git branch adına az qayda qoyur: adda boşluq və bir neçə xüsusi simvol olmamalıdır. Qalanını komanda özü razılaşdırır. Yaxşı ad `git branch` siyahısından üç suala cavab verir: branch-da hansı iş gedir, hansı tapşırığa aiddir və onu silmək olarmı.

Nümunə üç nəfərlik komandanın kiçik onlayn kitab mağazasıdır: Sam, Ayla və Murad mağazaya hədiyyə kartları və axtarış əlavə edirlər.

## 15 branch və heç bir məlumat {#why}

Bir neçə həftə sonra `git branch` 15 branch göstərir: `test`, `new`, `sam2`, `fix`, `temp` və daha on belə ad. Hədiyyə kartları hansındadır? `fix` hansı səhvi düzəldir? Hansı branch artıq `main`-ə merge olunub və silinə bilər? Adlar bunu demir. Cavab üçün hər branch-ın commit-lərinə ayrıca baxmaq lazımdır. Ona görə heç kim heç nəyi silmir və siyahı böyüyür.

Cədvəldə eyni beş iş iki cür adlandırılıb. Sağ sütundakı addan işin növü, tapşırığın nömrəsi və mövzusu oxunur.

## Növ prefiksi {#prefixes}

Adın əvvəlindəki prefiks işin növünü deyir. Çox işlənən prefikslər commit mesajları dərsindəki Conventional Commits tiplərinə bənzəyir:

- `feat/` yeni imkan: `feat/gift-cards`
- `fix/` səhvin düzəlişi: `fix/cart-total`
- `docs/` sənədlər: `docs/update-readme`
- `chore/` texniki xidmət işi: `chore/upgrade-node`
- `hotfix/` işləyən saytda təcili düzəliş: `hotfix/payment-page-crash`

Bunlar Git-in qaydası deyil, komandaların razılaşmasıdır (konvensiya). Git üçün `feat/gift-cards` içində `/` olan adi addır. Ona görə komandalar fərqlənir. Biri `feature/` və `bugfix/` yazır, başqası prefiksə müəllifin adını qoyur: `ayla/gift-cards`. Layihəyə qoşulanda README-yə, `CONTRIBUTING.md`-yə və mövcud branch-lara baxın və eyni üslubu işlədin.

> **Bilgi:** prefiks siyahını süzməyə kömək edir. `git branch --list "feat/*"` yalnız `feat/` ilə başlayan branch-ları göstərir.

## Tapşırıq nömrəsi və adın forması {#format}

Komanda tapşırıqları Jira və ya GitHub Issues kimi sistemdə izləyirsə, ada tapşırığın nömrəsi də yazılır: `feat/BOOK-142-gift-cards`. `BOOK-142` mağaza layihəsində 142 nömrəli tapşırıqdır. Branch-dan tapşırığı tapmaq olur, tapşırıqdan da branch-ı. Məsələn, Jira GitHub-a qoşulubsa, adında tapşırıq açarı olan branch-ı tapşırığın səhifəsində göstərir.

Nömrədən sonra 2–4 sözlük qısa təsvir gəlir. Sözlər kiçik hərflə yazılır və defislə ayrılır: `gift-cards`, `cart-total`. Bu yazılışa **kebab-case** deyilir. Adda boşluq olmadığı üçün onu terminalda dırnaqsız yazmaq olur. Uzun ad siyahıda çətin oxunur, ətraflı izah isə tapşırıqda və commit mesajlarında onsuz da var. Tapşırıq nömrəsi sistemdəki kimi qalır (`BOOK-142`), qalan hissə kiçik hərflə yazılır.

> **Diqqət:** modulun ilk dərsində gördük ki, branch `.git/refs/heads/` qovluğunda bir fayldır. Windows və macOS-da fayl adlarında böyük və kiçik hərf adətən fərqlənmir. Orada `Fix/cart` və `fix/cart` eyni qovluğa düşür və qarışıqlıq yaranır.

## Git nəyi qəbul etmir {#git-rules}

Git-in öz qaydaları simvollara aiddir. Branch adında bunlar ola bilməz:

- boşluq;
- `~`, `^`, `:`, `?`, `*`, `[` və `\` simvolları;
- ardıcıl iki nöqtə `..` və `@{` birləşməsi;
- əvvəldə `-`, sonda `/`, `.` və ya `.lock`;
- nöqtə ilə başlayan hissə: `.feat` və ya `feat/.draft`.

Bu simvolların çoxu Git-də başqa iş görür. `HEAD~1`-də `~` əvvəlki commit-i göstərir, `..` isə iki commit arasındakı aralığı yazır (aralıqları sonrakı dərslərdə görəcəyik). `?`, `*` və `[` terminalda fayl adı şablonudur. Belə simvol adda olsaydı, Git və terminal komandanı səhv oxuya bilərdi.

Adı yoxlamaq üçün `git check-ref-format --branch <ad>` komandası var. Düzgün adı olduğu kimi çap edir. Səhv ada isə `fatal: 'gift cards' is not a valid branch name` cavabını verir. `git branch "gift cards"` də eyni xəta ilə dayanır və branch yaratmır.

## Slash və eyni adlı qovluq {#slash}

`/` adda icazəlidir və branch-ları qruplara bölür. Git `feat/gift-cards`-ı `.git/refs/heads/feat/` qovluğunda `gift-cards` adlı fayl kimi saxlayır. Buna görə `feat` adlı branch və `feat/...` branch-ları eyni vaxtda ola bilməz. `feat` fayl olur, `feat/gift-cards` üçün isə həmin adda qovluq lazımdır.

Murad əvvəlcə sadəcə `feat` adlı branch yaradıb. Ayla `git switch -c feat/gift-cards` yazanda Git dayanır:

`fatal: cannot lock ref 'refs/heads/feat/gift-cards': 'refs/heads/feat' exists; cannot create 'refs/heads/feat/gift-cards'`

`cannot lock ref` o deməkdir ki, Git yeni ref faylını yaza bilmədi. Səbəb mesajın davamındadır: `refs/heads/feat` artıq var. Əks halda da belədir: `fix/cart-total` varsa, `fix` yaratmaq olmur. Çıxış yolu köhnə branch-ın adını `git branch -m` ilə dəyişməkdir: `git branch -m feat feat/search`. Bundan sonra `feat/gift-cards` yaradılır.
