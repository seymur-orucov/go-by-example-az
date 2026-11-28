Goroutines dərsində `wg.Go` və `wg.Wait()` ilə bir neçə goroutine-in hamısı bitənə qədər gözlədik. İçəridə `sync.WaitGroup` sayğacdır: `Add` onu artırır, `Done` isə azaldır. `Wait` sayğac sıfır olana qədər gözləyir.

Bu dərsdə deploy aləti yazırıq: o, bütün serverlərin sağlamlığını eyni anda yoxlayır və yeni versiyanı yalnız sağlam serverlərə göndərir.

## Done {#done}

`check` bir serveri yoxlayan goroutine-in işidir. `time.Sleep(100 * time.Millisecond)` goroutine-i 100 millisaniyə saxlayır və serverin cavabını gözləməyi təqlid edir. Nəticə `up[i]`-yə, yəni bu serverin öz yerinə yazılır: iki goroutine eyni elementə yazmır. `defer wg.Done()` funksiya bitəndə sayğacı bir azaldır; `defer` ilə yazıldığı üçün funksiya hansı yolla bitirsə-bitsin, işləyəcək.

> **Diqqət:** `check` WaitGroup-u pointer kimi alır: `*sync.WaitGroup`. Dəyər kimi alsaydı, kopyanın öz sayğacı olardı: `Done` kopyanı azaldar, `main`-dəki `Wait` isə heç vaxt bitməzdi. `go vet` bunu tutur: `passes lock by value`.

## Add və Wait {#wait}

`var wg sync.WaitGroup` sıfır sayğacla hazırdır, onu ayrıca yaratmaq lazım deyil. Hər server üçün `wg.Add(1)` sayğacı artırır, sonra `go check(...)` yoxlamanı ayrıca goroutine-də başladır. `Add` `go`-dan əvvəl çağırılır: goroutine-in içində olsaydı, `Wait` hələ heç bir `Add` olmamış sıfır sayğac görüb dərhal qayıda bilərdi.

`wg.Wait()` sayğac sıfır olana qədər `main`-i saxlayır, ona görə `up`-ı oxuyanda bütün cavablar artıq yazılıb. Çıxışda `web-3` `false`-dur: o cavab vermir. `time.Now()` indiki anı, `time.Since(start)` isə o andan keçən vaxtı verir. Dörd yoxlama bir-bir 400 millisaniyə çəkərdi; eyni anda isə təxminən 100 millisaniyəyə bitir. Dəqiq vaxtı çap etmirik, çünki o, kompüterdən asılıdır.

## wg.Go {#go}

Yeni versiya yalnız sağlam serverlərə gedir. `wg.Go(f)` (Go 1.25-dən) üç işi bir çağırışda görür: `Add(1)` edir, `f`-i yeni goroutine-də işə salır və `f` bitəndə `Done` çağırır. Beləcə `Add`-i və ya `Done`-u unutmaq mümkün olmur. Eyni `wg` yenidən istifadə olunur: əvvəlki `Wait` qayıdıb, indi yeni dövrə başlayır.

Hər goroutine yükləməni bitirəndə serverin adını `updated` channel-ına göndərir. `main` neçə mesaj gələcəyini əvvəlcədən saymır, sadəcə channel bağlanana qədər oxuyur.

## Wait-dən sonra close {#close}

`updated`-i kim bağlamalıdır? Göndərənlərdən heç biri: hər biri yalnız öz işini bilir, başqalarının hələ göndərib-göndərmədiyini bilmir. Ona görə ayrıca goroutine `wg.Wait()` ilə hamısını gözləyir və yalnız sonra `close(updated)` edir. Bu vaxt `main` `range` ilə mesajları oxuyur, `range` isə channel bağlananda bitir: 4 serverdən 3-ü yenilənib.

> **Diqqət:** `wg.Wait()` və `close`-u `main`-in özündə, `range`-dən əvvəl yazsanız, deadlock olar: buffer-siz channel-a göndərən goroutine-lər oxuyanı gözləyir, `Wait` isə onların bitməsini gözləyir.
