Əvvəlki dərsdə `exec.Command` uşaq proses yaradırdı: Go proqramı işləməyə davam edir və uşağın bitməsini gözləyir. Bəzən isə Go proqramının işi yalnız hazırlıqdır: mühiti qurmaq, arqumentləri toplamaq və sonra başqa proqrama yer vermək. `syscall.Exec` bunu edir: cari prosesi yeni proqramla əvəzləyir. Proses id-si (PID) eyni qalır, amma içindəki Go kodu tamamilə yox olur və bir daha qayıtmır.

Bu dərsdə gecə ehtiyat nüsxəsini (backup) başladan proqram yazırıq: o, işin adını mühitə yazır və işi shell-ə ötürür. Konteynerlərin başlanğıc proqramları və "wrapper" skriptlər məhz belə işləyir. `syscall.Exec` Unix sistemlərinə (Linux, macOS) aiddir: Windows-da funksiya mövcuddur, amma həmişə `not supported by windows` xətası qaytarır.

## LookPath {#lookpath}

`exec.Command` proqramı `PATH`-da özü axtarırdı, `syscall.Exec` isə axtarmır: ona faylın tam yolu lazımdır. `exec.LookPath("sh")` həmin axtarışı ayrıca edir və `/bin/sh` kimi yol qaytarır, proqram tapılmasa isə xəta. Yolu çap etmirik, çünki sistemdən sistemə dəyişir.

## Arqumentlər və mühit {#args}

`args` yeni proqramın `os.Args`-ı olacaq və qaydaya görə ilk element proqramın öz adıdır (`"sh"`); həqiqi arqumentlər ondan sonra gəlir. `sh -c` sonrakı mətni shell əmri kimi icra edir: skript `$$` ilə öz PID-ini `LAUNCHER_PID` ilə müqayisə edir. `env` yeni proqramın bütün mühitidir: `syscall.Exec` heç nəyi avtomatik ötürmür, ona görə `os.Environ()`-u götürüb öz dəyişənlərimizi əlavə edirik.

> **Diqqət:** `args`-ın ilk elementini unutmaq tipik səhvdir: `[]string{"-c", script}` yazsanız, `-c` proqramın adı sayılır və shell skripti görmür.

## Exec {#exec}

`syscall.Exec` uğurlu olanda geri qayıtmır: onun altındakı sətirlər, o cümlədən `defer` ilə qeyd olunan `launcher: cleanup`, heç vaxt işləmir. Bundan sonra prosesin çıxışını shell yazır və o, PID-in dəyişmədiyini təsdiqləyir: yeni proses yaranmayıb, köhnəsi yeni proqrama çevrilib. `fmt.Println("exec failed: ...")` yalnız `Exec` alınmayanda işləyir, məsələn fayl icra edilə bilmirsə və ya Windows-da.

> **Bilgi:** Go proqramı işini bitirib sonra nəticəni yoxlamalıdırsa, `exec.Command` seçin. `syscall.Exec` yalnız Go-nun işi tam bitəndə və başqa proqram onun yerinə keçməli olanda lazımdır.
