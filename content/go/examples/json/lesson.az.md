JSON verilənləri mətn kimi ötürmək üçün ən geniş yayılmış formatdır: `{"id":"PX-2207","weight_g":1250}`. Web API-lər, mobil tətbiqlər və konfiqurasiya faylları onu işlədir, çünki onu həm proqram, həm də insan oxuya bilir. Go-da `encoding/json` paketi struct-ı JSON mətninə çevirir (marshal, yəni kodlaşdırma) və JSON mətnindən struct doldurur (unmarshal).

Bu dərsdə bağlama izləmə (parcel tracking) servisi yazırıq: bağlamanın vəziyyətini müştəriyə JSON kimi göndəririk və kuryer şirkətinin API-sindən gələn cavabı oxuyuruq.

## Struct tag {#tags}

Sahənin tipindən sonra backtick-lər içində yazılan mətn tag adlanır: sahə haqqında paketlərin oxuduğu əlavə məlumat. `json:"weight_g"` deyir ki, JSON-da `WeightG` sahəsinin açarı `weight_g` olsun: Go-da exported adlar böyük hərflə başlayır, API-lərdə isə adətən kiçik hərf və alt xətt işlədilir. Tag olmasa, açar sahənin adının özü olardı: `"WeightG"`. `omitempty` sahə zero value olanda (boş string, `0`, `nil` slice) onu JSON-a yazmır.

> **Diqqət:** Tag-ın yazılışı dəqiqdir: `json:"id"`. `json: "id"` (boşluqla) və ya `json:'id'` kompilyasiya olunur, amma paket onu görmür və açar `"ID"` olur; `go vet` belə tag-ı tapır.

## Marshal {#marshal}

`json.Marshal` dəyəri JSON-a çevirir və `[]byte` ilə `error` qaytarır; mətn kimi çap etmək üçün `string(data)` yazırıq. Nəticədə `note` yoxdur, çünki `Note` boşdur və `omitempty` onu çıxarıb. `phone` də yoxdur: paket yalnız exported (böyük hərflə başlayan) sahələri görür. Beləcə alıcının telefon nömrəsi müştəriyə gedən cavaba düşmür.

## MarshalIndent {#indent}

`MarshalIndent` eyni JSON-u sətirlərə bölür: ikinci arqument hər sətrin əvvəlinə qoyulan prefiks, üçüncüsü bir səviyyənin girintisidir. Bu forma insan üçün rahatdır: log, sənəd, konfiqurasiya faylı. Proqramlar arası ötürmədə adətən yığcam `Marshal` işlədilir, çünki daha az yer tutur. Xətanı burada `_` ilə atırıq, çünki eyni dəyər bir addım əvvəl xətasız kodlaşdırılıb.

## Unmarshal {#unmarshal}

Kuryer API-sinin cavabı JSON mətnidir. `json.Unmarshal` onu `[]byte` kimi qəbul edir və nəticəni ikinci arqumentə yazır, ona görə `&got`, yəni pointer veririk: pointer olmasa, `Unmarshal` heç nə yazmır və xəta qaytarır. Açarlar tag-lara görə sahələrə paylanır. Struct-da olmayan `signed_by` səssizcə atılır, JSON-da olmayan `stops` isə zero value olaraq qalır (`nil` slice `[]` kimi çap olunur).

İkinci çağırışda `weight_g` ədəd yerinə mətndir. `Unmarshal` tipi özü çevirmir, xəta qaytarır və xəta mətni problemli sahəni və gözlənilən tipi göstərir.

> **Diqqət:** Kənardan gələn JSON səhv ola bilər, ona görə `Unmarshal`-ın xətasını həmişə yoxlayın.

## map[string]any {#map}

Cavabın quruluşu əvvəlcədən bilinmirsə, onu `map[string]any`-yə oxumaq olar (`any` istənilən tipdən dəyər saxlayır). Burada heç bir açar atılmır, `signed_by` da yerindədir. Amma dəyərlərin tipini JSON müəyyən edir: JSON-da tam və kəsr ədəd fərqi yoxdur, ona görə bütün ədədlər `float64` olur. `%T` bunu göstərir: `1250` `int` deyil, `float64`-dür.

> **Bilgi:** Quruluş bəllidirsə, struct seçin: tiplər `Unmarshal` zamanı yoxlanır və sahələrə adla müraciət olunur.
