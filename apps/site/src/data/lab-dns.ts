// Pilot: "DNS" as a visual lesson — a journey map. The domain is example.com; the addresses come
// from documentation ranges (203.0.113.0/24, 2001:db8::/32) and the timings are illustrative.
import type { FrameText, Takeaways } from "./lab-player";

export type Actor = "pc" | "res" | "root" | "tld" | "auth";
export type PacketKind = "q" | "ref" | "ans";

export interface Hop {
  from: Actor;
  to: Actor;
  kind: PacketKind;
  /** Short text on the wire. */
  label: string;
  ms: number;
  /** Packet inspector rows. */
  ask?: string;
  reply?: string;
}

export interface CacheRecord {
  name: string;
  type: string;
  value: string;
  /** Seconds left; 0 = expired. */
  ttl: number;
  max: number;
}

export interface DnsFrame extends FrameText {
  /** Clock since the first visit, e.g. "1:00". */
  t: string;
  hops: Hop[];
  /** Cache hit shown on this actor. */
  hit?: Actor;
  /** Device name when it is not the computer. */
  device?: string;
  pcCache: CacheRecord[];
  resCache: CacheRecord[];
}

export const ACTORS: Record<Actor, { title: string; sub: string }> = {
  pc: { title: "Sənin kompüterin", sub: "brauzer + OS" },
  res: { title: "Resolver", sub: "provayder / 1.1.1.1" },
  root: { title: "Root server", sub: "«.»" },
  tld: { title: "TLD server", sub: "«.com»" },
  auth: { title: "Authoritative", sub: "example.com" },
};

export const CHAPTERS = ["İlk sorğu", "Keş", "TTL bitəndə"];

const DAY2 = 172800;
const A = (ttl: number): CacheRecord => ({
  name: "example.com",
  type: "A",
  value: "203.0.113.10",
  ttl,
  max: 300,
});
const NS_COM = (ttl: number): CacheRecord => ({
  name: "com",
  type: "NS",
  value: "a.gtld-servers.net",
  ttl,
  max: DAY2,
});
const NS_EX = (ttl: number): CacheRecord => ({
  name: "example.com",
  type: "NS",
  value: "ns1.example.com",
  ttl,
  max: DAY2,
});

const Q = "example.com üçün A record?";

