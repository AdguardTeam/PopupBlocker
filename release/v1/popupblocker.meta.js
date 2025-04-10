// ==UserScript==
// @name AdGuard Popup Blocker
// @name:ar مانع النوافذ المنبثقة AdGuard
// @name:be Блакавальнік усплывальнай рэкламы ад AdGuard
// @name:ca Bloquejador de finestres emergents AdGuard
// @name:cs AdGuard blokátor vyskakovacích oken
// @name:da AdGuard Popup Blocker
// @name:de AdGuard Pop-up-Blocker
// @name:el Αποκλεισμός αναδυόμενων παραθύρων AdGuard
// @name:es AdGuard Popup Blocker
// @name:fa مسدودساز پاپ-آپ AdGuard
// @name:fi AdGuard Ponnahdusesto
// @name:fr Bloqueur de fenêtres pop-up de AdGuard
// @name:he חוסם חלונות קופצים של AdGuard
// @name:hr AdGuard Bloker skočnih prozora
// @name:hu AdGuard Popup Blocker
// @name:id Pemblokir Popup AdGuard
// @name:it AdGuard Popup Blocker
// @name:ja AdGuard ポップアップブロッカー
// @name:ko AdGuard 팝업 차단기
// @name:lt AdGuard iššokančiųjų langų blokatorius
// @name:mk Блокатор на скокачки прозорци AdGuard
// @name:ms AdGuard Penyekat Pop Timbul
// @name:no AdGuards popup-blokkerer
// @name:pl Bloker wyskakujących okienek przez AdGuard
// @name:nl AdGuard Pop-up Blocker
// @name:pt AdGuard Bloqueador de Pop-ups
// @name:pt-PT Bloqueador de Popup AdGuard
// @name:ro Blocant Pop-up AdGuard
// @name:ru Блокировщик всплывающей рекламы от AdGuard
// @name:sk AdGuard blokovač vyskakovacích okien
// @name:sl AdGuard Zaviralec pojavnih oken
// @name:sr-CS AdGuard blokator iskačućih prozora
// @name:sr-Latn AdGuard blokator iskačućih prozora
// @name:sv AdGuard Popup-blockerare
// @name:ta AdGuard பாப்அப் தடுப்பான்
// @name:th AdGuard Popup Blocker
// @name:tr AdGuard Açılır Pencere Engelleyici
// @name:uk Блокувальник спливних вікон AdGuard
// @name:vi AdGuard Popup Blocker
// @name:zh AdGuard 弹窗拦截器
// @name:zh-HK AdGuard 彈出式視窗封鎖器
// @name:zh-TW AdGuard 彈出式視窗封鎖器
// @namespace adguard
// @description Blocks pop-up ads on web pages
// @description:ar لحظر الإعلانات المنبثقة على صفحات الويب
// @description:be Блакуе ўсплывальную рэкламу на старонках
// @description:ca Bloqueja els anuncis emergents a les pàgines web
// @description:cs Blokuje vyskakovací reklamy na webových stránkách
// @description:da Blokerer pop-op annoncer på websider
// @description:de Blockiert Anzeige-Pop-ups auf Websites
// @description:el Αποκλείει αναδυόμενες διαφημίσεις σε ιστοσελίδες
// @description:es Bloquea anuncios emergentes en sitios web
// @description:fa مسدودسازی تبلیغات پاپ آپ در صفحات وب.
// @description:fi Estää verkkosivujen ponnahdusmainokset.
// @description:fr Bloque les fenêtres pop-up avec publicités intrusives sur les pages web
// @description:he חוסם פרסומות קופצות בדפי רשת
// @description:hr Blokira skočne prozore na web stranicama
// @description:hu Blokkolja a felugró ablakban megjelenő reklámokat a webhelyeken
// @description:id Blokir iklan popup di halaman web
// @description:it Blocca gli annunci pop-up sulle pagine web
// @description:ja Webページでポップアップ広告をブロックします。
// @description:ko 웹 페이지에서 팝업 광고를 차단
// @description:lt Blokuoja iššokančius skelbimus tinklalapiuose
// @description:mk Блокира скокачки реклами на веб-страници
// @description:ms Sekat pop timbul pada laman web
// @description:no Blokker popup-annonser på nettsider
// @description:pl Blokuje wyskakujące okienka na stronach internetowych
// @description:nl Blokkeert pop-upadvertenties op webpagina's
// @description:pt Bloqueia anúncios pop-ups dentro dos sites
// @description:pt-PT Bloqueia anúncios popup em páginas da web.
// @description:ro Blochează reclame pop-up pe pagini web
// @description:ru Блокирует всплывающую рекламу на страницах
// @description:sk Blokuje vyskakovacie reklamy na webových stránkach
// @description:sl Blokira pojavne oglase na spletnih straneh
// @description:sr-CS Blokira iskačuće reklame na veb stranicama
// @description:sr-Latn Blokira iskačuće reklame na veb stranicama
// @description:sv Blockerar popup-annonser på webbsidor
// @description:ta வலைப்பக்கங்களில் பாப்அப் விளம்பரங்களைத் தடுக்கிறது
// @description:th ปิดกั้นโฆษณาป๊อปอัพในหน้าเว็บ
// @description:tr Web sayfalarında açılır pencere reklamlarını engeller
// @description:uk Блокує спливну рекламу на вебсторінках
// @description:vi Chặn quảng cáo bật lên trên các trang web
// @description:zh 拦截网页弹窗广告
// @description:zh-HK 封鎖網頁上的彈出式視窗廣告
// @description:zh-TW 封鎖於網頁上之彈出式視窗廣告
// @version 2.5.107
// @license LGPL-3.0; https://github.com/AdguardTeam/PopupBlocker/blob/master/LICENSE
// @downloadUrl https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.user.js
// @updateUrl https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.meta.js
// @supportURL https://github.com/AdguardTeam/PopupBlocker/issues
// @homepageURL https://popupblocker.adguard.com/release/v1
// @match http://*/*
// @match https://*/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getResourceURL
// @grant unsafeWindow
// @icon https://userscripts.adtidy.org/release/popup-blocker/2.5/assets/128.png
// @resource ./assets/fonts/bold/OpenSans-Bold.woff https://userscripts.adtidy.org/release/popup-blocker/2.5/assets/fonts/bold/OpenSans-Bold.woff
// @resource ./assets/fonts/bold/OpenSans-Bold.woff2 https://userscripts.adtidy.org/release/popup-blocker/2.5/assets/fonts/bold/OpenSans-Bold.woff2
// @resource ./assets/fonts/regular/OpenSans-Regular.woff https://userscripts.adtidy.org/release/popup-blocker/2.5/assets/fonts/regular/OpenSans-Regular.woff
// @resource ./assets/fonts/regular/OpenSans-Regular.woff2 https://userscripts.adtidy.org/release/popup-blocker/2.5/assets/fonts/regular/OpenSans-Regular.woff2
// @resource ./assets/fonts/semibold/OpenSans-Semibold.woff https://userscripts.adtidy.org/release/popup-blocker/2.5/assets/fonts/semibold/OpenSans-Semibold.woff
// @resource ./assets/fonts/semibold/OpenSans-Semibold.woff2 https://userscripts.adtidy.org/release/popup-blocker/2.5/assets/fonts/semibold/OpenSans-Semibold.woff2
// @run-at document-start
// @exclude https://www.linkedin.com/*
// @exclude https://*.facebook.com/*
// @exclude https://*.google.com/*
// @exclude https://*.google.ad/*
// @exclude https://*.google.ae/*
// @exclude https://*.google.com.af/*
// @exclude https://*.google.com.ag/*
// @exclude https://*.google.com.ai/*
// @exclude https://*.google.al/*
// @exclude https://*.google.am/*
// @exclude https://*.google.co.ao/*
// @exclude https://*.google.com.ar/*
// @exclude https://*.google.as/*
// @exclude https://*.google.at/*
// @exclude https://*.google.com.au/*
// @exclude https://*.google.az/*
// @exclude https://*.google.ba/*
// @exclude https://*.google.com.bd/*
// @exclude https://*.google.be/*
// @exclude https://*.google.bf/*
// @exclude https://*.google.bg/*
// @exclude https://*.google.com.bh/*
// @exclude https://*.google.bi/*
// @exclude https://*.google.bj/*
// @exclude https://*.google.com.bn/*
// @exclude https://*.google.com.bo/*
// @exclude https://*.google.com.br/*
// @exclude https://*.google.bs/*
// @exclude https://*.google.bt/*
// @exclude https://*.google.co.bw/*
// @exclude https://*.google.by/*
// @exclude https://*.google.com.bz/*
// @exclude https://*.google.ca/*
// @exclude https://*.google.cd/*
// @exclude https://*.google.cf/*
// @exclude https://*.google.cg/*
// @exclude https://*.google.ch/*
// @exclude https://*.google.ci/*
// @exclude https://*.google.co.ck/*
// @exclude https://*.google.cl/*
// @exclude https://*.google.cm/*
// @exclude https://*.google.cn/*
// @exclude https://*.google.com.co/*
// @exclude https://*.google.co.cr/*
// @exclude https://*.google.com.cu/*
// @exclude https://*.google.cv/*
// @exclude https://*.google.com.cy/*
// @exclude https://*.google.cz/*
// @exclude https://*.google.de/*
// @exclude https://*.google.dj/*
// @exclude https://*.google.dk/*
// @exclude https://*.google.dm/*
// @exclude https://*.google.com.do/*
// @exclude https://*.google.dz/*
// @exclude https://*.google.com.ec/*
// @exclude https://*.google.ee/*
// @exclude https://*.google.com.eg/*
// @exclude https://*.google.es/*
// @exclude https://*.google.com.et/*
// @exclude https://*.google.fi/*
// @exclude https://*.google.com.fj/*
// @exclude https://*.google.fm/*
// @exclude https://*.google.fr/*
// @exclude https://*.google.ga/*
// @exclude https://*.google.ge/*
// @exclude https://*.google.gg/*
// @exclude https://*.google.com.gh/*
// @exclude https://*.google.com.gi/*
// @exclude https://*.google.gl/*
// @exclude https://*.google.gm/*
// @exclude https://*.google.gp/*
// @exclude https://*.google.gr/*
// @exclude https://*.google.com.gt/*
// @exclude https://*.google.gy/*
// @exclude https://*.google.com.hk/*
// @exclude https://*.google.hn/*
// @exclude https://*.google.hr/*
// @exclude https://*.google.ht/*
// @exclude https://*.google.hu/*
// @exclude https://*.google.co.id/*
// @exclude https://*.google.ie/*
// @exclude https://*.google.co.il/*
// @exclude https://*.google.im/*
// @exclude https://*.google.co.in/*
// @exclude https://*.google.iq/*
// @exclude https://*.google.is/*
// @exclude https://*.google.it/*
// @exclude https://*.google.je/*
// @exclude https://*.google.com.jm/*
// @exclude https://*.google.jo/*
// @exclude https://*.google.co.jp/*
// @exclude https://*.google.co.ke/*
// @exclude https://*.google.com.kh/*
// @exclude https://*.google.ki/*
// @exclude https://*.google.kg/*
// @exclude https://*.google.co.kr/*
// @exclude https://*.google.com.kw/*
// @exclude https://*.google.kz/*
// @exclude https://*.google.la/*
// @exclude https://*.google.com.lb/*
// @exclude https://*.google.li/*
// @exclude https://*.google.lk/*
// @exclude https://*.google.co.ls/*
// @exclude https://*.google.lt/*
// @exclude https://*.google.lu/*
// @exclude https://*.google.lv/*
// @exclude https://*.google.com.ly/*
// @exclude https://*.google.co.ma/*
// @exclude https://*.google.md/*
// @exclude https://*.google.me/*
// @exclude https://*.google.mg/*
// @exclude https://*.google.mk/*
// @exclude https://*.google.ml/*
// @exclude https://*.google.com.mm/*
// @exclude https://*.google.mn/*
// @exclude https://*.google.ms/*
// @exclude https://*.google.com.mt/*
// @exclude https://*.google.mu/*
// @exclude https://*.google.mv/*
// @exclude https://*.google.mw/*
// @exclude https://*.google.com.mx/*
// @exclude https://*.google.com.my/*
// @exclude https://*.google.co.mz/*
// @exclude https://*.google.com.na/*
// @exclude https://*.google.com.nf/*
// @exclude https://*.google.com.ng/*
// @exclude https://*.google.com.ni/*
// @exclude https://*.google.ne/*
// @exclude https://*.google.nl/*
// @exclude https://*.google.no/*
// @exclude https://*.google.com.np/*
// @exclude https://*.google.nr/*
// @exclude https://*.google.nu/*
// @exclude https://*.google.co.nz/*
// @exclude https://*.google.com.om/*
// @exclude https://*.google.com.pa/*
// @exclude https://*.google.com.pe/*
// @exclude https://*.google.com.pg/*
// @exclude https://*.google.com.ph/*
// @exclude https://*.google.com.pk/*
// @exclude https://*.google.pl/*
// @exclude https://*.google.pn/*
// @exclude https://*.google.com.pr/*
// @exclude https://*.google.ps/*
// @exclude https://*.google.pt/*
// @exclude https://*.google.com.py/*
// @exclude https://*.google.com.qa/*
// @exclude https://*.google.ro/*
// @exclude https://*.google.ru/*
// @exclude https://*.google.rw/*
// @exclude https://*.google.com.sa/*
// @exclude https://*.google.com.sb/*
// @exclude https://*.google.sc/*
// @exclude https://*.google.se/*
// @exclude https://*.google.com.sg/*
// @exclude https://*.google.sh/*
// @exclude https://*.google.si/*
// @exclude https://*.google.sk/*
// @exclude https://*.google.com.sl/*
// @exclude https://*.google.sn/*
// @exclude https://*.google.so/*
// @exclude https://*.google.sm/*
// @exclude https://*.google.sr/*
// @exclude https://*.google.st/*
// @exclude https://*.google.com.sv/*
// @exclude https://*.google.td/*
// @exclude https://*.google.tg/*
// @exclude https://*.google.co.th/*
// @exclude https://*.google.com.tj/*
// @exclude https://*.google.tk/*
// @exclude https://*.google.tl/*
// @exclude https://*.google.tm/*
// @exclude https://*.google.tn/*
// @exclude https://*.google.to/*
// @exclude https://*.google.com.tr/*
// @exclude https://*.google.tt/*
// @exclude https://*.google.com.tw/*
// @exclude https://*.google.co.tz/*
// @exclude https://*.google.com.ua/*
// @exclude https://*.google.co.ug/*
// @exclude https://*.google.co.uk/*
// @exclude https://*.google.com.uy/*
// @exclude https://*.google.co.uz/*
// @exclude https://*.google.com.vc/*
// @exclude https://*.google.co.ve/*
// @exclude https://*.google.vg/*
// @exclude https://*.google.co.vi/*
// @exclude https://*.google.com.vn/*
// @exclude https://*.google.vu/*
// @exclude https://*.google.ws/*
// @exclude https://*.google.rs/*
// @exclude https://*.google.co.za/*
// @exclude https://*.google.co.zm/*
// @exclude https://*.google.co.zw/*
// @exclude https://*.google.cat/*
// @exclude https://*.youtube.com/*
// @exclude *://disqus.com/embed/*
// @exclude https://vk.com/*
// @exclude https://*.vk.com/*
// @exclude https://vimeo.com/*
// @exclude https://*.vimeo.com/*
// @exclude *://*.coub.com/*
// @exclude *://coub.com/*
// @exclude *://*.googlesyndication.com/*
// @exclude *://*.naver.com/*
// @exclude https://gstatic.com/*
// @exclude https://*.gstatic.com/*
// @exclude https://yandex.ru/*
// @exclude https://*.yandex.ru/*
// @exclude https://yandex.ua/*
// @exclude https://*.yandex.ua/*
// @exclude https://yandex.by/*
// @exclude https://*.yandex.by/*
// @exclude https://yandex.com/*
// @exclude https://*.yandex.com/*
// @exclude https://yandex.com.tr/*
// @exclude https://*.yandex.com.tr/*
// @exclude https://yandex.kz/*
// @exclude https://*.yandex.kz/*
// @exclude https://yandex.fr/*
// @exclude https://*.yandex.fr/*
// @exclude https://*.twitch.tv/*
// @exclude https://tinder.com/*
// @exclude *://*.yahoo.com/*
// @exclude *://chatovod.ru/*
// @exclude *://*.chatovod.ru/*
// @exclude *://vc.ru/*
// @exclude *://tjournal.ru/*
// @exclude *://amanice.ru/*
// @exclude *://ka-union.ru/*
// @exclude *://gameforge.com/*
// @exclude *://*.gameforge.com/*
// @exclude *://*.ssgdfm.com/*
// @exclude *://*.brainpop.com/*
// @exclude *://*.taobao.com/*
// @exclude *://*.ksl.com/*
// @exclude *://*.t-online.de/*
// @exclude *://boards.4channel.org/*
// @exclude *://*.washingtonpost.com/*
// @exclude *://*.kakao.com/*
// @exclude *://*.discounttire.com/*
// @exclude *://mail.ukr.net/*
// @exclude *://*.mail.ukr.net/*
// @exclude *://*.sahadan.com/*
// @exclude *://*.groupon.*/*
// @exclude *://*.amoma.com/*
// @exclude *://*.jccsmart.com/*
// @exclude *://wp.pl/*
// @exclude *://*.wp.pl/*
// @exclude *://money.pl/*
// @exclude *://*.money.pl/*
// @exclude *://o2.pl/*
// @exclude *://*.o2.pl/*
// @exclude *://pudelek.pl/*
// @exclude *://*.pudelek.pl/*
// @exclude *://komorkomania.pl/*
// @exclude *://*.komorkomania.pl/*
// @exclude *://gadzetomania.pl/*
// @exclude *://*.gadzetomania.pl/*
// @exclude *://fotoblogia.pl/*
// @exclude *://*.fotoblogia.pl/*
// @exclude *://autokult.pl/*
// @exclude *://*.autokult.pl/*
// @exclude *://abczdrowie.pl/*
// @exclude *://*.abczdrowie.pl/*
// @exclude *://parenting.pl/*
// @exclude *://*.parenting.pl/*
// @exclude *://dobreprogramy.pl/*
// @exclude *://*.dobreprogramy.pl/*
// @exclude *://polygamia.pl/*
// @exclude *://*.polygamia.pl/*
// @exclude *://*.mosreg.ru/*
// @exclude *://vietjetair.com/*
// @exclude *://*.vietjetair.com/*
// @exclude https://web.skype.com/*
// @exclude *://karelia.press/*
// @exclude *://*.karelia.press/*
// @exclude *://microsoft.com/*
// @exclude *://*.microsoft.com/*
// @exclude *://bancoctt.pt/*
// @exclude *://*.bancoctt.pt/*
// @exclude *://print24.com/*
// @exclude *://*.print24.com/*
// @exclude *://shellfcu.org/*
// @exclude *://*.shellfcu.org/*
// @exclude *://yesfile.com/*
// @exclude *://*.yesfile.com/*
// @exclude *://sunrise.ch/*
// @exclude *://*.sunrise.ch/*
// @exclude *://cetesdirecto.com/*
// @exclude *://*.cetesdirecto.com/*
// @exclude *://ubi.com/*
// @exclude *://*.ubi.com/*
// @exclude *://*.sistic.com.sg/*
// @exclude *://*.ilfattoquotidiano.it/*
// @exclude *://*.vanis.io/*
// @exclude *://*.senpa.io/*
// @exclude *://wielkopolskiebilety.pl/*
// @exclude *://*.wielkopolskiebilety.pl/*
// @exclude *://*.astrogo.astro.com.my/*
// @exclude *://*.chaturbate.com/*
// @exclude *://play.pl/*
// @exclude *://*.play.pl/*
// @exclude *://web.de/*
// @exclude *://*.web.de/*
// @exclude *://gmx.net/*
// @exclude *://*.gmx.net/*
// @exclude *://clashofclans.com/*
// @exclude *://*.clashofclans.com/*
// @exclude *://online.bfgruppe.de/*
// @exclude *://*.online.bfgruppe.de/*
// @exclude *://portalpasazera.pl/*
// @exclude *://*.portalpasazera.pl/*
// @exclude *://jeanne-laffitte.com/*
// @exclude *://*.jeanne-laffitte.com/*
// @exclude *://epicgames.com/*
// @exclude *://*.epicgames.com/*
// @exclude *://freizeithugl.de/*
// @exclude *://*.freizeithugl.de/*
// @exclude *://koleje-wielkopolskie.com.pl/*
// @exclude *://*.koleje-wielkopolskie.com.pl/*
// @exclude *://ygosu.com/*
// @exclude *://*.ygosu.com/*
// @exclude *://ppss.kr/*
// @exclude *://*.ppss.kr/*
// @exclude *://nordea.com/*
// @exclude *://*.nordea.com/*
// @exclude *://*.gov/*
// @exclude *://austintestingandtherapy.com/*
// @exclude *://*.austintestingandtherapy.com/*
// @exclude *://learn-anything.xyz/*
// @exclude *://*.learn-anything.xyz/*
// @exclude *://egybest.*/*
// @exclude *://*.egybest.*/*
// @exclude *://ancestry.com/*
// @exclude *://*.ancestry.com/*
// @exclude *://login.mts.ru/*
// @exclude *://*.login.mts.ru/*
// @exclude *://ebay.com/*
// @exclude *://*.ebay.com/*
// @exclude *://outlook.live.*/*
// @exclude *://*.outlook.live.*/*
// @exclude *://joom.com.*/*
// @exclude *://*.joom.com.*/*
// @exclude *://unrealengine.com/*
// @exclude *://*.unrealengine.com/*
// @exclude freelancer.com
// @exclude ov-chipkaart.nl
// @exclude tezgoal.com
// @exclude joom.com
// @exclude *://id.gov.ua/*
// @exclude *://github.com/*
// @exclude *://tiktok.com/*
// @exclude *://*.tiktok.com/*
// @exclude *://namu.wiki/*
// @exclude *://*.namu.wiki/*
// @exclude https://ygosu.com/*
// @exclude https://m.ygosu.com/*
// @exclude https://ad-shield.io/*
// @exclude https://feedclick.net/*
// @exclude https://sportalkorea.com/*
// @exclude https://*.sportalkorea.com/*
// @exclude https://enetnews.co.kr/*
// @exclude https://*.enetnews.co.kr/*
// @exclude https://edaily.co.kr/*
// @exclude https://*.edaily.co.kr/*
// @exclude https://economist.co.kr/*
// @exclude https://*.economist.co.kr/*
// @exclude https://etoday.co.kr/*
// @exclude https://*.etoday.co.kr/*
// @exclude https://hankyung.com/*
// @exclude https://*.hankyung.com/*
// @exclude https://isplus.com/*
// @exclude https://*.isplus.com/*
// @exclude https://hometownstation.com/*
// @exclude https://*.hometownstation.com/*
// @exclude https://inven.co.kr/*
// @exclude https://*.inven.co.kr/*
// @exclude https://loawa.com/*
// @exclude https://*.loawa.com/*
// @exclude https://viva100.com/*
// @exclude https://*.viva100.com/*
// @exclude https://joongdo.co.kr/*
// @exclude https://*.joongdo.co.kr/*
// @exclude https://kagit.kr/*
// @exclude https://*.kagit.kr/*
// @exclude https://jjang0u.com/*
// @exclude https://*.jjang0u.com/*
// @exclude https://cboard.net/*
// @exclude https://*.cboard.net/*
// @exclude https://interfootball.co.kr/*
// @exclude https://*.interfootball.co.kr/*
// @exclude https://fourfourtwo.co.kr/*
// @exclude https://*.fourfourtwo.co.kr/*
// @exclude https://newdaily.co.kr/*
// @exclude https://*.newdaily.co.kr/*
// @exclude https://genshinlab.com/*
// @exclude https://*.genshinlab.com/*
// @exclude https://thephoblographer.com/*
// @exclude https://*.thephoblographer.com/*
// @exclude https://dogdrip.net/*
// @exclude https://*.dogdrip.net/*
// @exclude https://honkailab.com/*
// @exclude https://*.honkailab.com/*
// @exclude https://warcraftrumbledeck.com/*
// @exclude https://*.warcraftrumbledeck.com/*
// @exclude https://mlbpark.donga.com/*
// @exclude https://*.mlbpark.donga.com/*
// @exclude https://gamingdeputy.com/*
// @exclude https://*.gamingdeputy.com/*
// @exclude https://thestockmarketwatch.com/*
// @exclude https://*.thestockmarketwatch.com/*
// @exclude https://thesaurus.net/*
// @exclude https://*.thesaurus.net/*
// @exclude https://forexlive.com/*
// @exclude https://*.forexlive.com/*
// @exclude https://tweaksforgeeks.com/*
// @exclude https://*.tweaksforgeeks.com/*
// @exclude https://alle-tests.nl/*
// @exclude https://*.alle-tests.nl/*
// @exclude https://allthetests.com/*
// @exclude https://*.allthetests.com/*
// @exclude https://issuya.com/*
// @exclude https://*.issuya.com/*
// @exclude https://maketecheasier.com/*
// @exclude https://*.maketecheasier.com/*
// @exclude https://motorbikecatalog.com/*
// @exclude https://*.motorbikecatalog.com/*
// @exclude https://automobile-catalog.com/*
// @exclude https://*.automobile-catalog.com/*
// @exclude https://topstarnews.net/*
// @exclude https://*.topstarnews.net/*
// @exclude https://worldhistory.org/*
// @exclude https://*.worldhistory.org/*
// @exclude https://etnews.com/*
// @exclude https://*.etnews.com/*
// @exclude https://iusm.co.kr/*
// @exclude https://*.iusm.co.kr/*
// @exclude https://etoland.co.kr/*
// @exclude https://*.etoland.co.kr/*
// @exclude https://apkmirror.com/*
// @exclude https://*.apkmirror.com/*
// @exclude https://uttranews.com/*
// @exclude https://*.uttranews.com/*
// @exclude https://fntimes.com/*
// @exclude https://*.fntimes.com/*
// @exclude https://javatpoint.com/*
// @exclude https://*.javatpoint.com/*
// @exclude https://text-compare.com/*
// @exclude https://*.text-compare.com/*
// @exclude https://vipotv.com/*
// @exclude https://*.vipotv.com/*
// @exclude https://lamire.jp/*
// @exclude https://*.lamire.jp/*
// @exclude https://dt.co.kr/*
// @exclude https://*.dt.co.kr/*
// @exclude https://g-enews.*/*
// @exclude https://*.g-enews.*/*
// @exclude https://allthekingz.com/*
// @exclude https://*.allthekingz.com/*
// @exclude https://gadgets360.com/*
// @exclude https://*.gadgets360.com/*
// @exclude https://sports.hankooki.com/*
// @exclude https://*.sports.hankooki.com/*
// @exclude https://ajunews.com/*
// @exclude https://*.ajunews.com/*
// @exclude https://munhwa.com/*
// @exclude https://*.munhwa.com/*
// @exclude https://zal.kr/*
// @exclude https://*.zal.kr/*
// @exclude https://wfmz.com/*
// @exclude https://*.wfmz.com/*
// @exclude https://thestar.co.uk/*
// @exclude https://*.thestar.co.uk/*
// @exclude https://yorkshirepost.co.uk/*
// @exclude https://*.yorkshirepost.co.uk/*
// @exclude https://mydaily.co.kr/*
// @exclude https://*.mydaily.co.kr/*
// @exclude https://raenonx.cc/*
// @exclude https://*.raenonx.cc/*
// @exclude https://ndtvprofit.com/*
// @exclude https://*.ndtvprofit.com/*
// @exclude https://badmouth1.com/*
// @exclude https://*.badmouth1.com/*
// @exclude https://logicieleducatif.fr/*
// @exclude https://*.logicieleducatif.fr/*
// @exclude https://taxguru.in/*
// @exclude https://*.taxguru.in/*
// @exclude https://islamicfinder.org/*
// @exclude https://*.islamicfinder.org/*
// @exclude https://aikatu.jp/*
// @exclude https://*.aikatu.jp/*
// @exclude https://secure-signup.net/*
// @exclude https://*.secure-signup.net/*
// @exclude https://globalrph.com/*
// @exclude https://*.globalrph.com/*
// @exclude https://sportsrec.com/*
// @exclude https://*.sportsrec.com/*
// @exclude https://reportera.co.kr/*
// @exclude https://*.reportera.co.kr/*
// @exclude https://slobodnadalmacija.hr/*
// @exclude https://*.slobodnadalmacija.hr/*
// @exclude https://carscoops.com/*
// @exclude https://*.carscoops.com/*
// @exclude https://indiatimes.com/*
// @exclude https://*.indiatimes.com/*
// @exclude https://flatpanelshd.com/*
// @exclude https://*.flatpanelshd.com/*
// @exclude https://sportsseoul.com/*
// @exclude https://*.sportsseoul.com/*
// @exclude https://gloria.hr/*
// @exclude https://*.gloria.hr/*
// @exclude https://videogamemods.com/*
// @exclude https://*.videogamemods.com/*
// @exclude https://adintrend.tv/*
// @exclude https://ark-unity.com/*
// @exclude https://*.ark-unity.com/*
// @exclude https://cool-style.com.tw/*
// @exclude https://*.cool-style.com.tw/*
// @exclude https://dziennik.pl/*
// @exclude https://*.dziennik.pl/*
// @exclude https://eurointegration.com.ua/*
// @exclude https://*.eurointegration.com.ua/*
// @exclude https://jin115.com/*
// @exclude https://*.jin115.com/*
// @exclude https://onlinegdb.com/*
// @exclude https://*.onlinegdb.com/*
// @exclude https://winfuture.de/*
// @exclude https://*.winfuture.de/*
// @exclude https://hoyme.jp/*
// @exclude https://*.hoyme.jp/*
// @exclude https://pravda.com.ua/*
// @exclude https://*.pravda.com.ua/*
// @exclude https://freemcserver.net/*
// @exclude https://*.freemcserver.net/*
// @exclude https://esuteru.com/*
// @exclude https://*.esuteru.com/*
// @exclude https://pressian.com/*
// @exclude https://*.pressian.com/*
// @exclude https://blog.livedoor.jp/kinisoku/*
// @exclude https://blog.livedoor.jp/nanjstu/*
// @exclude https://itainews.com/*
// @exclude https://*.itainews.com/*
// @exclude https://infinityfree.com/*
// @exclude https://*.infinityfree.com/*
// @exclude https://wort-suchen.de/*
// @exclude https://*.wort-suchen.de/*
// @exclude https://dramabeans.com/*
// @exclude https://*.dramabeans.com/*
// @exclude https://word-grabber.com/*
// @exclude https://*.word-grabber.com/*
// @exclude https://palabr.as/*
// @exclude https://*.palabr.as/*
// @exclude https://motscroises.fr/*
// @exclude https://*.motscroises.fr/*
// @exclude https://cruciverba.it/*
// @exclude https://*.cruciverba.it/*
// @exclude https://missyusa.com/*
// @exclude https://*.missyusa.com/*
// @exclude https://smsonline.cloud/*
// @exclude https://*.smsonline.cloud/*
// @exclude https://crosswordsolver.com/*
// @exclude https://*.crosswordsolver.com/*
// @exclude https://heureka.cz/*
// @exclude https://*.heureka.cz/*
// @exclude https://oradesibiu.ro/*
// @exclude https://*.oradesibiu.ro/*
// @exclude https://oeffnungszeitenbuch.de/*
// @exclude https://*.oeffnungszeitenbuch.de/*
// @exclude https://the-crossword-solver.com/*
// @exclude https://*.the-crossword-solver.com/*
// @exclude https://woxikon.*/*
// @exclude https://*.woxikon.*/*
// @exclude https://oraridiapertura24.it/*
// @exclude https://*.oraridiapertura24.it/*
// @exclude https://laleggepertutti.it/*
// @exclude https://*.laleggepertutti.it/*
// @exclude https://news4vip.livedoor.biz/*
// @exclude *://onecall2ch.com/*
// @exclude *://*.onecall2ch.com/*
// @exclude https://ff14net.2chblog.jp/*
// @exclude https://ondemandkorea.com/*
// @exclude https://*.ondemandkorea.com/*
// @exclude https://economictimes.com/*
// @exclude https://*.economictimes.com/*
// @exclude https://mynet.com/*
// @exclude https://*.mynet.com/*
// @exclude https://rabitsokuhou.2chblog.jp/*
// @exclude https://talkwithstranger.com/*
// @exclude https://*.talkwithstranger.com/*
// @exclude https://petitfute.com/*
// @exclude https://*.petitfute.com/*
// @exclude https://netzwelt.de/*
// @exclude https://*.netzwelt.de/*
// @exclude https://convertcase.net/*
// @exclude https://*.convertcase.net/*
// @exclude https://picrew.me/*
// @exclude https://*.picrew.me/*
// @exclude https://rostercon.com/*
// @exclude https://*.rostercon.com/*
// @exclude https://woxikon.de/*
// @exclude https://*.woxikon.de/*
// @exclude https://suzusoku.blog.jp/*
// @exclude https://kreuzwortraetsel.de/*
// @exclude https://*.kreuzwortraetsel.de/*
// @exclude https://slashdot.org/*
// @exclude https://*.slashdot.org/*
// @exclude https://yutura.net/*
// @exclude https://*.yutura.net/*
// @exclude https://jutarnji.hr/*
// @exclude https://*.jutarnji.hr/*
// @exclude https://sourceforge.net/*
// @exclude https://*.sourceforge.net/*
// @exclude https://manta.com/*
// @exclude https://*.manta.com/*
// @exclude https://tportal.hr/*
// @exclude https://*.tportal.hr/*
// @exclude https://horairesdouverture24.fr/*
// @exclude https://*.horairesdouverture24.fr/*
// @exclude https://nyitvatartas24.hu/*
// @exclude https://*.nyitvatartas24.hu/*
// @exclude https://verkaufsoffener-sonntag.com/*
// @exclude https://*.verkaufsoffener-sonntag.com/*
// @exclude https://raetsel-hilfe.de/*
// @exclude https://*.raetsel-hilfe.de/*
// @exclude https://zeta-ai.io/*
// @exclude https://*.zeta-ai.io/*
// @exclude https://zagreb.info/*
// @exclude https://*.zagreb.info/*
// @exclude https://powerpyx.com/*
// @exclude https://*.powerpyx.com/*
// @exclude https://webdesignledger.com/*
// @exclude https://*.webdesignledger.com/*
// @exclude https://dolldivine.com/*
// @exclude https://*.dolldivine.com/*
// @exclude https://cinema.com.my/*
// @exclude https://*.cinema.com.my/*
// @exclude https://lacuarta.com/*
// @exclude https://*.lacuarta.com/*
// @exclude https://wetteronline.de/*
// @exclude https://*.wetteronline.de/*
// @exclude https://yugioh-starlight.com/*
// @exclude https://*.yugioh-starlight.com/*
// ==/UserScript==
