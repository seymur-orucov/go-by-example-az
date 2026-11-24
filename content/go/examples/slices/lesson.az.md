Slice — ölçüsü dəyişə bilən massivdir. Go-da siyahılarla işləmək üçün demək olar ki, həmişə array yox, slice istifadə olunur.

## Boş slice {#nil}

Elan olunmuş, amma dəyər verilməmiş slice `nil`-dir: hələ heç bir massiv yoxdur, `len` 0-dır.

## make ilə hazır ölçü {#make}

`make` verilmiş ölçüdə massiv ayırır və onu sıfır dəyərlərlə doldurur. Sonra elementləri indekslə dəyişirik.

## append ilə əlavə {#append}

`append` elementləri sona əlavə edir və yeni slice qaytarır, ona görə nəticəni yenidən `s`-ə yazırıq. Yer çatmayanda Go daha böyük massiv ayırır: `cap` 3-dən 6-ya qalxdı.

## Kəsik {#slice}

`s[1:3]` 1-ci indeksdən 3-cüyə qədər (3 daxil deyil) elementləri götürür. Kəsik eyni massivə baxır, heç nə kopyalanmır.

## Qısa yazılış {#literal}

Elementləri birbaşa da yazmaq olar: `[]int{1, 2, 3}`. Ölçü elementlərin sayından təyin olunur.
