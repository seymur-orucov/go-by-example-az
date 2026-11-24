Hər Go proqramı eyni quruluşda yazılır: `package` elanı, lazım olan package-lərin `import`-u və `main` funksiyası. Bu dərsdə çay evinin giriş lövhəsi kimi kiçik bir proqram yazıb bu üç hissəni bir-bir görəcəyik.

Proqramı `go run main.go` əmri ilə işə salırıq: Go faylı kompilyasiya edir, yəni kompüterin başa düşdüyü formaya çevirir, və dərhal icra edir.

## Package {#package}

Package — bir-biri ilə əlaqəli kodun qrupudur. Hər Go faylı hansı package-ə aid olduğunu bildirməklə başlayır. Birbaşa işə salınan proqramın package-i həmişə `main` adlanır; başqa ad yazsaq, Go onu proqram yox, başqa proqramların istifadə edəcəyi kitabxana sayır.

## Import {#import}

Go-nun özündə hazır package-lər var (standart kitabxana), lazım olanı `import` ilə qoşuruq. `fmt` mətni ekrana çap etmək və formatlamaq üçündür.

> **Diqqət:** import edib istifadə etmədiyimiz package kompilyasiya xətası verir.

## main funksiyası {#main}

Proqram `main` funksiyasının birinci sətrindən işə düşür. `fmt.Println` — `fmt` package-indəki `Println` funksiyasıdır: mətni çap edir və sonuna yeni sətir əlavə edir. Mətn dırnaq içində yazılır, Azərbaycan hərfləri də olar.

## Print və Println {#print}

`Println` çapdan sonra yeni sətrə keçir, `Print` isə keçmir — növbəti çap eyni sətirdə davam edir. Burada `Print` ilə `"Menyu: "` yazıb eyni sətirdə `Println` ilə menyunun özünü əlavə etdik.
