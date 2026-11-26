Test başqa kodu avtomatik yoxlayan koddur: funksiyaya giriş verir və nəticəni gözlənilən dəyərlə müqayisə edir. Hər dəyişiklikdən sonra nəticələri `fmt.Println` ilə gözlə yoxlamaq yerinə, testlər bir saniyədə işləyir və əvvəl düz işləyən bir şeyin sınıb-sınmadığını dərhal göstərir. Go-da bunun üçün əlavə kitabxana lazım deyil: `testing` paketi və `go test` əmri dilin özü ilə gəlir. Benchmark isə testin qardaşıdır: düzgünlüyü yox, sürəti və yaddaş istifadəsini ölçür.

Bu dərsdə onlayn mağazanın çatdırılma haqqını hesablayan funksiyanı test edirik. Səhv düstur birbaşa pul itkisidir, ona görə sərhəd hallarını (düz 2 kq, 1 qram artıq) yoxlamaq xüsusilə vacibdir.

Əsl layihədə funksiya `shipping.go`-da, testlər isə eyni paketdəki `shipping_test.go` faylında yazılır: `_test.go` ilə bitən fayllar yalnız `go test` zamanı kompilyasiya olunur və proqramın özünə düşmür. Sayt kodu `go run` ilə işlətdiyi üçün bu dərsdə hamısı bir `main.go`-dadır və `main` `go test`-in işini görür.

## Yoxlanan funksiya {#code}

`ShippingCents` haqqı sentlə, `int` kimi qaytarır: pulu kəsr ədədlə saxlamaq yuvarlaqlaşdırma xətası verir. Qayda belədir: 2 kq-a qədər 4.99 dollar, hər başlanmış artıq kiloqram üçün 1.50 dollar, ekspress çatdırılma iki qat. `(weightG - 2000 + 999) / 1000` tam bölmə ilə "başlanmış kiloqramı" yuxarı yuvarlaqlaşdırır: 1 qram artıq da bir kiloqram sayılır.

## İlk test {#test}

Test funksiyasının adı `Test` ilə başlayır, ardınca böyük hərf gəlir, və yeganə parametri `*testing.T`-dir; `go test` belə funksiyaları özü tapır. `t.Errorf` testi uğursuz kimi qeyd edir, mesajı yazır və testin qalanını işlətməyə davam edir; `t.Fatalf` isə testi dərhal dayandırır. Mesajda girişi, alınanı və gözləniləni yazmaq (`got ..., want ...`) uğursuz testi kodu açmadan başa düşməyə imkan verir.

## Cədvəlli test {#table}

Eyni funksiyanı bir neçə girişlə yoxlamaq üçün Go-da hallar cədvəli (table-driven test) yazılır: hər sətri bir hal olan slice. Burada struct tipi adsız, elə yerindəcə elan olunub, çünki yalnız bu cədvəl üçün lazımdır. Yeni hal əlavə etmək bir sətirdir.

`t.Run` hər hal üçün alt test (subtest) başladır: uğursuzluqlar ayrı-ayrı göstərilir, məsələn `TestShippingCents/express`, və bir halın xətası digərlərini dayandırmır. Adlardakı boşluqlar çıxışda `_` olur: `one_gram_over`.

## Benchmark {#bench}

Benchmark funksiyasının adı `Benchmark` ilə başlayır və `*testing.B` qəbul edir. `for b.Loop()` dövrü bədəni ölçmək üçün lazım olan qədər təkrarlayır (Go 1.24-dən; köhnə kodda `for i := 0; i < b.N; i++` görəcəksiniz). Nəticə bir çağırışın orta vaxtıdır (`ns/op`), `-benchmem` bayrağı ilə hər çağırışda neçə dəfə yaddaş ayrıldığı da göstərilir (`allocs/op`).

## İşə salmaq {#run}

Əsl layihədə terminalda `go test` yazılır: bütün testlər işləyir və uğurlu olanda `ok` ilə paketin adı çap olunur. `go test -v` hər testin adını və nəticəsini göstərir, `go test -run Cents` yalnız adı bu ifadəyə uyğun gələn testləri işlədir, `go test -bench .` isə benchmark-ları da işə salır: adi `go test` onları işlətmir.

Burada `main` eyni işi əl ilə görür. `testing.Benchmark` benchmark-ı işlədib nəticəni qaytarır; vaxt hər kompüterdə fərqli olduğu üçün yalnız dövrün işlədiyini və `allocs/op`-u çap edirik: funksiya yalnız ədədlərlə işləyir, yaddaş ayırmır. `testing.Main` testləri işlədir və hamısı keçəndə `PASS` yazır. Hal uğursuz olsaydı, `--- FAIL: TestShippingCents/express`, sətir nömrəsi ilə mesaj və `FAIL` çap olunardı, proqram isə 1 çıxış kodu ilə bitərdi.

> **Diqqət:** `testing.Main` yalnız bu sayt üçün nümayişdir: `go test` belə `main`-i özü yaradır. Öz layihənizdə testləri `_test.go` fayllarına yazın və `go test` ilə işlədin.
