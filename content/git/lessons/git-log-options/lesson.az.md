Əvvəlki dərsdə `git log` bütün tarixçəni göstərdi. Tarixçə uzananda orada lazım olan commit-i tapmaq çətinləşir. `git log`-un seçimləri çıxışı qısaldır və filtrləyir: yalnız bir müəllifin commit-lərini, bir tarix aralığını, bir faylı dəyişən və ya müəyyən sözü əlavə edən commit-ləri göstərir.

Nümunə oyun gecəsi üçün repository-dir: `rules.md`-də qaydalar, `snacks.txt`-də qəlyanaltılar yazılıb. Altı commit var, onları Sam və Ayla yazıb.

## Bir sətirdə və qraf şəklində {#oneline}

`--oneline` hər commit-i bir sətirdə göstərir: qısa hash və mesajın ilk sətri. Müəllif və tarix görünmür, amma bütün tarixçə bir ekrana sığır. Ən yeni commit yuxarıdadır.

`--graph` sətirlərin solunda commit qrafını çəkir. Burada hər commit üçün bir `*` var, çünki tarixçə düz xəttdir. Branch-lar olanda `--graph` budaqları və birləşmələri xətlərlə göstərir, onda bu seçim daha faydalı olur.

## Müəllifə görə {#author}

`--author` yalnız müəllifi verilən mətnə uyğun gələn commit-ləri göstərir. Git mətni müəllifin adı və email-i ilə, yəni `Ayla Karimova <ayla@example.com>` ilə müqayisə edir. Tam ad lazım deyil: `Ayla` kifayətdir.

Burada `--oneline` yoxdur, ona görə çıxış adi `git log` formatındadır. `Author` sətirlərində hər iki commit-in Ayla-ya aid olduğu görünür.

## Tarixə görə {#dates}

`--since` verilən tarixdən sonrakı, `--until` isə ona qədərki commit-ləri göstərir. Birinci komanda 10 yanvardan sonrakı iki commit-i tapdı: `Date` sətirlərində 11 və 12 yanvar görünür. İkinci komanda iki sərhədi birləşdirir: 7 ilə 10 yanvar arasındakı commit-lər. Nisbi tarix də yazmaq olar: `--since="2 weeks ago"`.

Git burada commit-in committer tarixinə baxır, `Date` sətri isə author tarixidir. Adətən ikisi eynidir.

> **Diqqət:** saatsız tarixdə Git saatı indiki vaxtdan götürür. `--since="2026-01-10"` saat 15:00-da işə salınsa, sərhəd 10 yanvar 15:00 olur və həmin günün səhər commit-ləri görünmür. Günün əvvəlindən saymaq üçün saatı da yazın: `--since="2026-01-10 00:00"`.

## Fayla görə və diff ilə {#path}

`--`-dan sonra fayl adı yazanda `git log` yalnız həmin faylı dəyişən commit-ləri göstərir. `snacks.txt`-i üç commit dəyişib. Yalnız `rules.md`-yə toxunan commit-lər siyahıda yoxdur.

`--` seçimləri fayl adlarından ayırır. Fayl silinib diskdə olmayanda o lazımdır: onsuz Git adı tanımır və xəta verir.

`-p` (*patch*) hər commit-in altına onun diff-ini əlavə edir. Diff-i `git diff` dərslərindən tanıyırıq: `pizza` silinib, `tacos` əlavə olunub. Commit-in mesajı bunu demir, diff isə dəqiq göstərir. `-1` yalnız ən yeni bir commit-i göstərir, `-3` isə üç commit-i (`-n 3` ilə eynidir).

> **Bilgi:** `-p` uzun çıxış verir. Onu say limiti və ya fayl adı ilə birlikdə işlədin.

## Mətnə görə: -S {#search}

`-S "pizza"` commit-lərin diff-ində axtarır və bu sözün faylda neçə dəfə keçdiyini dəyişən commit-ləri göstərir. `Add pizza to snacks` sözü əlavə edib, `Swap the main snack` isə silib. İkinci commit-in mesajında `pizza` yoxdur: `-S` mesajda yox, faylların məzmununda axtarır. Sözün nə vaxt yarandığını və ya yox olduğunu belə tapmaq olur.

Sözü olan sətri dəyişən, amma sözün sayını dəyişməyən commit (`pizza: 2`-ni `pizza: 3` etmək) burada görünmür.

Son komanda seçimləri birləşdirir: Sam-ın `rules.md`-ni dəyişən commit-ləri. Commit siyahıya düşmək üçün bütün filtrlərə uyğun gəlməlidir.

> **Bilgi:** commit mesajında axtarmaq üçün `--grep` var: `git log --grep="snack"`.
