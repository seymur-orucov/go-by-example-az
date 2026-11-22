# Claude Code üçün təlimat

Layihə: **Nümunələrlə Go** — gobyexample.com-un Azərbaycan dilində alternativi. Ümumi baxış: [README.md](README.md).

**Əsas məqsəd:** bu, ilk prototipdir. Yekun hədəf roadmap.sh / itbooster.ru tipində vahid öyrənmə platformasıdır: roadmap ilə öyrənmə, hər addımda nəzəriyyə + praktika, bütün texnologiyalar bir saytda. Struktur və texniki qərarlar bu hədəfə uyğun verilməlidir (məsələn marşrutlar `/<texnologiya>/...`, kontent `content/<texnologiya>/`). Təfərrüat: [docs/ROADMAP.md](docs/ROADMAP.md#vizyon-öyrənmə-platforması).

## İşə başlamazdan əvvəl oxu
1. [docs/ROADMAP.md](docs/ROADMAP.md) — hansı mərhələdəyik, nə qalıb, "Növbəti sessiyada haradan başlamaq".
2. [docs/DECISIONS.md](docs/DECISIONS.md) — razılaşdırılmış qərarlar; bunları yenidən müzakirəyə açma.
3. [docs/HISTORY.md](docs/HISTORY.md) — istifadəçinin əvvəlki rəyləri (nəyi bəyənib, nəyi rədd edib).

## Qaydalar
- İstifadəçi ilə **Azərbaycan dilində** danış. Saytın bütün UI mətnləri Azərbaycan dilindədir; Go terminləri ingiliscə qalır.
- Hazırkı mərhələ **dizayn prototipidir**: `design/` framework-süz statik HTML/CSS/JS-dir, asılılıq əlavə etmə.
- Seçilmiş variant **D**-dir (`design/d/`). A, B, C yalnız müqayisə üçündür, onlara toxunma.
- D ortaq faylları təkrar istifadə edir: `design/app.js`, `design/data.js`, `design/b/b.js`, `design/c/c.js`, `design/c/style.css` (D-nin `style.css`-i onu import edir). Bunları dəyişsən, A–C-yə də təsir edir.
- Animasiyalar `prefers-reduced-motion`-da söndürülməlidir.
- Hər iterasiyadan sonra `docs/HISTORY.md`-yə qısa qeyd əlavə et, `docs/ROADMAP.md`-də işarələri yenilə.

## Prototipi işə salmaq
```
node design/serve.mjs        # http://localhost:4321/d/
```
Preview konfiqurasiyası: `.claude/launch.json` (ad: `design`). Server `no-store` başlığı verir, amma brauzer köhnə faylı göstərsə, keşsiz yenilə.

## Mühit
Windows, Node 22. Go lokal quraşdırılmayıb.
