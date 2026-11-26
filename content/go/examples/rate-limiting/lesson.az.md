Rate limiting, yəni sürət məhdudiyyəti, işin tezliyini məhdudlaşdırmaqdır: vahid vaxtda ən çox N əməliyyat. SMS provayderləri və bir çox API bir tətbiqə müəyyən aralıqda yalnız bir neçə sorğu göndərməyə icazə verir: artığını rədd edir, bəzən isə hesabı müvəqqəti bloklayır. Ona görə proqram öz sürətini özü tənzimləməlidir. Go-da bunun üçün ayrıca alət lazım deyil: ticker sorğuları bərabər aralıqla buraxır, buffered channel isə qısa partlayış üçün ehtiyat saxlayır.

Bu dərsdə onlayn mağazanın SMS göndərən hissəsini yazırıq: adi bildirişlər növbə ilə gedir, giriş və bərpa kodları kimi təcili mesajlar üçün isə kiçik ehtiyat var.

## Ticker ilə aralıq {#ticker}

Hər mesajdan əvvəl `<-gateway.C` ticker-in növbəti siqnalını gözləyir, ona görə mesajlar 100 millisaniyədən bir gedir və saniyədə 10-dan çox ola bilmir. Ticker burada qapı rolunu oynayır: siqnal gəlməsə, mesaj keçmir. `time.Now()` indiki anı, `time.Since(start)` isə o andan bəri keçən müddəti qaytarır. Dörd mesaj təxminən 400 millisaniyə çəkir; vaxt hər işə salmada bir az fərqli olduğu üçün onu çap etmirik, yalnız ehtiyatla "ən azı 300" olduğunu yoxlayırıq.

> **Bilgi:** Bir neçə goroutine eyni ticker-dən oxuyarsa, limit hamısı üçün ortaq qalır: worker pool-dakı üç worker birlikdə yenə saniyədə 10 mesaj göndərər.

## Partlayış üçün ehtiyat {#burst}

Ticker hər mesajı növbəsinə qədər saxlayır, hətta gateway bir müddət boş dayanıbsa belə. Giriş kodunu isə istifadəçi elə indi gözləyir. Çıxış yolu buffered channel-dır: `tokens`-in tutumu (capacity) icazə verilən partlayışın ölçüsüdür. Onu əvvəlcədən iki "bilet" ilə doldururuq, hər təcili mesaj bir bilet götürür. Bilet olduqca `<-tokens` gözləmir, ona görə iki kod dərhal gedir və channel boşalır: `len(tokens)` `0` qaytarır. `struct{}` sahəsiz, yaddaş tutmayan tipdir, burada dəyərin özü yox, yalnız "icazə" faktı önəmlidir.

## Biletləri bərpa etmək {#refill}

Biletlər bitəndən sonra limit yenə işləməlidir, ona görə arxa planda bir goroutine hər 150 millisaniyədən bir yeni bilet qoyur. `time.Tick(d)` `time.NewTicker(d).C` kimidir, amma ticker-in özünü qaytarmır və onu dayandırmaq olmur; proqram bitənə qədər işləyən goroutine üçün bu rahatdır. Channel doludursa, `tokens <- struct{}{}` yer açılana qədər gözləyir, ona görə biletlər tutumdan çox yığılmır və partlayış heç vaxt ikidən böyük olmur. Üçüncü kod üçün bilet qalmayıb: o, yeni bilet gələnə qədər gözləyir.

> **Bilgi:** Köhnə məqalələr `time.Tick`-in yaddaş sızdırdığını yazır. Go 1.23-dən bu artıq doğru deyil: istifadə olunmayan ticker-i, dayandırılmasa belə, garbage collector təmizləyir.

Bu üsul **token bucket** adlanır. Real layihələrdə çox vaxt eyni ideyanı hazır şəkildə verən `golang.org/x/time/rate` paketindən istifadə olunur.
