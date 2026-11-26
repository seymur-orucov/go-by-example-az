`git init` adi qovluğu repository-yə çevirir. Bundan sonra Git həmin qovluqdakı faylları izləyə və onların tarixçəsini saxlaya bilir. Repository-nin bütün məlumatı qovluğun içindəki gizli `.git` qovluğunda olur. Nümunədə Sam CV-si üçün qovluq yaradır.

## Repository yaratmaq {#init}

`mkdir` ilə `cv` qovluğunu yaradıb içinə keçirik (`cd`) və ilk faylı yazırıq. `git init` cari qovluqda boş repository yaradır və onun yerini çap edir. `empty` o deməkdir ki, hələ heç bir commit yoxdur. `cv.md` yerində qalıb: `git init` mövcud fayllara toxunmur.

`ls -A` gizli faylları da göstərir. Adı nöqtə ilə başlayan `.git` adi `ls`-də görünmür.

## .git qovluğunun içi {#inside}

`.git` repository-nin özüdür: commit-lər, branch-lar və ayarlar burada saxlanır. Əsas hissələri:

- `objects`: faylların və commit-lərin məzmunu;
- `refs`: branch-ların hansı commit-ə baxdığı;
- `HEAD`: hazırda hansı branch-da olduğunuz;
- `config`: əvvəlki dərsdəki lokal ayarlar.

`cat .git/HEAD` göstərir ki, `HEAD` `main` branch-ına baxır (`refs/heads/main`). Bu ad əvvəlki dərsdəki `init.defaultBranch` ayarından gəlir.

> **Diqqət:** `.git`-in içindəki faylları əl ilə dəyişməyin. Onları Git komandaları idarə edir.

## Təkrar git init {#reinit}

Mövcud repository-də `git init`-i yenidən işə salanda Git `Reinitialized existing Git repository` yazır. Bu təhlükəsizdir: Git yalnız çatışmayan hissələri əlavə edir, tarixçəyə və ayarlara toxunmur.

> **Bilgi:** `git init`-i layihənin öz qovluğunda işə salın. Ev qovluğunda işə salsanız, Git oradakı bütün faylları bu repository-nin faylları kimi görəcək.

## .git-i silmək {#remove}

`rm -rf .git` `.git` qovluğunu silir. Bundan sonra `git status` `not a git repository` xətası verir: Git nə bu qovluqda, nə də yuxarıdakı qovluqlarda `.git` tapmadı. `cv.md` isə yerindədir. Deməli, repository `.git` qovluğudur: onu silsəniz, fayllar qalır, bütün tarixçə isə itir.
