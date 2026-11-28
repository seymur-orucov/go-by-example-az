README layihəyə gələn adamın ilk oxuduğu fayldır. GitHub `README.md`-ni repository-nin əsas səhifəsində, fayl siyahısının altında göstərir. Yaxşı README layihənin nə etdiyini, necə quraşdırılıb işlədildiyini, kömək haradan alınacağını və license-i deyir.

Nümunə Sam-ın `tidy-photos` layihəsinin README-sidir: şəkilləri çəkildiyi tarixə görə qovluqlara ayıran kiçik açıq mənbəli komanda sətri aləti.

## Ad, badge-lər və bir cümlə {#title}

Fayl layihənin adı ilə başlayır: birinci səviyyəli başlıq. Ən aşağıda bir cümləlik izah var. Oxucu layihənin ona lazım olub-olmadığını bu cümlədən anlamalıdır.

Aradakı iki sətir **badge**-dir (nişan). Badge kiçik şəkildir və Markdown-da adi şəkil kimi yazılır. Şəkli bir xidmət yaradır. Birincisi GitHub Actions-dandır: testlərin keçib-keçmədiyini göstərir. Actions testləri hər push-dan sonra özü işlədə bilir, onu sonrakı modullarda keçəcəyik. İkinci badge-i shields.io saytı ünvandakı mətndən düzəldir: `license-MIT-blue` "license | MIT" yazılı göy nişan olur.

Birinci badge həm də keçiddir. Şəkil `[mətn](ünvan)` keçidində mətnin yerinə yazılıb, ona görə badge-ə klikləyəndə testlərin səhifəsi açılır. Dərsin önizləməsində şəkillər yüklənmir, badge-lərin yerində alt text görünür.

> **Bilgi:** GitHub README-ni üç yerdə axtarır: gizli `.github` qovluğunda, kökdə və `docs` qovluğunda. Bir neçəsi varsa, `.github`-dakı göstərilir, o yoxdursa kökdəki, sonra `docs`-dakı. Adətən README kökdə saxlanır.

## Nə edir və niyə {#about}

`## Why` bölməsi layihənin hansı problemi həll etdiyini deyir. Sam əvvəl problemi yazır: bir qovluqda minlərlə `IMG_4031.jpg`. Sonra həlli: alət şəklin içindəki tarixi oxuyub onu `2024-06-15` kimi qovluğa köçürür.

Qısa siyahı əsas xüsusiyyətləri sayır. `never deletes a file` sətri şəkillərindən narahat olan oxucunun ilk sualına cavab verir. Bu bölmədə uzun tarixçəyə və kodun necə işlədiyinə ehtiyac yoxdur.

GitHub bölmə başlıqlarından README üçün avtomatik məzmun cədvəli (*table of contents*) qurur. Onu faylın yuxarı küncündəki **Outline** düyməsi açır. Ona görə hər bölməyə `##` başlıq verin: oxucu lazım olan yerə birbaşa keçir.

## Quraşdırma {#install}

Quraşdırma tələblə başlayır. Alət Go ilə yazılıb, ona görə Go 1.22 və ya daha yeni versiya lazımdır. Tələbi yazmasanız, köhnə versiyası olan oxucu anlaşılmaz xəta görəcək.

Komanda ayrıca kod blokundadır. Oxucu onu köçürüb terminalda işlədəcək, ona görə blokda yalnız komandanı saxlayın. İkinci blok quraşdırmanın alındığını yoxlayır: `tidy-photos --version` versiyanı çap edirsə, alət hazırdır.

## İstifadə və nümunə çıxış {#usage}

Usage bölməsi ən adi istifadəni bir komanda ilə göstərir. Bu komanda `~/Pictures/phone` qovluğundakı şəkilləri `~/Pictures/sorted`-a köçürür.

Altında nümunə çıxış var. Oxucu aləti işə salmadan nə görəcəyini bilir. Məsələn, `Skipped 5 files without a date` sətri xəta deyil, alət tarixi olmayan faylları yerində saxlayır. Çıxışın blokunda dil `text` yazılıb: bu, rənglənməyən adi mətndir.

Bütün seçimləri README-yə yığmaq lazım deyil. Bir-iki tipik nümunə kifayətdir, uzun siyahı ayrıca sənədə gedə bilər.

## Töhfə və license {#contributing}

**Contributing** bölməsi kömək haradan alınacağını və töhfənin necə veriləcəyini deyir. Səhv issue ilə bildirilir. Issue repository-dəki problem və ya təklif qeydidir, onu növbəti modulda keçəcəyik. Ətraflı qaydalar `CONTRIBUTING.md`-dədir. GitHub bu faylı tapanda issue və ya pull request açan adama ona keçid göstərir.

**License** bölməsi license-in adını deyir və `LICENSE` faylına keçid verir. License faylı repository-nin kökündədir, onun mətnini README-yə köçürmək lazım deyil.

Hər iki keçid nisbi yoldur. GitHub nisbi keçidi açıq olan branch-a uyğunlaşdırır: başqa branch-da README həmin branch-ın `CONTRIBUTING.md`-sinə aparır. Repository-ni clone edən də bu keçidləri öz kompüterində aça bilir. Ona görə GitHub Docs repository-nin öz faylları üçün nisbi keçid tövsiyə edir. Issue-lar isə fayl deyil, onlara tam URL ilə keçid verilir.
