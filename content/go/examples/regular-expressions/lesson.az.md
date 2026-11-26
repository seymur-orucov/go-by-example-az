Requlyar ifadə (regular expression, qısaca regexp) mətnin formasını təsvir edən kiçik dildir: "2–5 böyük hərf, defis, sonra rəqəmlər". `strings` paketinin funksiyaları konkret mətni axtarır (`"fix"` sözü varmı?), regexp isə bu formaya uyğun istənilən mətni tapır: hər hansı tapşırıq nömrəsi, telefon nömrəsi, poçt indeksi. Go-da bunun üçün `regexp` paketi var.

Komandalar tapşırıqları (ticket) tracker-də `PAY-142` kimi açarlarla izləyir və commit mesajlarında bu açarları yazır. Bu dərsdə belə açarları yoxlayırıq, commit mesajından çıxarırıq, layihə adına və nömrəyə bölürük və tracker-in səhifə linklərinə çeviririk.

## Pattern və MatchString {#match}

`regexp.MustCompile` pattern-i kompilyasiya edir, yəni axtarışa hazır `*regexp.Regexp` dəyərinə çevirir; bunu bir dəfə edib dəfələrlə istifadə edirik. Pattern backtick-lər içində yazılıb: bu, raw string literal-dır və onun içində `\` xüsusi simvol deyil, ona görə `\d` olduğu kimi pattern-ə çatır.

Pattern-in hissələri: `[A-Z]` bir böyük hərf, `{2,5}` əvvəlki hissə 2-dən 5-ə qədər dəfə, `-` adi defis, `\d` bir rəqəm, `+` əvvəlki hissə bir və ya daha çox dəfə, `^` və `$` isə mətnin əvvəli və sonu. `MatchString` mətn pattern-ə uyğundursa `true` qaytarır: kiçik hərfli `pay-142` və defissiz `PAY142` keçmir.

> **Diqqət:** `^` və `$` olmasa, `MatchString` uyğunluğu mətnin istənilən hissəsində axtarır və `PAY-142!` üçün də `true` qaytarardı.

## Mətndə axtarış {#find}

Commit mesajında açarlar sətrin ortasındadır, ona görə burada `^` və `$` yoxdur. `FindString` ilk uyğun hissəni qaytarır (heç nə tapılmasa, boş string), `FindAllString` isə hamısını slice kimi. İkinci arqument ən çox neçə nəticə lazım olduğunu deyir, `-1` "hamısı" deməkdir. `A-12`-də yalnız bir hərf olduğu üçün o, siyahıya düşmür.

> **Bilgi:** Sabit sözü axtarmaq üçün regexp lazım deyil: `strings.Contains(commit, "fix")` daha sadədir və daha sürətli işləyir. Regexp-i mətnin forması vacib olanda seçin.

## Qruplar {#groups}

Mötərizə pattern-in bir hissəsini qrupa (group) ayırır. `FindStringSubmatch` ilk uyğunluq üçün slice qaytarır: 0-cı element bütün uyğun mətndir, sonrakılar qrupların dəyərləridir, soldan sağa. Beləcə `PAY-142` açarını layihəyə (`PAY`) və tapşırığın nömrəsinə (`142`) ayırırıq. Uyğunluq yoxdursa, nəticə `nil`-dir, ona görə `m[1]`-ə müraciət etməzdən əvvəl bunu yoxlamaq lazımdır.

## Əvəzetmə {#replace}

Buraxılış qeydlərində (release notes) hər açar tracker-dəki səhifəsinə aparmalıdır. `ReplaceAllString` hər uyğunluğu ikinci arqumentdəki mətnlə əvəz edir, orada `$1` və `$2` uyğun qrupların dəyəridir. Beləcə `PAY-142` `/issues/PAY/142` olur, pattern-ə uyğun gəlməyən hissələr isə olduğu kimi qalır.

> **Diqqət:** `$1`-dən sonra hərf, rəqəm və ya `_` gəlirsə, Go onu qrup adının davamı sayır: `"$1_$2"` `1_` adlı qrupu axtarır, yerinə boş string qoyur və `PAY_142` əvəzinə `142` alınır. Belə halda `"${1}_$2"` yazın.

## Compile və xəta {#compile}

Pattern kodda yazılıbsa, səhvi yalnız proqramçı edə bilər, ona görə `MustCompile` rahatdır: səhv pattern-də proqram dərhal panic ilə dayanır. Pattern kənardan gəlirsə (istifadəçinin axtarış sahəsinə yazdığı filtr, konfiqurasiya faylı), `regexp.Compile` istifadə olunur: o, `*regexp.Regexp` və `error` qaytarır, proqram isə xətanı göstərib işləməyə davam edir. Burada istifadəçi `)`-ni unudub və xəta mətni problemin nə olduğunu deyir.
