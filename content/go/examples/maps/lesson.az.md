Map açarları dəyərlərlə əlaqələndirir: telefon kitabçasında ad nömrəyə, lüğətdə söz tərcüməyə, anbarda məhsul onun sayına bağlıdır. Slice-da elementi mövqeyinə görə (`cart[0]`) tapırıq, map-də isə açara görə (`stock["milk"]`) və bunun üçün bütün elementləri gəzmək lazım olmur.

Bu dərsdə kiçik mağazanın anbarını izləyirik: açar məhsulun adı, dəyər isə anbarda neçə ədəd qaldığıdır. Məhsul adları koddakı kimi ingiliscədir: `milk` (süd), `flour` (un), `honey` (bal), `butter` (yağ).

## Map literal {#literal}

`map[string]int` — açarı `string`, dəyəri `int` olan map. Literalda hər cüt `açar: dəyər` kimi yazılır. `len` cütlərin sayını, `stock["milk"]` isə həmin açarın dəyərini qaytarır.

> **Bilgi:** `fmt` map-i açarlara görə sıralanmış çap edir ki, nəticə oxunaqlı olsun. Map-in özündə isə sıra yoxdur, elementləri "birinci", "ikinci" deyə saymaq olmaz.

## Əlavə və dəyişmə {#set}

`stock["honey"] = 8` yeni açar əlavə edir. Açar artıq varsa, eyni yazılış onun dəyərini yeniləyir: `stock["milk"] -= 5` 5 ədəd `milk` satıldığını qeyd edir. Bir açar map-də yalnız bir dəfə ola bilər.

## Olmayan açar {#missing}

Map-də olmayan açarı oxusaq, xəta yaranmır — dəyərin zero value-su qayıdır, `int` üçün `0`. Amma `0` iki şey deyə bilər: "`butter` qurtarıb" və ya "anbarda belə məhsul heç olmayıb".

Fərqi bilmək üçün ikinci dəyəri də götürürük: `n, ok := stock["butter"]`. `ok` açar varsa `true`, yoxdursa `false` olur. Bu yazılışa "comma ok" deyilir və Go-da tez-tez rast gəlinir.

## delete {#delete}

`delete(stock, "flour")` açarı dəyəri ilə birlikdə silir və `len` bir azalır. Olmayan açarı silmək də təhlükəsizdir: heç nə baş vermir.

## make və sayğac {#make}

Boş map-i `make(map[string]int)` ilə yaradırıq. Olmayan açar `0` qaytardığı üçün `sold["milk"]++` ilk dəfə də işləyir: `0`-dan `1`-ə qalxır. Satışları saymaq, sözləri saymaq kimi işlər bu yolla bir sətirdə yazılır.

> **Diqqət:** `var sold map[string]int` yazsaq, map `nil` olur: onu oxumaq olar, amma ora yazmaq proqramı panic ilə dayandırır. Yazacağınız map-i `make` və ya literal ilə yaradın.
