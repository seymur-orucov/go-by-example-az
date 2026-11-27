Git-i işlətmək üçün heç bir hesab lazım deyil. Repository-ni GitHub-da saxlamaq, başqasının layihəsinə töhfə vermək və ya komandada işləmək üçün isə GitHub hesabı lazımdır. Bu dərsdə hesab açırıq və onu iki faktorlu girişlə qoruyuruq.

Nümunə Sam-dır: o, yeni işə başlayıb və komanda ondan GitHub hesabı açmağı istəyib.

## Qeydiyyat {#signup}

Qeydiyyat `github.com/signup` səhifəsində başlayır. Formaya email, parol və istifadəçi adı yazılır. Google və ya Apple hesabı ilə də qeydiyyatdan keçmək olar.

Parol iki qaydadan birinə uymalıdır. Ya ən azı 15 simvol olsun, ya da ən azı 8 simvol olsun və içində rəqəm ilə kiçik hərf olsun. GitHub parolu sızmış parolların siyahıları ilə də yoxlayır. Parol orada tapılsa, onu qəbul etmir, hətta siz onu heç vaxt işlətməmisinizsə belə.

Sonra emaili təsdiq etmək lazımdır: GitHub emailə məktub göndərir, təsdiq həmin məktubla olur. Bundan sonra hesab hazırdır. Formanın görünüşü vaxtaşırı dəyişir, maket onun sadə variantıdır.

## İstifadəçi adı {#username}

İstifadəçi adı hər yerdə görünür. Profil `github.com/sam-lee` ünvanında olur, repository-lər `github.com/sam-lee/<repository>` ünvanında. Clone ünvanında da, PR-larda və şərhlərdə də bu ad yazılır. Ona görə qısa və ciddi ad seçin: onu illərlə işlədəcəksiniz.

Adı sonra dəyişmək olar: **Settings** → **Account** → **Change username**. Amma bunun nəticələri var:

- Köhnə ad boşalır və başqası onu götürə bilər.
- Repository-lərin köhnə ünvanları yeni ünvana yönləndirilir. Köhnə adı götürən adam eyni adlı repository yaratsa, yönləndirmə işləməz. Ona görə lokal repository-lərdə remote ünvanını yeniləyin.
- Köhnə profil linki 404 verir. Başqa saytlardakı linkləri özünüz dəyişməlisiniz.

## İki faktorlu giriş {#two-factor}

Parol oğurlana bilər. **İki faktorlu autentifikasiya** (2FA) girişdə paroldan sonra ikinci bir sübut istəyir: telefonunuzdakı tətbiqin verdiyi kod və ya açar. Parolu bilən adam telefonunuz olmadan daxil ola bilmir.

GitHub kod töhfə verən hesablardan 2FA-nı tələb edir. Belə hesaba 45 gün vaxt verilir, sonra daha 7 gün. Bu müddətdə 2FA qurulmasa, hesaba girmək olmur. Ən yaxşısı onu hesabı açan kimi qurmaqdır.

2FA **Settings** → **Password and authentication** səhifəsində, **Two-factor authentication** bölməsində qurulur. Əsas üsul iki cürdür:

- **Authenticator tətbiqi** (TOTP): telefondakı tətbiq hər 30 saniyədən bir yeni 6 rəqəmli kod göstərir. GitHub bu üsulu tövsiyə edir.
- **SMS**: kod telefon nömrənizə mesajla gəlir. SMS-i ələ keçirmək olur və o, hər ölkədə işləmir. Ona görə bu üsul zəifdir.

## Authenticator tətbiqini qoşmaq {#totp}

**Enable two-factor authentication** düyməsindən sonra GitHub QR kod göstərir. Sam telefondakı authenticator tətbiqi ilə onu skan edir. QR kodu skan etmək alınmasa, **setup key** linki eyni məlumatı mətn kimi verir.

Tətbiq 6 rəqəmli kod göstərməyə başlayır. Sam bu kodu formaya yazır. Belə GitHub tətbiqin düzgün qoşulduğunu yoxlayır.

Sonra GitHub **recovery code**-ları göstərir. Bunlar 16 ehtiyat koddur. Telefon itəndə hər biri bir dəfə girişə yarayır. Sam onları **Download** ilə yükləyir və parol menecerində saxlayır. **I have saved my recovery codes** düyməsindən sonra 2FA işə düşür.

> **Diqqət:** recovery code-ları itirsəniz və telefon da itsə, hesaba qayıtmaq çox çətin olur. Təhlükəsizlik səbəbindən GitHub Support da girişi bərpa edə bilməyə bilər. Kodları telefondan ayrı yerdə saxlayın.

Bundan sonra hər girişdə GitHub paroldan sonra tətbiqdəki kodu soruşur. Sonradan ikinci üsul da əlavə etmək olar: passkey, fiziki təhlükəsizlik açarı və ya GitHub Mobile tətbiqi.
