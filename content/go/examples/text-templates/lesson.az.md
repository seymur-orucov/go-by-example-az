Şablon (template) boşluqları olan hazır mətndir, doldurulacaq blank kimi: klinika hər pasiyentə eyni xatırlatma göndərir, yalnız ad, həkim və saat dəyişir. `Printf`-də verb-lər arqumentlərlə sıra ilə əvəz olunur və format sətri koddadır. Şablonda isə boşluq birbaşa verilənin sahəsinin adını çəkir (`{{.Patient}}`), mətnin içində şərt və dövr ola bilər, mətnin özü isə ayrıca faylda saxlanıla və proqramçı olmayan biri tərəfindən dəyişdirilə bilər.

Go-da bunun üçün `text/template` package-i var. Bu dərsdə həkim qəbulu üçün xatırlatma mesajları hazırlayırıq: iki pasiyent, biri ac qarına gəlməlidir və özü ilə sənəd gətirməlidir, digəri yox.

## Şablonu qurmaq və icra etmək {#parse}

`template.New("greet")` adı olan boş şablon yaradır (ad xəta mətnlərində görünür), `Parse` isə mətni oxuyur. `{{` və `}}` arasındakı hissə action-dır: şablonun dolduracağı yer. Nöqtə (`.`) şablona verilən verilənin özüdür, `.Patient` isə onun `Patient` sahəsi. `Parse` şablon və xəta qaytarır; `template.Must` xəta olanda panic edir, ona görə mətn kodda sabit yazılıbsa, səhv proqram başlayan kimi üzə çıxır.

`Execute(os.Stdout, v)` şablonu `v` ilə doldurub nəticəni `Fprintf` kimi verilən yerə yazır. Şablon bir dəfə parse olunur, sonra hər pasiyent üçün yenidən icra olunur: `send` closure-u bunu bütün qəbullar üçün edir və `Execute`-un qaytardığı xətanı yoxlayır. Belə xəta məsələn struct-da olmayan sahədə yaranır: `{{.Room}}` yazsaq, `can't evaluate field Room in type main.Visit` alarıq.

> **Diqqət:** Şablon yalnız böyük hərflə başlayan (exported) sahələri görür. Kiçik hərfli `name` sahəsinə müraciət `Execute` zamanı xəta verir.

## Şərt: if və else {#if}

`{{if .Fasting}}…{{else}}…{{end}}` Go-dakı `if` kimi işləyir: şərt doğrudursa birinci hissə, deyilsə `else`-dən sonrakı hissə çap olunur. Blok `{{end}}` ilə bağlanır. Şərt yalnız `bool` ola bilməz: `0`, boş string, `nil` və boş slice də yalan (false) sayılır, ona görə `{{if .Bring}}` "gətiriləcək bir şey varmı?" sualına cavab verir.

## Dövr: range {#range}

`{{range .Bring}}…{{end}}` slice-ın hər elementi üçün blokun içini bir dəfə çap edir. Blokun içində nöqtə artıq bütün `Visit` deyil, cari elementdir, ona görə `{{.}}` sənədin adını verir. Slice boşdursa və ya `nil`-dirsə, `{{else}}` hissəsi işləyir: Omarın siyahısı boşdur və "nothing" çap olunur.

> **Bilgi:** Dövrün içində bütün verilənə qayıtmaq üçün `$` yazılır: `{{range .Bring}}{{$.Patient}}{{end}}`. `{{.Patient}}` isə orada xəta verər, çünki nöqtə string-dir.

## Boşluqları kəsmək {#trim}

Uzun şablonu bir neçə sətirdə yazmaq oxumağı asanlaşdırır. Bunun üçün backtick içində yazılan raw string literal istifadə edirik: o, bir neçə sətrə yayıla bilir və `\n` kimi işarələri çevirmədən olduğu kimi saxlayır. Problem odur ki, `{{range}}` və `{{end}}` sətirlərindən sonrakı sətir keçidləri də nəticəyə düşür və məktubda boş sətirlər yaranır.

`{{-` action-dan əvvəlki bütün boşluqları və sətir keçidlərini silir, `-}}` isə ondan sonrakıları. Burada `{{- range` və `{{- end` lazımsız keçidləri götürür: Noranın məktubunda boş sətir qalmır, Omarın məktubu isə sənəd siyahısı olmadan iki sətirdən ibarət olur.

> **Diqqət:** Tire ilə mətn arasında boşluq olmalıdır: `{{- 3}}` boşluqları kəsir, `{{-3}}` isə sadəcə mənfi üç ədədidir.
