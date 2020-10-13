// ==UserScript==
// @name AdGuard Popup Blocker (Dev)
// @name:ar مانع النوافذ المنبثقة AdGuard (Dev)
// @name:be Блакавальнік усплывальнай рэкламы ад AdGuard (Dev)
// @name:cs AdGuard blokátor vyskakovacích oken (Dev)
// @name:da AdGuard Popup Blocker (Dev)
// @name:de AdGuard Pop-up-Blocker (Dev)
// @name:es AdGuard Popup Blocker (Dev)
// @name:fa مسدودساز پاپ-آپ AdGuard (Dev)
// @name:fi AdGuardin Ponnahdusikkunan estäjä (Dev)
// @name:fr Bloqueur de fenêtres pop-up de AdGuard (Dev)
// @name:id Pemblokir Popup AdGuard (Dev)
// @name:it Blocco Pop-Up di AdGuard (Dev)
// @name:ja AdGuard ポップアップブロッカー (Dev)
// @name:ko AdGuard 팝업 차단기 (Dev)
// @name:lt AdGuard iššokančiųjų langų blokatorius (Dev)
// @name:ms AdGuard Penyekat Pop Timbul (Dev)
// @name:no AdGuards popup-blokkerer (Dev)
// @name:pl Bloker wyskakujących okienek przez AdGuard (Dev)
// @name:pt AdGuard Bloqueador de Pop-ups (Dev)
// @name:pt-PT Bloqueador de Popup AdGuard (Dev)
// @name:ru Блокировщик всплывающей рекламы от AdGuard (Dev)
// @name:sl AdGuard Zaviralec pojavnih oken (Dev)
// @name:tr AdGuard Popup Blocker eklentisi (Dev)
// @name:uk Блокувальник спливаючої реклами AdGuard (Dev)
// @name:vi AdGuard Popup Blocker (Dev)
// @name:zh AdGuard 弹窗拦截器 (Dev)
// @name:zh-TW AdGuard 彈出式視窗封鎖器 (Dev)
// @namespace adguard
// @description Blocks popup ads on web pages
// @description:ar لحظر الإعلانات المنبثقة على صفحات الويب
// @description:be Блакуе ўсплывальную рэкламу на старонках
// @description:cs Blokuje vyskakovací reklamy na webových stránkách
// @description:da Blokerer pop-up reklamer på websider
// @description:de Blockiert Anzeige-Pop-ups auf Webseiten
// @description:es Bloquea anuncios emergentes en sitios web
// @description:fa مسدودسازی تبلیغات پاپ آپ در صفحات وب.
// @description:fi Estää ponnahdusikkunamainokset verkkosivustoilla
// @description:fr Bloque les fenêtres pop-up avec publicités intrusives sur les pages web
// @description:id Blokir iklan popup di halaman web
// @description:it Blocca gli annunci di popup nelle pagine internet
// @description:ja Webページでポップアップ広告をブロックします。
// @description:ko 웹 페이지에서 팝업 광고를 차단
// @description:lt Blokuoja iššokančius skelbimus tinklalapiuose
// @description:ms Sekat pop timbul pada laman web
// @description:no Blokker popup-annonser på nettsider
// @description:pl Blokuje wyskakujące okienka na stronach internetowych
// @description:pt Bloqueia anúncios pop-ups dentro dos sites
// @description:pt-PT Bloqueia anúncios popup em páginas da web.
// @description:ru Блокирует всплывающую рекламу на страницах
// @description:sl Blokira pojavne oglase na spletnih straneh
// @description:tr Web sayfalarında açılan pencere reklamları engeller
// @description:uk Блокує спливаючу рекламу на веб-сторінках
// @description:vi Chặn quảng cáo bật lên trên các trang web
// @description:zh 拦截网页弹窗广告
// @description:zh-TW 封鎖於網頁上之彈出式視窗廣告
// @version 2.5.29
// @license LGPL-3.0; https://github.com/AdguardTeam/PopupBlocker/blob/master/LICENSE
// @downloadURL https://AdguardTeam.github.io/PopupBlocker/popupblocker.user.js
// @updateURL https://AdguardTeam.github.io/PopupBlocker/popupblocker.meta.js
// @supportURL https://github.com/AdguardTeam/PopupBlocker/issues
// @homepageURL https://popupblocker.adguard.com/
// @match http://*/*
// @match https://*/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
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
