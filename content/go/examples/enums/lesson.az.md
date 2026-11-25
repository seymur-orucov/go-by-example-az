Enum (sadalama) bir neçə sabit variantdan biri ola bilən dəyərdir: həftənin günləri, svetoforun rəngləri, sifarişin vəziyyəti. Go-da `enum` açar sözü yoxdur. Əvəzində öz tipimizi yaradırıq və onun mümkün dəyərlərini `const` blokunda sadalayırıq. Adi `int` sabitlərindən fərqi odur ki, dəyərin tipi onun nə olduğunu deyir və o, təsadüfi ədədlərlə qarışmır.

Bu dərsdə paltaryuyan maşının proqram mərhələlərini təsvir edirik.

## iota ilə sabitlər {#iota}

`type Stage int` mərhələ tipidir. `const` blokunda `iota` `0`-dan başlayır və hər yeni sətirdə bir artır. `Idle Stage = iota` yazmaq kifayətdir: növbəti sətirlər həm tipi, həm ifadəni təkrarlayır, ona görə `Washing` `1`, `Done` isə `4` olur. `main`-də rəqəmləri `int(...)` ilə çap edirik, çünki növbəti addımdakı metod çap formasını dəyişir.

`Stage` tipli sabiti başqa tipli dəyişənə yazmaq olmaz. Amma sabitlər dərsindən bildiyimiz kimi, tipsiz ədəd, məsələn `2`, `Stage` gözlənilən yerə avtomatik keçir.

## String metodu {#string}

`fmt.Println` `String() string` metodu olan dəyəri rəqəmlə yox, bu metodun qaytardığı mətnlə çap edir. Bu, interface-lər dərsindəki qaydadır: `fmt` package-indəki `Stringer` interface-i məhz bu metodu tələb edir və `Stage` onu avtomatik ödəyir. `Stage(7)` mövcud mərhələ deyil, ona görə `switch` `"unknown"` qaytarır.

## Növbəti mərhələ {#next}

`Next` mərhələni bir artırır: `s + 1` də `Stage` tiplidir. `Done`-dan sonra mərhələ yoxdur, ona görə `Done` özünü qaytarır. `main`-dəki `for` dövrü `Idle`-dan başlayıb bütün proqramı keçir. Sabitlər ardıcıl olduğu üçün ortaya yeni mərhələ əlavə etsək, `Next` dəyişmədən işləyəcək.

> **Diqqət:** Tipin zero value-su `0`-dır, yəni `var s Stage` `Idle` olur. Ona görə ilk sabitə həqiqətən başlanğıc vəziyyətin adını verin.
