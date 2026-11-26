`context` paketi işə "nə vaxta qədər davam et" xəbərini ötürür: vaxt limiti (deadline) və ya ləğv (cancel) siqnalı. Əvvəl `select` və `time.After` ilə bir yerdə timeout qururduq; real proqramda isə bir iş funksiyadan funksiyaya, goroutine-dən goroutine-ə, hətta şəbəkə sorğusuna ötürülür və hamısı eyni anda dayanmalıdır. `context.Context` bu siqnalı daşıyan dəyərdir: onu ilk arqument kimi `ctx` adı ilə ötürmək Go-da ümumi qaydadır.

Bu dərsdə taksi tətbiqi yazırıq: sürücü axtarışı vaxt limitinə sığmalı, sərnişin "Ləğv et" basanda dayanmalı, tətbiq bağlananda isə bütün işlər birlikdə bitməlidir.

## ctx.Done {#done}

`ctx.Done()` channel qaytarır və context bitəndə bu channel bağlanır. `findDriver` `select` ilə iki hadisəni gözləyir: axtarışın bitməsini və ya context-in bitməsini, hansı tez olsa. Context bitibsə, `ctx.Err()` səbəbi deyir. Funksiya context-i özü yaratmır, çağırandan alır: limiti nə vaxt qoymağı çağıran bilir.

## WithTimeout {#timeout}

`context.WithTimeout` mövcud context-dən vaxt limitli yeni context yaradır; `context.Background()` heç vaxt bitməyən boş başlanğıc context-dir. Limit context yarananda başlayır, ona görə ikinci axtarış 300 ms-in qalan hissəsini alır və `context deadline exceeded` xətası ilə bitir. `WithTimeout` həm də `cancel` funksiyası qaytarır: onu `defer` ilə çağırmaq context-in taymerini və resurslarını vaxtından əvvəl azad edir.

> **Diqqət:** `cancel`-i çağırmamaq resurs sızmasıdır; `go vet` bunu görür və xəbərdarlıq edir. Həmişə `defer cancel()` yazın.

## WithCancel {#cancel}

`context.WithCancel` vaxt limiti olmayan, yalnız əl ilə dayandırılan context yaradır. Sərnişin 100 ms sonra "Ləğv et" basır, yəni başqa goroutine `cancelRide()` çağırır və axtarış dərhal dayanır. Bu dəfə xəta `context canceled`-dir. Səbəbi `errors.Is` ilə yoxlamaq olar: `context.Canceled` ləğvi, `context.DeadlineExceeded` vaxtın bitməsini bildirir.

## Context ağacı {#tree}

Yeni context həmişə başqa birindən yaranır, ona görə context-lər ağac qurur. Siqnal yalnız yuxarıdan aşağı gedir: övlad (`search`) dayandırılanda valideyn (`app`) işləməyə davam edir, valideyn dayandırılanda isə bütün övladlar da dərhal dayanır. `pay`-in limiti bir saatdır, amma tətbiq bağlananda o da bitir. Beləcə bir `cancel` çağırışı bütün asılı işləri birdən dayandırır.

## HTTP sorğusunda context {#http}

`http.NewRequestWithContext` sorğunu context-ə bağlayır: context bitəndə müştəri gözləməyi dayandırır və `Do` xəta qaytarır, `errors.Is` isə səbəbin vaxt limiti olduğunu təsdiqləyir. Server tərəfində `r.Context()` müştəri bağlantını kəsəndə bitir; handler bunu görüb boşuna işləməyə davam etmir. Beləcə bir context şəbəkənin hər iki tərəfində işi dayandırır.

> **Bilgi:** `context.WithValue` context-ə dəyər də əlavə edə bilir (məsələn sorğunun id-si), amma adi funksiya arqumentlərini onunla əvəz etməyin.
