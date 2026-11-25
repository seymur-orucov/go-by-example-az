`range` slice, map və string üzərində işləyir. Iterator isə öz ardıcıllığımızı da `range` ilə gəzməyə imkan verir: dəyərlər əvvəlcədən slice-a yığılmır, lazım olduqca bir-bir yaranır. Bu, uzun və ya sonu olmayan ardıcıllıqlar üçün, həm də dövrdən tez çıxanda artıq iş görməmək üçün faydalıdır. Go-da iterator xüsusi formalı funksiyadır, standart `iter` package-i isə bu formalara ad verir.

Bu dərsdə avtobus cədvəli ilə işləyirik: saatın hansı dəqiqələrində avtobus yola düşür, marşrutda hansı dayanacaqlar var və bilet neçəyədir.

## iter.Seq {#seq}

`Departures` `iter.Seq[int]` qaytarır: bu, `func(yield func(int) bool)` tipinin qısa adıdır. `main`-dəki `for m := range Departures(5, 15, 50)` bu funksiyanı çağırır və ona `yield` verir. Iterator hər dəfə `yield(m)` çağıranda dövrün gövdəsi bir dəfə işləyir və `m` həmin dəyəri alır. `Departures(...)` çağırışının özü heç nə hesablamır, yalnız funksiya qaytarır; iş `range` başlayanda gedir.

## iter.Seq2 {#seq2}

`iter.Seq2[int, string]` hər addımda iki dəyər verir, slice üzərindəki `range` kimi. `Numbered` dayanacaqları 1-dən nömrələyir, çünki sərnişin üçün "sıfırıncı dayanacaq" qəribə görünərdi. `for n, stop := range` hər iki dəyəri alır; ikincisi lazım deyilsə, `for n := range` yazmaq da olar.

## Dövrdən tez çıxmaq {#stop}

`break` olanda gövdə bir daha işləməyəcək və `yield` `false` qaytarır. Ona görə `Departures` `if !yield(m) { return }` yazır: 30-cu dəqiqədən sonrakı ilk avtobus tapılan kimi iterator dayanır və 50-ci dəqiqəni hesablamır.

> **Diqqət:** `yield` `false` qaytarandan sonra onu yenə çağırmaq proqramı panic ilə dayandırır. `yield`-in nəticəsini həmişə yoxlayın.

## Standart iterator-lar {#std}

`slices` və `maps` package-ləri iterator-larla işləyir. `slices.Collect` iterator-un bütün dəyərlərini slice-a yığır. `maps.Keys` map-in açarlarını iterator kimi verir, `slices.Sorted` isə onları yığıb sıralayır. Map-in öz gəzinti sırası təsadüfidir, bu üsulla isə qiymətlər həmişə əlifba sırası ilə çap olunur.
