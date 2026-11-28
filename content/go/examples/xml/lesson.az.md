XML JSON-dan köhnə mətn formatıdır: verilənlər HTML-ə bənzər açılan və bağlanan elementlərin içində yazılır, məsələn `<total>240</total>`. Yeni API-lər əsasən JSON seçir, amma elektron hesab-fakturalar və RSS hələ də XML-dədir. Go-da `encoding/xml` package-i `encoding/json` kimi işləyir: `Marshal`, `MarshalIndent`, `Unmarshal` və struct tag-lar. Fərq formatın özündədir: XML elementinin atributları ola bilər və hər sənədin adı olan bir kök elementi var.

Bu dərsdə onlayn mağazanın hesab-fakturasını (invoice) mühasibat servisinə XML kimi göndəririk və oradan gələn başqa fakturanı oxuyuruq.

## XML tag-ları {#tags}

Tag-lar JSON-dakı kimi yazılır, sadəcə açar `xml`-dir: `xml:"total"` sahəni `<total>` elementinə bağlayır. XML üçün əlavə imkanlar da var. `,attr` sahəni ayrıca element yox, kök elementin atributu edir (`number="INV-0318"`). `buyer>name` `<buyer>` elementinin içində `<name>` yaradır, beləcə ayrıca struct yazmadan iç-içə element alınır. Slice sahə hər element üçün ayrıca `<item>` yaradır.

`xml.Name` tipli `XMLName` sahəsi kök elementin adını təyin edir; o olmasa, ad struct-ın adından götürülür (`<Invoice>`).

> **Bilgi:** Bir sahədə hər iki tag ola bilər, aralarında boşluq qoyulur: `json:"total" xml:"total"`.

## MarshalIndent və Header {#marshal}

`xml.MarshalIndent` JSON-dakı kimi `[]byte` və `error` qaytarır, girintini də eyni arqumentlərlə alır. `Buyer` və `Country` yan-yana yazılıb və yolları eyni `buyer`-lə başlayır, ona görə package onları bir `<buyer>` elementinin içində birləşdirir.

XML sənədi adətən `<?xml version="1.0" ...?>` başlığı ilə başlayır, amma `Marshal` onu yazmır. Package bu sətri `xml.Header` sabitində saxlayır və biz onu əvvələ özümüz əlavə edirik. `xml.Header` sətir sonu ilə bitir, ona görə başlıq ayrıca sətirdə qalır.

## Unmarshal {#unmarshal}

`xml.Unmarshal` də pointer gözləyir və tag-lara görə həm atributları, həm də iç-içə elementləri oxuyur: `number` atributu `Number`-a, `<buyer><name>` isə `Buyer`-ə düşür. Gələn fakturada `<country>` və `<item>` yoxdur, ona görə `Country` boş string, `Items` isə `nil` slice qalır (uzunluğu 0). Struct-da olmayan elementlər, JSON-dakı kimi, səssizcə atılır.

## Kök elementin yoxlanması {#root}

`XMLName` təkcə yazanda yox, oxuyanda da işləyir: kök element `<invoice>` deyilsə, `Unmarshal` heç nə doldurmur və xəta qaytarır. Bu, başqa sənədin, məsələn qəbzin (`<receipt>`), səhvən faktura kimi oxunmasının qarşısını alır. JSON-da belə yoxlama yoxdur, çünki JSON obyektinin adı olmur.

> **Diqqət:** Struct-da `XMLName` olmasa, `Unmarshal` kök elementin adını yoxlamır və istənilən sənədi qəbul edir.
