Qovluq (directory) faylları və başqa qovluqları qruplaşdıran konteynerdir: `photos/2026/07/lake.jpg` yolunda üç qovluq və bir fayl var. Əvvəlki dərslərdə tək bir faylın içini oxuyub yazdıq; qovluqlarla isə faylları yaradır, siyahılayır və silirik. Bunun üçün `os` paketi və `path/filepath` paketindəki `WalkDir` funksiyası kifayətdir.

Bu dərsdə foto arxivini il və aya görə qovluqlara düzən proqram yazırıq. Hər şey `os.MkdirTemp`-in yaratdığı müvəqqəti qovluğun içində baş verir və `defer os.RemoveAll(root)` sonda onu silir; `MkdirTemp` növbəti dərsin mövzusudur.

## Qovluq yaratmaq {#mkdir}

`os.Mkdir` bir qovluq yaradır. İkinci arqument icazələrdir (permission): `0o755` Linux və macOS-da "sahibi yaza bilər, hamı oxuya bilər" deməkdir, Windows bu dəyəri əsasən nəzərə almır. Qovluq artıq varsa, `Mkdir` xəta qaytarır; ana qovluq (`2026`) yoxdursa, `2026/07`-ni də yarada bilmir.

Xətanın mətni əməliyyat sistemindən asılıdır, ona görə onu `errors.Is` ilə `io/fs` paketinin hazır xətaları ilə müqayisə edirik: `fs.ErrExist` "artıq var", `fs.ErrNotExist` "yoxdur" deməkdir. `os.MkdirAll` isə yoldakı bütün çatışmayan qovluqları ardıcıl yaradır və qovluq artıq varsa, xəta vermir.

> **Bilgi:** `filepath.Join` yolu əməliyyat sisteminin ayırıcısı ilə birləşdirir (`/` və ya `\`), ona görə yolu heç vaxt `"2026/" + "07"` kimi əllə yığmayın.

## Qovluğu oxumaq {#read}

Əvvəlcə `2026` qovluğuna iki foto və bir mətn faylı yazırıq. `os.ReadDir` qovluğun birbaşa içindəkiləri `[]os.DirEntry` kimi qaytarır, adlara görə sıralanmış halda. Hər element üçün `Name()` adı, `IsDir()` isə onun qovluq olub-olmadığını verir. Fotolar siyahıda görünmür: `ReadDir` alt qovluqların (`07`) içinə girmir.

## Bütün ağacı gəzmək {#walk}

`filepath.WalkDir` qovluğu bütün alt qovluqları ilə birlikdə gəzir və hər yol üçün verdiyimiz funksiyanı çağırır: əvvəlcə kök qovluğun özü (`.`), sonra içindəkilər, yenə adlara görə. Funksiyanın `err` parametri o yolu oxumaq alınmadığını bildirir; onu qaytarmaq gəzintini dayandırır, `nil` qaytarmaq davam etdirir. Biz burada `.jpg` fayllarını sayırıq: arxivdə neçə foto olduğunu bilmək üçün hər qovluğa ayrıca `ReadDir` yazmaq lazım deyil.

`filepath.Rel` yolu kök qovluğa nisbətən yazır, `filepath.ToSlash` isə Windows-dakı `\` ayırıcısını `/`-ə çevirir, beləcə çap hər sistemdə eyni olur.

## Qovluğu silmək {#remove}

`os.Remove` yalnız boş qovluğu (və ya tək faylı) silir: `2026`-nın içində fayllar olduğu üçün xəta qaytarır. `os.RemoveAll` qovluğu bütün içindəkilərlə birlikdə silir; kökdə yalnız `2025` qalır.

> **Diqqət:** `RemoveAll` heç nə soruşmur və silinən faylları zibil qutusuna atmır. Ona verdiyiniz yolu, xüsusən istifadəçidən gələn yolu, iki dəfə yoxlayın.
