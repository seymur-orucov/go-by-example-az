**Profil README-si** profil səhifəsinin yuxarısında görünən Markdown mətnidir. Bio ən çox 160 simvoldur, README-də isə özünüz haqqında başlıq, siyahı və keçidlərlə daha geniş yazmaq olar. Bu mətn xüsusi bir repository-dəki `README.md` faylından gəlir.

Nümunə Sam-ın "Profili qurmaq" dərsində qurduğu `sam-lee` profilidir.

## Xüsusi repository {#special-repo}

Profil README-si üçün adı istifadəçi adınızla eyni olan repository lazımdır. Sam-ın istifadəçi adı `sam-lee`-dir, ona görə repository-nin adı da `sam-lee` olur: `github.com/sam-lee/sam-lee`. Ad tam eyni olmalıdır. `samlee` və ya `sam-lee-profile` adlı repository-nin README-si profildə görünmür.

Repository "GitHub-da repository yaratmaq" dərsindəki formada yaradılır: **+** → **New repository**. Sam **Repository name** sahəsinə `sam-lee` yazır. Ad istifadəçi adı ilə üst-üstə düşəndə GitHub formada bunun xüsusi repository olduğunu bildirən qısa qeyd göstərir. Maketdə bu qeydin mənası verilib, GitHub-dakı sözlər başqa ola bilər.

Sam **Public** seçir və **Add README** seçimini açır. Burada lokal repository yoxdur, ona görə ilk commit-i GitHub-ın yaratması problem deyil. Sonra **Create repository** düyməsini basır.

## README-ni yazmaq {#write}

Yeni `README.md`-də GitHub-ın hazır şablon mətni olur. Sam onu öz mətni ilə əvəz edir. Repository yarananda sağ sütunun üstündə **Edit README** linki çıxır. Faylı adi qaydada da açmaq olar: faylın səhifəsində qələm işarəsi (**Edit file**). Dəyişiklik **Commit changes...** düyməsi ilə commit edilir.

Mətn adi Markdown-dır, "Markdown" dərsindəki kimi yazılır. Sam üç şey yazır: kim olduğunu, indi nə üzərində işlədiyini və onunla necə əlaqə saxlamaq olar. Şəkil və GIF də əlavə etmək olar, amma Sam-a mətn kifayətdir.

Qısa yazın: profilə baxan adam README-ni bir dəqiqəyə oxumalıdır. Pinned repository-lərin siyahısını təkrarlamayın, onlar profildə onsuz da görünür. GitHub Docs başqa fikirlər də verir: fəxr etdiyiniz töhfələr və iştirak etdiyiniz icmalarda kömək almağın yolu.

> **Diqqət:** repository public-dir, README-ni hər kəs oxuyur. Telefon nömrəsi, ev ünvanı və şəxsi email kimi məlumatı yazmayın.

## Profildə nəticə {#on-profile}

Commit-dən sonra README `github.com/sam-lee` səhifəsinin yuxarısında görünür. GitHub Markdown-u formatlanmış göstərir: `#` başlıq olur, `-` siyahı olur. Pinned repository-lər README-dən aşağıda qalır, ad, şəkil və bio isə yan sütunda.

GitHub README-ni yalnız dörd şərt ödənəndə göstərir:

- repository-nin adı istifadəçi adı ilə eynidir;
- repository public-dir;
- `README.md` faylı repository-nin kökündədir;
- fayl boş deyil.

README görünmürsə, bu siyahını yoxlayın. Məsələn, `docs/README.md` sayılmır: fayl kökdə olmalıdır.

> **Bilgi:** belə adlı repository 2020-ci ilin iyulundan əvvəl yaradılıbsa, onun README-si profildə özü görünmür. Repository səhifəsindəki **Share to profile** düyməsi onu profilə çıxarır.

## Gizlətmək və silmək {#hide}

README-ni profildən çıxarmaq üçün şərtlərdən birini pozmaq kifayətdir. GitHub Docs üç yol sayır:

- repository-ni private etmək (**Settings** → **Danger Zone** → **Change visibility**, "Private və public repository" dərsi);
- `README.md` faylını silmək və ya boşaltmaq;
- repository-nin adını dəyişmək. İstifadəçi adı dəyişəndə də adlar artıq eyni olmur və README profildən çıxır.

Əmin deyilsinizsə, GitHub private etməyi tövsiyə edir. Onda fayl və tarixçə yerində qalır. README-ni qaytarmaq üçün repository-ni yenə public etmək kifayətdir.

> **Diqqət:** profilin özünü private etmək README-ni gizlətmir. GitHub-da belə ayar var, amma private profildə də README, bio və şəkil hər kəsə görünür.
