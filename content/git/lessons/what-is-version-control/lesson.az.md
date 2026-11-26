**Version control** (versiyalara nəzarət) layihədəki hər dəyişikliyi yadda saxlayan sistemdir: nə dəyişib, kim dəyişib, nə vaxt və niyə. Onun sayəsində istənilən köhnə vəziyyətə qayıtmaq, iki versiyanı müqayisə etmək və bir neçə nəfərin eyni fayllar üzərində işləməsi mümkün olur.

Version control yalnız proqramçılar üçün deyil, amma kod üçün demək olar ki, məcburidir. Bu kursda Git-i öyrənəcəyik. Git ən çox istifadə olunan version control sistemidir.

## Surətlər problemi {#copies}

Deyək ki, ailənin resept kitabını bir faylda yazırsınız. Hər böyük dəyişiklikdən əvvəl "nə olar, olmaz" deyə faylın surətini çıxarırsınız. Bir neçə həftə sonra qovluqda belə fayllar yığılır. Hansı sonuncudur? Tort reseptindəki şəkər miqdarını kim və nə vaxt dəyişib? Bu suallara fayl adları cavab vermir.

> **Diqqət:** surətlər qovluğu kiçik layihədə də tez qarışır. İki nəfər eyni faylın surətini ayrı-ayrı redaktə edəndə işi birləşdirmək əl ilə, sətir-sətir müqayisə tələb edir.

## Tarixçə: hər dəyişiklik bir snapshot {#history}

Version control-da fayl bir dənədir: `recipes.md`. Surət çıxarmaq əvəzinə dəyişikliyi **yadda saxlayırsınız** (Git-də buna *commit* deyilir). Hər yadda saxlama layihənin həmin andakı tam vəziyyətidir, yəni *snapshot*. Onun müəllifi, vaxtı və qısa izahı olur: "Add cake recipe", "Reduce sugar in cake".

Snapshot-lar zəncir kimi düzülür, ona görə tarixçəni əvvəldən axıra oxumaq olur. Qovluqda isə həmişə yalnız son versiya görünür, köhnələr qarışıqlıq yaratmır.

## Nə üçün lazımdır {#why}

Tarixçə olanda gündəlik işdə dörd şey asanlaşır:

- **Səhvi geri almaq**: dünən işləyən versiyaya bir komanda ilə qayıtmaq olur.
- **Müqayisə**: iki snapshot arasında hansı sətirlərin dəyişdiyini görmək olur.
- **Səbəbi tapmaq**: hər dəyişikliyin müəllifi və izahı olduğu üçün "bu sətir niyə belədir?" sualının cavabı tarixçədədir.
- **Komanda işi**: hər kəs öz dəyişikliyini edir, sistem onları birləşdirməyə kömək edir.

Bundan başqa, eksperiment təhlükəsiz olur: yeni ideyanı ayrıca sınayıb, alınmasa, heç nə itirmədən ondan imtina etmək olur.

## Mərkəzləşmiş və paylanmış {#models}

Version control sistemləri tarixçəni harada saxladığına görə iki cür olur. **Mərkəzləşmiş** (centralized) sistemdə tarixçə yalnız serverdədir. Hər kəsin kompüterində faylların son versiyası olur, yadda saxlamaq üçün serverə qoşulmaq lazımdır.

**Paylanmış** (distributed) sistemdə hər iştirakçının kompüterində bütün tarixçənin tam surəti var. Git paylanmış sistemdir: commit internetsiz də işləyir, server isə dəyişiklikləri paylaşmaq üçün ortaq yer olur. Bu iki modelin fərqlərini növbəti dərsdə ətraflı müqayisə edəcəyik.
