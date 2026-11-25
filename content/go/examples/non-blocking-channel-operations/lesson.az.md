Channel-dan qəbul dəyər gələnə qədər, göndərmə isə qəbul edən və ya buffer-də yer olana qədər gözləyir. Çox vaxt elə də lazımdır, amma bəzən gözləmək olmaz: oyun saniyədə onlarla kadr çəkir və yeni mesaj gəlmədi deyə ekran donmamalıdır. `select`-ə `default` əlavə edəndə əməliyyat bloklamayan olur: heç bir `case` dərhal hazır deyilsə, `select` gözləmir, `default`-u icra edib davam edir. Bu, "varsa götür, yoxdursa keç" deməkdir.

Bu dərsdə oyunun bildiriş nişanını (badge) yazırıq: oyun hər kadrda yeni mesaj olub-olmadığını gözləmədən yoxlayır, dolu bildiriş növbəsinə isə yenisini zorla salmır, onu atır.

## Gözləmədən qəbul {#try-receive}

Dostun mesajı 600 ms sonra gəlir, oyun isə hər 400 ms-dən bir kadr çəkir (real oyunda bu, təxminən 16 ms-dir, burada çıxış sabit olsun deyə aralıq böyükdür). Hər kadrda `select` `chat`-ı yoxlayır: mesaj yoxdursa, dərhal `default` işləyir və oyun növbəti kadra keçir. 1-ci (0 ms) və 2-ci (400 ms) kadrlarda mesaj hələ yoxdur, 3-cü kadrda (800 ms) isə o, artıq channel-dadır. `default` olmasaydı, birinci kadr mesajı 600 ms gözləyəcək və oyun bu müddətdə donacaqdı.

## Gözləmədən göndərmə {#try-send}

`popups` iki bildirişlik növbədir. `default` göndərməyə də eyni cür işləyir: buffer-də yer varsa, bildiriş növbəyə düşür, yoxdursa, `default` işləyir. İlk iki bildiriş yer tapır, `daily bonus` isə atılır. Adi `popups <- note` burada goroutine-i ilişdirərdi: növbədən oxuyan yoxdur və proqram deadlock ilə dayanardı.

> **Bilgi:** `select`-də bir neçə `case` və bir `default` ola bilər: hazır `case` varsa, o işləyir, heç biri hazır deyilsə, `default`. `default` heç vaxt hazır `case`-in yerinə seçilmir.

## Növbəni boşaltmaq {#drain}

Oyunçu bildiriş panelini açanda növbədə nə varsa göstərir və boş növbəni gözləmədən oyuna qayıdırıq. Dövr hər dəfə bir bildiriş oxuyur; növbə boşalanda `default` işləyir və dövrdən çıxırıq. `show:` dövrün etiketidir (label): `break show` məhz bu dövrü bitirir. `len(popups)`-a baxıb sonra oxumaq da olardı, amma başqa goroutine də oxuyursa, yoxlama ilə oxuma arasında növbə boşala bilər; `select` yoxlamanı və oxumanı bir addımda edir.

> **Diqqət:** `select`-in içindəki adi `break` dövrü yox, yalnız `select`-i bitirir. Etiketsiz `break` yazsaq, dövr dayanmadan `default`-a qayıdacaq və proqram heç vaxt bitməyəcəkdi.
