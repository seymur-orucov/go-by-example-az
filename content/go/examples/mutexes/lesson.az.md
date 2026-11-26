Atomik sayğac bir ədədi qoruyur, amma çox vaxt bir neçə addımı birlikdə qorumaq lazımdır: əvvəl "yer boşdur?" yoxla, sonra sat. İki goroutine eyni anda yoxlasa, hər ikisi yeri boş görür və onu iki nəfərə satır. **Mutex** (mutual exclusion, "qarşılıqlı istisna") qapının kilidi kimidir: `Lock` edən goroutine işini bitirib `Unlock` edənə qədər qalanları qapıda gözləyir. Kilidlə qorunan kod hissəsinə istənilən an yalnız bir goroutine girir, ona görə içindəki addımlar arasına başqası girə bilmir.

Bu dərsdə bir qatarın biletlərini üç kassa eyni vaxtda satır və eyni yer iki dəfə satılmamalıdır.

## Mutex struct-ın içində {#train}

`Train` satılmış yerləri map-də saxlayır, `mu` isə həmin map-i qoruyur; bunu şərhdə yazmaq adətdir. `sync.Mutex`-in zero value-su açıq kilitdir, onu yaratmaq lazım deyil, map-i isə yaratmaq lazımdır. Burada atomik tip kömək etmir: map üçün atomik tip yoxdur və iş bir yox, iki addımdır. Map-ə qorumasız eyni anda yazmaq da data race-dir: Go runtime bunu çox vaxt görür və proqramı `fatal error: concurrent map writes` ilə dayandırır.

## Lock və defer Unlock {#book}

`Book` əvvəl kilidi bağlayır, sonra yeri yoxlayır və boşdursa, yazır. `Lock` və `Unlock` arasında yalnız bir goroutine ola bildiyi üçün "yoxla, sonra sat" bölünməz olur. `defer t.mu.Unlock()` kilidi funksiya hansı `return` ilə bitsə də açır; burada iki `return` var və `defer` olmasa, birində `Unlock`-u unutmaq asandır. Kilid açılmasa, `Book`-u növbəti çağıran goroutine əbədi gözləyəcək.

> **Diqqət:** Receiver pointer olmalıdır: `func (t *Train)`. Value receiver hər çağırışda struct-ı, deməli mutex-i də kopyalayır və hər kassa öz kilidini bağlayır, yəni heç nə qorunmur. `go vet` bunu `passes lock by value` xəbərdarlığı ilə tutur.

## Oxumaq da kilid tələb edir {#sold}

`Sold` heç nə dəyişmir, amma yenə kilidi bağlayır. Bir goroutine map-ə yazarkən digəri onu oxusa, bu da data race-dir. Eyni mutex həm yazanları, həm də oxuyanları sıraya düzür.

> **Bilgi:** Oxuyan çox, yazan az olanda `sync.RWMutex` işlədilir: `RLock`/`RUnlock` bir neçə oxucunu eyni anda buraxır, `Lock` isə hamı çıxana qədər gözləyir və sonra tək girir.

## Kassalar {#desks}

Üç kassa üç goroutine-dir və eyni `train`-ə müraciət edir. 9 sorğuda 5 fərqli yer var: üç kassa da `4A`-nı istəyir. Hansı kassanın onu satacağı hər işə salmada fərqli ola bilər, amma nəticə dəyişmir: 5 yer satılır, 4 sorğu rədd edilir. Rədd edilənləri saymaq üçün atomik sayğac kifayətdir, çünki orada bir ədədi artırırıq, başqa heç nəyi yoxlamırıq.
