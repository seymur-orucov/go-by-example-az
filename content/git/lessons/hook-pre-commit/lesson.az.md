pre-commit hook `git commit` hər dəfə commit yaratmazdan əvvəl işə düşür. Skript `0` kodu ilə bitsə, commit yaranır; başqa kod commit-i dayandırır. Komandalar bu hook-da linter, yəni kodu qaydalara görə yoxlayan proqram işlədir.

Nümunə Markdown qeydlər saytıdır (`notes-site`, fayllar `index.md` və `about.md`): komanda içində `TODO` qalan mətnin commit olunmasını istəmir.

## Hook-u yazmaq {#write-hook}

Hook `.git/hooks/pre-commit` adlı adi skriptdir. Onu `printf` ilə yazırıq: `printf '%s\n'` hər arqumenti faylda ayrıca sətir edir. `chmod +x` faylı icra olunan edir, `cat` isə nəticəni göstərir. Adın, icra icazəsinin və `#!/bin/sh` sətrinin niyə lazım olduğunu "Hook nədir" dərsində gördük. Sonrakı hook dərsləri də faylı belə yaradır.

`git diff --cached` (`--staged` ilə eynidir) commit-ə nə düşəcəyini göstərir. `grep "^+.*TODO"` bu diff-dən `+` ilə başlayan və içində `TODO` olan sətirləri seçib çap edir. Bunlar commit-in əlavə etdiyi sətirlərdir. `grep` nəsə tapanda `0` kodu ilə çıxır və `if`-in içi işləyir: skript mesaj yazır, sonra `exit 1` ilə bitir. Heç nə tapılmasa, skript `0` ilə bitir və commit davam edir.

## Commit dayanır {#blocked}

`about.md`-də `TODO` sətri qalıb və fayl stage edilib. `git commit` əvvəlcə hook-u işə salır. Çıxışın birinci sətri `grep`-in tapdığı sətirdir: `+TODO: add contact link`. İkinci sətir hook-un öz mesajıdır. Hook `1` qaytardığı üçün commit yaranmadı. `git status --short` də bunu göstərir: `about.md` hələ də `A ` ilə staging area-dadır. Vizualda repository-də yenə yalnız `Start notes site` commit-i var.

## Hook staging area-ya baxır {#staged-only}

`sed -i '/TODO/d' about.md` `TODO` olan sətri fayldan silir. Amma commit yenə dayandı. Hook diskdəki fayla yox, staging area-dakı versiyaya baxır, orada isə `TODO` hələ var. `AM` bunu göstərir: `A` staging area-dakı yeni fayl, `M` isə working directory-də stage olunmamış dəyişiklikdir.

Yoxlama məhz staging area-ya baxmalıdır, çünki commit-ə o düşür. Hook working directory-ni yoxlasaydı, düzəlişi görüb commit-ə icazə verərdi. Commit-ə isə `TODO` olan köhnə versiya düşərdi.

## Düzəlişi stage edib commit etmək {#commit-ok}

`git add about.md` düzəlişi staging area-ya qoyur. İndi `git diff --cached`-də `TODO` yoxdur. `grep` heç nə tapmır və hook `0` ilə bitir. Hook uğurlu olanda heç nə çap etmir, ona görə çıxışda yalnız commit-in adi sətirləri var: fayl iki sətirlə yarandı.

## Hook-u keçmək: --no-verify {#no-verify}

`index.md`-ə `TODO` sətri əlavə etdik və `--no-verify` ilə commit etdik. Bu flag pre-commit və commit-msg hook-larını işə salmır, ona görə `TODO` commit-ə düşdü. Qısa forması `-n`-dir. Flag hook səhv işləyəndə və ya yarımçıq işi tez saxlamaq lazım olanda köməyə gəlir.

pre-commit hook qaydanı məcbur etmir, səhvi erkən tutur: hər developer onu keçə bilər. Ona görə eyni qayda server hook-unda və ya CI-da da yoxlanır. `--no-verify` onlara təsir etmir.
