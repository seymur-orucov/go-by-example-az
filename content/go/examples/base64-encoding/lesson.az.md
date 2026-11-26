Base64 istənilən baytları yalnız 64 "təhlükəsiz" simvoldan ibarət mətnə çevirir: `A`–`Z`, `a`–`z`, `0`–`9`, `+` və `/`. Bu lazımdır, çünki JSON, email və URL kimi yerlər yalnız mətn qəbul edir, şəkil, açar və ya əvvəlki dərsdəki heş kimi baytlar isə istənilən dəyərdə ola bilər. Heşdən fərqli olaraq base64 ikitərəflidir: kodlaşdırılmış mətndən ilkin baytları dəqiq geri almaq olur.

Bu dərsdə kino tətbiqi dosta dəvət linki göndərir və dəvətin mətni linkin içinə yazılır. Mətndə boşluq, `?` və mötərizə var, URL-də isə bu simvolların xüsusi mənası var.

## Kodlaşdırmaq {#encode}

`base64.StdEncoding` standart əlifbadır, onun `EncodeToString` metodu baytları qəbul edib string qaytarır. Hər simvol 6 bit daşıyır (2⁶ = 64, adı da buradandır), ona görə hər 3 bayt (24 bit) 4 simvola çevrilir və nəticə təxminən üçdə bir uzun olur. Bayt sayı 3-ə bölünmürsə, son natamam qrupun sonuna `=` əlavə olunur ki, uzunluq 4-ə bölünsün. Bizim 29 baytda son qrupda 2 bayt qalır, ona görə 40 simvolun sonunda bir `=` var.

## Geri çevirmək {#decode}

`DecodeString` `([]byte, error)` qaytarır, çünki hər mətn düzgün base64 deyil. Düzgün mətndən ilkin baytları dəqiq alırıq və `string(...)` ilə yenidən mətnə çeviririk. `"Free Friday?"` isə kodlaşdırılmamış mətndir: 4-cü indeksdəki boşluq base64 əlifbasında yoxdur və xəta məhz onun yerini göstərir.

> **Diqqət:** Base64 şifrələmə deyil: açar yoxdur, linki görən hər kəs onu `DecodeString` ilə oxuya bilər. Parol və ya kart nömrəsi kimi gizli məlumatı base64 ilə "gizlətmək" olmaz.

## URL üçün əlifba {#url}

Standart əlifbadakı `+` və `/` URL-də xüsusi mənalıdır: `/` path hissələrini ayırır, query-də isə `+` boşluq kimi oxunur. Bizim kodda hər ikisi var (`YXk/`, `ICh+`). `base64.URLEncoding` eyni üsuldur, yalnız `+` əvəzinə `-`, `/` əvəzinə isə `_` yazır, qalan simvollar dəyişmir. Belə nəticəni linkin path-inə rahat qoymaq olur.

## Padding-siz kodlaşdırma {#raw}

Sondakı `=` (padding) də URL-də problem yarada bilər, çünki query-də `açar=dəyər` cütlərini ayırır. Halbuki o, heç bir məlumat daşımır: neçə bayt olduğu mətnin uzunluğundan bilinir. `base64.RawURLEncoding` URL əlifbasıdır, amma `=` yazmır; standart əlifbanın da belə cütü var: `RawStdEncoding`. Decode edəndə kodlaşdırmadakı encoding-i seçmək lazımdır: `URLEncoding` sonuncu qrupu tam 4 simvol gözləyir və natamam qrupun başladığı 36-cı indeksdə xəta verir, `RawURLEncoding` isə mətni düzgün açır.

> **Bilgi:** Login zamanı verilən JWT tokenlərinin hissələri məhz `RawURLEncoding` ilə kodlaşdırılır: onları linkə və HTTP başlığına əlavə dəyişiklik etmədən qoymaq olur.
