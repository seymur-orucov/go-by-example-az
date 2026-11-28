GitHub-da hər repository-nin görünməsi (*visibility*) var: o, repository-ni kimin görə biləcəyini müəyyən edir. **Public** repository-ni internetdə hər kəs görür və clone edə bilir. **Private** repository-ni yalnız siz və giriş verdiyiniz adamlar görür.

Nümunədə Ayla-nın kiçik çörəkxanasının iki repository-si var: sifarişləri izləyən `bakery-orders` tətbiqi və çek hazırlayan köməkçi kitabxana `receipt-kit`.

## Kim görür, kim nə edə bilir {#who-sees}

Public repository-nin səhifəsini GitHub hesabı olmayan adam da açır. O, kodu və commit tarixçəsini oxuyur, repository-ni clone edir. Hesabı olan hər kəs onu fork da edə bilər. Push isə public repository-də də yalnız yazma icazəsi verilən adamlara açıqdır. Public "hər kəs dəyişə bilər" demək deyil.

Private repository-ni kənar adam heç görmür. Sahibi kimisə əməkdaş (*collaborator*) kimi əlavə edəndə həmin adam repository-ni görür və onunla işləyə bilir. Organization-a, yəni komandanın ortaq hesabına aid repository-də təşkilatın bəzi üzvlərinin də girişi olur. Fork orijinalın görünməsini götürür, ona görə private repository-nin fork-u da private olur.

Ayla `bakery-orders`-i private saxlayır. Bu kod yalnız onun çörəkxanası üçündür və başqasına lazım deyil. `receipt-kit`-i isə public edəcək: başqa kiçik dükanlar da onu işlədə və düzəliş təklif edə bilsin.

## Hansını seçmək {#choose}

Kodu başqalarının işlətməsini və ya ona töhfə verməsini istəyirsinizsə, public seçin. Açıq mənbəli kitabxana və işə düzəlmək üçün göstərdiyiniz portfolio layihəsi buna aiddir. Kod yalnız sizin və ya müştərinizin işidirsə, private seçin. Hələ hazır olmayan layihəni private başlayıb sonra açmaq da olar.

Pulsuz planda, GitHub Free-də, hər iki növdən istənilən qədər repository yaratmaq olar. Fərq imkanlardadır. GitHub Free-də public repository-lərdə bütün imkanlar işləyir, private repository-lərdə isə bəziləri yoxdur. Onlar üçün pullu plan lazımdır: GitHub Pro, Team və ya Enterprise Cloud. Hansı imkanın hansı planda olduğu vaxtaşırı dəyişir, dəqiq siyahı GitHub-ın planlar səhifəsindədir.

> **Diqqət:** private repository parol və açar saxlamaq üçün yer deyil. Sonra onu public edə və ya kiməsə giriş verə bilərsiniz. Onda bütün tarixçə də onlara açılır.

## Görünməni dəyişmək {#change}

Ayla `receipt-kit`-i private başlamışdı, indi kitabxana hazırdır. O, repository-də **Settings** tab-ını açır. Səhifənin aşağısında **Danger Zone** bölməsi var, orada **Change visibility** düyməsi durur. Ayla yeni görünməni seçir və GitHub dəyişikliyin nəticələrini göstərir. Ayla onları oxuyub təsdiq edir, sonra **Make this repository public** düyməsini basır. Görünməni yalnız repository-də admin icazəsi olan adam dəyişə bilər.

Hər istiqamətin öz nəticəsi var:

- **Private → public:** kod və bütün tarixçə hər kəsə açılır, hər kəs repository-ni fork edə bilir. Mövcud private fork-lar isə ayrılır və private qalır.
- **Public → private:** mövcud public fork-lar public qalır və repository-dən ayrılır. Onlarda olan kodu geri gizlətmək olmur. GitHub Free-də private repository-də olmayan imkanlar da söndürülür.
- **Hər dəyişiklikdə** ulduzlar (*stars*) və izləyicilər (*watchers*), yəni repository-ni bəyənən və yeniliklərini izləyən adamların siyahısı silinir.

> **Diqqət:** public etmək son versiyanı yox, bütün tarixçəni açır. Ayla-nın ilk commit-lərindən birində `.env` faylı var idi, içində email xidmətinin açarı. Fayl sonrakı commit-də silinib, amma köhnə commit-də qalır və public olandan sonra onu hər kəs görəcək. Ona görə Ayla açarı xidmətdə ləğv edib yenisini yaradır.

## Internal repository {#internal}

Üçüncü görünmə böyük şirkətlər üçündür. **Internal** repository-ni enterprise-in bütün üzvləri görür və oxuya bilir. Enterprise hesabı bir şirkətin bir neçə organization-unu birlikdə idarə edir. Enterprise-dən kənarda internal repository görünmür, hətta organization-a dəvət olunmuş kənar əməkdaşa (*outside collaborator*) da.

Məsələn, bankda onlarla komanda var və hər birinin öz organization-u var. Ortaq giriş kitabxanası internal olanda bütün komandalar onun kodunu görür və işlədə bilir. Kod isə internetə çıxmır.

Bu görünmə yalnız GitHub Enterprise Cloud işlədən və enterprise hesabına bağlı organization-larda var. Ayla-nın hesabı şəxsidir, onun üçün seçim ikidir: public və private.
