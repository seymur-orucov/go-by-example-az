Go-da hər dəyərin tipi var və tip dəyərlə nə etmək olacağını müəyyən edir: mətnləri birləşdirmək, ədədləri toplamaq olar, amma ikisini bir-birinə qatmaq olmaz. Ən çox işlənən tiplər mətn (`string`), tam ədəd (`int`), kəsr ədəd (`float64`) və məntiqi dəyərdir (`bool`).

Bu dərsdə dəyərləri birbaşa yazıb nəticələrinə baxırıq. Onları adla saxlamaq — dəyişənlər — növbəti dərsin mövzusudur.

## Mətn {#strings}

Dırnaq içində yazılan dəyər mətndir, rəqəm olsa belə: `"2"` ədəd deyil. `+` iki mətni birləşdirir, amma arada boşluq qoymur — boşluğu özümüz əlavə edirik: `"Black" + " " + "tea"`.

## Tam ədədlər {#ints}

Tam ədəd (`int`) kəsr hissəsi olmayan ədəddir. İki tam ədədi böləndə nəticə də tam ədəd olur: 4 nəfər 50 dollarlıq hesabı bölsə, `50/4` → `12`, qalan 2 dollar nəzərə alınmır.

> **Diqqət:** kəsr hissə yuvarlaqlaşdırılmır, atılır: `19/10` da `1` verir.

## Kəsr ədədlər {#floats}

Kəsr ədəd (`float64`) onluq hissəsi ola bilən ədəddir; Go-da vergül yox, nöqtə yazılır: `12.5`. Ədədlərdən biri nöqtə ilə yazılıbsa (`50.0`), bölmə kəsr nəticə verir: hər nəfərə 12.5 dollar.

## Məntiqi dəyərlər {#bools}

`bool` tipinin yalnız iki dəyəri var: `true` (doğru) və `false` (yalan). `&&` hər iki tərəf doğru olanda `true` verir ("və"). `||` üçün bir tərəfin doğru olması kifayətdir ("və ya"). `!` dəyəri tərsinə çevirir. Müqayisələr (`>`, `<`, `==`) də `bool` qaytarır.
