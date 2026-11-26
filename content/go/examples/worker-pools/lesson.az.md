Worker pool, yəni işçi hovuzu, eyni işi görən bir neçə goroutine-dən (worker-dən) ibarətdir: hamısı bir növbədən iş götürür və nəticəni başqa bir növbəyə qoyur. Avtoyuma kimi: üç yuma bölməsi var, maşınlar növbədə gözləyir, boşalan bölmə növbəti maşını götürür. Goroutines dərsində hər iş üçün ayrıca goroutine açırdıq; burada worker sayı sabitdir, çünki real həyatda resurs məhduddur: bölmə sayı, verilənlər bazasına bağlantı sayı, prosessor nüvələri. İşlər çox, icraçılar az olanda worker pool lazımdır.

Bu dərsdə avtoyuma yazırıq: maşınlar növbəyə düzülür, bir neçə bölmə onları paralel yuyur, sonda kassa hər maşının qiymətini və cəmi göstərir.

## Worker {#worker}

`bay` bir yuma bölməsidir, yəni worker. O, `cars` channel-ından `range` ilə maşın götürür; bu dövr channel bağlanıb boşalanda bitir. `time.Sleep(60 * time.Millisecond)` goroutine-i 60 millisaniyə saxlayır və yumanın vaxt aparmasını təqlid edir. Sonra bölmə qiyməti hesablayır və nəticəni `washes` channel-ına göndərir. `Wash` `Car`-ı embed edir, ona görə nəticədə maşının nömrəsi (`Plate`) və növbədəki yeri (`Slot`) də var.

Parametrlərin istiqaməti işi aydın bölür: `<-chan Car`-dan bölmə yalnız maşın götürə bilər, `chan<- Wash`-a yalnız nəticə qoya bilər.

## Hovuz {#pool}

`washAll` iki channel yaradır və `for range bays` ilə `bays` qədər worker işə salır. Sonra bütün maşınları növbəyə qoyur və `close(cars)` ilə "başqa maşın yoxdur" deyir. Channel-dan alınan dəyər yalnız bir alıcıya çatır, ona görə hər maşını tam bir bölmə yuyur, heç biri iki dəfə yuyulmur. `close` olmasaydı, növbə boşalanda bölmələrin `range`-i bitməz və onlar sonsuza qədər yeni maşın gözləyərdi.

> **Diqqət:** Hər iki channel buffer-siz olsaydı, proqram deadlock-a düşərdi: bütün bölmələr məşğul olanda `washAll` dördüncü maşını verə bilmir, bölmələr isə nəticəni verə bilmir, çünki `washAll` hələ oxumur. Burada buffer-lər `len(queue)` qədərdir və bu dövrəni qırır.

## Nəticələri toplamaq {#collect}

`washAll` neçə nəticə gələcəyini bilir: neçə maşın, o qədər nəticə. Ona görə `washes`-dən düz `len(queue)` dəfə oxuyur. Nəticələr hansı bölmə tez qurtarırsa, o sıra ilə gəlir və bu sıra hər dəfə fərqli ola bilər. Ona görə hər nəticə `done[w.Slot]`-a, yəni maşının növbədəki yerinə yazılır və slice sonda növbə sırası ilə dolu olur.

`range washes` burada işləməzdi: `washes`-i heç kim bağlamır. Onu worker-lərdən biri bağlaya bilməz, çünki digərləri hələ göndərə bilər. Hamısının bitməsini gözləyib sonra bağlamaq növbəti dərsin, WaitGroups-un mövzusudur.

## Nəticələr {#results}

`washAll(queue, 3)` üç bölmə ilə bütün növbəni yuyur və nəticələri növbə sırası ilə qaytarır. `main` onları çap edir və qiymətləri toplayır: iki tam yuma 25, dörd adi yuma 10 dollar, cəmi 90 USD. Bölmələr maşınları hər dəfə başqa sıra ilə götürsə də, çıxış həmişə eynidir.

## Niyə tez {#speed}

`time.Now()` indiki anı verir, `time.Since(start)` isə o andan keçən vaxtı (`time.Duration`). Bir bölmə maşınları bir-bir yuyur: 6 × 60 = 360 millisaniyə çəkir; ehtiyat üçün 300 ilə müqayisə edirik. Üç bölmə eyni anda üç maşın yuyur və növbəni iki dövrədə, təxminən 120 millisaniyəyə bitirir. Millisaniyələri çap etmirik, çünki dəqiq vaxt kompüterdən və yükdən asılıdır; yalnız müqayisənin nəticəsi hər dəfə eynidir.

> **Bilgi:** Worker çox olduqca iş həmişə sürətlənmir: maşından çox bölmə olsa, artıqları boş dayanır. Worker sayını əlinizdəki resurs müəyyən edir.
