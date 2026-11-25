Bir neçə goroutine eyni adi dəyişəni `count++` ilə artıranda say itir. `count++` əslində üç addımdır: dəyəri oxu, bir əlavə et, geri yaz. İki goroutine eyni anda 41-i oxuyub hər ikisi 42 yazsa, artımlardan biri yox olur. Buna **data race** deyilir: bir neçə goroutine eyni yaddaşa qoruma olmadan müraciət edir və heç olmasa biri yazır; nəticə hər işə salmada fərqli ola bilər. `sync/atomic` paketi **atomik**, yəni bölünməz əməliyyatlar verir: oxumaq, dəyişmək və yazmaq bir addım kimi baş verir və başqa goroutine onların arasına girə bilmir.

Bu dərsdə stadionun turniketlərini sayırıq: hər qapının öz goroutine-i var və hamısı bir ümumi sayğacı artırır.

## Ümumi sayğac {#counter}

`atomic.Int64` içində `int64` saxlayan tipdir. Onun zero value-su hazır sayğacdır: 0, `make` və ya başlanğıc dəyər lazım deyil. `Add(1)` dəyəri atomik artırır, `Load()` atomik oxuyur. `for range fans` dövrü dəyişən olmadan `fans` dəfə təkrarlanır: hər təkrar turniketdən keçən bir azarkeşdir. Dörd qapı eyni `inside`-ı cəmi 12000 dəfə artırır və bir artım da itmir, ona görə `wg.Wait()`-dən sonra nəticə həmişə 12000 olur.

> **Diqqət:** `inside++` yazmaq olmur: `atomic.Int64` ədəd yox, struct-dır və kompilyator `invalid operation` xətası verir. Beləcə sayğaca səhvən atomik olmayan yolla toxunmaq mümkün deyil.

## Artırmaq və azaltmaq {#halftime}

Ayrıca azaltma metodu yoxdur: `Add`-ə mənfi ədəd veririk. Fasilədə 1500 azarkeş tez çıxır, eyni vaxtda 300 gecikən içəri girir. İki goroutine eyni sayğacı əks istiqamətlərdə dəyişir, amma hər dəyişiklik nəzərə alınır: 12000 − 1500 + 300 = 10800. Tablo oyun gedərkən də `Load()` ilə sayğacı oxuya bilər, amma gördüyü rəqəm yalnız o an üçün doğrudur. Yekun rəqəm lazım olanda goroutine-lərin bitməsini gözləyirik.

## Add-in nəticəsi {#last-fan}

`Add` yeni dəyəri qaytarır və hər çağırış öz nəticəsini alır: iki goroutine eyni rəqəmi ala bilməz. Ona görə üç çıxışdan dəqiq biri 0 görür və işıqları söndürür. Mesajı yalnız bir goroutine çap edir, `main` isə öz sətrini `Wait`-dən sonra çap edir, ona görə çıxış sırası həmişə eynidir.

> **Diqqət:** `inside.Add(-1)`, sonra ayrıca `inside.Load() == 0` yazmaq səhvdir. Bunlar iki ayrı addımdır: arada başqa çıxış da sayğacı azalda bilər, iki goroutine 0 görüb mesajı iki dəfə çap edər. "Yoxla, sonra dəyiş" kimi bir neçə addımlı işi atomik sayğac qorumur, bunun üçün növbəti dərsdəki mutex lazımdır.
