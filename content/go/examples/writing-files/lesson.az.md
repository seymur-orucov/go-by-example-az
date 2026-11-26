Proqram nəticəsini fayla yazanda o, proqram bitəndən sonra da qalır: günün hesabatı, sifariş jurnalı, istifadəçinin ayarları. Yazmağın bir neçə yolu var və seçim məqsəddən asılıdır: faylı tamamilə əvəz etmək, yeni fayl yaradıb hissə-hissə doldurmaq, ya da mövcud faylın sonuna əlavə etmək. Yazılanı yoxlamaq üçün əvvəlki dərsdəki `os.ReadFile`-dan istifadə edirik.

Bu dərsdə kafenin faylları ilə işləyirik: menyu, günlük satış hesabatı, sifariş jurnalı və qəbz. Fayllar `os.MkdirTemp` ilə yaradılan müvəqqəti qovluğa yazılır və sonda silinir.

## os.WriteFile {#writefile}

`os.WriteFile` faylı yaradır, `[]byte`-ı ona yazır və bağlayır. Fayl artıq varsa, köhnə məzmun silinir və yerinə yenisi yazılır: ikinci çağırışdan sonra menyuda yalnız `tea 3 USD` qalıb. Üçüncü arqument yeni faylın icazələridir (permission): `0o644` sahibin oxuyub-yaza, qalanların isə yalnız oxuya bildiyini bildirir. Rəqəmlər səkkizlik say sistemindədir, `0o` prefiksi də bunu göstərir.

> **Bilgi:** İcazələr Unix sistemləri (Linux, macOS) üçündür. Windows-da onlardan praktik olaraq yalnız "yalnız oxumaq üçün" əlaməti nəzərə alınır.

## os.Create və yazmaq {#create}

`os.Create` faylı yazmaq üçün açır və `*os.File` qaytarır: fayl yoxdursa yaradır, varsa boşaldır. Açıq faylın `WriteString` metodu string yazır, `fmt.Fprintf` isə `Printf` kimi formatlayır, amma nəticəni ekrana yox, birinci arqumentə, yəni fayla yazır. Hər ikisi yazılan baytların sayını qaytarır: başlıq 13, formatlanmış sətir 15 baytdır.

Burada `defer` əvəzinə `f.Close()`-u özümüz çağırıb nəticəsini çap edirik. Yazılan faylda `Close` xəta qaytara bilər, məsələn, disk dolubsa son baytlar yazılmayıb: bu xətanı atmaq verilənləri səssizcə itirmək deməkdir.

## Faylın sonuna əlavə etmək {#append}

Sifariş jurnalına hər yeni sifariş sona əlavə olunmalıdır, köhnələr qalmalıdır. `os.OpenFile` faylı bayraqlarla (flag) açır və bayraqlar `|` ilə birləşdirilir: `O_APPEND` hər yazını sona əlavə edir, `O_CREATE` fayl yoxdursa yaradır, `O_WRONLY` faylı yalnız yazmaq üçün açır. Dövr kassanın üç ayrı sifarişini təqlid edir: hər dəfə fayl açılır, bir sətir əlavə olunur və bağlanır, jurnalda isə üç sətir toplanır.

> **Diqqət:** `O_APPEND` olmadan `OpenFile` yazmağa faylın əvvəlindən başlayır və köhnə məzmunun üstündən yazır.

## bufio.Writer {#buffered}

Hər `Write` çağırışı əməliyyat sisteminə müraciətdir və çoxlu kiçik yazı proqramı yavaşladır. `bufio.NewWriter` yazıları əvvəlcə yaddaşdakı buferdə toplayır və diskə böyük hissələrlə ötürür. Çıxışda bu görünür: `WriteString`-dən sonra fayl hələ boşdur (`0`), məzmun yalnız `Flush()`-dan sonra diskə düşür (`11` bayt).

> **Diqqət:** `Flush()`-u unutsanız, buferdə qalan son verilənlər fayla heç vaxt yazılmır. Faylı bağlamazdan əvvəl `Flush()` çağırın və onun xətasını da yoxlayın.
