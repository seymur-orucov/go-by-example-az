Base64 istənilən baytları yalnız 64 "təhlükəsiz" simvoldan ibarət mətnə çevirir: `A`–`Z`, `a`–`z`, `0`–`9`, `+` və `/`. Bu lazımdır, çünki JSON, email və URL kimi yerlər yalnız mətn qəbul edir, şəkil, açar və ya əvvəlki dərsdəki heş kimi baytlar isə istənilən dəyərdə ola bilər. Heşdən fərqli olaraq base64 ikitərəflidir: kodlaşdırılmış mətndən ilkin baytları dəqiq geri almaq olur.

Bu dərsdə kino tətbiqi dəvətin 32 baytlıq SHA-256 heşini dosta göndərilən dəvət linkinə yazır.

## Kodlaşdırmaq {#encode}

`base64.StdEncoding` standart əlifbadır, onun `EncodeToString` metodu baytları qəbul edib string qaytarır. Hər simvol 6 bit daşıyır (2⁶ = 64, adı da buradandır), ona görə hər 3 bayt (24 bit) 4 simvola çevrilir və nəticə təxminən üçdə bir uzun olur. Bayt sayı 3-ə bölünmürsə, son natamam qrupun sonuna `=` əlavə olunur ki, uzunluq 4-ə bölünsün. Bizim 32 baytda son qrupda 2 bayt qalır, ona görə 44 simvolun sonunda bir `=` var.

## Geri çevirmək {#decode}

`DecodeString` `([]byte, error)` qaytarır, çünki hər mətn düzgün base64 deyil. Düzgün mətndən ilkin 32 baytı dəqiq alırıq: `bytes.Equal` onları heşlə müqayisə edib `true` qaytarır. `"invite 1021"` isə base64 deyil: 6-cı indeksdəki boşluq base64 əlifbasında yoxdur və xəta məhz onun yerini göstərir.

> **Diqqət:** Base64 şifrələmə deyil: açar yoxdur, linki görən hər kəs onu `DecodeString` ilə oxuya bilər. Parol və ya kart nömrəsi kimi gizli məlumatı base64 ilə "gizlətmək" olmaz.

## URL üçün əlifba {#url}

Standart əlifbadakı `+` və `/` URL-də xüsusi mənalıdır: `/` path hissələrini ayırır, query-də isə `+` boşluq kimi oxunur. Bizim kodda hər ikisi var (`D/yi`, `p+VY`). `base64.URLEncoding` eyni üsuldur, yalnız `+` əvəzinə `-`, `/` əvəzinə isə `_` yazır, qalan simvollar dəyişmir. Belə nəticəni linkin path-inə rahat qoymaq olur.

> **Bilgi:** Adi mətni linkə qoymaq üçün base64 lazım deyil: `url.QueryEscape` kifayətdir. Base64 mətn olmayan baytlar üçündür.

## Padding-siz kodlaşdırma {#raw}

Sondakı `=` (padding) query-də açarı dəyərdən ayıran işarədir, ona görə linkdə çox vaxt `%3D` kimi kodlaşdırılır və link uzanır. Halbuki o, heç bir məlumat daşımır: neçə bayt olduğu mətnin uzunluğundan bilinir. `base64.RawURLEncoding` URL əlifbasıdır, amma `=` yazmır; standart əlifbanın da belə cütü var: `RawStdEncoding`. Mətni açanda kodlaşdırmada işlənən encoding-i seçmək lazımdır. `URLEncoding` sonuncu qrupu tam 4 simvol gözləyir və natamam qrupun başladığı 40-cı indeksdə xəta verir, `RawURLEncoding` isə mətni düzgün açır.

> **Bilgi:** Login zamanı verilən JWT tokeni istifadəçinin kim olduğunu göstərən imzalı mətndir. Onun hissələri məhz `RawURLEncoding` ilə kodlaşdırılır, ona görə tokeni linkə və HTTP başlığına dəyişmədən qoymaq olur.
