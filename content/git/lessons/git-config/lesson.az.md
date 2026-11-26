Git hər commit-ə müəllifin adını və email-ini yazır. Onları bir dəfə `git config` ilə təyin edirsiniz, sonra Git hər commit-də özü istifadə edir. Ayarlar iki səviyyədə saxlanır: **qlobal** ayar kompüterdəki bütün repository-lərə aiddir, **lokal** ayar isə yalnız bir repository-yə.

## Ad və email {#identity}

`git config --global` ayarı qlobal fayla yazır: `user.name` adı, `user.email` isə email-i saxlayır. Komandalar heç nə çap etmir. Git-də uğurlu komandanın səssiz qalması normaldır. Ad və email olmasa, Git commit zamanı `Please tell me who you are` xətası verə və ya kompüterin adından düzəltdiyi yanlış email-i yaza bilər.

> **Diqqət:** ad və email commit-in içinə yazılır. Repository-ni görən hər kəs onları da görür.

## Əsas branch-ın adı {#default-branch}

`init.defaultBranch` yeni repository-lərdə ilk branch-ın adını təyin edir. Branch tarixçənin bir xəttidir, onları ayrıca modulda keçəcəyik. Bu ayar olmasa, Git köhnə adı, `master`-i götürür və hər yeni repository-də bu barədə xəbərdarlıq çap edir. GitHub və bir çox komanda `main` adından istifadə edir, Git 3.0-da isə `main` standart ad olacaq.

## Ayarları oxumaq {#read}

Dəyər verməsəniz, `git config` ayarın cari dəyərini çap edir. `--global --list` qlobal fayldakı bütün ayarları `bölmə.ad=dəyər` şəklində göstərir. Çıxışda `init.defaultbranch` kiçik hərflə yazılıb. Ayar adlarında böyük və kiçik hərf fərq etmir, Git onları kiçik hərflə çap edir.

## Lokal ayar qlobalı üstələyir {#local}

Sam iş layihəsində iş email-ini istifadə etmək istəyir. `client-site` qovluğu artıq repository-dir (repository yaratmağı növbəti dərsdə görəcəyik). Repository-nin içində `--global` olmadan yazılan ayar yalnız bu repository-yə aiddir və onun `.git/config` faylına düşür.

`--show-origin` dəyərin hansı fayldan gəldiyini göstərir. Repository-nin içində lokal `sam@work.example` qalib gəlir. `cd ..` ilə repository-dən çıxanda isə ev qovluğundakı `.gitconfig` faylından qlobal `sam@example.com` gəlir.

> **Bilgi:** üçüncü səviyyə də var: `--system`, kompüterin bütün istifadəçiləri üçün. Ona nadir hallarda toxunulur.
