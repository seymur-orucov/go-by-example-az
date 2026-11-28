Go-da xəta adi dəyərdir: funksiya onu sonuncu nəticə kimi qaytarır, çağıran isə dərhal yoxlayır. Bir çox dildə isə exception "atılır" və kodun harasındasa tutulur. Go-da hansı çağırışın uğursuz ola biləcəyi kodda açıq görünür. Nümunədə kiçik kitabxana var.

## Xəta yaratmaq və yoxlamaq {#new}

`lateFee` iki nəticə qaytarır: haqq və `error`. Uğurlu halda xəta `nil`-dir, səhv halda isə `errors.New` verilən mətnlə yeni xəta yaradır. Çağıran `if err != nil` ilə yoxlayır. `error` bir metodu olan interface-dir: `Error() string`. `fmt` xətanı çap edəndə bu metodun mətnini göstərir. Xəta olanda digər nəticə adətən zero value olur və ona baxılmır.

> **Bilgi:** Xəta mətni kiçik hərflə başlayır və nöqtə ilə bitmir, çünki onu tez-tez başqa mətnin içinə qoyurlar.

## Xəta dəyişənləri {#sentinel}

Çağıran hansı xətanın baş verdiyini ayırd etməlidirsə, xətanı bir dəfə yaradıb package səviyyəsində dəyişənə yazırıq: `ErrNotFound`, `ErrOnLoan`. Adları `Err` ilə başlamaq Go-da qəbul olunmuş qaydadır. `checkOut` hər dəfə eyni dəyəri qaytarır, ona görə `err == ErrOnLoan` işləyir. Birinci çağırış kitabı verir və `nil` qaytarır, ikincisi isə kitabın artıq verildiyini deyir.

## Xətanı bükmək {#wrap}

`borrow` xətanı yuxarı ötürür, amma əvvəlcə ona kontekst əlavə edir: problem hansı kitabdadır. `fmt.Errorf` mətn şablonundan xəta yaradır: `%s` yerinə sətir, `%w` yerinə isə orijinal xəta qoyulur. `%w` xətanı bükür (wrap): yeni xətanın içində köhnəsi saxlanılır. Ona görə `==` artıq `false` verir. Bükülmüş xətalar zəncir əmələ gətirir: `borrow Atlas: …` → `ErrNotFound`. `errors.Is` bu zənciri içəriyə doğru yoxlayır və `ErrNotFound`-u tapır.

> **Diqqət:** `%w` əvəzinə `%v` yazsanız, mətn eyni görünəcək, amma orijinal xəta itəcək və `errors.Is` `false` qaytaracaq.
