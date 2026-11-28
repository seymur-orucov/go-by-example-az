Mühit dəyişəni (environment variable) əməliyyat sisteminin proqrama verdiyi `AD=dəyər` cütüdür: `PATH`, `HOME`, `LANG`. Komanda sətri arqumentlərini hər işə salanda yazırsınız, mühit dəyişənlərini isə shell, server və ya konteyner bir dəfə təyin edir. Ona görə port və gizli açarlar adətən mühit dəyişənlərində saxlanır: eyni kod noutbukda bir, serverdə başqa parametrlərlə işləyir.

Bu dərsdə kafedəki sifariş terminalının (kiosk) proqramını yazırıq: o, portu və valyutanı `KIOSK_` ilə başlayan mühit dəyişənlərindən götürür.

## os.Getenv {#getenv}

`os.Getenv` dəyişənin dəyərini string kimi qaytarır, dəyişən yoxdursa boş string. Proqramı adi qaydada işlətdik və `KIOSK_PORT` təyin olunmayıb, ona görə standart port 8080 seçilir. Bu, tipik nümunədir: mühit dəyişəni varsa, onu götür, yoxdursa, ağlabatan standart dəyər işlət. Bash-da proqramı `KIOSK_PORT=7000 go run main.go` kimi işlətsəniz, port 7000 olar.

## os.Setenv {#setenv}

`os.Setenv` dəyişəni proqramın öz içində təyin edir və ya dəyişir. Dəyişiklik yalnız bu prosesə (yəni işləyən proqramın özünə) və onun işə saldığı proqramlara görünür. Proqram bitəndən sonra terminaldakı dəyər əvvəlki kimi qalır. Mühit dəyişənlərinin dəyəri həmişə string-dir, ədəd lazımdırsa, `strconv` ilə çevirmək lazımdır.

## os.LookupEnv {#lookup}

`Getenv` iki halı ayırmır: dəyişən yoxdur, yoxsa var, amma dəyəri boşdur. `os.LookupEnv` ikinci nəticə kimi `bool` qaytarır: `KIOSK_GREETING` təyin olunub, sadəcə boşdur, ona görə `true`; `KIOSK_REGION` isə ümumiyyətlə yoxdur. Boş dəyərin öz mənası olanda bu fərq lazım olur: məsələn, boş `KIOSK_GREETING` "salamlama göstərmə" deməkdir.

## os.Unsetenv {#unset}

`os.Unsetenv` dəyişəni silir. Silinəndən sonra `LookupEnv` `false` qaytarır. Boş dəyər təyin edəndə isə `true` qaytarırdı.

## os.Environ {#environ}

`os.Environ` bütün mühit dəyişənlərini `AD=dəyər` formasında string slice kimi qaytarır. Maşında onlarla dəyişən olur, ona görə yalnız `KIOSK_` ilə başlayanları seçirik və sıralayırıq: siyahının sırası zəmanətli deyil. `strings.Cut` cütü ilk `=` işarəsində ad və dəyərə bölür.

> **Diqqət:** Mühit dəyişənlərində gizli açarlar ola bilər, ona görə `os.Environ()`-u bütövlükdə loga yazmayın.
