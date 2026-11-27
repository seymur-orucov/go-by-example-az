# Glossary (Go)

For lesson authors: the Go terms used in the lessons, how each one is written in Azerbaijani text, and its short explanation. New lessons and the `write-lesson` skill follow it, so a term reads the same in every lesson.

Rules (from [DECISIONS.md](DECISIONS.md)):

- **Kept** terms stay in English (`slice`, `goroutine`, `channel`). Suffixes go after a hyphen: `slice-ın`, `goroutine-lər`, `channel-a`. The first lesson that uses a term explains it in one short sentence, with the Azerbaijani gloss in parentheses where one exists: "Konkurentlik (concurrency)", "Pointer (göstərici)".
- **Translated** terms are written in Azerbaijani; the English term is given once in parentheses where the reader will meet it in docs or error messages: "Sabit", "Rekursiya", "Mühit dəyişəni (environment variable)".
- Keywords, identifiers, package names and error messages are code: `defer`, `sync.WaitGroup`, `fatal error: all goroutines are asleep - deadlock!`.
- The "First explained in" column is the lesson where the term is introduced; link to it from a later lesson instead of explaining the term again.

Explanations below are in Azerbaijani, as on the site. Checked against the lesson texts on 2026-11-27.

## Əsaslar

| Term | In lessons | Explanation (az) | First explained in |
|---|---|---|---|
| package | kept | Go kodunun vahidi; hər fayl `package` elanı ilə başlayır, proqram `package main`-dən işə düşür | hello-world |
| import | kept (keyword) | başqa package-ləri fayla qoşmaq | hello-world |
| variable | translated: **dəyişən** | ad verilmiş, dəyəri dəyişə bilən yaddaş yeri | variables |
| `:=` (short variable declaration) | kept as code | dəyişəni elan edib dəyər vermək, tipi dəyərdən çıxarılır; yalnız funksiyanın içində | variables |
| zero value | kept | dəyər verilməyən dəyişənin avtomatik aldığı dəyər: `0`, `""`, `false`, `nil` | variables |
| constant | translated: **sabit** | proqram işləyərkən dəyişməyən, kompilyasiya zamanı məlum olan dəyər (`const`) | constants |
| loop | translated: **dövr** | kodu təkrar-təkrar icra etmək; Go-da yeganə dövr `for`-dur | for |
| literal | kept | dəyəri kodda birbaşa yazmaq: `42`, `"çay"`, `[]int{1, 2}` | arrays |

## Kolleksiyalar

| Term | In lessons | Explanation (az) | First explained in |
|---|---|---|---|
| array | kept | eyni tipli elementlərin sabit ölçülü siyahısı; ölçü tipin hissəsidir | arrays |
| slice | kept | array üzərində qurulan, böyüyə bilən siyahı; `len` və `cap`-i var | slices |
| capacity | kept as `cap`; "ayrılmış yerin həcmi" (slices), "tutum" (channels) | slice-ın və ya buffered channel-ın yer açmadan saxlaya biləcəyi element sayı | slices |
| map | kept | açarları dəyərlərlə əlaqələndirən kolleksiya; sıra saxlamır | maps |
| comma ok | kept | `v, ok := m[key]`: ikinci nəticə açarın olub-olmadığını göstərir | maps |
| byte | translated: **bayt** | 0–255 arası kiçik ədəd; mətn yaddaşda baytlarla saxlanılır | strings-and-runes |
| rune | kept | bir simvolu təmsil edən ədəd, simvolun Unicode-dakı nömrəsi | strings-and-runes |
| UTF-8 | kept | mətni baytlara çevirən kodlaşdırma; bir hərf 1–4 bayt tuta bilər | strings-and-runes |

## Funksiyalar

| Term | In lessons | Explanation (az) | First explained in |
|---|---|---|---|
| function | translated: **funksiya** | adı, parametrləri və nəticəsi olan kod bloku (`func`) | functions |
| blank identifier | kept as `_` | lazım olmayan dəyəri atmaq üçün yer | range |
| variadic | kept | istənilən sayda arqument qəbul edən funksiya (`...int`) | variadic-functions |
| function literal | kept | adsız, yerindəcə yazılan funksiya | closures |
| closure | kept | ətrafındakı dəyişənləri "yadda saxlayan" function literal | closures |
| recursion | translated: **rekursiya** | funksiyanın özünü çağırması; dayanma şərti mütləqdir | recursion |
| stack overflow | kept as code | dayanmayan rekursiyada call stack-in dolması | recursion |

