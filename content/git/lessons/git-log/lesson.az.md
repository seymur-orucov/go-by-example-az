Əvvəlki dərsdə gördük ki, hər commit öz parent-ini göstərir və commit-lər zəncir qurur. `git log` bu zənciri ən yeni commit-dən başlayıb parent-lər üzrə geriyə oxuyur və hər commit-i çap edir. `git show` isə bir commit-i açır: onun məlumatını və nəyi dəyişdiyini göstərir.

Nümunə oxu siyahısıdır: `books.txt`-də kitablar yazılıb, repository-də artıq iki commit var.

## git log: tarixçəni oxumaq {#log}

`git log` hər commit üçün bir blok çap edir. Birinci sətirdə `commit` sözü və tam, 40 simvolluq hash var. `Author` commit-i kimin yazdığını, `Date` isə nə vaxt yazıldığını göstərir. Boş sətirdən sonra, dörd boşluq içəridən, commit mesajı gəlir.

Commit-lər yenidən köhnəyə sıralanır. Ən aşağıdakı `Start reading list` ilk (root) commit-dir, ondan əvvəl heç nə yoxdur. Vizualdakı qraf da eyni sıradadır: ən yeni commit yuxarıdadır.

> **Bilgi:** Real terminalda tarixçə ekrana sığmayanda `git log` onu pager-də, yəni səhifə-səhifə baxmaq üçün proqramda açır. Ox düymələri ilə sürüşdürün, çıxmaq üçün `q` basın.

## git show: son commit {#show}

Siyahıda `Dune`-u oxunmuş kimi qeyd edib commit etdik. Arqumentsiz `git show` son commit-i göstərir. Yuxarı hissə `git log`-dakı blokla eynidir: hash, müəllif, tarix və mesaj.

Altında diff var: bu commit parent-inə görə nəyi dəyişib. Format `git diff`-dəki ilə eynidir. Dəyişmiş sətir bir silinən (`-Dune`) və bir əlavə olunan (`+Dune (read)`) sətir kimi görünür. Commit çıxışındakı `1 insertion(+), 1 deletion(-)` da bunu deyir.

> **Bilgi:** Commit diff saxlamır. `git show` bu diff-i commit-in snapshot-unu parent-in snapshot-u ilə müqayisə edib hesablayır.

## Yeni fayl əlavə edən commit {#new-file}

Kitab haqqında qeydlər üçün yeni fayl, `notes.md` yaradıb commit etdik. `git show`-un diff-i `git diff --staged` dərsindəki yeni fayla bənzəyir: `new file mode 100644` yeni faylı, `--- /dev/null` isə parent-də bu faylın olmadığını bildirir.

`books.txt` diff-də yoxdur, çünki bu commit-də dəyişməyib. Snapshot-da isə o yenə də var.

## Yeni commit yuxarıda {#order}

`git log` indi dörd commit göstərir. Son iki commit siyahının yuxarısına əlavə olunub, ilk commit isə yenə ən aşağıdadır.

`git log` bütün tarixçəni diff-siz, `git show` isə bir commit-i diff ilə göstərir. Çıxışı qısaltmaq, filtrləmək və diff-i `git log`-da da görmək üçün seçimlər var; onları növbəti dərsdə keçəcəyik.

> **Bilgi:** Real terminalda ən yuxarıdakı commit-in hash-indən sonra `(HEAD -> main)` da görünür: `main` branch-ı və `HEAD` bu commit-i göstərir. `HEAD`-i ayrıca dərsdə keçəcəyik.
