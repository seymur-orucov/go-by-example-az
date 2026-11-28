Go-da funksiya da dəyərdir, ədəd və ya `string` kimi. Onu dəyişənə yazmaq, başqa funksiyaya arqument kimi vermək, funksiyadan nəticə kimi qaytarmaq olar. Adsız, yerindəcə yazılan funksiyaya function literal deyilir. Function literal ətrafındakı dəyişənləri "yadda saxlayıb" onlardan istifadə edirsə, ona closure deyilir.

Nümunələr kiçik qəhvəxanadandır: qiymət, süd əlavəsi və bonus kartı.

## Function literal {#literal}

`func(size string) int { ... }` adsız funksiyadır, `price := ...` isə onu dəyişənə yazır. Sonra onu adi funksiya kimi çağırırıq: `price("large")`. `price` adi dəyişən olduğu üçün yalnız elan olunduğu sətirdən sonra istifadə oluna bilər. Yuxarı səviyyədə `func` ilə elan olunan funksiyalar isə faylın istənilən yerindən görünür.

## Closure dəyişəni tutur {#capture}

`withMilk` öz içində olmayan iki dəyişəndən istifadə edir: `price` və `milk`. Closure bu dəyişənlərin o anki dəyərini yox, dəyişənlərin özünü tutur. Ona görə `milk = 2` yazandan sonra `withMilk("small")` artıq `6` qaytarır. Eyni qayda tərsinə də işləyir: closure xarici dəyişənə yazsa, dəyişiklik çöldən də görünür.

## Funksiyanı arqument kimi vermək {#pass}

Faylın əvvəlindəki `countIf` sifarişləri gəzir və hansının sayılacağını özü bilmir. Bu qərarı `keep` parametrinə ötürülən funksiya verir. Parametrin tipi `func(string) bool`-dur: `string` qəbul edib `bool` qaytaran istənilən funksiya. `main`-də function literal-ı birbaşa çağırışın içində yazırıq. O, `want` dəyişənini tutur, beləcə `countIf`-ə ayrıca parametr ötürmək lazım olmur.

`countIf` `main`-dən əvvəl, `newCard` isə sonra yazılıb. Yuxarı səviyyədəki funksiyaların sırası fərq etmir.

## Vəziyyəti saxlayan closure {#card}

`newCard` funksiya qaytarır, nəticə tipi `func() string`-dir. Qaytarılan closure `cups` dəyişənini tutur. `newCard` bitəndən sonra da `cups` yox olmur, closure onu hər çağırışda artırır. Beləcə kart neçə qəhvə alındığını yadda saxlayır və hər üçüncüsünü pulsuz edir.

Hər `newCard()` çağırışı yeni `cups` dəyişəni yaradır. Ona görə `other` kartı sıfırdan başlayır. `cups`-a closure-dan başqa heç bir kod çata bilmir, onu çöldən təsadüfən dəyişmək mümkün deyil.
