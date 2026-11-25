İndiyə qədər yazdığımız proqramlar işləri bir-bir görürdü: biri bitməyincə növbətisi başlamırdı. Konkurentlik (concurrency) bir neçə işi eyni vaxtda irəlilətmək deməkdir, aşpazın şorba qaynayanda salat doğraması kimi. Bu, xüsusən çox gözləmə olan işlərdə lazımdır: başqa serverdən cavab, şəbəkə, disk. Proqram boş dayanıb gözləmək əvəzinə həmin vaxtda başqa işlər görür.

Go-da eyni vaxtda işləyən hər belə işə goroutine deyilir. Goroutine çox yüngüldür, bir proqramda minlərlə ola bilər. Proqram bir goroutine ilə başlayır və `main` funksiyası məhz onda işləyir. Bu dərsdə səyahət saytı yazırıq: o, üç aviaşirkətdən bilet qiymətini soruşur və hər cavab 100 millisaniyə çəkir.

## Bir-bir soruşmaq {#one-by-one}

`fare` aviaşirkətin yavaş serverini təqlid edir: `time.Sleep` goroutine-i verilən müddət qədər dayandırır, `100 * time.Millisecond` isə 100 millisaniyəlik müddətdir (tipi `time.Duration`; `time` paketi sonra ayrıca keçiləcək). `time.Now()` indiki anı götürür, `time.Since(start)` isə o andan bəri keçən müddəti qaytarır. Sorğular bir-bir getdiyi üçün gözləmələr toplanır: üç cavab təxminən 300 millisaniyə çəkir, çapda isə ehtiyatla 250 ilə müqayisə edirik.

Müddətin özünü çap etmirik, çünki o hər işə salmada bir az fərqli olur. Onun əvəzinə müqayisənin nəticəsini çap edirik.

## Hamısını eyni vaxtda {#together}

İndi üç sorğunu eyni vaxtda göndəririk. `sync.WaitGroup` başladılan goroutine-ləri sayır: `wg.Go` verilən funksiyanı yeni goroutine-də işə salır, `wg.Wait()` isə hamısı bitənə qədər `main`-i saxlayır (`wg.Go` Go 1.25-də əlavə olunub, təfərrüatı WaitGroups dərsindədir). Üç goroutine eyni anda gözləyir, ona görə hamısı 300 yox, təxminən 100 millisaniyəyə bitir. Bunu birinci addımda saxladığımız `oneByOne` müddəti ilə müqayisə edirik.

Hər goroutine nəticəni slice-ın öz yerinə yazır: `fares[i]`. Beləcə heç biri başqasının yerinə toxunmur və qiymətlər aviaşirkətlərin sırası ilə qalır, hansı cavab əvvəl gəlsə də. Function literal `i` və `name` dəyişənlərini tutur. Go 1.22-dən bəri dövrün hər addımı bu dəyişənlərin yeni nüsxəsini yaradır, ona görə hər goroutine öz aviaşirkətini alır.

> **Diqqət:** Goroutine-lərin hansı sırada bitəcəyi müəyyən deyil. Onlar nəticəni birbaşa çap etsəydi, sətirlərin sırası hər işə salmada fərqli ola bilərdi. İki goroutine eyni dəyişənə eyni anda yazsa isə nəticə pozula bilər; bu xətaya data race deyilir.

## main gözləmir {#no-wait}

`go` açar sözü funksiya çağırışını yeni goroutine-də işə salır və onu gözləmədən növbəti sətrə keçir. Function literal ilə də işləyir: `go func() { ... }()`. Burada `main` `search finished` yazıb bitir. `main` bitəndə proqram bütün goroutine-lərlə birlikdə dayanır, ona görə `LateAir`-in 100 millisaniyəlik cavabı çap olunmağa çatmır. Goroutine-in nəticəsi lazımdırsa, onu gözləmək lazımdır, yuxarıdakı `wg.Wait()` kimi.

`go` funksiyanın nəticəsini də qaytarmır: `price := go fare("SkyJet")` kompilyasiya olunmur. Nəticəni ya hər goroutine-in öz yerinə (`fares[i]`) yazmaq, ya da növbəti dərsdəki channel ilə göndərmək olar.

> **Diqqət:** Yeni goroutine-də yalnız funksiyanın özü işləyir, arqumentləri isə dərhal, cari goroutine-də hesablanır. `go show(fare("SkyJet"))` yazsanız, `fare` `main`-in içində işləyəcək və onu 100 millisaniyə saxlayacaq.
