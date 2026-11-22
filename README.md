# Nümunələrlə Go

[Go by Example](https://gobyexample.com) saytının **Azərbaycan dilində**, müasir dizaynlı və daha sadə nümunəli alternativi.

Hər mövzu qısa izahdan, işlək koddan və addım-addım vizualdan ibarətdir. İzah ilə kod qarşılıqlı işıqlanır: izahın üzərinə gələndə uyğun kod sətirləri, kodun üzərinə gələndə isə uyğun izah addımı işıqlanır.

## Əsas məqsəd

"Nümunələrlə Go" **ilk prototipdir**. Yekun hədəf [roadmap.sh](https://roadmap.sh) və [itbooster.ru](https://itbooster.ru) tipində **vahid öyrənmə platformasıdır**:

- Developer **düzgün yol xəritəsi (roadmap)** ilə irəliləyir: nəyi, hansı ardıcıllıqla öyrənməli olduğunu görür.
- Yol xəritəsinin hər addımında həm **nəzəriyyə** (qısa, aydın izah), həm də **praktika** (işlək nümunələr, tapşırıqlar, "Özünü yoxla" sualları) eyni resursdan verilir.
- **Bütün texnologiyalar bir saytda** olur (Go, Python, Rust, TypeScript, SQL…), ayrı-ayrı saytlar yaradılmır.

Go prototipi bu platformanın dizaynını, dərs formatını və kontent modelini sınamaq üçündür. Təfərrüat: [docs/ROADMAP.md](docs/ROADMAP.md#vizyon-öyrənmə-platforması).

## Hazırkı vəziyyət

**Mərhələ 1 — Dizayn.** Framework-süz statik HTML/CSS prototip hazırdır. Dörd variant var, istifadəçi **Variant D**-ni seçib və üzərində iterasiya gedir. Təfərrüat: [docs/ROADMAP.md](docs/ROADMAP.md).

## Prototipi açmaq

Node.js 18+ lazımdır, başqa asılılıq yoxdur:

```powershell
git clone https://github.com/seymur-orucov/go-by-example-az.git
cd go-by-example-az
node design/serve.mjs
```

Sonra brauzerdə:

| Ünvan | Nə var |
|---|---|
| http://localhost:4321/d/ | **Variant D** — seçilmiş dizayn (ana səhifə) |
| http://localhost:4321/d/example.html | Variant D — dərs səhifəsi (pilot: Slices) |
| http://localhost:4321/, `/b/`, `/c/` | Variant A, B, C — müqayisə üçün saxlanılıb |

Sağ aşağı küncdəki **Variant A | B | C | D** düyməsi ilə eyni səhifənin variantları arasında keçid olur.

## Sənədlər

| Fayl | Məzmun |
|---|---|
| [docs/ROADMAP.md](docs/ROADMAP.md) | Mərhələlər: görülənlər, hazırkı iş, növbəti addımlar |
| [docs/HISTORY.md](docs/HISTORY.md) | İş jurnalı: hər iterasiyada nə istənildi, nə edildi |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Razılaşdırılmış qərarlar (texniki, dizayn, kontent) və səbəbləri |
| [docs/REFERENCES.md](docs/REFERENCES.md) | Referans saytlar, nədən nə götürüldü, texnologiyalar |
| [design/README.md](design/README.md) | Prototipin faylları və dizayn variantlarının ətraflı izahı |
| [CLAUDE.md](CLAUDE.md) | Claude Code ilə davam edərkən qısa təlimat |

## Qovluq quruluşu

```
design/          Mərhələ 1: statik dizayn prototipi (A, B, C, D variantları)
docs/            Plan, tarixçə, qərarlar, referanslar
.claude/         Claude Code üçün preview server konfiqurasiyası
```

Mərhələ 2-dən etibarən Astro monoreposu əlavə olunacaq (`apps/site`, `packages/theme`, `content/<texnologiya>/`, `content/roadmaps/`). Plan: [docs/ROADMAP.md](docs/ROADMAP.md).

## Lisenziya və istinad

Kontent Mark McGranaghan və Eli Bendersky-nin [Go by Example](https://gobyexample.com) layihəsi əsasında hazırlanır, Azərbaycan dilinə uyğunlaşdırılır və sadələşdirilir. Orijinal kontent [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) lisenziyası ilə paylaşılır, bu layihənin kontenti də eyni şərtlə paylaşılacaq. Go adı Google LLC-yə məxsusdur.
