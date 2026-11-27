Mutex dərsində verilənlər paylaşılırdı və hər goroutine ona toxunmazdan əvvəl kilidi bağlayırdı. Başqa yol da var: verilənlərə yalnız bir goroutine sahib olur, qalanları isə ona channel ilə sorğu göndərib cavab gözləyir. Verilənlər heç vaxt paylaşılmadığı üçün kilid lazım deyil: sorğular növbəyə düzülür və sahib onları bir-bir icra edir. Go-da bu fikir belə deyilir: "yaddaşı paylaşaraq ünsiyyət qurmayın, ünsiyyət quraraq yaddaşı paylaşın".

Bu dərsdə anbarı idarə edirik: anbar siyahısı tək anbardar goroutine-dədir, yığıcılar isə ondan mal istəyir.

## Sorğu {#request}

`request` anbardara göndərilən mesajdır: nə istənir (`kind`), hansı mal və neçə ədəd. `reply` cavab channel-ıdır və sorğu ilə birlikdə gedir. Anbardar çox goroutine-dən sorğu alır, `reply` isə ona cavabı kimə qaytaracağını deyir, zərfin üstündəki geri ünvan kimi.

## Vəziyyətin sahibi {#keeper}

`stock` map-i `keeper`-in local dəyişənidir: başqa heç bir goroutine onu görmür, ona görə data race mümkün deyil. `for r := range requests` sorğuları bir-bir götürür və birini bitirmədən növbətiyə keçmir. Ona görə "mal yetirmi? yoxla, sonra azalt" mutex olmadan da bölünməzdir. Mal yetmirsə, anbardar 0 cavab verir və `continue` ilə növbəti sorğuya keçir. `requests` bağlananda dövr bitir və goroutine də işini bitirir.

## Sorğu göndərmək {#ask}

`ask` hər sorğu üçün yeni `reply` channel-ı yaradır, sorğunu göndərir və cavabı gözləyir. Çağıran üçün bu, adi funksiya çağırışıdır, channel-lar onun içində gizlənib. Parametr `chan<- request`-dir: `ask` yalnız göndərir, `keeper` isə `<-chan request` ilə yalnız qəbul edir.

> **Diqqət:** Sahib hər sorğuya cavab verməlidir. `keeper` tanımadığı `kind` üçün heç nə göndərməsə, `ask` `<-reply`-də əbədi gözləyəcək.

## Yığıcılar {#pickers}

Beş yığıcı eyni anda 3 cüt çəkmə istəyir, anbarda isə 12 cüt var. `requests` buffer-siz channel-dır: yığıcılar sorğunu göndərmək üçün növbə ilə gözləyir, anbardar isə onları bir-bir icra edir. Ona görə dördü malı alır, beşinci 0 alır. Hansı yığıcının boş qalacağı hər dəfə fərqli ola bilər, nəticə isə həmişə eynidir. Doldurulan sifarişləri atomik sayğacla sayırıq.

## Yoxlama və bağlama {#check}

`wg.Wait()` bütün `"take"` cavablarını gözləyir, ona görə `"check"` sorğusu onlardan sonra göndərilir və anbardar qalığı düzgün deyir: 0. Sonra `main` `requests`-i bağlayır. Channel-ı göndərən bağlayır, burada göndərən `main`-dir və başqa sorğu olmayacağını yalnız o bilir.

## Mutex, yoxsa sahib goroutine?

Hər iki yol eyni problemi həll edir. Mutex-də verilənlər paylaşılır və hər müraciət kilidlənir: kod qısadır, sadə map və ya sayğac üçün adətən daha sürətlidir. Sahib goroutine-də verilənlər bir yerdədir və müraciət mesajla olur: kilidi unutmaq və ya mutex-i kopyalamaq riski yoxdur, amma hər sorğu iki channel əməliyyatıdır və kod uzanır. Vəziyyət sadəcə qorunmalı verilənlərdirsə, mutex seçin. Vəziyyətin sahibi "xidmət" kimi işləyirsə, məsələn, hər hərəkəti jurnala yazırsa və ya `select` ilə başqa hadisələri də gözləyirsə, sahib goroutine daha təbiidir.
