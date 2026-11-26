Sətir filtri (line filter) mətni sətir-sətir oxuyan, hər sətirlə nəsə edən və nəticəni yazan kiçik proqramdır. Unix-in `grep`, `sort`, `uniq` kimi alətləri belə işləyir: biri o birinin çıxışını oxuyur və onlar boru (pipe) ilə zəncir kimi birləşdirilir: `cat list.txt | grep milk`. Filtr adətən standart girişdən (`os.Stdin`) oxuyur və standart çıxışa (`os.Stdout`) yazır, ona görə istənilən fayl və ya başqa proqramın çıxışı ilə işləyə bilir.

Bu dərsdə ailə çatından köçürülmüş alış-veriş siyahısını təmizləyirik: artıq boşluqları, şərhləri və boş sətirləri atırıq, təkrarları çıxarırıq və qalanları nömrələyirik.

## io.Reader və io.Writer {#reader}

`cleanList` faylı yox, `io.Reader` qəbul edir: `Read` metodu olan istənilən dəyəri. `*os.File`, `os.Stdin` və `strings.NewReader`-in qaytardığı dəyər bu interface-ə uyğundur. Çıxış da eyni qaydada `io.Writer`-dir: `os.Stdout`, fayl, ya da başqa bir yer. `bufio.NewScanner` istənilən `io.Reader`-i sətirlərə bölür, ona görə funksiya mənbədən asılı deyil və onu sınamaq üçün fayl yaratmaq lazım gəlmir.

## Sətri təmizləmək {#clean}

`strings.TrimSpace` sətrin əvvəlindəki və sonundakı boşluqları silir, `strings.ToLower` isə hərfləri kiçildir: `"  EGGS  "` və `"eggs"` eyni məhsula çevrilir. Boş sətirlər və `#` ilə başlayan şərhlər (`# for the weekend`) siyahıya aid deyil, `continue` onları ötürür.

## Təkrarları atmaq {#unique}

`seen` map-i artıq yazılmış məhsulları yadda saxlayır: `seen[item]` olmayan açar üçün zero value, yəni `false` qaytarır, ona görə ayrıca yoxlama lazım deyil. Yeni məhsul `fmt.Fprintf` ilə `out`-a yazılır və nömrələnir. Dövr bitəndə funksiya `sc.Err()` qaytarır: oxuma xətası olubsa, çağıran bunu bilməlidir.

## Filtri işə salmaq {#run}

Nümunədə giriş `strings.NewReader(chat)`-dır ki, proqramın nəticəsi hər dəfə eyni olsun. Real filtrdə yalnız arqument dəyişir: `cleanList(os.Stdin, os.Stdout)`. Onda siyahını fayldan `go run main.go < list.txt` ilə, ya da başqa proqramdan boru ilə ötürmək olar.

Xəta mesajı `os.Stderr`-ə, standart xəta axınına yazılır. Boru və `>` yalnız `os.Stdout`-u yönləndirir, ona görə xəta mesajları növbəti proqramın girişinə və ya nəticə faylına qarışmır.

> **Bilgi:** `Scanner` bir sətri ən çox 64 KB qəbul edir. Daha uzun sətirlərdə `Scan()` dayanır və `sc.Err()` xəta qaytarır; limiti `sc.Buffer` ilə artırmaq olar.
