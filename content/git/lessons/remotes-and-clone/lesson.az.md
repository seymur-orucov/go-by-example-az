İndiyə qədər bütün iş bir kompüterdə, bir repository-də getdi. Komandada isə hər kəsin öz lokal repository-si olur, ortaq tarixçə serverdə saxlanır. **Remote** sizin repository-nin tanıdığı başqa bir repository-dir: onun adı və ünvanı.

Nümunə kiçik onlayn mağaza layihəsidir: Sam və Ayla onun üzərində birlikdə işləyir, ortaq repository GitHub-dadır.

## Üç repository, bir layihə {#three-repos}

Diaqramda üç repository var. Sam-ın laptopundakı və Ayla-nın laptopundakı repository lokal repository-dir. GitHub-dakı isə ikisi üçün də remote-dur. Üçündə də eyni layihənin tam tarixçəsi ola bilər, amma onlar bir-birindən asılı deyil.

Repository-lər özləri sinxronlaşmır. Sam commit edəndə onun commit-i yalnız laptopunda olur. Onu GitHub-a göndərmək üçün `push` lazımdır. Ayla həmin commit-i yalnız GitHub-dan özü götürəndə görür (`fetch` və ya `pull`). Bu komandaları Remote-lar modulunun növbəti dərslərində keçəcəyik.

> **Bilgi:** "Server" sözü burada Git üçün xüsusi bir şey demək deyil. Remote başqa bir Git repository-dir. O, GitHub-da, şirkətin serverində və ya hətta eyni kompüterin başqa qovluğunda ola bilər.

## origin: remote-un adı {#origin}

Hər remote-un repository-nizdə bir adı var. Hər dəfə uzun ünvan yazmamaq üçün komandalarda bu addan istifadə olunur: `git push origin main`.

`origin` Git-in xüsusi sözü deyil. `git clone` repository-ni köçürəndə onun gəldiyi yeri avtomatik olaraq `origin` adı ilə yadda saxlayır. Ad sadəcə razılaşmadır: onu dəyişmək olar və bir repository-nin bir neçə remote-u ola bilər. Məsələn, başqasının layihəsinin surəti ilə işləyəndə orijinal layihə çox vaxt `upstream` adlanır.

Remote-ların siyahısı repository-nin `.git/config` faylında saxlanır. Orada `[remote "origin"]` bölməsi yaranır və ünvan `url` sətrində yazılır. `git remote -v` hər remote üçün iki sətir göstərir: `(fetch)` götürmək, `(push)` göndərmək üçün ünvandır. Adətən ikisi eynidir.

## Remote URL {#url}

Ünvan, yəni remote URL Git-ə repository-ni harada tapacağını deyir. GitHub-dakı eyni repository-nin iki ünvanı olur:

- HTTPS: `https://github.com/sam/shop.git`
- SSH: `git@github.com:sam/shop.git`

İkisi də eyni repository-ni göstərir. Fərq yalnız Git-in serverə necə qoşulması və sizi necə tanımasındadır.

Ünvan diskdəki qovluq da ola bilər, məsələn `/home/sam/server/shop.git`. Bu kursun terminal dərslərində internet yoxdur. Ona görə "server" rolunu eyni kompüterdəki ayrıca qovluq oynayacaq. Git üçün bu, GitHub-dakı remote ilə eyni işləyir.

## HTTPS, yoxsa SSH {#https-ssh}

HTTPS ilə başlamaq asandır: heç nə qurmadan clone etmək olar. Push zamanı isə GitHub sizi tanımalıdır. GitHub 2021-ci ilin avqustundan Git əməliyyatları üçün hesabın parolunu qəbul etmir. Onun yerinə *personal access token* və ya parolu sizin əvəzinizə saxlayan credential manager lazımdır. Git for Windows ilə credential manager birlikdə quraşdırılır.

SSH ilə bir dəfə açar cütü yaradırsınız (`ssh-keygen -t ed25519`). Açıq açarı GitHub hesabınıza əlavə edirsiniz, gizli açar isə kompüterinizdə qalır. Bundan sonra push zamanı heç nə soruşulmur.

> **Diqqət:** gizli açarı (`id_ed25519`, `.pub`-suz fayl) heç kimə göndərməyin və repository-yə commit etməyin. GitHub-a yalnız `.pub` ilə bitən açıq açar əlavə olunur.
