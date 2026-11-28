Əvvəlki dərsdə `exec.Command` uşaq proses yaradırdı: Go proqramı işləməyə davam edir və uşağın bitməsini gözləyir. `syscall.Exec` isə cari prosesi yeni proqramla əvəzləyir: proses id-si (PID) eyni qalır, Go kodu isə yox olur və geri qayıtmır. Bu, Go-nun işi yalnız hazırlıq olanda lazımdır: konteynerlərin başlanğıc proqramları və "wrapper" skriptlər mühiti qurub işi başqa proqrama ötürür.

Bu dərsdə gecə ehtiyat nüsxəsini (backup) başladan proqram yazırıq: o, işin adını mühitə yazır və işi shell-ə ötürür.

## LookPath {#lookpath}

`exec.Command` proqramı `PATH`-da özü axtarırdı, `syscall.Exec` isə axtarmır: ona faylın tam yolu lazımdır. `exec.LookPath("sh")` həmin axtarışı ayrıca edir və `/bin/sh` kimi yol qaytarır, proqram tapılmasa isə xəta. Yolu çap etmirik, çünki sistemdən sistemə dəyişir.

## Arqumentlər və mühit {#args}

`args` yeni proqramın `os.Args`-ı olacaq və qaydaya görə ilk element proqramın öz adıdır (`"sh"`); həqiqi arqumentlər ondan sonra gəlir. `sh -c` sonrakı mətni shell əmri kimi icra edir. Skriptdə `$$` shell-in öz PID-idir və `[ … ]` onu Go-nun ötürdüyü `LAUNCHER_PID` ilə müqayisə edir. Ədədlər bərabərdirsə `yes`, deyilsə `no` çap olunur. `env` yeni proqramın bütün mühitidir: `syscall.Exec` heç nəyi avtomatik ötürmür, ona görə `os.Environ()`-u götürüb öz dəyişənlərimizi əlavə edirik.

> **Diqqət:** `args`-ın ilk elementini unutmaq tipik səhvdir: `[]string{"-c", script}` yazsanız, `-c` proqramın adı sayılır və shell skripti görmür.

## Exec {#exec}

`syscall.Exec` uğurlu olanda geri qayıtmır: onun altındakı sətirlər, o cümlədən `defer` ilə qeyd olunan `launcher: cleanup`, heç vaxt işləmir. Bundan sonra prosesin çıxışını shell yazır və o, PID-in dəyişmədiyini təsdiqləyir: yeni proses yaranmayıb, köhnəsi yeni proqrama çevrilib. `fmt.Println("exec failed: ...")` yalnız `Exec` alınmayanda işləyir, məsələn fayl icra edilə bilmirsə. `syscall.Exec` yalnız Unix sistemlərində (Linux və macOS) işləyir. Windows-da funksiya var, amma həmişə `not supported by windows` xətası qaytarır.

> **Bilgi:** Go proqramı işini bitirib sonra nəticəni yoxlamalıdırsa, `exec.Command` seçin. `syscall.Exec` yalnız Go-nun işi tam bitəndə və başqa proqram onun yerinə keçməli olanda lazımdır.
