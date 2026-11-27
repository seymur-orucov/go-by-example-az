`pre-commit` hook-u mesajı görmür: Git onu mesajı almazdan əvvəl çağırır. Mesajı `commit-msg` hook-u yoxlayır, Git onu commit-i yaratmazdan əvvəl işə salır. Hook 0-dan fərqli kodla çıxsa, commit yaranmır.

Nümunə açıq mənbəli komanda sətri aləti `cli-tool`-dur (`main.sh` və `README.md`): onu saxlayanlar hər mesajın Conventional Commits formatında olmasını tələb edir.

## Hook mesajı haradan alır {#message-file}

Əvvəlcə heç nəyi yoxlamayan hook yazırıq: o, aldığını çap edir. Faylı pre-commit dərsindəki kimi `printf` ilə yazıb `chmod +x` edirik. Tək dırnaq içində `$1` dəyişmir və fayla olduğu kimi düşür.

Git `commit-msg`-ə bir arqument verir: mesajın yazıldığı müvəqqəti faylın yolu. Skriptdə bu `$1`-dir. Çıxışın birinci sətri onu göstərir: `.git/COMMIT_EDITMSG`. Yol nisbidir, çünki Git hook-u repository-nin kök qovluğunda işə salır. İkinci sətri `cat "$1"` çap edib: faylda `-m` ilə verdiyimiz mesaj var. Hook 0 kodu ilə bitdi, ona görə Git commit-i yaratdı. Sonrakı sətirlər adi commit çıxışıdır.

> **Bilgi:** `-m` olmadan Git mesajı redaktorda soruşur. Onda faylda `#` ilə başlayan izah sətirləri də olur və hook onları da görür. Git bu sətirləri hook işləyəndən sonra silir.

## Formatı yoxlayan hook {#check}

İndi eyni faylı real yoxlama ilə əvəz edirik. `>` faylın içini yenidən yazır, icra icazəsi isə qalır, ona görə `chmod` təkrar lazım deyil. `cat` skripti sətir-sətir göstərir.

`head -n1 "$1"` mesajın birinci sətrini, yəni başlığı götürür. `grep -E` onu regular expression (mətn nümunəsi) ilə müqayisə edir, `-q` isə heç nə çap etmir və yalnız çıxış kodu qaytarır. Nümunənin hissələri:

- `^(feat|fix|docs|refactor|test|chore)`: başlıq bu tiplərdən biri ilə başlayır;
- `(\(.+\))?`: mötərizədə scope, istəyə bağlıdır (`?` "olmaya da bilər" deməkdir);
- `!?`: breaking change üçün `!`, o da istəyə bağlıdır;
- `: .+`: iki nöqtə, boşluq və ən azı bir simvolluq description.

Başlıq uyğun gəlməsə, `grep` 1 qaytarır. `!` nəticəni tərsinə çevirir və `if`-in içi işləyir: iki sətir izah çap olunur, `exit 1` commit-i dayandırır.

## update stuff rədd olunur {#blocked}

`main.sh`-ə sətirləri sayan komanda əlavə edib onu tələsik mesajla commit etməyə çalışırıq. Başlıq tiplə başlamır, ona görə hook iki sətir çap edib 1 kodu ilə çıxdı. Git commit-i yaratmadı və özündən heç nə əlavə etmədi. Ekrandakı yeganə izah hook-un mesajıdır, ona görə o, düzgün formatı və nümunəni göstərməlidir.

`git status --short` `M  main.sh` göstərir: dəyişiklik staging area-da qalıb. Mesajı düzəldib komandanı təkrarlamaq kifayətdir.

## Düzgün mesaj {#valid}

Bu dəfə başlıq formata uyğundur: tip `feat`, scope `cli` və description. Hook heç nə çap etmir və 0 ilə bitir. Git commit-i yaradır. `git log --oneline` üç commit göstərir, hamısının başlığı eyni formatdadır.

pre-commit dərsindəki `git commit --no-verify` bu hook-u da keçir.

Kiçik layihə üçün öz yoxlamanız kifayətdir. Çox layihə isə hazır alət, commitlint işlədir. Bu, Node.js alətidir. `@commitlint/config-conventional` konfiqurasiyası Conventional Commits qaydalarını hazır verir. Üstündən başlığın uzunluğu və icazəli scope-lar kimi öz qaydalarınızı da yazmaq olur. Bu aləti `commit-msg` hook-undan Husky və ya lefthook kimi hook manager-lər çağırır və ona eyni faylı ötürür: `commitlint --edit "$1"`.
