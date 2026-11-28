**Wiki** repository-nin sənədlər üçün ayrıca bölməsidir. Orada bir neçə səhifə olur, səhifələr bir-birinə keçidlə bağlanır. README layihəni qısa təqdim edir, wiki isə uzun bələdçilər və tez-tez verilən suallar üçündür.

Nümunə Ayla-nın açıq mənbəli qeyd tətbiqi `quicknote`-dur: onun README-si istifadə bələdçisi, FAQ və klaviatura qısayolları ilə çox uzanıb.

## README və ya wiki {#readme-or-wiki}

README repository-yə gələn adamın ilk gördüyü mətndir. O, layihənin nə etdiyini, necə quraşdırıldığını və işlədildiyini deyir. Uzun bölmələr bu məlumatı aşağı itələyir və oxucu onu axtarmalı olur.

Ayla mətni ikiyə bölür. README-də qısa təsvir, quraşdırma və bir istifadə nümunəsi qalır. İstifadə bələdçisi, klaviatura qısayolları və FAQ wiki-yə köçür. README-nin sonunda wiki-yə keçid qoyulur.

Wiki repository səhifəsindəki **Wiki** tab-ındadır. Public repository-nin wiki-sini hamı oxuyur, private repository-nin wiki-sini isə yalnız repository-yə girişi olanlar. GitHub Free-də wiki yalnız public repository-lərdə var. Private repository-də wiki üçün GitHub Pro, Team və ya Enterprise lazımdır.

## Wiki-ni açmaq və icazələr {#enable-wiki}

Wiki repository-nin **Settings** tab-ında, **Features** bölməsində açılır və bağlanır. **Wikis** qutusu işarəlidirsə, repository-də **Wiki** tab-ı olur. Qutunu söndürəndə səhifələr gizlənir, amma silinmir. Wiki yenidən açılanda onlar geri qayıdır.

Public repository-də wiki-ni kimin dəyişə biləcəyini **Restrict editing to collaborators only** qutusu təyin edir. Qutu işarəli olanda wiki-ni yalnız collaborator-lar, yəni repository-yə yazmaq icazəsi olanlar dəyişir. Söndürəndə GitHub hesabı olan hər kəs dəyişə bilir. Ayla qutunu işarəli saxlayır: səhifələri o və komandası yazacaq. Wiki-ni oxumaq isə hamı üçün açıq qalır.

> **Bilgi:** axtarış sistemləri wiki-ni iki şərtlə indeksləyir: repository-nin ən azı 500 ulduzu olmalı və redaktə collaborator-larla məhdudlaşdırılmalıdır. Mətnin axtarışda tapılması lazımdırsa, GitHub Docs public repository-də GitHub Pages saytını tövsiyə edir.

## Səhifələr və keçidlər {#pages-and-links}

Boş wiki-də GitHub ilk səhifəni yaratmağı təklif edir. Bu səhifə **Home** adlanır və Wiki tab-ı açılanda göstərilir. Ayla Home-a layihənin qısa təsvirini və başqa səhifələrə keçidləri yazır.

Sonrakı səhifələr sağ yuxarıdakı **New Page** düyməsi ilə yaranır. Formada başlıq, mətn və **Edit message** sahəsi var. Mətn Markdown-la yazılır, başqa format **Edit mode** menyusundan seçilir. **Edit message** commit mesajıdır: **Save Page** hər dəfə wiki-də bir commit yaradır. Hazır səhifə **Edit** düyməsi ilə dəyişdirilir.

Səhifələr adi Markdown keçidi ilə bağlanır, keçidə səhifənin tam ünvanı yazılır: `[FAQ](https://github.com/ayla-karimova/quicknote/wiki/FAQ)`. Başlıqda boşluq varsa, ünvanda o `-` olur: `Keyboard shortcuts` səhifəsi `.../wiki/Keyboard-shortcuts` ünvanındadır.

> **Diqqət:** səhifənin başlığında `\ / : * ? " < > |` simvollarını işlətməyin. Bəzi əməliyyat sistemlərində belə adlı fayllarla işləmək olmur.

## Sidebar və footer {#sidebar-footer}

Wiki səhifəsinin sağında səhifələrin siyahısı (**Pages**) var. Səhifə çoxalanda bu siyahıda lazım olanı tapmaq çətinləşir. Ayla oxucu üçün öz menyusunu istəyir. Orada əvvəl bələdçi gəlməlidir, sonra qısayollar və FAQ.

Bunun üçün sağdakı **Add a custom sidebar** linki var. Sidebar adi wiki səhifəsi kimi yazılır və saxlanır, adı `_Sidebar`-dır. Ayla ora keçidləri öz sırası ilə yazır. Bu sidebar wiki-nin bütün səhifələrində görünür.

Səhifənin altındakı **Add a custom footer** eyni yolla `_Footer` səhifəsini yaradır. Footer hər səhifənin aşağısında görünür. Ayla ora sual üçün issue açmağı təklif edən bir sətir yazır.

## Wiki ayrıca Git repository-sidir {#wiki-repository}

Wiki layihənin kodu ilə bir repository-də saxlanmır. Onun öz Git repository-si var. Ünvanı layihənin ünvanına `.wiki` əlavə etməklə alınır: `git clone https://github.com/ayla-karimova/quicknote.wiki.git`. Wiki-də ən azı bir səhifə yarandıqdan sonra onu clone etmək olur.

Hər səhifə bir fayldır: `Home.md`, `Keyboard-shortcuts.md`, `_Sidebar.md`, `_Footer.md`. Faylın adı səhifənin başlığını, uzantısı isə formatını təyin edir. `.md` Markdown deməkdir. Ayla faylları redaktorda dəyişir, sonra commit və push edir. Çox səhifəni birdən dəyişmək belə rahatdır.

Wiki repository-sində də branch yaratmaq olar. Amma oxucular yalnız default branch-a push olunan dəyişiklikləri görür.
