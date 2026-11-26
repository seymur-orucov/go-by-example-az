Git yeganə version control sistemi deyil. Ondan əvvəl və onunla yanaşı **SVN** (Apache Subversion), **Mercurial**, **Perforce** kimi sistemlər var. Onların hamısı tarixçə saxlayır, amma tarixçənin harada durduğu və gündəlik işin necə getdiyi fərqlidir.

Bu dərsdə Git-i ən çox müqayisə edilən mərkəzləşmiş sistemlə, SVN ilə tutuşdururuq. Sonra Git-in niyə standart olduğunu və başqa sistemlərin hələ harada işlədildiyini görəcəyik.

## İki model {#two-models}

SVN-də bir mərkəzi repository var və tarixçə yalnız oradadır. İştirakçı faylları serverdən götürür (*checkout*), dəyişikliyi isə birbaşa serverə yazır. Git-də hər iştirakçının kompüterində tam repository var. Commit əvvəlcə lokal tarixçəyə yazılır, başqaları ilə paylaşmaq üçün isə ayrıca komanda lazımdır (*push*).

Cədvəldə yaşıl xana həmin aspektdə üstün olan tərəfi göstərir. Fərqlərin çoxu bir faktdan gəlir: Git-də tarixçə kompüterinizdədir.

## İnternetsiz iş {#offline}

Deyək ki, qatarda işləyirsiniz və internet yoxdur. SVN-də dəyişikliyi yadda saxlamaq olmur, çünki commit serverə yazılır. Tarixçəyə baxmaq da çətindir, çünki tarixçə serverdədir. Git-də isə commit, tarixçəyə baxmaq və versiyaları müqayisə etmək tam işləyir. Qatardan düşəndən sonra bütün commit-ləri bir dəfədə serverə göndərirsiniz.

Bu, sürətə də təsir edir. Git-də tarixçəyə baxmaq disk əməliyyatıdır, SVN-də isə hər dəfə şəbəkə sorğusudur.

> **Bilgi:** "paylanmış" o demək deyil ki, server lazım deyil. Komandalar adətən ortaq repository saxlayır (GitHub, GitLab və ya öz serverləri). Fərq ondadır ki, o, tarixçənin yeganə surəti deyil.

## Branch-lar və birləşdirmə {#branches}

Branch, yəni işin ayrıca qolu, yeni funksiyanı əsas koda toxunmadan hazırlamaq üçündür. SVN-də branch serverdə qovluğun surətidir. Onu yaratmaq ucuzdur, amma branch-ları birləşdirmək (*merge*) tarixən çətin və səhvə meylli sayılıb. Ona görə komandalar branch-dan az istifadə edirdi.

Git-də branch sadəcə bir commit-ə göstəricidir. O, bir anda yaranır, Git isə branch-ları birləşdirmək üçün qurulub. Nəticədə hər kiçik iş üçün ayrıca branch açmaq Git-də adi vərdişdir. Bunu "Branch-lar" modulunda ətraflı görəcəyik.

## Mercurial, Perforce və Git-in seçilməsi {#others}

**Mercurial** da Git kimi paylanmış sistemdir və onunla eyni ildə, 2005-də yaranıb. Komandaları sadə sayılır, amma istifadəçi sayı azaldı: məsələn, Bitbucket 2020-də Mercurial dəstəyini dayandırdı. **Perforce** mərkəzləşmiş kommersiya sistemidir. O, oyun studiyaları kimi çox böyük binary fayllarla işləyən komandalarda hələ də geniş yayılıb.

Git-i Linus Torvalds 2005-də Linux kernel-in inkişafı üçün yaratdı. Sürəti, branch-ların ucuzluğu və GitHub kimi platformalar onu standart etdi. Bu gün yeni layihə üçün seçim demək olar ki, həmişə Git-dir. SVN və Perforce isə əsasən köhnə layihələrdə və çox böyük fayllarla işləyən komandalarda qalır.
