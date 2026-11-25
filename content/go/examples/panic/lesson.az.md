`panic` proqramı təcili dayandırır. Xətadan fərqi budur: `error` adi dəyərdir və çağıran onunla nə edəcəyinə özü qərar verir, panic isə funksiyanı dərhal kəsir və heç kim tutmasa bütün proqramı bitirir. Ona görə gözlənilən uğursuzluqlar üçün (yanlış giriş, tapılmayan kitab, boş otaq) `error` qaytarılır. Panic isə düzgün yazılmış proqramda heç vaxt baş verməməli hallar, yəni proqramçının səhvi üçündür.

Bu dərsdə teatrda yer qiymətlərini hesablayırıq: sıralar `A`, `B`, `C`-dir, başqa sıra yoxdur.

## panic çağırmaq {#own}

`seatPrice` yalnız üç sıranı tanıyır. Teatrda başqa sıra olmadığı üçün başqa hərf yalnız koddakı səhvdən gələ bilər, ona görə funksiya `error` qaytarmır, `panic` çağırır. `panic`-ə verilən dəyər, adətən mətn, səbəbi izah edir. `main`-də `B` sırası üçün çağırırıq, hər şey qaydasındadır: `30` dollar.

## Go özü də panic edir {#runtime}

Bəzi əməliyyatları Go icra edə bilmir və özü panic edir: slice-ın olmayan elementinə müraciət, `nil` map-ə yazmaq, `nil` pointer-in dəyərini oxumaq. `prices[5]` yazsaydıq, proqram `index out of range [5] with length 3` mesajı ilə dayanardı. İndeks proqramın çölündən gəlirsə, onu əvvəlcə `len` ilə yoxlayırıq.

## Proqram dayanır {#crash}

`seatPrice("Z")` panic edir. `fmt.Println` arqumentlərini hesablayarkən dayanır, ona görə `"row Z:"` da çap olunmur, sonrakı sətir də işləmir. Proqram `panic: unknown row Z` mesajı ilə və 2 çıxış kodu ilə (exit code, yəni proqramın əməliyyat sisteminə qaytardığı nəticə) bitir.

> **Bilgi:** Real terminalda mesajdan sonra çağırış izi (stack trace) də çap olunur: panic hansı funksiyada və hansı sətirdə baş verib. Çıxış panelində onu qısaltmışıq.
