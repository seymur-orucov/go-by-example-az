Branch commit-ə pointer-dir, ona görə onun adını dəyişmək commit-lərə toxunmur: hash-lər və fayllar olduğu kimi qalır. Adı `git branch -m` dəyişir (`-m` *move* sözündəndir).

Nümunə məktəb qəzetinin repository-sidir: `newsletter/` qovluğunda hər nömrə ayrıca faylda yazılır (`issue-1.md`, `issue-2.md`). Hazırda iki branch var: əsas `master` və ikinci nömrənin qaralaması üçün `isue-2`.

## Başqa branch-ın adı {#other-branch}

`git branch` siyahısında `isue-2` görünür: adda bir `s` çatmır. `git branch -m <köhnə> <yeni>` istənilən branch-ın adını dəyişir, həmin branch-a keçmək lazım deyil. Komanda uğurla işləyəndə heç nə çap etmir.

İkinci siyahıda artıq `issue-2` var. `*` yenə `master`-in qarşısındadır: HEAD `master`-də qaldı. Qaralamanın commit-i də yeni adlı branch-dadır.

## Hazırkı branch: master əvəzinə main {#current-branch}

Bir ad versəniz, `git branch -m` hazırkı branch-ın, yəni HEAD-in göstərdiyi branch-ın adını dəyişir. Bu repository köhnə qaydada, `master` adı ilə yaradılıb. `git config` dərsində gördük ki, GitHub və bir çox komanda `main` adını işlədir. `git branch -m main` adı dəyişir, HEAD də yeni ada keçir. Ona görə `git status` `On branch main` yazır.

Köhnə layihələrdə bu ad dəyişikliyi tez-tez lazım olur. Başqa branch-da olsaydınız, iki adla yazardınız: `git branch -m master main`.

## Ad artıq varsa: -M {#name-taken}

`issue-2`-dəki qaralama alınmadı. Sam ikinci nömrəni `main`-dən yenidən başlayır: `issue-2-new` branch-ı yaradıb ilk commit-i edir. İndi bu branch-a `issue-2` adını vermək istəyir. Amma bu ad artıq var, ona görə `git branch -m` dayanır: `fatal: a branch named 'issue-2' already exists`. Git mövcud branch-ı öz-özünə əvəz etmir.

`-M` (böyük hərflə) adı məcburi dəyişir: köhnə `issue-2` silinir, ad yeni branch-a keçir. `git branch` iki branch göstərir. Qrafda `Draft issue 2` commit-i yoxdur, çünki ona artıq heç bir branch göstərmir.

> **Diqqət:** `-M`-dən əvvəl köhnə branch-da lazımlı commit olmadığını yoxlayın. Adsız qalan commit dərhal silinmir. Onu `git reflog` ilə tapmaq olar, bu komandanı "Faydalı alətlər" modulunda keçəcəyik.

## Serverdəki branch {#remote}

Sam `isue-2`-ni yaradanda onu məktəbin serverinə də göndərmişdi. Server branch adlarının öz nüsxəsini saxlayır, lokal ad dəyişikliyi ora çatmır. `git ls-remote --heads origin` serverdəki branch-ları göstərir: hər sətirdə commit-in hash-i və branch-ın tam adı (`refs/heads/isue-2`) var. `origin` serverin qısa adıdır. Burada server bu kompüterdəki qovluqdur (`/home/sam/server/newsletter.git`), GitHub-da onun yerində `https://github.com/...` kimi ünvan olardı.

Server üçün ad dəyişmək komandası yoxdur: yeni adı push edirsiniz, köhnəni silirsiniz. `git push -u origin issue-2` branch-ı serverə göndərir, `[new branch]` orada yeni branch yarandığını bildirir. `-u` lokal branch-ı serverdəkinə bağlayır, çıxışın son sətri də bunu deyir. `git push origin --delete isue-2` köhnə adı silir (`[deleted]`). Son yoxlamada serverdə yalnız `issue-2` qalıb. Remote-ları və push-u "Remote-lar" modulunda ətraflı keçəcəyik.

> **Bilgi:** GitHub-da branch-ın adını saytın özündə də dəyişmək olar: "View all branches" siyahısında "Rename branch". Köhnə adlı linklər yeni ada yönləndirilir. Default branch-ın adını yalnız repository-nin admini dəyişə bilər.
