Heş funksiyası istənilən uzunluqda məlumatdan sabit ölçülü "barmaq izi" hesablayır. SHA-256-da bu iz həmişə 32 baytdır: istər bir sözün, istər bir neçə gigabaytlıq faylın heşi olsun. Heş şifrələmə deyil, birtərəfli çevirmədir: açar yoxdur və heşdən ilkin məlumatı geri almaq mümkün deyil.

Ona görə heş məlumatın dəyişmədiyini yoxlamaq üçün işlədilir: bu dərsdə faylı checksum ilə, yəni yükləmə səhifəsində dərc olunan heşlə yoxlayırıq.

## Heşi hesablamaq {#sum}

`sha256.Sum256` bayt slice-ı qəbul edir, ona görə mətni `[]byte(...)` ilə çeviririk. Nəticə slice yox, `[32]byte` tipli array-dir: ölçüsü tipin özündə yazılıb. Baytları oxunaqlı göstərmək üçün `%x` istifadə edirik: hər bayt iki hex rəqəmi olur, 32 bayt isə 64 simvolluq sətir verir. Yükləmə səhifələrində dərc olunan checksum məhz bu sətirdir.

## Bir hərf dəyişəndə {#change}

Eyni baytlar həmişə eyni heşi verir, ona görə `sum == again` `true`-dur. Array-ləri `==` ilə müqayisə etmək olar: Go onları element-element yoxlayır. `Windows` sözündəki `W` kiçik `w` olanda isə heş tamamilə başqa olur, ilk rəqəmdən sonuncuya qədər. Yaxın girişlər yaxın heş vermir, ona görə heşə baxıb faylın "az" və ya "çox" dəyişdiyini demək olmaz, yalnız dəyişdiyini.

## Hissə-hissə hesablamaq {#stream}

Böyük faylı yaddaşa bütöv yükləmək lazım deyil: o, şəbəkədən və ya diskdən hissə-hissə oxunur. `sha256.New()` hesablamanın vəziyyətini saxlayan obyekt qaytarır, hər `Write` ona növbəti hissəni əlavə edir, `Sum(nil)` isə nəticəni `[]byte` kimi verir. Üç hissə birlikdə eyni baytları təşkil etdiyi üçün heş birinci addımdakı ilə eynidir. `Write` `(int, error)` qaytarır, amma heş funksiyası üçün xəta heç vaxt olmur, ona görə nəticəyə baxmırıq.

> **Bilgi:** `Sum` vəziyyəti sıfırlamır: ondan sonra yenə `Write` çağırmaq olar, növbəti `Sum` isə indiyə qədər yazılan bütün baytların heşini verəcək.

## Checksum-u yoxlamaq {#verify}

Yükləmə səhifəsi faylın heşini dərc edir, biz də yüklədiyimiz baytların heşini özümüz hesablayıb müqayisə edirik. Eynidirsə, fayl yolda pozulmayıb və quraşdırmaq olar; fərqlidirsə, onu yenidən yükləmək lazımdır. `%x` hex rəqəmləri kiçik hərflə yazır, böyük hərflə dərc olunmuş checksum-u `strings.EqualFold` ilə müqayisə etmək olar. Checksum yalnız etibarlı mənbədən götürüləndə kömək edir: faylı dəyişən adam saxta səhifədə heşi də dəyişə bilər.

> **Diqqət:** Parolları tək SHA-256 heşi ilə saxlamaq olmaz. SHA-256 çox sürətlidir, ona görə hücumçu milyonlarla ehtimal olunan parolun heşini hesablayıb sizinkilərlə müqayisə edə bilər. Parollar üçün qəsdən yavaş işləyən bcrypt və ya Argon2 işlədilir (`golang.org/x/crypto/bcrypt`).