export const FRAMES: DnsFrame[] = [
  {
    chapter: 0,
    title: "Ünvanı yazırsan",
    body: "Brauzerə <code>example.com</code> yazırsan. Amma şəbəkədə kompüterlər bir-birini adla yox, <b>IP ünvanı</b> ilə tapır (məsələn, <code>203.0.113.10</code>). <b>DNS</b> internetin telefon kitabçasıdır: adı ünvana çevirir. Brauzer əvvəlcə öz yaddaşına — <b>keşə</b> — baxır, sonra əməliyyat sisteminin keşinə. Hər ikisi boşdur.",
    t: "0:00",
    hops: [],
    pcCache: [],
    resCache: [],
  },
  {
    chapter: 0,
    title: "Sual resolver-ə gedir",
    body: "Kompüter ünvanı özü axtarmır. Sualı <b>resolver</b>-ə göndərir — adətən internet provayderinin server-inə və ya <code>1.1.1.1</code>, <code>8.8.8.8</code> kimi ictimai server-ə. Sual qısadır: «<code>example.com</code>-un <b>A record</b>-u (IPv4 ünvanı) nədir?» Kompüter son cavabı gözləyir, bütün axtarışı resolver edəcək.",
    t: "0:00",
    hops: [{ from: "pc", to: "res", kind: "q", label: "A? example.com", ms: 6, ask: Q }],
    pcCache: [],
    resCache: [],
  },
  {
    chapter: 0,
    title: "Root server: «.com-dan soruş»",
    ask: {
      q: "Resolver-in keşi də boşdur. O, ilk olaraq kimdən soruşacaq?",
      options: [
        "<code>example.com</code>-un öz server-indən",
        "Root server-dən",
        "<code>.com</code> server-indən",
      ],
      answer: 1,
      explain:
        "Resolver nə <code>example.com</code>-un, nə də <code>.com</code>-un server-lərinin ünvanını bilir. Əvvəlcədən bildiyi yeganə ünvanlar root server-lərinindir — onlar resolver-in proqramına yazılıb.",
    },
    body: "Ad sağdan sola oxunur: <code>example.com.</code> — sondakı görünməyən nöqtə <b>root</b>-dur. Root server cavabı bilmir, amma kimin bildiyini bilir: «<code>.com</code> zonasının server-ləri bunlardır». Belə cavaba <b>referral</b> (yönləndirmə) deyilir.",
    t: "0:00",
    hops: [
      { from: "res", to: "root", kind: "q", label: "A? example.com", ms: 14, ask: Q },
      {
        from: "root",
        to: "res",
        kind: "ref",
        label: ".com → a.gtld-servers.net",
        ms: 14,
        ask: Q,
        reply: "Bilmirəm. <code>.com</code>-dan soruş: <code>a.gtld-servers.net</code> (NS)",
      },
    ],
    pcCache: [],
    resCache: [NS_COM(DAY2)],
  },
  {
    chapter: 0,
    title: "TLD server: «example.com-un server-indən soruş»",
    body: "<code>.com</code> <b>TLD</b> (top-level domain) server-i milyonlarla domeni tanıyır, amma onların IP ünvanlarını saxlamır. Yalnız <code>example.com</code>-a hansı server-lərin cavabdeh olduğunu deyir — domenin <b>NS record</b>-larını verir.",
    t: "0:00",
    hops: [
      { from: "res", to: "tld", kind: "q", label: "A? example.com", ms: 16, ask: Q },
      {
        from: "tld",
        to: "res",
        kind: "ref",
        label: "example.com → ns1.example.com",
        ms: 16,
        ask: Q,
        reply: "Bilmirəm. <code>example.com</code>-un server-i: <code>ns1.example.com</code> (NS)",
      },
    ],
    pcCache: [],
    resCache: [NS_COM(DAY2), NS_EX(DAY2)],
  },
  {
    chapter: 0,
    title: "Authoritative server: son cavab",
    body: "<b>Authoritative</b> server domen sahibinin record-larını saxlayır və son cavabı verir: <code>203.0.113.10</code>. Cavabın yanında <b>TTL</b> (time to live) da gəlir — 300 saniyə: «bu cavabı 5 dəqiqə yadda saxlaya bilərsən».",
    cmd: "dig example.com",
    out: ";; ANSWER SECTION:\nexample.com.    300    IN    A    203.0.113.10",
    t: "0:00",
    hops: [
      { from: "res", to: "auth", kind: "q", label: "A? example.com", ms: 20, ask: Q },
      {
        from: "auth",
        to: "res",
        kind: "ans",
        label: "A 203.0.113.10 · TTL 300",
        ms: 20,
        ask: Q,
        reply: "<code>example.com</code> → <code>203.0.113.10</code>, TTL 300 s",
      },
    ],
    pcCache: [],
    resCache: [NS_COM(DAY2), NS_EX(DAY2), A(300)],
  },
  {
    chapter: 0,
    title: "Cavab sənə çatır",
    body: "Resolver cavabı kompüterə qaytarır və yol boyu öyrəndiklərini <b>keşə</b> yazır — təkcə IP-ni yox, <code>.com</code> və <code>example.com</code> server-lərinin ünvanlarını da. Bütün səyahət ~110 ms çəkdi. İndi brauzer bu IP ilə bağlantı qura bilər (TCP, TLS — ayrı mövzulardır).",
    t: "0:00",
    hops: [
      {
        from: "res",
        to: "pc",
        kind: "ans",
        label: "A 203.0.113.10",
        ms: 6,
        ask: Q,
        reply: "<code>203.0.113.10</code>, TTL 300 s",
      },
    ],
    pcCache: [A(300)],
    resCache: [NS_COM(DAY2), NS_EX(DAY2), A(300)],
  },
  {
    chapter: 1,
    title: "Keş: sorğu heç çıxmır",
    ask: {
      q: "Bir dəqiqə sonra səhifəni yeniləyirsən. Neçə server-ə DNS sorğusu gedəcək?",
      options: ["4 — bütün yol təkrarlanır", "1 — yalnız resolver-ə", "0 — heç birinə"],
      answer: 2,
      explain: "Cavab kompüterin öz keşində var və TTL-i hələ bitməyib: 300 saniyədən 60-ı keçib.",
    },
    body: "Kompüter cavabı öz keşində tapdı — şəbəkəyə heç bir paket getmədi, gözləmə 0 ms. Saytın ikinci dəfə daha tez açılmasının səbəblərindən biri budur.",
    t: "1:00",
    hops: [],
    hit: "pc",
    pcCache: [A(240)],
    resCache: [NS_COM(DAY2 - 60), NS_EX(DAY2 - 60), A(240)],
  },
  {
    chapter: 1,
    title: "Başqa cihaz, eyni resolver",
    body: "Eyni Wi-Fi-dakı telefonundan da <code>example.com</code>-u açırsan. Telefonun keşi boşdur, ona görə sual resolver-ə gedir. Amma resolver bu cavabı 90 saniyə əvvəl öyrənib və keşdən dərhal qaytarır: root, TLD və authoritative server-lərə müraciət olunmur. ~12 ms.",
    t: "1:30",
    device: "Telefonun",
    hops: [
      { from: "pc", to: "res", kind: "q", label: "A? example.com", ms: 6, ask: Q },
      {
        from: "res",
        to: "pc",
        kind: "ans",
        label: "A 203.0.113.10 (keşdən)",
        ms: 6,
        ask: Q,
        reply: "<code>203.0.113.10</code>, TTL 210 s — keşdən",
      },
    ],
    hit: "res",
    pcCache: [A(210)],
    resCache: [NS_COM(DAY2 - 90), NS_EX(DAY2 - 90), A(210)],
  },
  {
    chapter: 2,
    title: "6 dəqiqə keçdi",
    body: "TTL sayğacları sıfıra enir. <code>example.com</code>-un A record-unun 300 saniyəsi bitib — hər iki keşdə köhnəlib və artıq istifadə olunmayacaq. NS record-ları isə 2 gün (172800 s) yaşayır, onlar hələ keşdədir.",
    t: "6:30",
    hops: [],
    pcCache: [A(0)],
    resCache: [NS_COM(DAY2 - 390), NS_EX(DAY2 - 390), A(0)],
  },
  {
    chapter: 2,
    title: "Yarım yol",
    ask: {
      q: "Yenə <code>example.com</code>-u açırsan. Resolver bu dəfə kimdən soruşacaq?",
      options: [
        "Root server-dən — hər şey yenidən",
        "<code>.com</code> server-indən",
        "Birbaşa <code>example.com</code>-un server-indən",
      ],
      answer: 2,
      explain:
        "<code>example.com</code>-un server-inin ünvanı (NS record) hələ keşdədir. Resolver yolun ilk iki addımını atlayır.",
    },
    body: "Resolver birbaşa authoritative server-ə getdi: ~52 ms. TTL-i domen sahibi seçir. Qısa TTL ünvanı tez dəyişməyə imkan verir, amma sorğu çox olur; uzun TTL sorğuları azaldır, amma dəyişiklik keşlərdə gec yenilənir. «DNS dəyişikliyi niyə dərhal yayılmır?» sualının cavabı budur.",
    t: "6:30",
    hops: [
      { from: "pc", to: "res", kind: "q", label: "A? example.com", ms: 6, ask: Q },
      { from: "res", to: "auth", kind: "q", label: "A? example.com", ms: 20, ask: Q },
      {
        from: "auth",
        to: "res",
        kind: "ans",
        label: "A 203.0.113.10 · TTL 300",
        ms: 20,
        ask: Q,
        reply: "<code>example.com</code> → <code>203.0.113.10</code>, TTL 300 s",
      },
      {
        from: "res",
        to: "pc",
        kind: "ans",
        label: "A 203.0.113.10",
        ms: 6,
        ask: Q,
        reply: "<code>203.0.113.10</code>, TTL 300 s",
      },
    ],
    pcCache: [A(300)],
    resCache: [NS_COM(DAY2 - 390), NS_EX(DAY2 - 390), A(300)],
  },
];

