Server hook-ları push zamanı serverdəki repository-də işləyir. Push qəbul olunandan sonra iki hook çağırılır: köhnə `post-update` və onu əvəz edən `post-receive`. Onların ən çox işi deploy-dur: push gələn kimi yeni fayllar saytın qovluğuna yazılır.

Nümunə bir səhifəlik statik saytdır: Sam `index.html`-i `~/server/site.git` bare repository-sinə push edir, `~/www` isə web serverin saytı oxuduğu qovluqdur.

## Bare repository-də hooks qovluğu {#bare-hooks}

Adi repository-də hook-lar `.git/hooks` qovluğundadır. Bare repository-də `.git` qovluğu yoxdur: `ls` göstərir ki, `HEAD`, `config`, `objects`, `refs` birbaşa kökdədir. Ona görə server hook-ları `~/server/site.git/hooks` qovluğuna yazılır.

`git init` bu qovluğa nümunə skriptlər qoyub. Siyahıda push zamanı serverdə işləyən hook-ların nümunələri də var: `pre-receive`, `update`, `post-update`, `push-to-checkout`. `.sample` ilə bitən fayl işləmir. `post-receive`-in nümunəsi yoxdur, onu özümüz yazacağıq.

## post-receive hook-unu yazmaq {#post-receive}

`post-receive` push qəbul olunandan sonra bir dəfə işləyir. O, arqument almır. Yenilənən hər ref üçün stdin-dən bir sətir oxuyur: `<köhnə hash> <yeni hash> <ref adı>`. `while read old new ref` bu sətirləri bir-bir oxuyub üç dəyişənə bölür. Bizim hook yalnız ref adını çap edir.

Deploy üçüncü sətirdədir. `--git-dir` commit-lərin harada saxlandığını, `--work-tree` isə faylların hara yazılacağını deyir. Bare repository-nin öz working directory-si yoxdur, ona görə qovluğu biz veririk. `checkout -f main` `main`-in fayllarını `~/www`-a yazır. `-f` orada əl ilə dəyişdirilmiş faylları da üstələyir, `-q` isə checkout-un öz mesajını gizlədir.

Faylı client hook-ları kimi `printf` ilə yazıb `chmod +x` edirik, sadəcə yol serverdəki `hooks` qovluğudur.

> **Bilgi:** deploy skriptlərində adətən `checkout -f` yazılır. `git switch -f main` də eyni işi görür.

## Push və deploy {#deploy}

Sam `index.html`-ə iş saatlarını yazıb push edir. `remote:` ilə başlayan sətirlər serverdən gəlir: hook-un çap etdiyi hər şey push edənin terminalında görünür. `Received refs/heads/main` stdin-dən gələn sətirdir. `refs/heads/main` `main` branch-ının tam adıdır. Sonra adi push çıxışı gəlir: `To` və `main -> main`.

`cat ~/www/index.html` yeni mətni göstərir. Sayt ayrıca komanda olmadan yeniləndi.

> **Diqqət:** `post-receive` push-un nəticəsini dəyişə bilmir. O işləyəndə ref-lər artıq yenilənib. Hook xəta ilə bitsə də, push qəbul olunmuş qalır.

## post-update: köhnə hook {#post-update}

`post-update` də push-dan sonra işləyir, amma ref-ləri başqa yolla alır. Ona stdin verilmir. Yenilənən ref-lərin adları arqument kimi gəlir, köhnə və yeni hash-lər isə ümumiyyətlə gəlmir. Ona görə yeni hook-lar üçün `post-receive` seçilir.

`post-update.sample` tək iş görür: `git update-server-info`. Bu komanda `info/refs` faylına ref-lərin siyahısını yazır. "Dumb" HTTP server, yəni Git-i tanımayan adi fayl serveri, clone zamanı ref-ləri bu fayldan oxuyur. Bizim hook bunu edir və arqumentləri də çap edir: `$*` bütün arqumentlərdir.

Sam bu dəfə yeni commit-i və `v1.0` tag-ını bir push ilə göndərir. `post-receive` iki sətir aldı, hər ref üçün bir. `post-update` isə hər iki adı bir sətirdə, arqument kimi aldı. Sıra da görünür: əvvəl `post-receive`, sonra `post-update` işləyir. `info/refs`-də hər ref-in hash-ı və adı var.

## pre-receive: push-u rədd etmək {#pre-receive}

"Client və server hook-ları" dərsindəki `pre-receive` ref-lər yenilənməzdən əvvəl işləyir. Stdin-də `post-receive` ilə eyni sətirləri alır. 0-dan fərqli çıxış kodu ilə bitsə, server heç bir ref-i yeniləmir. Bizim hook mesaj çap edib `exit 1` ilə bitir.

`! [remote rejected] main -> main (pre-receive hook declined)` sətri push-u serverdəki hook-un rədd etdiyini deyir. Push dərsindəki `! [rejected] (fetch first)`-dən fərqi budur: orada səbəb serverdəki yeni commit idi. `cat` saytın dəyişmədiyini göstərir, çünki heç bir ref yenilənmədi və `post-receive` işləmədi. Yeni commit Sam-ın lokal `main`-ində qalır. Real serverlərdə `pre-receive` qaydaları yoxlayır, məsələn, `main`-ə birbaşa push-u bağlayır.

> **Bilgi:** GitHub.com-da server hook-u yazmaq olmur, deploy-u orada GitHub Actions və ya webhook başladır.
