Əvvəlki dərsdəki channel-da dəyər üçün yer yox idi: göndərən qəbul edəni gözləyirdi. Buffered channel-ın isə içində bir neçə dəyər üçün yer (buffer) var. Göndərən buffer dolana qədər gözləmədən işinə davam edir, qəbul edən isə dəyərləri sonra, gəliş sırası ilə götürür. Bu, iki tərəfin sürəti fərqli olanda lazımdır: tez işləyən tərəf yavaş tərəfi hər dəfə gözləməsin.

Nümunədə `rail` kafedə üç sifariş saxlayan channel-dır.

## Buffered channel yaratmaq {#make}

`make`-in ikinci arqumenti buffer-in ölçüsüdür: `make(chan string, 3)` üç dəyər saxlaya bilən channel yaradır. `cap(rail)` bu tutumu qaytarır, slice-dakı kimi. Ölçü verilməsə və ya `0` olsa, channel əvvəlki dərsdəki kimi buffer-siz olur.

## Gözləmədən göndərmək {#no-wait}

`main` üç dəyəri `rail`-ə göndərir və heç birində gözləmir, halbuki qəbul edən goroutine hələ yoxdur. Buffer-siz channel-da elə ilk göndərmə `main`-i əbədi saxlayardı və proqram deadlock ilə dayanardı. `len(rail)` buffer-də hazırda neçə dəyər olduğunu göstərir: `3 of 3`, yəni buffer doludur.

## Dolu buffer {#full}

Dolu buffer-ə göndərmə yenə gözləyir, bu dəfə boş yer açılana qədər. Goroutine 100 millisaniyədən sonra `rail`-dən bir dəyər götürür və onu `made` channel-ı ilə `main`-ə qaytarır. `rail <- "espresso"` məhz o ana qədər `main`-i saxlayır, `waited: true` bunu göstərir. Goroutine `latte`-ni götürüb, çünki `rail`-ə ilk göndərilən dəyər o idi.

> **Diqqət:** Dolu buffer-i boşaldacaq başqa goroutine yoxdursa, göndərmə əbədi gözləyir və proqram `fatal error: all goroutines are asleep - deadlock!` ilə dayanır. Buffer qəbul edəni əvəz etmir: o, göndərənə qəbul edəndən ən çox `cap` dəyər qabağa getməyə icazə verir.

## Növbə sırası {#fifo}

Buffered channel növbə kimi işləyir: dəyərlər göndərildiyi sırada çıxır. Buna FIFO deyilir (first in, first out, yəni ilk girən ilk çıxır). Dövr buffer-də dəyər qaldıqca növbətisini götürür: `cappuccino`, `mocha`, sonra buffer dolu olanda gözləyib göndərilən `espresso`. Burada `len` şərti düzgün işləyir, çünki `rail`-ə artıq heç kim göndərmir.

> **Bilgi:** Başqa goroutine-lər eyni vaxtda göndərib-götürəndə `len`-in cavabı dərhal köhnəlir. Ona görə `len` və `cap`-i məlumat üçün işlədin, gözləmək üçün yox. Channel-ı sona qədər oxumağın düzgün yolu Range over Channels dərsindədir.
