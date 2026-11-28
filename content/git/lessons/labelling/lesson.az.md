Issue-lar çoxaldıqca hansının xəta, hansının yeni fikir olduğunu ayırmaq çətinləşir. **Etiket** (label) issue-ya qoyulan qısa işarədir, məsələn `bug` və ya `enhancement`: onunla issue-ları qruplaşdırıb lazım olanları bir siyahıda görmək olur. Pull request-lərdə (PR) etiketlər eyni cür işləyir.

Nümunə Sam-ın (`sam-lee`) könüllülərlə saxladığı `bike-stations` tətbiqidir: o, şəhər stansiyalarında boş velosipedləri göstərir və repository-də çoxlu açıq issue yığılıb.

## Etiket nədir {#what-is-a-label}

Etiketin üç hissəsi var: ad, rəng və qısa təsvir. Rəng siyahıda etiketi tez tanımaq üçündür. Təsvir isə etiketin nə vaxt qoyulduğunu izah edir. Bir issue-da bir neçə etiket ola bilər, məsələn `bug` və `good first issue`.

Hər yeni repository-də GitHub hazır etiketlər yaradır:

- `accessibility`: əlilliyi olan insanlar üçün maneə
- `bug`: gözlənilməyən xəta
- `documentation`: sənədləşməyə düzəliş və ya əlavə lazımdır
- `duplicate`: oxşar issue artıq var
- `enhancement`: yeni imkan istəyi
- `good first issue`: ilk dəfə töhfə verən üçün uyğun iş
- `help wanted`: layihəni saxlayan kömək istəyir
- `invalid`: issue, PR və ya discussion artıq aktual deyil
- `question`: əlavə məlumat lazımdır
- `wontfix`: bu iş görülməyəcək

Bu etiketləri dəyişmək və silmək olar. Etiketlər repository-yə aiddir: `bike-stations`-da dəyişilən etiket Sam-ın başqa repository-lərinə təsir etmir.

## Issue-ya etiket qoymaq və yeni etiket yaratmaq {#apply-and-create}

Etiket issue-nun sağ panelində qoyulur. Sam issue-nu açır, paneldə **Labels**-ə basır və siyahıdan etiketi seçir. Etiket həmin paneldə və issue siyahısında görünür.

Standart etiketlər hər şeyi əhatə etmir. `bike-stations`-da çox issue stansiya məlumatının səhv olmasından gəlir: velosiped sayı düz deyil, stansiya bağlanıb. Sam bunlar üçün ayrı etiket yaradır. **Issues** səhifəsində siyahının üstündəki **Labels**-ə, sonra **New label**-ə basır. **Label name** sahəsinə `station-data`, **Description** sahəsinə qısa izah yazır. Rəngi hex kodu ilə dəyişmək olar, yanındakı düymə isə təsadüfi rəng seçir. **Create label** ilə etiket yaranır.

> **Bilgi:** etiket yaratmaq üçün repository-də write icazəsi lazımdır, etiket qoymaq üçün isə triage icazəsi kifayətdir. Triage icazəsi ilə issue və PR-ları idarə etmək olur, kodu dəyişmək olmur. Ona görə kənar könüllü öz issue-suna etiketi özü qoya bilmir. Bunu Sam və komandası edir.

## Etiketə görə filtrləmək {#filter}

Issue siyahısının üstündə axtarış sahəsi var. Orada adətən `is:issue state:open` yazılıb, yəni yalnız açıq issue-lar göstərilir. Sam sona `label:bug` əlavə edir və siyahıda yalnız xətalar qalır. Siyahıda bir issue-nun etiketinə basmaq da eyni filtri qurur.

Bir neçə etiket də işlətmək olar:

- `label:bug label:station-data`: hər iki etiketi olan issue-lar
- `label:bug,station-data`: bu etiketlərdən ən azı biri olan issue-lar
- `-label:wontfix`: bu etiketi olmayan issue-lar; `-` filtri tərsinə çevirir
- `label:"help wanted"`: adında boşluq olan etiket dırnaq içində yazılır

Bu sorğular PR siyahısında da işləyir. **Labels** düyməsindən etiketi siyahıdan seçmək də olar, sorğunu əl ilə yazmaq lazım deyil.

## Yeni gələnlər üçün etiketlər {#newcomers}

`good first issue` başlanğıc üçün uyğun işi göstərir: kiçikdir, layihəni dərindən bilmək tələb etmir. `help wanted` isə komandanın bu işə kömək gözlədiyini deyir. Açıq mənbə layihələrinin çoxu bu iki etiketi işlədir. Yeni könüllülər iş axtaranda `label:"good first issue"` ilə axtarır.

Sam stansiya siyahısının başlığındakı yazı səhvini düzəltmək üçün issue açıb. İş bir sətirlikdir, ona görə ona `good first issue` qoyur. Issue-ya hansı faylın dəyişəcəyini də yazır: belə yeni gələn haradan başlayacağını bilir.

Public repository-də `good first issue` etiketi issue-nun GitHub-da başqa yerlərdə də göstərilmə ehtimalını artırır. Hansı issue-nun göstəriləcəyini GitHub-un öz alqoritmi seçir, etiket bunu zəmanət etmir.
