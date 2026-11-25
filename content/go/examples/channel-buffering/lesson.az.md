Əvvəlki dərsdəki channel-da dəyər üçün yer yox idi: göndərən qəbul edəni gözləyirdi. Buffered channel-ın isə içində bir neçə dəyər üçün yer (buffer) var. Göndərən buffer dolana qədər gözləmədən işinə davam edir, qəbul edən isə dəyərləri sonra, gəliş sırası ilə götürür. Bu, iki tərəfin sürəti fərqli olanda lazımdır: tez işləyən tərəf yavaş tərəfi hər dəfə gözləməsin.

Bu dərsdə kafe yazırıq: kassir sifariş çeklərini rəfə (`rail`) qoyur, barista onları bir-bir götürür. Rəfdə üç çekə yer var, ona görə barista məşğul olanda da kassir yeni sifarişlər qəbul edə bilir.

## Buffered channel yaratmaq {#make}

`make`-in ikinci arqumenti buffer-in ölçüsüdür: `make(chan string, 3)` üç dəyər saxlaya bilən channel yaradır. `cap(rail)` bu tutumu qaytarır, slice-dakı kimi. Ölçü verilməsə və ya `0` olsa, channel əvvəlki dərsdəki kimi buffer-siz olur.

## Gözləmədən göndərmək {#no-wait}

Kassir üç çeki rəfə qoyur və heç birində gözləmir, halbuki onları götürən hələ yoxdur. Buffer-siz channel-da elə ilk göndərmə `main`-i əbədi saxlayardı və proqram deadlock ilə dayanardı. `len(rail)` buffer-də hazırda neçə dəyər olduğunu göstərir: `3 of 3`, yəni rəf doludur.

## Dolu buffer {#full}

Dolu buffer-ə göndərmə yenə gözləyir, bu dəfə boş yer açılana qədər. Barista goroutine-i 100 millisaniyədən sonra rəfdən bir çek götürür və hazır içkini `made` channel-ı ilə qaytarır. `rail <- "espresso"` məhz o ana qədər `main`-i saxlayır, `waited: true` bunu göstərir. Barista `latte`-ni hazırlayıb, çünki rəfə ilk qoyulan çek o idi.

> **Diqqət:** Dolu buffer-i boşaldacaq başqa goroutine yoxdursa, göndərmə əbədi gözləyir və proqram `fatal error: all goroutines are asleep - deadlock!` ilə dayanır. Buffer qəbul edənin yerini tutmur, o yalnız iki tərəfin qısa fasilələrini yumşaldır.

## Növbə sırası {#fifo}

Buffered channel növbə kimi işləyir: dəyərlər göndərildiyi sırada çıxır. Buna FIFO deyilir (first in, first out, yəni ilk girən ilk çıxır). Dövr rəfdə çek qaldıqca növbətisini götürür: `cappuccino`, `mocha`, sonra rəf dolu olanda gözləyib gələn `espresso`. Burada `len` şərti düzgün işləyir, çünki rəfə artıq heç kim yazmır.

> **Bilgi:** Başqa goroutine-lər eyni vaxtda göndərib-götürəndə `len`-in cavabı dərhal köhnəlir. Ona görə `len` və `cap`-i məlumat üçün işlədin, gözləmək üçün yox. Channel-ı sona qədər oxumağın düzgün yolu Range over Channels dərsindədir.
