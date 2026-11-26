`<-ch` yalnız bir channel-dan qəbul edir və dəyər gələnə qədər goroutine-i saxlayır. Bir neçə channel-ı eyni anda dinləmək lazım olanda bu kifayət etmir: birini gözləyərkən o birindən gələn mesaj boş yerə gözləyir. `select` `switch`-ə bənzəyir, amma onun `case`-lərində şərt yox, channel əməliyyatları olur: hansı channel əvvəl hazır olsa, onun `case`-i işləyir.

Bu dərsdə yemək çatdırma xidmətinin dispetçerini yazırıq: o, iki kuryer tətbiqini eyni vaxtda dinləyir və sifarişi hansı kuryer əvvəl cavab versə, ona verir.

## Kuryer tətbiqləri {#apps}

`courierApp` bir kuryer tətbiqini təqlid edir: hər `gap` müddətindən sonra növbəti boş kuryerin adını `offers` channel-ına göndərir. `time.Sleep` goroutine-i verilən müddət qədər saxlayır; müddətin tipi `time.Duration`-dır və `100*time.Millisecond` kimi yazılır. Tətbiq channel-a yalnız göndərir, ona görə parametr `chan<- string`-dir.

## select {#select}

`main` hər tətbiq üçün ayrı channel yaradır və tətbiqləri ayrı goroutine-lərdə işə salır: ZoomEats kuryerləri 100 ms, SwiftRide kuryerləri 600 ms aralıqla gəlir. `select` hər iki `case`-i eyni anda gözləyir. Birinci ZoomEats hazır olur, onun `case`-i işləyir və sifarişi Aysel alır. `select` yalnız bir `case` icra edir: SwiftRide-ın təklifi bu `select`-də oxunmur, öz növbəsini gözləyir.

Əvəzində ardıcıl `<-swift`, sonra `<-zoom` yazsaydıq, dispetçer 600 ms SwiftRide-ı gözləyəcəkdi, halbuki Aysel 100 ms-də hazır olmuşdu. `case`-də qəbul əvəzinə göndərmə də yazmaq olar: `case orders <- id:` channel göndərməyə hazır olanda işləyir.

> **Bilgi:** Bir neçə `case` eyni anda hazırdırsa, `select` onlardan birini təsadüfi seçir. `case`-lərin yazılış sırası üstünlük vermir.

## Dövrdə select {#loop}

Qalan üç təklifi almaq üçün `select`-i dövrə qoyuruq. Hər təkrarda `select` hansı channel hazırdırsa, onu götürür, ona görə təkliflər gəliş sırası ilə çap olunur: Tom (200 ms), Mark (600 ms), Nina (1200 ms). Tom 200 ms-də gəlir, çünki ZoomEats növbəti 100 ms-i Aysel-i təhvil verəndən sonra saymağa başlayır. Dövr düz 3 dəfə işləyir, çünki neçə təklif gələcəyini bilirik; say bilinməyəndə channel bağlanır, bunu Closing Channels dərsində görəcəyik.

> **Diqqət:** Heç bir `case` hazır olmayacaqsa, `select` əbədi gözləyir. Dövr 4 dəfə işləsəydi, son təkrarda göndərən qalmazdı və proqram `fatal error: all goroutines are asleep - deadlock!` ilə dayanardı.
