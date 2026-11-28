Metod receiver-i olan funksiyadır: receiver metodun aid olduğu dəyərdir və `func` ilə metodun adı arasında yazılır. Adi funksiya `long(road)` kimi çağırılır, metod isə dəyərin özündən: `road.Long()`. Package-də `long` adlı yalnız bir funksiya ola bilər, amma `Playlist`-in də, `Album`-un da öz `Long()` metodu ola bilər.

Nümunədə musiqi siyahısı (playlist) var: adı, mahnıları və ümumi müddəti.

## Value receiver {#value}

`func (p Playlist) Long() bool` metodunun receiver-i `p Playlist`-dir. Metodun içində `p` adi parametr kimidir, onun sahələrini oxumaq olar. `road.Long()` çağırışı `road`-un surətini `p`-yə verir; metod yalnız oxuyursa, bu kifayətdir. Siyahı hələ 40 dəqiqədir, ona görə ilk çağırış `false` qaytarır.

## Pointer receiver {#pointer}

`Add` siyahıya mahnı əlavə edir və çağıranın dəyərini dəyişməlidir, ona görə receiver `*Playlist`-dir. `road.Add(...)` yazanda Go `road`-un ünvanını özü götürür, `(&road).Add(...)` yazmaq lazım deyil. Əlavədən sonra müddət 65 dəqiqədir və `Long()` artıq `true` qaytarır. Praktikada tipin bir metodu pointer receiver istəyirsə, qalanları da pointer receiver ilə yazılır. Burada `Long` iki növü müqayisə etmək üçün value receiver ilə qalıb.

> **Diqqət:** `Add`-i `(p Playlist)` ilə yazsaq, kod kompilyasiya olunar, amma mahnı surətə əlavə olunar və `road` dəyişməz.

## Öz tipinə metod {#own-type}

Metodu yalnız struct-a yox, öz elan etdiyimiz istənilən tipə əlavə etmək olar. `type Minutes int` `int` üzərində qurulmuş yeni tipdir və `Length` sahəsi bu tipdədir, ona görə `road.Length.Split()` yazmaq olur. `int(m)` dəyəri yenidən `int`-ə çevirir, `Split` isə iki nəticə qaytarır: 65 dəqiqə 1 saat 5 dəqiqədir. `int` kimi hazır tiplərə isə metod əlavə etmək olmaz.
