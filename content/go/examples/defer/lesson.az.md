`defer` funksiya çağırışını təxirə salır: çağırış dərhal yox, onu yazan funksiya bitəndə icra olunur. Bununla "sonda mütləq etməli olduğumuz" işi başlanğıcın yanına yazırıq: qapını açan kimi "çıxanda bağla" deyirik. Funksiya neçə yerdən bitirsə bitsin, bu iş unudulmur. Real proqramlarda `defer` faylı bağlamaq və ya kilidi açmaq üçün istifadə olunur, həmin mövzular sonrakı bölmələrdədir.

Bu dərsdə çörəkxananın iş gününü yazırıq.

## defer necə işləyir {#basic}

`defer fmt.Println(baker, "locks the door")` sətri çağırışı yadda saxlayır, amma icra etmir. Çağırış `shift` bitəndə işləyir, ona görə "locks the door" kodda ortada yazılsa da, ən sonda çap olunur. `defer`-dən sonra mütləq funksiya çağırışı gəlməlidir.

## Bir neçə defer {#order}

Hər `defer` çağırışı yığına (stack) qoyulur və funksiya bitəndə sonuncudan birinciyə doğru icra olunur. Boşqab yığını kimi: sonuncu qoyulan birinci götürülür. Dövrdə `oven`, `kitchen`, `shop` sırası ilə təxirə saldıq, işıqlar isə tərs sıra ilə sönür.

## Arqumentlər nə vaxt hesablanır {#args}

`defer fmt.Println("at defer:", loaves)` yazılanda arqumentlər dərhal hesablanır: `loaves` o an `10`-dur və sonrakı dəyişiklik ona təsir etmir. Function literal-ı təxirə salanda isə (`defer func() { ... }()`) o, closure kimi dəyişənin özünü tutur və sondakı dəyəri, `25`-i görür. Sondakı `()` funksiyanı çağırır: `defer`-ə funksiyanın özü yox, çağırış lazımdır. Bu iki defer də tərs sıra ilə çap olunur.

## Erkən return {#early}

`sell` iki yerdən bitə bilər, amma qəbz (`receipt`) hər iki halda çap olunur, çünki `defer` istənilən `return`-dan sonra işləyir. Çap sırasına diqqət edin: `fmt.Println("sold:", ...)` əvvəlcə arqumentini, yəni `sell`-i hesablayır. `sell`-in defer-i onun içində, `sell` bitəndə işləyir, `"sold:"` sətri isə bundan sonra çap olunur.

> **Bilgi:** `defer` panic zamanı da işləyir. Bunu növbəti dərsdə, `recover` ilə istifadə edəcəyik.
