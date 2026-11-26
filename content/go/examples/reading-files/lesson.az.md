Proqramın işlədiyi verilənlərin çoxu fayllarda saxlanır: konfiqurasiya, hesabat, cədvəl, başqa proqramın yazdığı nəticə. Dəyişən proqram bitəndə yox olur, fayl isə diskdə qalır və proqram növbəti dəfə onu yenidən oxuya bilir. Go-da faylla işin əsas alətləri `os` paketindədir, sətir-sətir oxumaq üçün isə `bufio` paketi var.

Bu dərsdə avtobus marşrutu faylını oxuyuruq: birinci sətir marşrutun adıdır, qalanları dayanacaqlardır. Faylı proqram özü müvəqqəti qovluqda yaradır və sonda silir (fayl yazmaq və müvəqqəti fayllar növbəti dərslərdədir).

## Faylı bütöv oxumaq {#whole}

`os.ReadFile` faylı açır, bütün məzmununu oxuyur, bağlayır və `[]byte` ilə `error` qaytarır. Kiçik fayllar üçün ən sadə yol budur: bir çağırış, açıb-bağlamaq qayğısı yoxdur. `%s` `[]byte`-ı mətn kimi çap edir, `len(data)` isə ölçünü baytla verir: dörd sətir, hər biri `\n` ilə bitir, cəmi 33 bayt.

> **Diqqət:** `ReadFile` bütün faylı yaddaşa yükləyir. Gigabaytlarla ölçülən log faylı üçün bu yararsızdır, onu hissə-hissə oxumaq lazımdır.

## Fayl tapılmayanda {#missing}

Fayl olmaya bilər: silinib, adı səhv yazılıb, başqa qovluqdadır. Xəta `*fs.PathError` tipindədir və içində əməliyyatı, yolu və səbəbi saxlayır. Səbəbin "fayl yoxdur" olduğunu `errors.Is(err, fs.ErrNotExist)` ilə yoxlayırıq: beləcə proqram, məsələn, faylı yaratmağa və ya standart dəyərlə davam etməyə qərar verə bilir.

> **Bilgi:** Xətanın mətnini müqayisə etməyin: Linux-da `no such file or directory`, Windows-da `The system cannot find the file specified.` yazılır. `errors.Is` hər sistemdə eyni işləyir.

## Open və Read {#open}

`os.Open` faylı oxumaq üçün açır və `*os.File` qaytarır. Açılan fayl əməliyyat sistemindən götürülmüş resursdur, onu bağlamaq lazımdır: `defer f.Close()` xəta yoxlamasından dərhal sonra yazılır ki, funksiya harada bitirsə bitsin, fayl bağlansın. `f.Read(buf)` slice-ın uzunluğu qədər, ən çox 5 bayt oxuyur və neçə bayt oxuduğunu qaytarır. Ona görə `buf` yox, `buf[:n]` çap edirik: son oxunuşda slice-ın hamısı dolmaya bilər.

Fayl öz mövqeyini yadda saxlayır: növbəti `Read` 6-cı baytdan davam edərdi. Faylın sonuna çatanda `Read` `0` və `io.EOF` qaytarır.

## Sətir-sətir oxumaq {#lines}

`f.Seek(0, io.SeekStart)` mövqeyi faylın əvvəlinə qaytarır. `bufio.NewScanner` faylı hissə-hissə oxuyur və sətirlərə bölür: hər `Scan()` növbəti sətri hazırlayır və sətir qalmayanda `false` qaytarır, `Text()` isə sətri `\n` olmadan verir. Birinci `Scan()` başlığı ötürür, dövr isə dayanacaqları nömrələyir. Bütün fayl yaddaşa yüklənmir, bir anda yalnız bir hissə saxlanır, ona görə bu üsul böyük fayllar üçün də yararlıdır.

`Scan()` həm faylın sonunda, həm də xəta olanda `false` qaytarır. Bu ikisini ayırmaq üçün dövrdən sonra `sc.Err()` yoxlanır: faylın sonu xəta sayılmır, ona görə orada `nil` olur.

> **Bilgi:** Windows-da yazılmış fayllarda sətirlər `\r\n` ilə bitir. `Scanner` sondakı `\r`-i də silir, ona görə eyni kod hər iki formatı oxuyur.
