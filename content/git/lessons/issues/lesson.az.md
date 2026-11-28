Issue GitHub-da repository-yə bağlı bir qeyddir: xəta, ideya və ya görüləcək iş. Hər issue-nun nömrəsi, başlığı, mətni və şərhləri olur, iş bitəndə o bağlanır.

Nümunə `pet-adopt`-dur: heyvan sığınacağının kiçik saytı, könüllülər orada övladlığa veriləcək heyvanları siyahıya salır. Saytı Ayla (`ayla-karimova`) aparır, Sam (`sam-lee`) ona kömək edir.

## Issue nədir və nə vaxt açılır {#what-is-an-issue}

Issue-lar repository-nin **Issues** tab-ındadır. Siyahıda əvvəlcə açıq issue-lar görünür. Hər issue-nun nömrəsi var, məsələn `#12`. Bu nömrə ilə issue-ya commit-də və şərhlərdə istinad olunur.

Issue adətən üç səbəbdən açılır. Saytda xəta var (bug). Yeni ideya var. Ya da kiminsə görməli olduğu iş var. `pet-adopt`-da üçü də var. Sam telefondan formanın işləmədiyini görüb. Ayla heyvanları növə görə süzən filtr istəyir. Köhnə heyvan siyahısını da yeniləmək lazımdır.

Söhbətdə deyilən iş tez unudulur. Issue isə bağlanana qədər siyahıda qalır və kimin nə etdiyi orada yazılır.

## Aydın issue {#clear-issue}

**New issue** düyməsi formanı açır. Formada iki əsas sahə var: **Title** və mətn. Başlıq problemi bir cümlədə deyir. "Adoption form does not submit on mobile" başlığı "Form broken"-dən yaxşıdır: siyahıya baxan hər kəs nəyin, harada xarab olduğunu görür.

Xəta haqqında issue-da üç şey olur. Xətanı təkrarlamaq üçün addımlar (steps to reproduce), gözlənilən nəticə (expected) və real nəticə (actual). Harada baş verdiyini də yazın: telefon, brauzer. Ayla addımları özü təkrarlaya bilsə, xətanı tez tapır. Mətn Markdown-dur, ona görə siyahı və qalın mətn işləyir. Sam belə yazır:

```markdown
**Steps to reproduce**
1. Open /animals/luna on a phone
2. Fill in the adoption form
3. Tap **Send**

**Expected:** a "Thank you" message.
**Actual:** nothing happens, the form stays filled.

Phone: iPhone 13, Safari
```

Başlığı və mətni yazanda GitHub oxşar issue-ları təklif edə bilər. Eyni xəta artıq yazılıbsa, yenisini açmayın, köhnəsinə şərh yazın. Sonda **Submit new issue** düyməsi issue-nu yaradır.

## Issue şablonları {#templates}

Hər dəfə eyni başlıqları yazmamaq üçün repository-yə issue şablonu əlavə olunur. Şablon `.github/ISSUE_TEMPLATE/` qovluğunda Markdown faylıdır. Ayla `bug_report.md` faylını yaradır:

```markdown
---
name: Bug report
about: Something on the site does not work
title: "[Bug] "
assignees: ayla-karimova
---

**Steps to reproduce**
1.

**Expected:**
**Actual:**
```

İki `---` arasındakı hissə şablonun ayarlarıdır. `name` və `about` seçim siyahısında görünür. `title` başlığın əvvəlini hazır yazır, `assignees` isə issue-nu dərhal Ayla-ya təyin edir. Aşağıdakı mətn yeni issue-nun mətninə köçür və onu doldurmaq qalır.

Şablon default branch-da (`main`) olanda işləyir. Faylı adi commit ilə əlavə etmək olar, ya da **Settings** səhifəsinin **Features** bölməsindəki **Set up templates** düyməsi ilə. Şablon olanda **New issue** əvvəlcə seçim siyahısını açır. Şablonun yanında **Get started** düyməsi, aşağıda **Open a blank issue** linki olur. `.yml` faylı ilə ayrı-ayrı sahələri olan forma da qurmaq olar (issue form), amma başlamaq üçün Markdown şablonu kifayətdir.

## Assignee və milestone {#assignees-milestones}

İndi issue-nu düzəldəcək adamı seçmək lazımdır. Issue səhifəsinin sağ tərəfində **Assignees** sahəsi var. Ayla oraya `sam-lee` yazır və issue Sam-ın üzərinə düşür. Bir issue-ya 10 nəfərə qədər adam təyin etmək olar. Özünüzü, repository-də write icazəsi olan adamı və ya issue-da şərh yazmış adamı təyin edə bilərsiniz.

**Milestone** bir məqsədə aid issue-ları bir yerə toplayır. Ayla saytın ilk buraxılışı üçün "Launch v1" milestone-u yaradır: **Issues** tab-ında **Milestones**, sonra **New milestone**. Milestone-un adı, təsviri və son tarixi olur. Onun səhifəsi neçə issue-nun açıq, neçəsinin bağlı olduğunu və faizlə irəliləyişi göstərir. Issue-ya milestone sağ tərəfdəki **Milestone** sahəsində verilir.

Bu sahələri layihəni aparan adamlar doldurur. Kənardan gələn istifadəçi issue aça bilər, amma onu kiməsə təyin edə bilməz. Eyni yerdəki **Labels** sahəsi növbəti dərsin mövzusudur.

## Issue-nu bağlamaq {#closing}

Sam xətanı düzəldir və commit mesajına issue-nun nömrəsini açar sözlə yazır:

```text
Fix the adoption form on mobile Safari

Fixes #12
```

Bu commit default branch-a düşəndə GitHub issue `#12`-ni özü bağlayır. Eyni sətri pull request-in (PR) təsvirinə də yazmaq olar: PR default branch-a merge olunanda issue bağlanır.

Açar sözlər doqquzdur: `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, `resolved`. Böyük hərflə yazmaq və sözdən sonra iki nöqtə qoymaq olar: `Closes: #12`. Bir neçə issue üçün açar söz hər nömrənin qarşısında yazılır: `Fixes #12, fixes #15`.

> **Diqqət:** commit başqa branch-dadırsa, issue açıq qalır. O, yalnız commit `main`-ə düşəndən sonra bağlanır.

Issue-nu əllə də bağlamaq olar: səhifənin altında **Close issue** düyməsi var. Yanındakı oxdan səbəb seçilir. Completed: iş görülüb. Not planned: iş görülməyəcək. Duplicate: bu, başqa issue-nun təkrarıdır. Ayla filtr ideyasını not planned kimi bağlayır, çünki ilk buraxılışda bu iş yoxdur. Issue-nu onu açan adam bağlaya bilər, repository-nin sahibi və collaborator-ları da.
