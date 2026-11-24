`switch` bir dəyəri bir neçə variantla müqayisə edir və uyğun gələni işlədir. Eyni dəyişəni `if / else if` zənciri ilə dəfələrlə yoxlamaq əvəzinə, variantları səliqəli siyahı kimi yazırıq: gün adına görə iş saatı, janra görə rəf, say görə mesaj.

Bu dərsdə kitabxananın işini təsvir edirik. `if` zənciri hər şərti ayrıca yoxlayır, `switch` isə bir dəyərə baxıb ona uyğun yolu seçir, ona görə seçim çoxdursa kod daha oxunaqlı olur.

## Dəyərə görə seçim {#value}

`switch day` `day`-i yuxarıdan aşağı hər `case` ilə müqayisə edir; uyğun gələn ilk `case` işləyir və `switch` bitir. Heç biri uyğun gəlmirsə `default` bloku işləyir, onu yazmaq məcburi deyil. Burada `day` `"Saturday"`-dir, ona görə şənbə saatları çap olunur. Mətn müqayisəsi böyük-kiçik hərfə həssasdır: `"saturday"` `"Saturday"`-ə bərabər deyil.

> **Bilgi:** C və Java-dan fərqli olaraq burada `break` yazmaq lazım deyil: bir `case` işləyib bitəndən sonra `switch` özü dayanır. Növbəti `case`-in koduna da keçmək istəsəniz, `fallthrough` yazılır, amma bu nadir lazım olur.

## Bir case-də bir neçə dəyər {#multi}

Eyni nəticə verən dəyərlər vergüllə ayrılıb bir `case`-də yazılır: `case "novel", "novella", "short story"` bunlardan hər hansı biri uyğun gələndə işləyir. Eyni kodu üç ayrı `case`-də təkrarlamaqdan daha qısadır.

> **Diqqət:** eyni sabit dəyəri iki `case`-də yazmaq (məsələn, `"novel"`-i iki dəfə) kompilyasiya xətasıdır.

## İfadəsiz switch {#cond}

`switch`-dən sonra dəyər yazılmasa, hər `case` ayrıca şərt olur. Bu, `if / else if` zəncirinin səliqəli variantıdır və aralıq yoxlamaları (`<`, `>`) üçün əlverişlidir. Şərtlər yuxarıdan aşağı yoxlanır və ilk doğru olan işləyir: oxucu 3 kitab götürüb, `books == 0` yalandır, `books < 5` doğrudur, deməli yenisini götürə bilər.
