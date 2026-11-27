Əvvəlki dərsdə gördük ki, branch commit-i göstərən pointer-dir və onu yaratmaq ucuzdur. Yeni branch-ı iki komanda yaradır: `git branch` onu yalnız yaradır, `git switch -c` isə yaradıb dərhal ona keçir.

Nümunə iki commit-i olan foto albom saytıdır: səhifə `index.html`-də, şəkillərin altındakı yazılar `captions.txt`-dədir.

## Siyahı və yeni branch {#create}

`git branch` arqumentsiz branch-ların siyahısını çap edir. Hələlik yalnız `main` var. Qarşısındakı `*` hazırkı branch-ı, yəni HEAD-in göstərdiyi branch-ı bildirir.

`git branch dark-mode` heç nə çap etmir. O, hazırkı commit-i göstərən yeni branch yaradır, amma ona keçmir. İkinci siyahıda iki ad var, `*` isə yenə `main`-in qarşısındadır. Branch-lar əlifba sırası ilə düzülür, yaranma sırası ilə yox. Vizualda `dark-mode` və `HEAD → main` eyni commit-in yanındadır.

> **Diqqət:** `git branch <ad>`-dan sonra branch-a keçməyi unutmaq tez-tez olur. Onda yeni commit-lər `main`-ə düşür, `dark-mode` isə yerində qalır.

## Hər branch-ın son commit-i: -v {#verbose}

Adi siyahıda branch-ın hansı commit-i göstərdiyi görünmür. `-v` (verbose, yəni ətraflı) hər adın yanına onun commit-ini yazır: qısa hash və mesajın ilk sətri. Hər iki sətirdə hash eynidir. Deməli, `dark-mode` və `main` eyni commit-i, `Add mountain photo`-nu göstərir. Başlanğıc commit verilməyəndə yeni branch HEAD-in olduğu commit-dən başlayır.

## Köhnə commit-dən başlamaq {#start-point}

Branch-ı köhnə commit-dən də başlatmaq olar. Deyək ki, albomun çap versiyası üçün branch lazımdır, amma son commit-dəki dağ şəkli ora düşməməlidir. `git branch print-version HEAD~1` iki arqument alır: branch-ın adını və başlanğıc commit-i. İkinci arqument istənilən commit adı ola bilər: `HEAD~N`, qısa hash və ya başqa branch-ın adı.

`git branch -v` çıxışında `print-version` başqa commit-dədir: `Add album page`. Vizualda o, bir commit aşağıdadır. `*` yenə `main`-dədir: bu komanda da branch-a keçmir, diskdəki fayllar dəyişmir.

## Yaratmaq və keçmək: git switch -c {#switch-create}

Branch-ı adətən dərhal onda işləmək üçün yaradırsınız. `git switch -c slideshow` iki işi bir komandada görür: branch-ı yaradır (`-c` — create) və ona keçir. `Switched to a new branch 'slideshow'` sətri bunu təsdiqləyir. Commit çıxışındakı `[slideshow ...]` yeni commit-in `slideshow`-a düşdüyünü göstərir. Siyahıda `*` indi `slideshow`-un qarşısındadır.

`git switch -c dark-mode` xəta verir, çünki belə adda branch artıq var. `-c` yalnız yeni branch yaradır. Mövcud branch-a keçmək üçün `-c` yazılmır: `git switch dark-mode`. Keçidi növbəti dərsdə ətraflı görəcəyik.

> **Bilgi:** köhnə yazılış `git checkout -b slideshow` eyni işi görür. `git switch -c` da başlanğıc commit qəbul edir: `git switch -c print-fix HEAD~1`.
