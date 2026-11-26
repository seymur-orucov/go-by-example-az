Log (jurnal) proqramın işləyərkən özü haqqında yazdığı qeydlərdir: hansı sifariş gəldi, hansı ödəniş rədd edildi, nə vaxt xəta baş verdi. `fmt.Println`-dən fərqi məqsəddədir: çıxış istifadəçi üçündür, log isə proqramı izləyən və problemi axtaran proqramçı üçün. Serverdə heç kim ekrana baxmır, ona görə gecə baş verən xətanı səhər yalnız loglardan tapmaq olur. Go-da iki standart paket var: sadə `log` və strukturlu `log/slog`.

Bu dərsdə onlayn mağazanın sifariş servisini yazırıq: o, sifarişlərin qəbulunu, ödənişləri və anbar xəbərdarlıqlarını loga yazır.

## log paketi {#std}

`log.Println` və `log.Printf` `fmt`-dəki kimi işləyir, amma standart olaraq stderr-ə yazır və hər sətrin əvvəlinə tarix və saat qoyur: `2026/11/26 09:14:03 order 1042 received`. Real serverdə bu vaxt vacibdir, çünki hadisələri sıraya düzməyə və xətanın nə vaxt başladığını tapmağa kömək edir. Bu dərsdə çıxış hər dəfə eyni olmalıdır, ona görə `SetFlags(0)` ilə vaxtı söndürürük və `SetOutput(os.Stdout)` ilə logu adi çıxışa yönləndiririk.

> **Diqqət:** `log.Fatal` mesajı yazandan sonra proqramı dərhal bitirir, `log.Panic` isə panic yaradır. Onları adi xəta üçün yox, proqramın davam edə bilmədiyi hal üçün işlədin.

## Öz logger-iniz {#custom}

`log.New` ayrıca logger yaradır: hara yazacağı, hər sətrin prefiksi və flag-ları. Ödəniş modulunun sətirləri `payments: ` ilə başlayır, ona görə ümumi logda onları asanlıqla seçmək olur. Üçüncü arqument flag-lardır: `0` vaxtı söndürür, `log.LstdFlags` tarix və saatı, `log.Lshortfile` isə faylın adı ilə sətrin nömrəsini əlavə edir.

## slog: açar və dəyər {#slog}

Adi log sətri mətndir və ondan məlumatı çıxarmaq çətindir. `slog` hər qeydi səviyyə, mesaj və açar-dəyər cütləri kimi saxlayır: `order=1042 carrier=DHL`. Belə logda log sistemləri "1042 nömrəli sifarişin bütün qeydləri" kimi axtarış edə bilir. Handler qeydin formatını seçir, `TextHandler` `açar=dəyər` yazır. `ReplaceAttr`-a verdiyimiz `dropTime` vaxt sahəsini atır, onu son addımda görəcəyik.

`Debug` sətri çap olunmayıb: standart səviyyə `Info`-dur və ondan aşağı qeydlər atılır. Sazlama (debug) qeydlərini yalnız problem axtaranda açmaq olar.

## JSON və səviyyə {#json}

`JSONHandler` hər qeydi bir sətirlik JSON kimi yazır, log yığan sistemlər onu birbaşa oxuyur. `Level: slog.LevelWarn` hədd qoyur: `Info` qeydi atılır, yalnız `Warn` və `Error` qalır. `With("service", "orders")` bu logger-in hər qeydinə eyni cütü əlavə edir, onu hər çağırışda təkrar yazmaq lazım olmur.

## Vaxt sahəsini atmaq {#drop-time}

`ReplaceAttr` handler hər sahəni yazmazdan əvvəl çağırılır və onu dəyişə bilər. `slog.TimeKey` (`"time"`) olan sahə üçün boş `slog.Attr{}` qaytarırıq, boş sahə isə yazılmır. `len(groups) == 0` şərti yalnız ən üst səviyyədəki vaxtı seçir, istifadəçinin öz qrupları içindəki eyni adlı açarlara toxunmur. Real serverdə bu funksiya lazım deyil: vaxt logun ən faydalı sahələrindən biridir.
