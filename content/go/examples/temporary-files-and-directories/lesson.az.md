Müvəqqəti (temporary) fayl yalnız proqram işləyərkən lazım olan fayldır: yarımçıq hesabat, endirilən faylın hissələri, testlər üçün nümunə verilənlər. Əməliyyat sisteminin bunun üçün ayrıca qovluğu var (Linux-da adətən `/tmp`, Windows-da `%TEMP%`), `os.TempDir()` onun yolunu qaytarır. Adi fayldan iki fərqi var: adı təsadüfi və unikal seçilir ki, eyni proqramın iki nüsxəsi bir-birinin faylını əzməsin, və onu proqram özü silməlidir.

Bu dərsdə onlayn mağazanın günlük sifarişlərini CSV faylına ixrac edirik. Faylı əvvəlcə müvəqqəti adla hazırlayıb sonra əsl adına keçiririk: mühasibat proqramı heç vaxt yarımçıq yazılmış fayl görmür.

## Müvəqqəti qovluq {#dir}

`os.MkdirTemp` yeni boş qovluq yaradır və onun tam yolunu qaytarır. Birinci arqument boş string olanda qovluq sistemin müvəqqəti qovluğunda yaranır. İkinci arqument ad şablonudur: `*` təsadüfi simvollarla əvəzlənir (`export-*` → `export-3815204967` kimi), `*` yoxdursa təsadüfi hissə adın sonuna əlavə olunur. Eyni şablonla iki çağırış iki fərqli qovluq verir.

Qovluğu yaradan kimi `defer os.RemoveAll(dir)` yazırıq: funksiya hansı yolla bitsə də, qovluq bütün içindəkilərlə silinəcək.

> **Diqqət:** Təsadüfi adı çap etməyin və ya kodda gözləməyin: hər işə salınmada başqa olur. Ona görə burada yalnız prefiksi və unikallığı yoxlayırıq.

## Müvəqqəti fayl {#file}

`os.CreateTemp` faylı eyni qaydada adlandırır, yaradır və yazmaq-oxumaq üçün açıq `*os.File` qaytarır. `*`-dan sonrakı hissə (`.csv`) adın sonunda qalır, beləcə faylın genişlənməsi itmir. `f.Name()` faylın tam yolunu verir; sətirləri `fmt.Fprintln` ilə birbaşa fayla yazırıq.

Yazmaq bitən kimi faylı `Close` ilə bağlayırıq: Windows açıq faylın adını dəyişməyə icazə vermir, digər sistemlərdə də bağlanmamış faylda son yazılanlar diskə çatmamış ola bilər.

## Hazır faylı yerinə qoymaq {#rename}

`os.Rename` faylın adını dəyişir, yəni onu başqa yola köçürür; hədəfdə eyni adlı fayl varsa, onu əvəz edir. Eyni disk daxilində bu bir addımlıq əməliyyatdır: `orders.csv`-ni oxuyan proqram ya köhnə tam faylı, ya da yeni tam faylı görür, yarımçığını heç vaxt. Qovluqda indi yalnız `orders.csv` var.

> **Bilgi:** Müvəqqəti faylı hədəf faylla eyni qovluqda yaradın (`os.CreateTemp(dir, ...)`): fərqli disklər arasında `Rename` xəta qaytarır.

## Təmizləmək {#cleanup}

Kiçik şəkillər (thumbnail) yalnız ixrac zamanı lazımdır, ona görə onları yaradan funksiya qovluğu özü silir: `defer os.RemoveAll(tmp)` funksiya qayıdanda işləyir. Funksiya literalını dərhal çağırırıq və o, qovluğun yolunu qaytarır. `os.Stat` yol haqqında məlumat qaytarır; artıq yoxdursa, xətası `fs.ErrNotExist` olur.

> **Diqqət:** `os.Exit` ilə bitən proqramda `defer` işləmir və müvəqqəti fayllar qalır. Sistem müvəqqəti qovluğu hər zaman dərhal təmizləmir, ona görə silmək proqramın işidir.
