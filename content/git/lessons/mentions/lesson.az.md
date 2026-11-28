Repository-ni izləməyən adam issue-ya yazılan şərhdən xəbər tutmur. **Mention**, yəni şərhdə `@` ilə adı çəkmək, konkret adama bildiriş göndərir. `#` ilə nömrə yazanda isə başqa issue və ya PR-a link yaranır.

Nümunə `bright-school` təşkilatının məktəb dərs cədvəli tətbiqi `school-timetable`-dir: onu Ayla (`ayla-karimova`), Sam (`sam-lee`) və kiçik bir komanda yazır.

## Adamı çağırmaq {#user-mention}

Ayla #14 issue-nu açıb: bazar ertəsi iki dərs eyni saata düşür. Cədvəli hesablayan kodu Sam yazıb, ona görə Ayla şərhdə onu çağırır. `@` yazan kimi siyahı açılır. Hərf əlavə etdikcə siyahı daralır. Ayla `sam-lee`-ni seçir, Enter basır və şərhi göndərir.

Sam bildiriş alır və bu issue-ya abunə olur. Yəni sonrakı şərhlər də ona gəlir. Mention-ı sonradan şərhi redaktə edib əlavə etsəniz də, adam bildiriş alır.

Siyahıda hər istifadəçi yox, repository-nin əməkdaşları və bu müzakirədə yazanlar görünür. Bildiriş yalnız repository-ni görə bilən adama gedir. Repository təşkilata aiddirsə, adam həm də təşkilatın üzvü olmalıdır.

## Komandanı çağırmaq {#team-mention}

**Təşkilat** (organization) bir qrupun repository-lərini saxlayan ortaq hesabdır, `bright-school` kimi. **Team** təşkilat üzvlərindən ibarət qrupdur: burada `frontend` və `backend`. Təşkilatları 18-ci modulda ətraflı keçəcəyik.

Ayla səhvin harada olduğunu bilmir. Cədvəli server tərəfi qaytarır. Ona görə Ayla bütün backend komandasını çağırır: `@bright-school/backend`. Format belədir: əvvəl təşkilat, sonra `/` və team-in adı. Team-in hər üzvü bildiriş alır və müzakirəyə abunə olur.

**Visible** team-i təşkilatın hər üzvü görür və çağıra bilər. **Secret** team-i isə yalnız onun üzvləri və təşkilatın sahibləri görür.

## Issue və commit-lərə istinad {#references}

Ayla #14-də yazır: `Looks like #12 again`. `#12` eyni repository-dəki 12 nömrəli issue və ya PR-a link olur. `#` yazanda da siyahı açılır: repository-nin issue və PR-ları. Nömrə və ya başlıq yazıb siyahını daraltmaq olar.

Başqa repository üçün qabağa onun tam adını yazın: `bright-school/school-website#5`. Commit-in SHA-sı, yəni uzun hash-i də linkə çevrilir. Göstərilən mətn onun ilk 7 simvoludur. Məsələn, `1234567890abcdef1234567890abcdef12345678` `1234567` kimi görünür. Bu hash uydurmadır.

İstinad iki tərəflidir. #12-nin tarixçəsində #14-ə geri link görünür. Belə #12-yə baxan adam #14-dəki söhbəti də görür. Adi istinad issue-nu bağlamır: bunun üçün "Issue-lar" dərsindəki açar sözlər lazımdır (`Closes #12`).

## Nə vaxt çağırmaq {#when-to-mention}

Mention adamın işini kəsir. Sualı kim cavablandıra bilirsə, onu çağırın. Ayla cədvəl hesabı haqqında soruşanda yalnız Sam-ı çağırır. Səhvin harada olduğu bilinməyəndə team-i çağırmaq yerindədir.

Eyni adamı hər şərhdə təkrar çağırmayın: o, artıq abunədir və yeni şərhləri onsuz da görür. Şərhdə adamdan nə istədiyinizi yazın. `@sam-lee can you look?` azdır. `@sam-lee why is Monday counted twice?` Sam-a nəyə baxacağını deyir.
