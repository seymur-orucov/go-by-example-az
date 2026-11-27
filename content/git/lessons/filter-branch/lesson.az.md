API açarı və ya parol commit-ə düşübsə, onu növbəti commit-də silmək kifayət etmir: köhnə commit-lər faylı saxlayır. Faylı tarixçədən tam çıxarmaq üçün `git filter-branch` və ya `git filter-repo` onu saxlayan hər commit-i yenidən yazır. Interactive rebase commit-ləri bir-bir əl ilə dəyişir, bu alətlər isə eyni dəyişikliyi bütün tarixçəyə tətbiq edir.

Nümunə ev avtomatlaşdırması skriptləridir: `config.env` açarla commit olunub, sonra daha iki commit gəlib və hamısı GitHub-a push edilib.

## Faylı silmək kifayət deyil {#delete-not-enough}

`git log --oneline` dörd commit göstərir. Açar `Load settings from config.env` commit-ində əlavə olunub. `git rm config.env` faylı diskdən və staging area-dan silir, commit isə bu silinməni yazır.

`git log --oneline -- config.env` bu faylı dəyişən iki commit-i göstərir: biri onu əlavə edib, digəri silib. Fayl yalnız ən yeni snapshot-da yoxdur. `git show HEAD~3:config.env` bunu sübut edir. `<commit>:<fayl>` yazılışı faylı həmin commit-dəki halı ilə çap edir. `HEAD~3` üç commit geridəki `Load settings from config.env` commit-idir. Açar orada durur. Repository-ni clone edən hər kəs onu bu komanda ilə oxuya bilər.

## Əvvəlcə açarı dəyişin {#rotate-key}

Açar push olunan anda ələ keçmiş sayılmalıdır. Kimsə repository-ni artıq clone və ya fork edə bilib. Tarixçəni təmizləmək onların nüsxəsinə toxunmur. Ona görə birinci addım Git-dən kənardadır: xidmətin ayarlarında köhnə açarı ləğv edib yenisini yaradırsınız. Kodun ilk iki sətri bunu xatırladır.

Yeni açar yalnız lokal `config.env`-ə yazılır. `.gitignore` faylı onu bir daha commit-ə buraxmır. Komandaya hansı dəyişənlərin lazım olduğunu göstərmək üçün açarsız nümunə, `config.env.example` commit olunur. `--ignored` seçimi ignore olunan faylları da göstərir: `!!` kodu `config.env`-in ignore olunduğunu bildirir.

> **Diqqət:** tarixçəni təmizləmək açarı dəyişməyi əvəz etmir. Tarixçə tam təmizlənsə də, köhnə açarı ləğv edin.

## git filter-branch: hər commit-dən silmək {#filter-branch}

`git filter-branch` Git-in daxili komandasıdır. O, tarixçədəki hər commit-i götürür, ona filtr tətbiq edir və yeni commit yazır. `--index-filter` hər commit-in staging area-sında verilən komandanı işlədir. Burada bu, `git rm --cached --ignore-unmatch config.env`-dir. O, faylı commit-dən çıxarır, faylı olmayan commit-lərdə isə xəta vermir. `-- --all` bütün branch və tag-ları yenidən yazır.

`--prune-empty` boş qalan commit-ləri atır. `Remove config.env` artıq heç nəyi dəyişmir, ona görə siyahıdan çıxıb. `FILTER_BRANCH_SQUELCH_WARNING=1` Git-in xəbərdarlığını söndürür. Onsuz komanda filter-branch-ın çoxlu tələsi olduğunu yazır, `git filter-repo`-nu təklif edir və 10 saniyə gözləyir. `| tail -n 1` yalnız son sətri saxlayır: real terminalda hər commit üçün `Rewrite` irəliləyiş sətri də görünür.

`Ref 'refs/heads/main' was rewritten` sətri `main`-in yeni tarixçəyə keçdiyini bildirir. `git log --oneline -- config.env` artıq heç nə çap etmir. Hash-lar dəyişib, çünki commit-in hash-i snapshot-dan və parent-dən hesablanır. `Add lights script`-də `config.env` yox idi, onun hash-i eyni qalıb. Ondan sonrakı commit-lərin hamısı yenidir, vizualda onlar seçilib.

## Ehtiyat nüsxə: refs/original {#backup-ref}

filter-branch köhnə tarixçəni dərhal atmır. Yenidən yazdığı hər branch-ın köhnə ucunu `refs/original/` altında saxlayır: `main` üçün bu, `refs/original/refs/heads/main`-dir. Nəsə səhv getsə, köhnə tarixçəyə oradan qayıtmaq olar. `--all` bu ref-i də oxuyur, ona görə `config.env`-ə toxunan iki köhnə commit yenə göründü.

Yeni tarixçəni yoxlayandan sonra ehtiyat ref-i `git update-ref -d` ilə silirik. İndi `--all` ilə də heç nə tapılmır. Köhnə obyektlər isə hələ bir müddət `.git` qovluğunda qalır. Serverdən təzə clone edilən repository-də onlar olmayacaq.

> **Bilgi:** `refs/original/` boş deyilsə, filter-branch yenidən işə düşmür. Əvvəlcə ehtiyat ref-i silin və ya `-f` seçimini verin.

## Real layihədə: git filter-repo {#filter-repo}

Git-in öz sənədləri filter-branch-ı tövsiyə etmir: o, yavaşdır və tarixçəni gözlənilməz şəkildə korlaya bilər. Sənədlər əvəzində `git filter-repo`-nu təklif edir. Bu alət Git-ə daxil deyil. Onu `pip install git-filter-repo` ilə və ya Homebrew, Scoop kimi paket menecerləri ilə quraşdırırlar. Bu dərsin terminalında filter-repo yoxdur, ona görə komandalar şərh kimi göstərilir.

`--path config.env` faylı seçir. `--invert-paths` seçimi tərsinə çevirir: bu fayldan başqa hər şey saxlanılır. filter-repo boş qalan commit-ləri və köhnə obyektləri özü təmizləyir. O, təzə clone-da işləməyi tələb edir, başqa repository-də `--force` olmadan işə düşmür.

Hansı aləti seçsəniz də, serverdəki branch köhnə tarixçədə qalır. Yeni tarixçəni force push ilə göndərirsiniz (force push dərsindəki qaydalarla). Sonra komandadakı hər kəs repository-ni yenidən clone etməlidir. Köhnə clone-da `git pull --no-rebase` ilə merge edib push etsələr, köhnə commit-lər açarla birlikdə serverə qayıdır.

> **Diqqət:** GitHub-da açar fork-larda, köhnə pull request-lərdə və commit-in hash-i ilə açılan keşlənmiş səhifələrdə qala bilər. Keşi GitHub Support silə bilər, fork-ları isə yalnız onların sahibləri. Açarı ləğv etmək bu nüsxələrin hamısını zərərsiz edir.
