**Pull request** (PR) bir branch-ı başqa branch-a, adətən `main`-ə merge etmək təklifidir. Merge-dən əvvəl komanda dəyişikliyi oxuyur və düzəliş istəyir, bu müzakirə PR-ın səhifəsində qalır.

Nümunə açıq mənbəli avtobus cədvəli tətbiqi `citybus/timetable`-dır. Sam və Ayla onu saxlayan komandadır, Murad isə ilk töhfəsini göndərir.

## Base və compare branch {#what-is}

Git-də pull request komandası yoxdur. Fork kimi, PR da hostinq xidmətinin imkanıdır. GitHub onu pull request, GitLab isə merge request adlandırır. Adlar fərqlidir, iş eynidir.

PR-da iki branch iştirak edir. **Base** branch dəyişikliyin merge olunacağı branch-dır, adətən `main`. **Compare** branch (sənədlərdə *head* branch da deyilir) dəyişikliyin yazıldığı branch-dır. PR-ın səhifəsində compare branch-ın commit-ləri və onun base-ə görə diff-i görünür. Diff yalnız branch-ın gətirdiyi dəyişiklikləri göstərir, "Branch-lar arası fərq" dərsindəki kimi.

## Branch-dan və ya fork-dan {#two-starts}

Ayla komandanın üzvüdür və `citybus/timetable`-a yaza bilir. O, 12 nömrəli marşrutun həftəsonu cədvəlini `feat/route-12-weekend` branch-ında hazırlayır. Sonra `git push -u origin feat/route-12-weekend` yazır. PR eyni repository-nin içində açılır: `feat/route-12-weekend`-dən `main`-ə. GitHub-da repository səhifəsində bu branch seçiləndə sarı zolaqda **Compare & pull request** düyməsi çıxır. PR oradan açılır.

Murad-ın isə `citybus/timetable`-a yazma icazəsi yoxdur. O, fork dərsindəki yolla gedir. Repository-ni fork edir və `murad/timetable` yaranır. Fork-u clone edir və `fix/stop-name` branch-ında `stops.csv`-dəki səhv yazılmış dayanacaq adını düzəldir. Branch-ı `origin`-ə, yəni fork-a push edir.

Murad-ın PR-ı iki repository arasında açılır. Base `citybus/timetable`-ın `main`-idir, compare isə `murad/timetable`-dakı `fix/stop-name`. Commit-lər fork-da qalır, PR isə `citybus/timetable`-da görünür. GitHub bunu edə bilir, çünki fork ilə orijinal eyni Git məlumatını paylaşır.

Diaqramda Murad-ın yolu var. Fork-dan PR açmağın addımlarını GitHub hissəsində ayrıca keçəcəyik.

## Açılışdan merge-ə {#lifecycle}

PR açılanda ona başlıq və təsvir yazılır: nə dəyişdi və niyə. Murad təsvirdə səhv adın tətbiqin hansı ekranında göründüyünü yazır. PR-da reviewer da təyin olunur. Reviewer (rəyçi) dəyişikliyi oxuyub qiymət verən adamdır.

İş hələ bitməyibsə, PR **draft** kimi açılır. Draft PR merge oluna bilməz. Komanda işin getdiyini görür, amma ondan review gözlənilmir. İş hazır olanda **Ready for review** ilə PR adi PR-a çevrilir.

Review-da üç cavab var:

- **Comment** ümumi rəydir: nə təsdiq, nə etiraz.
- **Approve** dəyişikliyin merge-ə hazır olduğunu bildirir.
- **Request changes** merge-dən əvvəl düzəliş istəyir.

PR iki yolla bitir. **Merge** branch-ın işini base branch-a gətirir. **Close** PR-ı merge etmədən bağlayır, məsələn layihə bu dəyişikliyi istəmədikdə. Bağlanmış PR silinmir, onun müzakirəsinə sonra da baxmaq olur.

## Yeni commit-lər və check-lər {#updates}

Sam Murad-ın PR-ında **Request changes** seçir: eyni səhv ad `README.md`-də də var. Murad yeni PR açmır. O, düzəlişi həmin `fix/stop-name` branch-ında commit edir və `git push` yazır. Yeni commit PR-da avtomatik görünür. Sam bütün PR-ı yenidən oxumağa məcbur deyil, yeni commit-ə ayrıca baxa bilər.

PR branch-ın surətini saxlamır, branch-ın özünə baxır. PR açıq qaldıqca compare branch-a edilən hər push PR-a düşür. Ona görə bir branch-da bir iş aparılır. Murad `fix/stop-name`-də başqa iş görüb push etsə, o da bu PR-a düşər.

Çox layihədə hər push-dan sonra CI (*continuous integration*) işə düşür. CI testləri və build-i avtomatik işlədən sistemdir. Onun nəticəsi PR-da **check** kimi görünür: yaşıl işarə keçdi, qırmızı işarə düşdü deməkdir. `citybus/timetable`-da CI hər cədvəl faylının formatını yoxlayır.

Repository-nin qaydaları merge üçün şərt qoya bilər. Məsələn, PR-a approve və uğurlu check-lər lazım olur. Şərtlər ödənməyibsə, GitHub PR-ı merge etmir.

## Üç merge üsulu və merge-dən sonra {#merge}

Murad-ın branch-ında iki commit var: `Fix stop name` və `Fix stop name in README`. GitHub PR-ı üç üsulla merge edə bilir. Onların adlarını "Fast-forward və --no-ff" dərsində görmüşdük. Üsullar `main`-in tarixçəsində qalan commit-lərlə fərqlənir:

- **Create a merge commit**: `--no-ff` ilə merge. İki commit `main`-ə gəlir, üstəlik bir merge commit yaranır.
- **Squash and merge**: iki commit bir yeni commit olur. `main`-də yalnız bu commit görünür.
- **Rebase and merge**: commit-lər bir-bir `main`-in ucuna köçürülür, merge commit yaranmır. GitHub bu zaman həmişə yeni commit-lər yaradır. Mesajlar eynidir, hash-lər isə başqadır.

Merge-dən sonra branch lazım deyil. GitHub PR-ın səhifəsində onu silməyi təklif edir. Repository ayarı ilə bunu avtomatik də etmək olar.

Ayla-nın PR-ı merge commit ilə merge olunub. O, lokal repository-ni də yeniləyir. `git switch main` və `git pull` `main`-ə PR-ın işini gətirir. `git fetch --prune` serverdə silinmiş `origin/feat/route-12-weekend`-i silir. `git branch -d feat/route-12-weekend` isə lokal branch-ı silir. Murad `main`-ini fork dərsindəki kimi `upstream`-dən yeniləyir.

> **Diqqət:** PR squash və ya rebase ilə merge olunubsa, eyni komandalardan sonra `git branch -d` `not fully merged` xətası verir. `main`-də branch-ın commit-ləri yox, yeni commit-lər var. İş `main`-dədirsə, branch-ı `git branch -D` ilə silin.
