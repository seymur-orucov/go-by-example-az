Əvvəlki dərsdəki `slices.Sort` yalnız `cmp.Ordered` tipləri, yəni ədədləri və sətirləri sıralayır. Struct-ı isə necə düzmək lazım olduğunu o bilmir: reysləri qiymətə görə, yoxsa aktarma sayına görə? `slices.SortFunc` sıranı bizim verdiyimiz müqayisə funksiyasına görə qurur, ona görə eyni siyahını istənilən qaydaya düzmək olur.

Bu dərsdə bilet axtarışı saytındakı kimi reys siyahısını müxtəlif düymələrlə sıralayırıq: "əvvəlcə ucuz", "əvvəlcə aktarmasız", "əvvəlcə baha". Hər reysin kodu, dollarla qiyməti və aktarma (yolda təyyarə dəyişmə) sayı var.

## Müqayisə funksiyası {#by-field}

`slices.Sort(flights)` kompilyasiya olunmazdı, çünki `Flight` struct-ı `cmp.Ordered` deyil. `SortFunc`-a isə `func(a, b Flight) int` verilir: `a` `b`-dən əvvəl gəlməlidirsə, mənfi ədəd, sonra gəlməlidirsə, müsbət ədəd, fərqi yoxdursa, `0` qaytarır. Bunu `if`-lərlə də yazmaq olar, amma `cmp.Compare(x, y)` hazır cavab verir: `x < y` olanda `-1`, bərabər olanda `0`, böyük olanda `1`. Burada yalnız `Price` sahəsi müqayisə olunur, ona görə ən ucuz reys önə keçir.

## Bir neçə açar {#keys}

Çox vaxt bir açar azdır: "əvvəlcə aktarmasız, onların içində də əvvəlcə ucuz". `cmp.Or` arqumentlərindən sıfır olmayan birincisini qaytarır, hamısı `0`-dırsa, `0`. Aktarma sayları fərqlidirsə, ilk `cmp.Compare` sıfır deyil və o qərar verir; eynidirsə, `0` qaytarır və növbə qiymətə çatır. Açarların yazılış sırası vacibdir: birinci açar əsasdır, sonrakılar yalnız bərabərlikdə işə düşür.

## Azalan sıra {#desc}

Arqumentlərin yerini dəyişmək kifayətdir: `cmp.Compare(b.Price, a.Price)`. İndi daha baha reys "kiçik" sayılır və siyahının önünə keçir. Eyni nəticəni `-cmp.Compare(a.Price, b.Price)` da verir, amma `a` ilə `b`-nin yerini dəyişmək daha qısadır.

> **Diqqət:** `a` ilə `b`-ni səhvən qarışdırmaq sıranı tərsinə çevirir, kompilyator isə bunu tutmur. Sıranı çıxışda mütləq yoxlayın.

## Sabit sıralama {#stable}

İstifadəçi siyahını bahadan ucuza düzüb, sonra "əvvəlcə aktarmasız" düyməsini basır. Aktarma sayı eyni olan reyslər əvvəlki, yəni bahadan ucuza sırasında qalmalıdır. `SortFunc` buna zəmanət vermir: müqayisəsi `0` qaytaran elementlərin sırası istənilən cür ola bilər. `SortStableFunc` isə bərabər elementləri əvvəlki sırada saxlayır: aktarmasız `QR218` (510 dollar) `J2064`-dan (455 dollar) öndə qalır.

Nəticəni "Bir neçə açar" addımı ilə müqayisə edin: orada qiymət açıq yazılmış ikinci açar idi, burada isə qiymət sırası əvvəlki sıralamadan gəlir.

> **Diqqət:** Kiçik slice-da `SortFunc` da təsadüfən bərabər elementlərin sırasını saxlaya bilər. Bu sıra vacibdirsə, buna güvənməyin, `SortStableFunc` yazın.