## Tiplər və strukturlar

| Term | In lessons | Explanation (az) | First explained in |
|---|---|---|---|
| pointer | kept (göstərici) | dəyərin özünü yox, yaddaşdakı ünvanını saxlayan dəyər (`*T`, `&x`) | pointers |
| struct | kept | bir-biri ilə əlaqəli bir neçə dəyəri (sahəni) bir yerə yığan tip | structs |
| method | translated: **metod** | receiver-i olan funksiya | methods |
| receiver | kept | metodun bağlı olduğu dəyər: `func (p Playlist) ...` | methods |
| interface | kept | tipin nə bacardığını təsvir edən metodlar dəsti | interfaces |
| type assertion | kept | interface-in içindəki konkret tipi yoxlamaq: `c, ok := s.(Circle)` | interfaces |
| type switch | kept | interface-in tipinə görə `switch` | interfaces |
| enum | kept (sadalama) | bir neçə sabit variantdan biri ola bilən dəyər; Go-da `const` + `iota` ilə | enums |
| iota | kept as code | `const` blokunda 0-dan başlayıb hər sətirdə bir artan sayğac | enums |
| embedding | kept (daxiletmə) | struct-ın içinə başqa tipi sahə adı olmadan yazmaq | struct-embedding |
| generics | kept | tipi də parametr kimi verib funksiyanı bir dəfə yazmaq | generics |
| type parameter | kept | generic funksiyada tipin yerini tutan ad: `T` | generics |
| constraint | kept (məhdudiyyət) | type parameter-in hansı tiplər ola biləcəyini təyin edən interface | generics |
| iterator | kept | dəyərləri əvvəlcədən yığmadan, lazım olduqca `range`-ə verən funksiya | range-over-iterators |
| exported | kept | böyük hərflə başlayan, package-dən kənarda görünən ad | text-templates |

## Xətalar

| Term | In lessons | Explanation (az) | First explained in |
|---|---|---|---|
| error | translated: **xəta**; the type stays `error` | işin alınmadığını bildirən dəyər; funksiya `(nəticə, error)` qaytarır | multiple-return-values |
| sentinel error | translated: **xəta dəyişəni** | müqayisə üçün package səviyyəsində elan olunan xəta: `ErrNotFound` | errors |
| wrap | translated: **xətanı bükmək** | xətaya kontekst əlavə edib ilkin xətanı içində saxlamaq (`%w`) | errors |
| panic | kept | proqramı dərhal dayandıran gözlənilməz vəziyyət | panic |
| stack trace | translated: **çağırış izi** | panic-in hansı funksiyada və sətirdə baş verdiyini göstərən siyahı | panic |
| exit code | translated: **çıxış kodu** | proqramın əməliyyat sisteminə qaytardığı nəticə; 0 uğurdur | panic |
| defer | kept as code | çağırışı onu yazan funksiya bitənə qədər təxirə salmaq | defer |
| recover | kept as code | `defer` içində panic-i tutub proqramı davam etdirmək | recover |
| named result | translated: **adlı nəticə** (named result) | funksiya imzasında adı verilən nəticə: zero value ilə başlayan adi dəyişən, funksiya bitəndə son dəyəri qaytarılır | recover |

## Konkurentlik

| Term | In lessons | Explanation (az) | First explained in |
|---|---|---|---|
| concurrency | translated: **konkurentlik** | bir neçə işi eyni vaxtda irəlilətmək | goroutines |
| goroutine | kept | eyni vaxtda işləyən yüngül iş; `go f()` ilə başlayır | goroutines |
| WaitGroup | kept as `sync.WaitGroup` | başladılan goroutine-ləri sayıb hamısının bitməsini gözləmək | goroutines |
| data race | kept | iki goroutine-in eyni dəyişənə eyni anda yazması; nəticə pozulur | goroutines |
| channel | kept (kanal) | goroutine-lər arasında dəyər ötürən boru | channels |
| unbuffered | translated: **buffer-siz** | dəyəri saxlamayan channel: göndərən qəbul edəni gözləyir | channels |
| buffer | kept | channel-ın içində dəyərlər üçün yer | channel-buffering |
| deadlock | kept | bütün goroutine-lərin bir-birini gözləyib ilişməsi | channels |
| FIFO | kept | ilk girən ilk çıxır: buffered channel növbə kimi işləyir | channel-buffering |
| select | kept as code | bir neçə channel əməliyyatından hazır olanı seçmək | select |
| timeout | kept | gözləməyə vaxt limiti | timeouts |
| timer / ticker | kept | bir dəfə / hər `d` müddətindən bir siqnal verən saat | timers, tickers |
| worker pool | kept (işçi hovuzu) | eyni növbədən iş götürən bir neçə goroutine | worker-pools |
| rate limiting | kept (sürət məhdudiyyəti) | vahid vaxtda ən çox N əməliyyat | rate-limiting |
| atomic | translated: **atomik** | bölünməz əməliyyat: oxumaq, dəyişmək və yazmaq bir addımda | atomic-counters |
| mutex | kept | kodun bir hissəsinə eyni anda yalnız bir goroutine-i buraxan kilid | mutexes |

