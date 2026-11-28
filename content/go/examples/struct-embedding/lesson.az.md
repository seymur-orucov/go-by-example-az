Struct-ın içinə başqa tipi sahə adı olmadan yazmaq olar, buna embedding (daxiletmə) deyilir. Daxil edilən tipin sahələri və metodları xarici tipə keçir, beləcə ortaq hissəni bir dəfə yazıb bir neçə tipdə istifadə edirik. Embedding varislik (inheritance) deyil, tərkibdir (composition): müştərinin ünvanı var, amma müştəri ünvan deyil.

Bu dərsdə çatdırılma xidməti üçün etiketlər çap edirik: həm müştərinin, həm də anbarın ünvanı var.

## Tipi daxil etmək {#embed}

`Address` adi struct-dır, `Label` metodu ünvanı bir sətirdə qaytarır. `Customer`-də isə `Address` sahə adı olmadan yazılıb. İndi `mia.City` `mia.Address.City`-nin qısa formasıdır, `Address`-in metodu da `mia.Label()` kimi çağırılır. Daxil edilmiş sahənin adı elə tipin adıdır, ona görə literal-da onu `Address: Address{...}` kimi veririk.

## Metodu gizlətmək {#override}

`Warehouse` da `Address`-i daxil edir, amma onun öz `Label` metodu var. Belə olanda `depot.Label()` xarici tipin metodunu çağırır, daxili metod gizlənir (eyni adlı sahələr üçün də belədir). Daxili metod itmir, ona tam yolla çatmaq olar: `depot.Address.Label()`. Anbarın metodu da məhz bunu edir və ünvanın qarşısına anbar kodunu əlavə edir.

> **Diqqət:** Daxili tip xarici tipi tanımır. `Address`-in başqa metodu içəridə `a.Label()` çağırsa, `depot` üçün də `Address.Label` işləyir, `Warehouse.Label` yox.

## Embedding və interface {#interface}

`Labeler` interface-i `Label() string` metodunu tələb edir. `Customer` bu metodu `Address`-dən alıb, `Warehouse`-un isə öz metodu var, ona görə hər ikisi `[]Labeler` slice-ına düşür. Dövrdə hər dəyər üçün öz `Label` metodu çağırılır.

> **Diqqət:** Embedding varislik deyil: `var a Address = mia` kompilyasiya olunmur. Daxili dəyər lazımdırsa, onu açıq götürün: `mia.Address`.
