// Design v2 — sample content for roadmap nodes (theory · practice · visual · test · interview).
// Prototype data: on the platform each facet comes from content/<technology>/ and the node's
// quiz / interview files. Code is English (language-neutral), text is Azerbaijani.
window.W3_NODES = {
  "hello-world": {
    theory: "Hər icra olunan Go proqramı <code>package main</code> ilə başlayır və işə <code>main()</code> funksiyasından düşür. <code>fmt</code> paketi mətni ekrana çıxarır.",
    code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Open daily from 9:00")\n}',
    out: "Open daily from 9:00",
    steps: ["package main — icra olunan proqram", 'import "fmt" — çap üçün paket', "func main() — giriş nöqtəsi", "fmt.Println — mətn və yeni sətir"],
    quiz: { q: "Go proqramının giriş nöqtəsi hansı funksiyadır?", opts: ["init()", "main()", "start()", "run()"], ok: 1, why: "İcra olunan proqramda giriş nöqtəsi <code>main</code> paketindəki <code>main()</code>-dir." },
    interview: { lvl: "junior", q: "<code>package main</code> ilə digər paketlər arasında fərq nədir?", a: "<code>package main</code> icra olunan fayl yaradır və onda <code>main()</code> olmalıdır. Digər paketlər kitabxanadır: başqa kod onları <code>import</code> edir." },
  },
  variables: {
    theory: "<code>var</code> dəyişən elan edir; funksiyanın içində qısa <code>:=</code> yazılışı tipi dəyərdən özü çıxarır. Dəyər verilməyən dəyişən öz tipinin <b>sıfır dəyərini</b> alır.",
    code: 'var visits int\nname := "Lena"\nfmt.Println(name, visits)',
    out: "Lena 0",
    steps: ["var visits int → 0 (sıfır dəyər)", 'name := "Lena" → tip: string', "Println → Lena 0"],
    quiz: { q: "<code>var price float64</code> — <code>price</code> nəyə bərabərdir?", opts: ["nil", "0", "təyin olunmayıb", "NaN"], ok: 1, why: "Rəqəm tiplərinin sıfır dəyəri <code>0</code>-dır." },
    interview: { lvl: "junior", q: "<code>var</code> ilə <code>:=</code> arasında fərq nədir?", a: "<code>:=</code> yalnız funksiyanın içində işləyir və tipi dəyərdən çıxarır. <code>var</code> paket səviyyəsində də işləyir, tipi açıq yazmağa və dəyərsiz elan etməyə imkan verir." },
  },
  for: {
    theory: "Go-da tək dövr əmri <code>for</code>-dur: üç hissəli klassik forma, yalnız şərtli forma (başqa dillərdəki <code>while</code> kimi) və sonsuz <code>for { }</code>.",
    code: 'for day := 1; day <= 3; day++ {\n\tfmt.Println("day", day)\n}',
    out: "day 1\nday 2\nday 3",
    steps: ["day := 1 → başlanğıc", "day <= 3 → hər dövrdən əvvəl yoxlanılır", "day++ → hər dövrdən sonra"],
    quiz: { q: "Bu kod neçə sətir çap edir?", code: "for i := 0; i < 3; i++ {\n\tfmt.Println(i)\n}", opts: ["2", "3", "4"], ok: 1, why: "<code>i</code> 0, 1, 2 olur; 3-də şərt yalan olur." },
    interview: { lvl: "junior", q: "Go-da <code>while</code> yoxdursa, onu necə yazırsınız?", a: "Yalnız şərti olan <code>for</code> ilə: <code>for balance &lt; goal { … }</code>. Şərtsiz <code>for { … }</code> sonsuz dövrdür, ondan <code>break</code> ilə çıxılır." },
  },
  slices: {
    theory: "<b>Slice</b> — eyni tipli elementlərin dinamik siyahısıdır. Özü kiçik bir başlıqdır: altdakı array-ə göstərici, uzunluq (<code>len</code>) və tutum (<code>cap</code>). <code>append</code> tutum çatmayanda yeni, daha böyük array ayırır.",
    code: 'cart := []string{"milk", "bread"}\ncart = append(cart, "honey")\nfmt.Println(cart, len(cart))',
    out: "[milk bread honey] 3",
    steps: ["var cart []string → nil, len 0", 'append "milk" → yeni array, cap 1', 'append "bread" → cap 2', 'append "honey" → cap 4, bir boş yer'],
    quiz: { q: "Bu kod nə çap edir?", code: "s := []int{1, 2, 3}\nt := s[:2]\nt[0] = 9\nfmt.Println(s[0])", opts: ["1", "9", "0", "kompilyasiya xətası"], ok: 1, why: "<code>t</code> və <code>s</code> eyni array-i bölüşür." },
    interview: { lvl: "junior+", q: "<code>append</code> niyə bəzən orijinal slice-ın elementlərini dəyişir, bəzən dəyişmir?", a: "Tutum çatırsa, <code>append</code> eyni array-ə yazır və onu bölüşən slice dəyişikliyi görür. Çatmırsa, yeni array ayrılır və köhnə slice toxunulmaz qalır. Ona görə nəticəni həmişə yenidən mənimsədirik." },
  },
  maps: {
    theory: "Map açar–dəyər cütlərini saxlayır. Olmayan açar sıfır dəyər qaytarır, ona görə açarın varlığını <code>v, ok := m[k]</code> ilə yoxlayırıq.",
    code: 'stock := map[string]int{"milk": 4}\nqty, ok := stock["honey"]\nfmt.Println(qty, ok)',
    out: "0 false",
    steps: ["map yaradılır: milk → 4", 'stock["honey"] → belə açar yoxdur', "qty = 0, ok = false"],
    quiz: { q: "Bu kod nə çap edir?", code: 'stock := map[string]int{"milk": 4}\nqty, ok := stock["honey"]\nfmt.Println(qty, ok)', opts: ["0 false", "nil false", "panic", "4 true"], ok: 0, why: "Olmayan açar <code>int</code>-in sıfır dəyərini və <code>false</code> qaytarır." },
    interview: { lvl: "junior", q: "Map-də <code>range</code> ilə gəzəndə elementlərin sırası necə olur?", a: "Sıra təyin olunmayıb və hər işə salmada fərqli ola bilər. Sabit sıra lazımdırsa, açarları slice-a yığıb sıralayın." },
  },
  goroutines: {
    theory: "<code>go f()</code> funksiyanı ayrıca goroutine-də, digər kodla eyni vaxtda işə salır. Goroutine çox yüngüldür; işinin bitməsini gözləmək üçün <code>sync.WaitGroup</code> və ya channel lazımdır.",
    code: 'var wg sync.WaitGroup\nwg.Add(1)\ngo func() {\n\tdefer wg.Done()\n\tfmt.Println("order packed")\n}()\nwg.Wait()\nfmt.Println("order shipped")',
    out: "order packed\norder shipped",
    steps: ["wg.Add(1) → bir işi gözləyəcəyik", "go func() → yeni goroutine", "wg.Wait() → main gözləyir", "wg.Done() → main davam edir"],
    quiz: { q: "<code>main()</code> bitəndə hələ işləyən goroutine-lərə nə olur?", opts: ["gözlənilir", "proqramla birlikdə dayanır", "fonda davam edir"], ok: 1, why: "<code>main</code> qayıdanda proqram bitir; digər goroutine-lər gözlənilmir." },
    interview: { lvl: "middle", q: "Goroutine ilə OS thread arasında fərq nədir?", a: "Goroutine-i Go runtime idarə edir: kiçik stack ilə (bir neçə KB) başlayır və minlərlə goroutine az sayda OS thread üzərində planlaşdırılır. Thread isə əməliyyat sisteminindir və daha bahalıdır." },
  },
};
