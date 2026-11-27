**Hook** Git-in müəyyən anda özü işə saldığı skriptdir, məsələn commit-dən və ya push-dan əvvəl. Hook-a yoxlama yazırsınız, Git onu hər dəfə həmin anda işlədir. Yoxlama keçməsə, Git əməliyyatı dayandırır və səhv tarixçəyə düşmür.

Nümunədə üç nəfərlik komanda velosiped icarəsi proqramı yazır: kodda tez-tez unudulmuş `console.log` qalır, tarixçədə isə `fix` kimi mesajlar yığılır.

## Hook nədir {#what}

Git-in işində sabit anlar var, hər birinin öz adı olur:

- `pre-commit`: commit yaranmazdan əvvəl;
- `commit-msg`: commit mesajı yazılandan sonra;
- `post-checkout`: branch dəyişəndən sonra;
- `pre-push`: push-dan əvvəl.

Belə adda skript varsa, Git o anda onu işə salır.

Adın əvvəli hook-un nə vaxt işlədiyini deyir. `pre-` hook-u əməliyyatdan əvvəl işləyir və onu dayandıra bilər. `post-` hook-u əməliyyatdan sonra işləyir. O, heç nəyi dayandıra bilmir və bildiriş göndərmək kimi işlər üçündür.

Velosiped proqramının komandasına iki hook lazımdır. `pre-commit` commit-ə düşən fayllarda `console.log` axtarır. `commit-msg` mesajın Conventional Commits formatında olduğunu yoxlayır: `fix` keçmir, `fix(booking): reject end date before start date` keçir.

## Commit anı və çıxış kodu {#commit-flow}

`git commit` yazanda Git commit-i dərhal yaratmır. Əvvəl `pre-commit` işləyir və staging area-dakı faylları yoxlayır. Sonra `commit-msg` işləyir. Git ona mesajın yazıldığı faylın yolunu verir: `.git/COMMIT_EDITMSG`. Adında `pre-` olmasa da, `commit-msg` də commit-dən əvvəl işləyir. Hər ikisi keçəndə commit yaranır, sonra `post-commit` işləyir.

Hook-un cavabı onun **çıxış kodudur** (exit code), yəni skript bitəndə qaytardığı rəqəm. `0` uğur deməkdir, sıfırdan fərqli kod isə xəta. `pre-commit` və ya `commit-msg` xəta qaytarsa, Git commit-i dayandırır. Fayllar staging area-da qalır, tarixçəyə heç nə yazılmır. Hook-un çap etdiyi mətn terminalda görünür. Ona görə yaxşı hook nəyin səhv olduğunu yazır: `app.js: remove console.log`.

`post-commit` commit artıq yarananda işləyir. Onun çıxış kodu heç nəyi dəyişmir.

## .git/hooks qovluğu {#hooks-folder}

Hook-lar repository-nin `.git/hooks` qovluğunda saxlanır. `git init` ora nümunələr qoyur: `pre-commit.sample`, `commit-msg.sample`, `pre-push.sample`, `pre-rebase.sample` və başqaları. Git 2.56-da onlar 14 dənədir. Hər nümunənin içində hook-un nə aldığı izah olunur. Sonu `.sample` ilə bitən fayl işləmir.

Hook-u qoşmaq üçün qovluqda hook-un dəqiq adı ilə, uzantısız fayl olmalıdır: `.git/hooks/pre-commit`. Linux və macOS-da fayl icra oluna bilən olmalıdır (`chmod +x .git/hooks/pre-commit`), yoxsa Git onu işə salmır. Hook shell, Python və ya Node.js kimi istənilən dildə yazıla bilər. Faylın birinci sətri onu hansı proqramın işlədəcəyini deyir, məsələn `#!/bin/sh`.

> **Diqqət:** Windows-da fayllarda icra icazəsi yoxdur. Git for Windows faylın `#!` ilə başlamasına baxır və skripti özü ilə gələn shell-də işlədir. Birinci sətirdə `#!/bin/sh` olmasa, commit `cannot spawn .git/hooks/pre-commit` xətası ilə dayanır.

## Hook-ları komanda ilə paylaşmaq {#sharing}

`.git` qovluğu commit olunmur. Ona görə `.git/hooks`-dakı fayllar push ilə serverə getmir və `git clone` ilə gəlmir. Ayla repository-ni klonlayanda onun `.git/hooks` qovluğunda yalnız `.sample` faylları olur. Sam-ın yazdığı yoxlama Aylanın kompüterində işləmir.

Ona görə hook-ları repository-nin adi qovluğunda saxlayırlar, məsələn `.githooks/`. Bu qovluq commit olunur və hamıya çatır. Sonra hər kəs bir dəfə `git config core.hooksPath .githooks` işlədir. Bu ayardan sonra Git hook-ları `.githooks`-da axtarır, `.git/hooks`-a isə baxmır. Ayar lokal `config`-ə yazılır və clone ilə gəlmir, ona görə bu komandanı README-də yazırlar.

Böyük layihələrdə çox vaxt **hook manager** işlədilir. Hook-lar repository-dəki ayar faylında təsvir olunur, alət isə quraşdırılanda onları Git-ə qoşur. Məsələn:

- **Husky**: JavaScript layihələri üçün, hook-lar `.husky/` qovluğunda olur;
- **pre-commit**: Python ilə yazılıb, ayarları `.pre-commit-config.yaml` faylındadır;
- **lefthook**: dildən asılı deyil, ayarları `lefthook.yml` faylındadır.

Bu saytın öz repository-si lefthook işlədir. `pnpm install` hook-ları qurur. `pre-commit` kodu Prettier və ESLint ilə yoxlayır, `commit-msg` isə mesajı commitlint ilə.

## Hook son yoxlama deyil {#limits}

Hook proqramçının öz kompüterində işləyir. Onu quraşdırmamaq olar, bir commit üçün söndürmək də olar: `git commit --no-verify` `pre-commit` və `commit-msg`-i işə salmır (bunu `pre-commit` dərsində görəcəyik). Hook səhvi erkən, commit-dən əvvəl tutur. Qaydanın pozulmadığına isə yalnız serverdəki yoxlama zəmanət verir. Bu, server hook-u və ya CI ola bilər. CI hər push-dan sonra testləri serverdə işlədən sistemdir. Client və server hook-larının fərqi növbəti dərsdədir.
