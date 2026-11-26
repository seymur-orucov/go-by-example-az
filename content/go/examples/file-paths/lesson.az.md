Fayl yolu (path) faylın qovluqlar içində harada olduğunu göstərən mətndir: `photos/2026/summer/Beach.JPG`. Yolu adi string kimi `+` ilə yığmaq və ya kəsmək səhvlərə aparır: ayırıcı işarə əməliyyat sistemindən asılıdır (Linux və macOS-da `/`, Windows-da `\`), artıq və ya əksik `/` da asanlıqla yaranır. `path/filepath` paketi yolları sistemin qaydalarına uyğun yığır və hissələrə ayırır.

Bu dərsdə foto arxivi üçün yollarla işləyirik: şəklin yolunu qururuq, adını və uzantısını ayırırıq, kiçik önizləmə (thumbnail) faylının yolunu düzəldirik və arxiv qovluğuna nisbətən yolu tapırıq.

## filepath.Join {#join}

`filepath.Join` hissələri sistemin ayırıcısı ilə birləşdirir: Linux-da `photos/2026/summer/Beach.JPG`, Windows-da `photos\2026\summer\Beach.JPG` alınır. Çıxış hər sistemdə eyni olsun deyə nümunədə yolları `filepath.ToSlash` ilə çap edirik: o, ayırıcını `/`-ə çevirir. `Join` nəticəni həm də təmizləyir: təkrarlanan ayırıcıları, `.`-ı (cari qovluq) və `..`-dan (bir yuxarı qovluq) əvvəlki hissəni silir. Ona görə səliqəsiz yığılmış ikinci yol da `photos/2025/lake.png` olur.

## Dir, Base, Ext {#parts}

`filepath.Dir` yolun son elementdən əvvəlki hissəsini, yəni qovluğu, `filepath.Base` son elementi, yəni faylın adını qaytarır. `filepath.Ext` adın sonuncu nöqtədən başlayan hissəsidir: `.JPG`. Uzantı nöqtə ilə birlikdə qaytarılır, nöqtə yoxdursa nəticə boş string olur.

## Uzantını dəyişmək {#thumb}

Önizləmə şəkli eyni adla, amma `.webp` uzantısı ilə `thumbs` alt qovluğunda saxlanır. `strings.TrimSuffix` adın sonundan uzantını kəsir (`Beach`), yeni yolu isə yenə `Join` qurur. Uzantını yoxlayanda hərflərin böyüklüyünü nəzərə alın: kameralar çox vaxt `.JPG` yazır, ona görə müqayisədən əvvəl `strings.ToLower` çağırırıq.

## filepath.Rel {#rel}

`filepath.Rel(base, target)` `target`-ə `base` qovluğundan necə çatmağı göstərir. Arxivdə yolları `photos`-a nisbətən saxlasaq, arxivi başqa diskə köçürəndə də onlar düz qalır. Hədəf başqa qovluqdadırsa, nəticə `..` ilə başlayır: `2026`-dan `2025`-ə keçmək üçün əvvəlcə bir qovluq yuxarı çıxmaq lazımdır. Nisbi yolu tapmaq mümkün olmayanda, məsələn, biri tam, o biri nisbi yol olanda, `Rel` xəta qaytarır.

> **Bilgi:** Tam (absolute) yollar da sistemdən asılıdır: Linux-da `/home/ann/photos`, Windows-da `C:\Users\ann\photos`. Nisbi yolu tam yola `filepath.Abs` çevirir. URL-lərdə isə ayırıcı həmişə `/`-dir, onlar üçün `filepath` yox, `path` paketi istifadə olunur.
