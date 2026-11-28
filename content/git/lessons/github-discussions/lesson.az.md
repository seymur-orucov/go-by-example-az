Issue görüləcək işi izləyir: düzəldiləcək xətanı, bitəcək tapşırığı. İnsanlar isə issue-ya sual və fikir də yazır, real xətalar bunların arasında itir. **GitHub Discussions** repository-yə ayrıca forum əlavə edir: suallar və ideyalar orada yazılır, issue-lar iş üçün qalır.

Nümunə Ayla-nın açıq mənbəli `pixel-paint` proqramıdır (piksel şəkil çəkmək üçün): istifadəçilər ona "GIF-i necə export edim?" kimi suallarla issue açır.

## Issue, yoxsa discussion {#issue-or-discussion}

Ayla-nın issue siyahısında üç cür yazı var. "Undo crashes after 50 steps" xətadır: onu düzəltmək lazımdır və iş bitəndə issue bağlanır. "How do I export a GIF?" sualdır: onu düzəltmək lazım deyil, cavab vermək lazımdır. "Add a dark theme" ideyadır: hələ heç kim onu görməyə söz verməyib.

Sadə qayda belədir:

- **Issue**: görüləcək konkret iş. Xəta, tapşırıq, artıq qəbul edilmiş təklif.
- **Discussion**: işə çevrilməyən söhbət. Sual, ideya, elan, sorğu, kiminsə proqramla etdiyi iş.

İdeya müzakirədə aydınlaşanda və konkret işə çevriləndə ondan issue yaradılır. Bunu son addımda görəcəyik.

## Discussions-u aktivləşdirmək {#enable}

Discussions hər repository-də ayrıca açılır. Bunu repository sahibi və ya write icazəsi olan adam edə bilər. Ayla `pixel-paint`-də **Settings** səhifəsini açır və **Features** bölməsinə enir. Orada **Discussions** seçimini işarələyir və **Set up discussions** düyməsini basır.

Discussions ilk dəfə açılanda GitHub salamlama yazısı yaratmağı təklif edir. Ayla hazır mətni öz layihəsinə uyğun dəyişir və **Start discussion** basır. Bundan sonra repository-də **Discussions** tab-ı görünür. Maket sadələşdirilib, real səhifədə seçimlər çoxdur.

## Kateqoriyalar {#categories}

Discussion-lar kateqoriyalara bölünür. Yeni Discussions-da altı kateqoriya hazır olur: **Announcements**, **General**, **Ideas**, **Polls**, **Q&A** və **Show and tell**. Discussion açan adam kateqoriya seçir. Sonra onu başqa kateqoriyaya köçürmək də olar.

Kateqoriyanın formatı discussion-un necə işlədiyini müəyyən edir:

- **Open-ended discussion**: adi söhbət. General, Ideas və Show and tell bu formatdadır.
- **Question and Answer**: bir şərhi cavab kimi işarələmək olur. Q&A bu formatdadır.
- **Announcement**: yeni discussion-u yalnız maintain və ya admin icazəsi olanlar açır, şərhi hamı yazır. Announcements bu formatdadır.
- **Polls**: bir neçə variantı olan sorğu, insanlar səs verir.

Kateqoriyaları dəyişmək, silmək və yenisini əlavə etmək olar, bir repository-də 25-ə qədər. Bunun üçün sol paneldə **Categories** yanındakı qələm ikonuna basılır, sonra **New category**.

## Sualı cavablandırmaq {#answer}

Bir istifadəçi Q&A kateqoriyasında soruşur: "How do I export a GIF?". Ayla cavab yazır: **File** → **Export** → **GIF**. Sual verən adam bu şərhin altında **Mark as answer** basır.

GitHub işarələnmiş şərhi və ona yazılan cavabları vurğulayır. Discussion cavablanmış sayılır. Eyni sualla gələn növbəti adam cavabı şərhlər arasında axtarmır.

Cavabı discussion-un müəllifi işarələyə bilər. Triage və ya daha yüksək icazəsi olanlar da işarələyə bilər, yəni Ayla da. Fikir dəyişsə, **Unmark as answer** işarəni götürür. **Mark as answer** yalnız Question and Answer formatlı kateqoriyada var.

## Issue-nu discussion-a çevirmək {#convert}

Discussions açılmamışdan əvvəl yazılan sual-issue-lar siyahıda qalıb. Ayla onları əl ilə köçürmür. Issue-nu açır və sağ paneldə **Convert to discussion** basır. **Choose a category** menyusundan kateqoriya seçir, məsələn Q&A. Sonda **I understand, convert this issue to a discussion** düyməsini basır. Discussion issue-nun mətni ilə avtomatik yaranır.

Əks istiqamət də var. Ideas-dakı "Add a dark theme" müzakirədə aydınlaşır və Ayla onu görməyə qərar verir. Discussion-un sağ panelində **Create issue from discussion** basır. Yeni issue-nun mətninə discussion-un mətni avtomatik yazılır, etiketlər saxlanır. Discussion silinmir və issue-ya çevrilmir, yerində qalır.

> **Bilgi:** hər iki əməliyyat üçün repository-də ən azı **triage** icazəsi lazımdır. Bu icazə ilə issue və discussion-ları idarə etmək olur, kodu dəyişmək olmur. İcazə səviyyələrini "Collaborator-lar" dərsində keçəcəyik.
