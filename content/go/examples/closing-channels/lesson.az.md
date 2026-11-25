Qəbul edən tərəf adətən neçə dəyər gələcəyini bilmir. Əvvəlki dərslərdə sayı əvvəlcədən verirdik (`for range n`), amma işin nə vaxt bitdiyini çox vaxt yalnız göndərən bilir. `close(ch)` channel-ı bağlayır və "bundan sonra yeni dəyər olmayacaq" xəbərini verir. Bağlı channel-dan qəbul bloklanmır, dərhal qayıdır, ona görə qəbul edən tərəfə bağlanmanı adi dəyərdən ayırmağın yolu lazımdır.

Bu dərsdə imtahan yazırıq: müəllim sualları bir-bir verir və sonda "başqa sual yoxdur" deyir, tələbə isə sualların ballarını toplayır.

## Channel-ı bağlamaq {#close}

`teacher` hər sualın balını `questions` channel-ına göndərir, suallar bitəndə isə `close(questions)` çağırır. Bağlamaq channel-ı silmir: əvvəl göndərilmiş dəyərlər yenə qəbul oluna bilər, sadəcə yeni dəyər göndərmək olmur. Channel-ı göndərən bağlayır, çünki işin bitdiyini yalnız o bilir. Qəbul edən bağlasaydı, göndərən növbəti göndərişdə panic edərdi.

## Bağlanmanı tanımaq {#ok}

`main` channel-ı yaradır və müəllimi goroutine-də işə salır. `p, ok := <-questions` iki dəyər qaytarır: gələn dəyəri və `ok`-u. `ok` `true`-dursa, dəyəri həqiqətən kimsə göndərib; `false`-dursa, channel bağlanıb və boşdur. `ok` `false` olanda `for` dövrü `break` ilə bitir.

Bu fərq burada vacibdir: ilk sual isinmə sualıdır və 0 bal dəyərindədir. Yalnız `p == 0`-a baxsaydıq, tələbə imtahanın ilk sualda bitdiyini düşünərdi.

> **Bilgi:** Növbəti dərsdə bu dövrün qısa yazılışını görəcəyik: `for p := range questions`.

## Bağlı channel-dan qəbul {#zero}

Bağlı channel-dan qəbul heç vaxt bloklanmır: hər dəfə dərhal tipin zero value-sunu və `ok = false` qaytarır. `int` üçün bu `0`-dır, ona görə çıxışda `0 false` görünür. Bağlanmamış boş channel-dan qəbul isə kimsə dəyər göndərənə qədər gözləyərdi.

## Bağlı channel-a göndərmək {#send-closed}

Bağlı channel-a göndərmək panic-dir: `send on closed channel`. Bunu göstərmək üçün `main`-in sonuna `defer` və `recover` qoyuruq (Xətalar bölməsindən tanışdır) və 20 ballıq "gec sual" göndəririk. `recover` panic-i tutur və onun mesajını çap edir. Real kodda panic-i belə tutmaq yox, onun baş verməsinin qarşısını almaq lazımdır: channel-ı yalnız göndərən bağlayır və bağladıqdan sonra ona heç nə göndərmir.

> **Diqqət:** Channel-ı ikinci dəfə bağlamaq da panic-dir: `close of closed channel`.
