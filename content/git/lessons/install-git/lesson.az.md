Git kompüterinizdə işləyən proqramdır. Onunla terminalda komandalar yazaraq işləyirsiniz: `git status`, `git commit` və s. Bu kursdakı bütün nümunələr terminaldadır, ona görə əvvəlcə Git quraşdırılmalıdır. Bəzi sistemlərdə o artıq var, buna görə əvvəlcə yoxlayırıq.

## Git var mı? {#check}

`git --version` quraşdırılmış Git-in versiyasını çap edir. Cavab `git version` ilə başlayırsa, Git var və quraşdırma addımını keçə bilərsiniz. Nömrə sizdə fərqli olacaq. Bu kurs üçün 2.23 və ya daha yeni versiya lazımdır, çünki `git switch` və `git restore` komandaları o versiyada gəlib.

> **Bilgi:** terminal `command not found` və ya `is not recognized` cavabı verirsə, Git ya quraşdırılmayıb, ya da terminal onu tapmır.

## Quraşdırmaq {#install}

Bu addımdakı sətirlər şərhdir (`#` ilə başlayır), onlar işə salınmır. Öz sisteminizə uyğun komandanı seçin:

- **Windows**: git-scm.com saytından Git for Windows quraşdırıcısını yükləyin və ya `winget` komandasını işə salın. Quraşdırıcı **Git Bash** terminalını da gətirir. Kursdakı `echo`, `ls` kimi komandalar orada da işləyir.
- **macOS**: terminalda ilk dəfə `git` yazanda sistem Command Line Tools-u quraşdırmağı təklif edir; `xcode-select --install` bunu birbaşa edir. Homebrew istifadə edirsinizsə, `brew install git` adətən daha yeni versiya verir.
- **Linux**: paket meneceri ilə: `apt` (Ubuntu, Debian) və ya `dnf` (Fedora).

> **Diqqət:** quraşdırmadan sonra terminalı bağlayıb yenidən açın və `git --version`-u təkrarlayın. Əvvəldən açıq olan terminal yeni proqramı görməyə bilər.

## Komandanın qısa yardımı {#help}

Hər Git komandasının `-h` flag-i var: o, komandanın qısa istifadə qaydasını terminala çap edir. Birinci sətir (`usage`) komandanın yazılış formasıdır. Kvadrat mötərizədəki hissələr məcburi deyil, `|` isə "ya bu, ya o" deməkdir. Aşağıda hər flag-in bir sətirlik izahı var. Məsələn, `-q` (`--quiet`) komandanı səssiz edir.

> **Bilgi:** tam sənəd üçün `git help init` yazın. Windows-da sənəd brauzerdə, macOS və Linux-da isə terminalda açılır.
