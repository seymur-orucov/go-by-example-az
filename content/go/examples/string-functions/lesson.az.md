İstifadəçinin yazdığı mətn nadir hallarda səliqəli olur: əvvəlində boşluq qalır, hərflər gah böyük, gah kiçik yazılır, siyahılar vergüllə bir sətirdə gəlir. Standart `strings` package-i belə mətni təmizləmək, onda axtarmaq, onu hissələrə bölmək və yenidən birləşdirmək üçün hazır funksiyalar verir. Əvvəlki dərslərdə mətni `range` ilə hərf-hərf özümüz gəzirdik; çox vaxt isə lazım olan iş artıq bir funksiya çağırışıdır.

Bu dərsdə konfrans qeydiyyatı formunu emal edirik: e-poçt, maraq teqləri, ad, telefon və endirim kodu.

## Təmizləmək {#clean}

`strings.TrimSpace` mətnin əvvəlindən və sonundan boşluqları, tab və sətir sonu simvollarını atır, `strings.ToLower` isə bütün hərfləri kiçik edir. Kvadrat mötərizələr çıxışda boşluğun qalmadığını göstərir. Go-da string dəyişməzdir, ona görə bu funksiyalar `raw`-a toxunmur, həmişə yeni string qaytarır: `raw` yenə 26 baytdır. Nəticəni saxlamaq üçün onu dəyişənə yazmaq lazımdır.

> **Diqqət:** `strings.ToLower(email)` yazıb nəticəni heç yerə yazmasanız, kod kompilyasiya olunur, amma `email` dəyişmir.

## Axtarmaq {#search}

`strings.Contains` mətnin içində alt sətrin olub-olmadığını, `strings.Index` isə onun ilk dəfə başladığı bayt indeksini qaytarır; tapılmasa, `-1`. `@`-ın indeksini bilərək domeni slice ilə kəsirik: `email[at+1:]`. `strings.HasSuffix` mətnin verilən sonluqla bitdiyini yoxlayır, burada tələbə endirimi üçün `.edu`; `strings.HasPrefix` eyni işi mətnin əvvəli üçün görür.

> **Diqqət:** `Index` `-1` qaytara bilər. `@` olmayan mətndə yoxlamadan `email[at+1:]` yazsanız, `email[0:]` alınar və bütün mətn "domen" kimi görünər.

## Bölmək və birləşdirmək {#split}

`strings.Split` mətni ayırıcıya görə slice-a bölür, ayırıcının ətrafındakı boşluqlara isə toxunmur: elementlər `"#go"`, `" #cloud "`, `"#databases"` olur. `strings.Trim` ikinci arqumentdəki simvolların hər birini mətnin hər iki kənarından atır, ona görə `" #"` həm boşluğu, həm `#`-ı təmizləyir. `strings.Join` əksini edir: slice-ı verilən ayırıcı ilə bir mətnə yığır.

`strings.Fields` mətni boşluqlara görə sözlərə bölür, bir neçə ardıcıl boşluğu isə bir ayırıcı sayır. Ona görə `"  Lena   Park "` iki sözə bölünür, eyni mətndə `Split(..., " ")` isə boş sətirlərlə dolu slice verərdi.

## Əvəz etmək və təkrarlamaq {#replace}

`strings.ReplaceAll` alt sətrin bütün rastlaşmalarını əvəz edir: telefondan tireləri atıb yalnız rəqəmləri saxlayırıq. `strings.Replace`-in son arqumenti neçə dəfə əvəz etməyi deyir: `1` yalnız birinci tireni dəyişir, `-1` isə hamısını, yəni `ReplaceAll` kimi işləyir. `strings.Repeat` mətni verilən sayda təkrarlayır: nişanda (badge) nömrənin son dörd rəqəmindən başqa hamısını ulduzla gizlədirik.

## Böyük-kiçik hərfə baxmadan müqayisə {#fold}

`==` sətirləri bayt-bayt müqayisə edir, ona görə `EarlyBird26` `EARLYBIRD26`-ya bərabər deyil. Endirim kodunda isə hərflərin necə yazıldığı fərq etməməlidir. `strings.EqualFold` hərf registrinə baxmadan müqayisə edir və bunu yeni string yaratmadan görür, ona görə iki tərəfi `ToLower` edib `==` ilə müqayisə etməkdən daha yaxşıdır.
