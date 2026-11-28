Siqnal əməliyyat sisteminin işləyən prosesə göndərdiyi qısa bildirişdir. Terminalda Ctrl+C basanda proses `SIGINT` (interrupt) alır, `kill -TERM <pid>` əmri və ya server proqramları dayandıranda (məsələn Docker, systemd) isə `SIGTERM` gəlir. Proqram heç nə etməsə, bu siqnallar onu dərhal öldürür: `defer`-lər işləmir, yarımçıq iş yarımçıq qalır.

Bu dərsdə çap növbəsi yazırıq: `os/signal` paketi Ctrl+C-ni channel-a göndərir, proqram cari sənədi bitirib qalanları sonraya saxlayır (graceful shutdown).

## Siqnalı simulyasiya etmək {#simulate}

Ctrl+C-ni proqramın özündən portativ şəkildə göndərmək olmur: Windows-da prosesin özünə `SIGINT` göndərmək dəstəklənmir. Ona görə dərsdə istifadəçinin rolunu `pressCtrlC` oynayır: əməliyyat sisteminin edəcəyini edir və `os.Interrupt`-u channel-a özü qoyur. Proqramın qalan hissəsi real siqnalla eyni işləyir; terminalda işə salıb Ctrl+C basanda eyni yol keçilir.

## signal.Notify {#notify}

`signal.Notify` göstərilən siqnalları (`os.Interrupt` və `syscall.SIGTERM`) channel-a yönləndirir; bundan sonra onlar proqramı öldürmür. Channel buffer-li olmalıdır: paket siqnalı göndərəndə gözləmir, channel o an hazır deyilsə, siqnal itir. `signal.Stop` yönləndirməni ləğv edir və siqnalların adi davranışını qaytarır.

> **Diqqət:** Buffer-siz channel (`make(chan os.Signal)`) kompilyasiya olunur, amma siqnal itə bilər; `go vet` bunu tapır.

## Növbəni işləmək {#loop}

Hər sənəddən əvvəl `select` siqnal gəlib-gəlmədiyini yoxlayır; `default` qolu sayəsində siqnal yoxdursa, gözləmədən çapa keçir. Siqnal yalnız sənədlər arasında yoxlanır, ona görə çap olunan sənəd heç vaxt yarımçıq kəsilmir. İkinci sənəddən sonra `pressCtrlC` çağırılır; növbəti yoxlamada dövr dayanır.

## Səliqəli dayanma {#shutdown}

Siqnal gəlibsə, proqram nə baş verdiyini yazır və çap olunmamış sənədləri saxlayır. `os.Interrupt` çap olunanda `interrupt` görünür. Real proqramda bu yerdə fayllar bağlanır, serverə `Shutdown` çağırılır, verilənlər bazası bağlantısı qapanır. `main` adi qaydada bitir və `defer`-lər işləyir.

`SIGKILL`-i (`kill -9`) və `SIGSTOP`-u tutmaq olmur: əməliyyat sistemi onları proqrama çatdırmadan prosesi dayandırır. Ona görə səliqəli dayanma `SIGINT` və `SIGTERM` üçün qurulur.

> **Bilgi:** `signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)` siqnal gələndə bitən context qaytarır: onu HTTP serverə və goroutine-lərə ötürmək bir channel-ı əl ilə paylamaqdan rahatdır.
