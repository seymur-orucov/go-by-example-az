Əvvəlki dərslərdə faylları proqram işləyərkən diskdən oxuduq: fayl proqramın yanında olmalıdır, yoxsa `os.ReadFile` xəta qaytarır. `//go:embed` direktivi (kompilyatora verilən xüsusi şərh) isə faylın məzmununu kompilyasiya zamanı, yəni proqram işə düşməzdən əvvəl, birbaşa proqramın içinə yerləşdirir. Nəticədə bir icra olunan fayl (binary) alınır: onu harasa köçürmək kifayətdir, yanında heç bir qovluq daşımaq lazım deyil.

Bu dərsdə kafenin özünəxidmət ekranı (kiosk) üçün proqram yazırıq. Kiosk kompüterinə yalnız bir fayl köçürülür, ona görə salamlama mətni (`banner.txt`), standart ayarlar (`config.json`) və menyu faylları (`menu/` qovluğu) proqramın içində olmalıdır. Bu fayllar dərsin qovluğunda, `main.go`-nun yanındadır.

## Direktiv {#directive}

`//go:embed` paket səviyyəsindəki dəyişənin düz üstündə yazılır və hansı faylın onun dəyəri olacağını deyir. `//` ilə `go:embed` arasında boşluq olmamalıdır: boşluqla bu adi şərhdir və dəyişən boş qalır. Dəyişənin tipi üç cürdür: tək fayl üçün `string` və ya `[]byte`, bir neçə fayl və ya qovluq üçün `embed.FS`.

Yollar `main.go`-nun olduğu qovluğa nisbətən yazılır və `..` ilə yuxarı çıxa bilməz. Fayl yoxdursa, proqram kompilyasiya olunmur. Burada üç dəyişəni bir `var (...)` blokunda qruplaşdırmışıq; hər birini ayrıca `var` ilə, direktivi düz üstündə yazmaq da eynidir.

> **Diqqət:** `embed` paketi import olunmalıdır. Yalnız `string` və ya `[]byte` işlədəndə paketin adı kodda keçmir, onda `import _ "embed"` yazılır (`_` "paketi yüklə, adını işlətmirəm" deməkdir).

## string kimi {#string}

`banner` adi string-dir: onu çap etmək, `strings` funksiyalarına vermək olar. Xəta yoxlamaq lazım deyil, çünki faylı kompilyator artıq oxuyub; proqram işləyəndə disk ümumiyyətlə açılmır.

## []byte kimi {#bytes}

`[]byte` baytlarla işləyən funksiyalar üçün rahatdır: `configData`-nı birbaşa `json.Unmarshal`-a veririk. Bu, standart ayarları proqramla birlikdə göndərməyin sadə yoludur.

> **Bilgi:** Məzmun build vaxtı götürülür. `config.json`-u build-dən sonra dəyişsəniz, köhnə binary köhnə ayarları göstərəcək; yenisi üçün proqramı yenidən kompilyasiya etmək lazımdır. İstifadəçinin dəyişəcəyi ayarları diskdən oxuyun.

## embed.FS ilə qovluq {#fs}

`embed.FS` yalnız oxumaq üçün kiçik fayl sistemidir. `ReadDir` qovluğun siyahısını, `ReadFile` faylın məzmununu qaytarır. Yollar həmişə `/` ilə yazılır, Windows-da da, və qovluğun adı ilə başlayır: `menu/drinks.txt`, sadəcə `drinks.txt` yox.

`menu` qovluğunda üçüncü fayl da var, `_draft.txt`, amma siyahıda yoxdur: qovluq embed olunanda adı `.` və ya `_` ilə başlayan fayllar atılır. Onları da daxil etmək üçün `//go:embed all:menu` yazılır.

> **Bilgi:** `embed.FS` `io/fs` paketinin `fs.FS` interface-ini ödəyir, ona görə onu fayl sistemi gözləyən funksiyalara vermək olar, məsələn `template.ParseFS`-ə.
