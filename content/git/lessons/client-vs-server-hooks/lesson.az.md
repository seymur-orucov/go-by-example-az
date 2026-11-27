Hook-lar iki yerdə işləyir: developer-in kompüterində (*client hook*-ları) və push-u qəbul edən serverdə (*server hook*-ları). Client hook-u səhvi tez göstərir, qaydanı hamı üçün isə yalnız server hook-u saxlaya bilir.

Nümunə şirkətin daxili Git serverindəki `billing.git` repository-sidir. Komandanın iki qaydası var: heç kim `main`-ə birbaşa push etmir və hər commit mesajında `PAY-142` kimi tapşırıq (*ticket*) nömrəsi olur.

## Hook-lar harada işləyir {#two-sides}

Sam commit edəndə Git onun kompüterindəki `.git/hooks` qovluğuna baxır. Commit yaranmazdan əvvəl `pre-commit` işləyir, sonra mesajı yoxlayan `commit-msg`. `git push` commit-ləri göndərməzdən əvvəl `pre-push`-u işlədir. `git switch`-dən sonra `post-checkout` işləyir. Bunlar client hook-larıdır: Sam-ın kompüterində, onun repository-sində işləyir.

Push serverə çatanda növbə server hook-larına keçir. Onlar serverdəki bare repository-nin `hooks` qovluğundadır. `pre-receive` branch-ları yeniləməzdən əvvəl bir dəfə işləyir. `update` hər branch üçün ayrıca işləyir. `post-receive` isə iş bitəndən sonra işləyir. Vizualda bir commit və bir push zamanı hook-ların sırası var.

## Client hook-u qaydanı saxlaya bilmir {#client-side}

"Hook nədir" dərsində gördüyünüz kimi, `.git/hooks` clone ilə gəlmir. Ayla `billing.git`-i clone edəndə Sam-ın `commit-msg` hook-u onda olmur. Ona görə Ayla tapşırıq nömrəsi olmayan commit yarada bilir. `core.hooksPath` və hook manager-lər quraşdırmanı asanlaşdırır, amma onu yenə hər developer özü edir.

Quraşdırılmış hook-u da keçmək olur. `git commit --no-verify` `pre-commit` və `commit-msg`-i işlətmir. `git push --no-verify` isə `pre-push`-u işlətmir. Developer hook faylını silə və ya dəyişə də bilər, çünki fayl onun öz kompüterindədir.

Client hook-unun üstünlüyü sürətdir. Nömrəsiz mesajı `commit-msg` elə commit anında rədd edir və Sam mesajı orada düzəldir. Server bu səhvi yalnız push zamanı görər. O vaxta qədər commit tarixçədə olur və mesajı `git commit --amend` və ya interactive rebase ilə dəyişmək lazım gəlir.

## Server hook-u push-u rədd edir {#server-side}

Server hook-unu serverin administratoru quraşdırır və developer onu keçə bilmir. Push gələndə Git `pre-receive`-ə hər yenilənəcək ref, yəni branch və ya tag üçün bir sətir verir. Sətirdə köhnə hash, yeni hash və ref-in adı olur, məsələn `refs/heads/main`. Hook sıfırdan fərqli kodla çıxsa, push-dakı heç bir branch yenilənmir.

`billing.git`-in `pre-receive` hook-u `refs/heads/main`-i görəndə `Direct push to main is not allowed.` yazır və `1` kodu ilə çıxır. Sam `main`-i push edəndə terminalda əvvəl bu mesajı görür, qabağında `remote:` olur. Git server hook-unun çıxışını developer-ə ötürür və hər sətrin əvvəlinə `remote:` qoyur. Sonra bu sətir gəlir: `! [remote rejected] main -> main (pre-receive hook declined)`. O, `main`-in serverdə yenilənmədiyini və səbəbin `pre-receive` olduğunu deyir.

`update` eyni yoxlamanı hər branch üçün ayrıca edir. Ona üç arqument verilir: ref-in adı, köhnə hash və yeni hash. `update` rədd edəndə yalnız o branch yenilənmir, push-dakı digər branch-lar qəbul olunur. `post-receive` push bitəndən sonra işləyir və onu dayandıra bilmir. Ondan bildiriş göndərmək, CI-ı başlatmaq və ya deploy üçün istifadə olunur. Daha köhnə `post-update` hook-u da var, onu ayrıca dərsdə keçəcəyik.

> **Diqqət:** `--no-verify` server hook-larına təsir etmir. `git push --no-verify` yalnız Sam-ın kompüterindəki `pre-push`-u keçir, serverdəki `pre-receive` yenə işləyir.

## GitHub-da server hook-u yoxdur {#github}

GitHub.com-da server GitHub-ındır və ora öz `pre-receive` hook-unuzu yükləyə bilməzsiniz. Eyni məqsədlərə repository ayarları ilə çatılır. `main`-ə birbaşa push-u branch qorunma qaydası (*branch protection rule*) və ya ruleset qadağan edir. Hər ikisi branch üçün qaydalar yığınıdır və pull request tələb edə bilir. Tələb olunan status check-lər (*required status checks*) pull request-i CI yoxlamaları uğurla bitməyincə merge etməyə qoymur. CI hər push-da testləri və yoxlamaları avtomatik işlədən xidmətdir, commit mesajlarında tapşırıq nömrəsini də o yoxlaya bilər. `post-receive`-in işini isə webhook görür: GitHub push-dan sonra seçdiyiniz ünvana sorğu göndərir.

GitHub Enterprise Server şirkətin öz serverində quraşdırılan GitHub-dır. Orada `pre-receive` hook-ları var, onları administrator əlavə edir. GitHub sənədlərinə görə bir push-da bütün pre-receive hook-ları birlikdə 5 saniyədən tez bitməlidir. Ona görə uzun testlər server hook-unda yox, CI-da işləyir.

Praktikada iki tərəf birlikdə işlədilir. Client hook-u Sam-a səhvi commit anında göstərir. Server hook-u və ya GitHub qaydası isə hook quraşdırmayan developer üçün də qaydanı saxlayır.
