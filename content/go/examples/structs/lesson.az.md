Struct bir-biri ilə əlaqəli bir neçə dəyəri bir yerə yığan tipdir. Bağlamanın nömrəsi, getdiyi şəhər, çəkisi və çatdırılıb-çatdırılmadığı ayrı-ayrı dəyişənlərdə dağınıq qalsa, onları qarışdırmaq asandır. Struct bu dəyərləri adlı sahələr (field) kimi bir yerdə saxlayır. Array və slice eyni tipli elementləri nömrə ilə saxlayır, struct isə müxtəlif tipli sahələri adla.

Bu dərsdə poçt xidməti üçün bağlamaları (parcel) təsvir edirik.

## Tip elan etmək {#define}

`type Parcel struct { ... }` yeni tip yaradır: hər sahənin adı və tipi var. Sahə adları böyük hərflə başlayır: belə sahələr başqa package-lərdən də görünür (exported). `Parcel{ID: "P-101", ...}` struct literal-dır, sahələrə isə nöqtə ilə müraciət olunur: `box.City`. `fmt.Println` struct-ı fiqurlu mötərizədə, sahələrin dəyərləri ilə elan sırasına görə çap edir.

## Zero value və natamam literal {#zero}

`var empty Parcel` hər sahəni öz zero value-su ilə doldurur: `0`, `false`, boş string. Literal-da yazılmayan sahələr də belədir: məktubun (`letter`) çəkisini vermədik, ona görə `WeightKg` `0` oldu. Sahə adları ilə yazılan literal-da sahələrin sırası fərq etmir.

> **Diqqət:** Adsız literal da var: `Parcel{"L-7", "Oslo", 0, false}`. Orada bütün sahələr elan sırası ilə yazılmalıdır və struct-a yeni sahə əlavə olunanda belə kod kompilyasiya olunmur.

## Struct dəyərdir {#copy}

`redirected := box` bütün sahələrin surətini çıxarır, ona görə `redirected.City`-ni dəyişmək `box`-a toxunmur. Funksiyaya ötürəndə və `range` ilə gəzəndə də surət alınır. Struct-ları `==` ilə bütövlükdə müqayisə etmək olar: şəhərlər fərqli olduğu üçün nəticə `false`-dur. Sahələrdən biri slice, map və ya funksiya olanda isə `==` kompilyasiya olunmur.

## Struct pointer-i {#pointer}

Orijinal struct-ı başqa yerdən dəyişmək üçün onun ünvanı lazımdır: `ptr := &box`. Sahəyə çatmaq üçün `(*ptr).Delivered` yazmaq lazım deyil, Go `ptr.Delivered`-i özü belə başa düşür. Struct-ı dəyişən funksiyalar da adətən `*Parcel` qəbul edir.

## Struct-lardan ibarət slice {#slice}

`[]Parcel` adi slice-dır, sadəcə elementləri struct-dır. Literal-ın içində elementin tipini təkrar yazmaq lazım deyil: `{ID: "P-102", ...}` kifayətdir. `range` hər dövrdə `p`-yə elementin surətini verir; çəkiləri toplamaq üçün bu kifayətdir.

> **Diqqət:** Dövrün içində `p.WeightKg = 0` yazmaq slice-ı dəyişməz, çünki `p` surətdir. Elementi dəyişmək üçün indeksdən istifadə edin: `route[i].WeightKg = 0`.
