// ==UserScript==
// @name AdGuard Popup Blocker (Dev)
// @name:ru Блокировщик всплывающей рекламы от AdGuard (Dev)
// @name:es-419 AdGuard Popup Blocker (Dev)
// @name:hu AdGuard Felugró Szűrő (Dev)
// @name:pt-PT AdGuard Popup Blocker (Dev)
// @name:it Blocco Pop-Up di AdGuard (Dev)
// @name:tr AdGuard Popup Blocker (Dev)
// @name:fr Bloqueur de popup de AdGuard (Dev)
// @name:ko AdGuard Popup Blocker (Dev)
// @name:zh-CN AdGuard 弹窗拦截器 (Dev)
// @name:zh-TW AdGuard 彈出式視窗封鎖器 (Dev)
// @name:fa مسدودساز پاپ-آپ AdGuard (Dev)
// @name:pl Bloker wyskakujących okienek przez AdGuard (Dev)
// @name:id AdGuard Popup Blocker (Dev)
// @name:de AdGuard Pop-up-Blocker (Dev)
// @name:sv AdGuards popup-blockerare (Dev)
// @name:mk-MK AdGuard Popup Blocker (Dev)
// @name:sk AdGuard blokovač vyskakovacích okien (Dev)
// @name:da AdGuard Popup Blocker (Dev)
// @name:nl AdGuard Popup Blocker (Dev)
// @name:ms AdGuard Popup Blocker (Dev)
// @name:uk Блокувальник спливаючої реклами AdGuard (Dev)
// @name:es-ES Bloqueador de popup de AdGuard (Dev)
// @name:vi AdGuard Popup Blocker (Dev)
// @name:no AdGuards popup-blokkerer (Dev)
// @name:sr-Latn AdGuard blokator iskačućih prozora (Dev)
// @name:ja AdGuard ポップアップブロッカー (Dev)
// @name:pt-BR AdGuard Bloqueador de Pop-ups (Dev)
// @name:ar AdGuard Popup Blocker (Dev)
// @namespace AdGuard
// @description Blocks popup ads on web pages
// @description:ru Блокирует всплывающую рекламу на страницах
// @description:es-419 Bloquea anuncios emergentes en páginas web
// @description:hu A felugró hirdetéseket szűri minden weboldalon
// @description:pt-PT Bloqueia anúncios popup em páginas da web.
// @description:it Blocca gli annunci di popup nelle pagine internet
// @description:tr Web sayfalarında açılan pencere reklamları engeller
// @description:fr Bloque les publicités intrusives sur les pages web
// @description:ko 웹 페이지의 팝업 광고를 차단합니다.
// @description:zh-CN 拦截网页弹窗广告
// @description:zh-TW 封鎖於網頁上之彈出式視窗廣告
// @description:fa مسدودسازی تبلیغات پاپ آپ در صفحات وب.
// @description:pl Blokuje wyskakujące okienka z reklamami na stronach internetowych
// @description:id Blocks popup ads on web pages
// @description:de Blockiert Anzeige-Pop-ups auf Webseiten
// @description:sv Blockerar popupfönster på webbsidor
// @description:mk-MK Blocks popup ads on web pages
// @description:sk Blokuje vyskakovacie reklamy na webových stránkach
// @description:da Blokerer pop-up reklamer på websider
// @description:nl Blokkeert pop up advertenties op webpagina's
// @description:ms Halang iklan popup di laman web
// @description:uk Блокує спливаючу рекламу на веб-сторінках
// @description:es-ES Bloquea elementos emergentes en sitios web
// @description:vi Chặn quảng cáo popup trên các trang web
// @description:no Blokker popup-annonser på nettsider
// @description:sr-Latn Blokira iskačuće reklame na veb stranicama
// @description:ja Webページでポップアップ広告をブロックします。
// @description:pt-BR Bloqueia anúncios pop-ups dentro dos sites
// @description:ar لحظر الإعلانات المنبثقة على صفحات الويب
// @version 2.5.3
// @license LGPL-3.0; https://github.com/AdguardTeam/PopupBlocker/blob/master/LICENSE
// @downloadURL https://popupblocker.adguard.com/popupblocker.user.js
// @updateURL https://popupblocker.adguard.com/popupblocker.meta.js
// @supportURL https://github.com/AdguardTeam/PopupBlocker/issues
// @homepageURL https://popupblocker.adguard.com/
// @match http://*/*
// @match https://*/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @grant GM_getResourceURL
// @grant unsafeWindow
// @icon ./assets/128.png
// @resource ./assets/fonts/bold/OpenSans-Bold.woff ./assets/fonts/bold/OpenSans-Bold.woff
// @resource ./assets/fonts/bold/OpenSans-Bold.woff2 ./assets/fonts/bold/OpenSans-Bold.woff2
// @resource ./assets/fonts/regular/OpenSans-Regular.woff ./assets/fonts/regular/OpenSans-Regular.woff
// @resource ./assets/fonts/regular/OpenSans-Regular.woff2 ./assets/fonts/regular/OpenSans-Regular.woff2
// @resource ./assets/fonts/semibold/OpenSans-Semibold.woff ./assets/fonts/semibold/OpenSans-Semibold.woff
// @resource ./assets/fonts/semibold/OpenSans-Semibold.woff2 ./assets/fonts/semibold/OpenSans-Semibold.woff2
// @run-at document-start
// ==/UserScript==