## Mətn və verilənlər

| Term | In lessons | Explanation (az) | First explained in |
|---|---|---|---|
| stdout / stderr / stdin | kept | standart çıxış / xəta çıxışı / standart giriş | string-formatting, line-filters |
| template | translated: **şablon** | boşluqları olan hazır mətn, dəyərlərlə doldurulur | text-templates |
| regular expression | translated: **requlyar ifadə** (regexp) | mətnin formasını təsvir edən kiçik dil | regular-expressions |
| marshal / unmarshal | kept | struct-ı JSON-a çevirmək / JSON-dan struct doldurmaq | json |
| struct tag | kept | sahənin JSON və ya XML-də adını təyin edən qeyd: `` `json:"name"` `` | json |
| epoch | kept | 1970-01-01 00:00 UTC: Unix vaxtının başlanğıc nöqtəsi | epoch |
| layout | kept | Go-da tarix formatı: nümunə tarix `2006-01-02 15:04:05` ilə yazılır | time-formatting-parsing |
| seed | kept | təsadüfi ədədlər generatorunun başlanğıc ədədi | random-numbers |
| hash | translated: **heş** | məlumatdan sabit ölçülü "barmaq izi"; birtərəfli çevirmə | sha256-hashes |
| Base64 | kept | baytları 64 təhlükəsiz simvoldan ibarət mətnə çevirmək | base64-encoding |

## Fayllar və test

| Term | In lessons | Explanation (az) | First explained in |
|---|---|---|---|
| path | translated: **fayl yolu** | faylın qovluqlar üzrə ünvanı; tam (absolute) və ya nisbi | file-paths |
| directory | translated: **qovluq** | faylları və başqa qovluqları saxlayan yer | directories |
| temporary file | translated: **müvəqqəti fayl** | yalnız proqram işləyərkən lazım olan fayl | temporary-files-and-directories |
| pipe | translated: **boru** | bir proqramın çıxışını digərinin girişinə vermək: `cat x \| sort` | line-filters |
| table-driven test | translated: **hallar cədvəli** | hər sətri bir hal olan slice ilə eyni funksiyanı yoxlamaq | testing-and-benchmarking |
| subtest | translated: **alt test** | `t.Run` ilə başlayan, ayrıca göstərilən test | testing-and-benchmarking |
| benchmark | kept | sürəti və yaddaşı ölçən test | testing-and-benchmarking |

## Sistem və şəbəkə

| Term | In lessons | Explanation (az) | First explained in |
|---|---|---|---|
| flag | translated: **bayraq** | komanda sətrində `-name=value` seçimi | command-line-flags |
| subcommand | translated: **alt əmr** | alətin işini bölən əmr: `git commit`, `go test` | command-line-subcommands |
| environment variable | translated: **mühit dəyişəni** | əməliyyat sisteminin proqrama verdiyi `AD=dəyər` cütü | environment-variables |
| handler | kept | qeydin (slog) və ya HTTP sorğusunun necə işlənəcəyini təyin edən dəyər | logging, http-server |
| context | kept as `context` | işə vaxt limiti (deadline) və ya ləğv (cancel) siqnalı ötürən dəyər | context |
| child process | translated: **uşaq proses** | Go proqramının işə saldığı başqa proqram (`os/exec`) | spawning-processes |
| PID | kept | proses id-si | execing-processes |
| signal | translated: **siqnal** | əməliyyat sisteminin prosesə göndərdiyi xəbər: `SIGINT`, `SIGTERM` | signals |
