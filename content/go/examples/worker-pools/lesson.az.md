Worker pool, yəni işçi hovuzu, eyni işi görən bir neçə goroutine-dən (worker-dən) ibarətdir: hamısı bir növbədən iş götürür və nəticəni başqa bir növbəyə qoyur. Avtoyuma kimi: üç yuma bölməsi var, maşınlar növbədə gözləyir, boşalan bölmə növbəti maşını götürür. Goroutines dərsində hər iş üçün ayrıca goroutine açırdıq; burada worker sayı sabitdir, çünki real həyatda resurs məhduddur: bölmə sayı, verilənlər bazasına bağlantı sayı, prosessor nüvələri. İşlər çox, icraçılar az olanda worker pool lazımdır.

Bu dərsdə avtoyuma yazırıq: maşınlar növbəyə düzülür, bir neçə worker onları paralel yuyur, nəticələr növbə sırası ilə çap olunur.

## Worker {#worker}

`bay` worker-dir. O, `cars` channel-ından `range` ilə iş götürür; bu dövr channel bağlanıb boşalanda bitir. `time.Sleep(60 * time.Millisecond)` goroutine-i 60 millisaniyə saxlayır və işin vaxt aparmasını təqlid edir. Sonra worker nəticəni `washes` channel-ına göndərir; burada nəticə emal olunmuş `Car`-ın özüdür. `Slot` maşının növbədəki yeridir, nəticələri sıraya düzəndə lazım olacaq.

Parametrlərin istiqaməti işi aydın bölür: `<-chan Car`-dan worker yalnız iş götürə bilər, `chan<- Car`-a yalnız nəticə qoya bilər.

## Hovuz {#pool}

`washAll` iki channel yaradır və `for range bays` ilə `bays` qədər worker işə salır. Sonra hər nömrəni növbədəki yeri ilə `Car`-a çevirib `cars`-a qoyur və `close(cars)` ilə başqa iş olmayacağını bildirir. Channel-dan alınan dəyər yalnız bir alıcıya çatır, ona görə hər işi tam bir worker görür, heç biri iki dəfə görülmür. `close` olmasaydı, növbə boşalanda worker-lərin `range`-i bitməz və onlar sonsuza qədər yeni iş gözləyərdi.

> **Diqqət:** Hər iki channel buffer-siz olsaydı, proqram deadlock-a düşərdi: bütün worker-lər məşğul olanda `washAll` dördüncü işi verə bilmir, worker-lər isə nəticəni verə bilmir, çünki `washAll` hələ oxumur. Burada buffer-lər `len(plates)` qədərdir və bu dövrəni qırır.

## Nəticələri toplamaq {#collect}

`washAll` neçə nəticə gələcəyini bilir: neçə iş, o qədər nəticə. Ona görə `washes`-dən düz `len(plates)` dəfə oxuyur. Nəticələr hansı worker tez qurtarırsa, o sıra ilə gəlir və bu sıra hər dəfə fərqli ola bilər. Ona görə hər nəticə `done[car.Slot]`-a, yəni maşının növbədəki yerinə yazılır və slice sonda növbə sırası ilə dolu olur.

`range washes` burada işləməzdi: `washes`-i heç kim bağlamır. Onu worker-lərdən biri bağlaya bilməz, çünki digərləri hələ göndərə bilər. Hamısının bitməsini gözləyib sonra bağlamaq növbəti dərsin, WaitGroups-un mövzusudur.

## Nəticələr {#results}

`washAll(queue, 3)` üç worker ilə bütün növbəni emal edir və nömrələri növbə sırası ilə qaytarır. Worker-lər işləri hər dəfə başqa sıra ilə götürsə də, çıxış həmişə eynidir.

## Niyə tez {#speed}

`time.Now()` indiki anı verir, `time.Since(start)` isə o andan keçən vaxtı (`time.Duration`). Bir worker işləri bir-bir görür: 6 × 60 = 360 millisaniyə çəkir; ehtiyat üçün 300 ilə müqayisə edirik. Üç worker eyni anda üç iş görür və növbəni iki dövrədə, təxminən 120 millisaniyəyə bitirir. Millisaniyələri çap etmirik, çünki dəqiq vaxt kompüterdən və yükdən asılıdır; yalnız müqayisənin nəticəsi hər dəfə eynidir.

> **Bilgi:** Worker çox olduqca iş həmişə sürətlənmir: işdən çox worker olsa, artıqları boş dayanır. Worker sayını əlinizdəki resurs müəyyən edir.