export interface RecordCard {
  type: string;
  front: string;
  back: string;
  example: string;
}

export const RECORDS: RecordCard[] = [
  {
    type: "A",
    front: "Ad → ?",
    back: "Adı <b>IPv4</b> ünvanına çevirir. Ən çox soruşulan record.",
    example: "example.com.  A  203.0.113.10",
  },
  {
    type: "AAAA",
    front: "Ad → ?",
    back: "Adı <b>IPv6</b> ünvanına çevirir. Adı «dörd A»: IPv6 ünvanı dörd dəfə uzundur.",
    example: "example.com.  AAAA  2001:db8::10",
  },
  {
    type: "CNAME",
    front: "Ad → ?",
    back: "Adı <b>başqa ada</b> yönləndirir (ləqəb). Resolver sonra hədəf adın record-unu axtarır.",
    example: "www.example.com.  CNAME  example.com.",
  },
  {
    type: "MX",
    front: "Poçt → ?",
    back: "Domenin <b>poçt server-ini</b> göstərir. Rəqəm prioritetdir: kiçik olan əvvəl yoxlanılır.",
    example: "example.com.  MX  10 mail.example.com.",
  },
  {
    type: "NS",
    front: "Zona → ?",
    back: "Domenə <b>cavabdeh server-ləri</b> göstərir. Yuxarıdakı referral-lar məhz NS record-larıdır.",
    example: "example.com.  NS  ns1.example.com.",
  },
  {
    type: "TXT",
    front: "Mətn → ?",
    back: "İxtiyari <b>mətn</b>: domenin sahibliyini təsdiqləmək, poçt qaydaları (SPF) üçün.",
    example: 'example.com.  TXT  "v=spf1 -all"',
  },
];

export const TAKEAWAYS: Takeaways = {
  rules: [
    "DNS adı (`example.com`) IP ünvanına çevirir; kompüter bunu **resolver**-dən soruşur.",
    "Resolver yuxarıdan aşağı gedir: **root → TLD → authoritative**. İlk ikisi cavabı bilmir, yalnız yönləndirir (referral).",
    "Hər cavabın **TTL**-i var: o bitənə qədər cavab keşdən verilir.",
    "Keş bir neçə yerdədir: brauzer, əməliyyat sistemi, resolver. NS record-ları uzun yaşadığı üçün təkrar sorğular qısa yolla gedir.",
  ],
  practices: [
    "IP-ni dəyişməzdən əvvəl TTL-i azalt (ən azı köhnə TTL qədər əvvəl) — dəyişiklik keşlərdə tez yenilənsin.",
    "DNS-i yoxlamaq üçün `dig` və ya `nslookup` işlət: brauzerin keşi səni çaşdıra bilər.",
  ],
};
