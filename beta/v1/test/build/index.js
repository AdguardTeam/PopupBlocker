(function () {

    const DEBUG = false; const RECORD = false; const NO_PROXY = true;

    var ProxyServiceExternalError = /** @class */ (function () {
        function ProxyServiceExternalError(original) {
            this.original = original;
        }
        return ProxyServiceExternalError;
    }());

    var getTime = 'now' in performance ? function () { return performance.timing.navigationStart + performance.now(); } : Date.now;

    /* eslint-disable no-console, prefer-rest-params */
    var log = (function () {
        var prefix = '';
        var win = window;
        while (win.parent !== win) {
            // @ts-ignore
            win = win.parent;
            prefix += '-- ';
        }
        var loc = window.location.href;
        var suffix = "    (at ".concat(loc, ")");
        var depth = 0;
        function call(msg) {
            depth += 1;
            console.group(prefix + msg + suffix);
        }
        function callEnd() {
            depth -= 1;
            console.groupEnd();
        }
        function closeAllGroup() {
            while (depth > 0) {
                console.groupEnd();
                depth -= 1;
            }
        }
        function print(str, obj) {
            var date = getTime().toFixed(3);
            var indent = 10 - date.length;
            if (indent < 0) {
                indent = 0;
            }
            var indentstr = '';
            // eslint-disable-next-line no-plusplus
            while (indent-- > 0) {
                indentstr += ' ';
            }
            console.log("".concat(prefix, "[").concat(indentstr).concat(date, "]: ").concat(str).concat(suffix));
            if (obj !== undefined) {
                console.log("".concat(prefix, "============================="));
                try {
                    console.log(obj);
                }
                catch (e) {
                    /**
                     * According to testing, Edge 41.16299 throws some errors
                     * while printing some `Proxy` objects in console, such as
                     * new Proxy(window, { get: Reflect.get }).
                     * Strangely, just having a try-catch block enclosing it prevents errors.
                     */
                    console.log('Object not printed due to an error');
                }
                console.log("".concat(prefix, "============================="));
            }
        }
        var connect = function (fn, message, cond) { return function () {
            // eslint-disable-next-line prefer-spread
            var shouldLog = cond ? cond.apply(null, arguments) : true;
            if (shouldLog) {
                call(message);
            }
            var ret = fn.apply(this, arguments);
            if (shouldLog) {
                callEnd();
            }
            return ret;
        }; };
        var connectSimplified = function (fn) { return fn; };
        function throwMessage(thrown) {
            throw thrown;
        }
        function throwMessageSimplified(thrown, code) {
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw code;
        }
        // Debug api is only required in DEBUG mode
        if (DEBUG) {
            return {
                call: call,
                callEnd: callEnd,
                closeAllGroup: closeAllGroup,
                print: print,
                connect: connect,
                throwMessage: throwMessage,
            };
        }
        // For beta and release builds simple debug methods are stubbed,
        // connect() and throwMessage() methods are simplified
        var noopFunc = function () { };
        return {
            call: noopFunc,
            callEnd: noopFunc,
            closeAllGroup: noopFunc,
            print: noopFunc,
            connect: connectSimplified,
            throwMessage: throwMessageSimplified,
        };
    })();

    var en = {
    	show_popup: {
    		message: "Show %destUrl%"
    	},
    	continue_blocking: {
    		message: "Continue blocking"
    	},
    	allow_from: {
    		message: "Allow popups for %origDomain%"
    	},
    	manage_pref: {
    		message: "Manage preferences..."
    	},
    	popup_text: {
    		message: "AdGuard prevented this website from opening %numPopup% pop-up windows"
    	},
    	options: {
    		message: "Options"
    	},
    	silence_noti: {
    		message: "Don't show this message on %origDomain%"
    	},
    	site_input_ph: {
    		message: "Enter site name"
    	},
    	add_site: {
    		message: "Add a site"
    	},
    	add: {
    		message: "Add"
    	},
    	allowed_empty: {
    		message: "List of allowed sites is empty"
    	},
    	allowed: {
    		message: "Allowed"
    	},
    	silenced_empty: {
    		message: "List of silenced sites is empty"
    	},
    	silenced: {
    		message: "Silenced"
    	},
    	allowed_tooltip: {
    		message: "Popups will be allowed for domains listed here."
    	},
    	silenced_tooltip: {
    		message: "Notifications for blocked popups will not be shown for domains listed here."
    	},
    	installFrom: {
    		message: "Install from <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Step 3: Refresh this page to get to the userscript settings"
    	},
    	noinst_ignore_if_ag: {
    		message: "If you installed AdGuard for Windows, you can ignore this step as the Popup Blocker userscript comes pre-installed."
    	},
    	noinst_rec: {
    		message: "(Recommended)"
    	},
    	please_wait: {
    		message: "Please wait, detecting the Popup Blocker"
    	},
    	noinst_special_prog: {
    		message: "To use a userscript, you first need a special program or extension that runs userscript."
    	},
    	noinst_subtitle: {
    		message: "AdGuard Popup Blocker userscript is not installed. Please see the instruction below."
    	},
    	homepage: {
    		message: "Homepage"
    	},
    	noinst_step_1: {
    		message: "Step 1: Install a userscript manager"
    	},
    	noinst_step_2: {
    		message: "Step 2: Userscript"
    	},
    	extension_name: {
    		message: "Popup Blocker by AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Popup Blocker",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blocks pop-up ads on web pages"
    	},
    	on_navigation_by_popunder: {
    		message: "This transition to the new page is likely to be caused by a pop-under. Do you wish to continue?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Popup Blocker aborted a script execution to prevent background redirect",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Popup Blocker is on duty"
    	},
    	ext_disabled: {
    		message: "Popup Blocker is disabled for $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Popup Blocker is disabled for this domain"
    	},
    	settings_saved: {
    		message: "Settings saved"
    	}
    };
    var ar = {
    	show_popup: {
    		message: "%destUrl%اظهار"
    	},
    	continue_blocking: {
    		message: "متابعة الحظر"
    	},
    	allow_from: {
    		message: "%origDomain%السماح بالنوافذ المنبثقة على"
    	},
    	manage_pref: {
    		message: "...أداره التفضيلات"
    	},
    	popup_text: {
    		message: "النوافذالمنبثقة%numPopup% منع ادجارد موقع الويب هذا من فتح"
    	},
    	options: {
    		message: "الخيارات"
    	},
    	silence_noti: {
    		message: "%origDomain%عدم إظهار هذه الرسالة على"
    	},
    	site_input_ph: {
    		message: "ادخل اسم الموقع"
    	},
    	add_site: {
    		message: "إضافة موقع"
    	},
    	add: {
    		message: "إضافة"
    	},
    	allowed_empty: {
    		message: "قائمه الاستثناءات فارعة"
    	},
    	allowed: {
    		message: "الاستثناءات "
    	},
    	silenced_empty: {
    		message: "قائمة المواقع التي تحتوي على إشعارات صامتة فارغة"
    	},
    	silenced: {
    		message: "صامت"
    	},
    	allowed_tooltip: {
    		message: "سيتم السماح بالنوافذ المنبثقة على المواقع المدرجة هنا"
    	},
    	silenced_tooltip: {
    		message: "لن يتم عرض إشعارات النوافذ المنبثقة الممنوعة على مواقع الويب المدرجة هنا"
    	},
    	installFrom: {
    		message: "<a>%name%</a>التثبيت من"
    	},
    	noinst_step_3: {
    		message: "الخطوة 3: قم بتحديث هذه الصفحة للوصول إلى إعدادات userscript"
    	},
    	noinst_ignore_if_ag: {
    		message: "إذا كان لديك برنامج ادجوارد مثبتًا على الويندوز ، فيمكنك تجاهل هذه الخطوة حيث يأتي مانع النوافذ المنبثقة مثبتة مسبقًا"
    	},
    	noinst_rec: {
    		message: "(موصى به)"
    	},
    	please_wait: {
    		message: "يرجى الانتظار للكشف عن مانع ظهور النوافذ المنبثقة"
    	},
    	noinst_special_prog: {
    		message: "أولاً وقبل كل شيء, لاستخدام userscript تحتاج إلى برنامج خاص أو ملحق الذي يستطيع تشغيل userscript."
    	},
    	noinst_subtitle: {
    		message: "لم يتم تثبيت يوزر سكربت ادجوارد مانع النوافذ المنبثقة  يرجى الاطلاع على التعليمات أدناه"
    	},
    	homepage: {
    		message: "الصفحه الرئيسيه"
    	},
    	noinst_step_1: {
    		message: "الخطوة 1: تثبيت مديريوزر سكربت"
    	},
    	noinst_step_2: {
    		message: "الخطوة 2: يوزر سكربت"
    	},
    	extension_name: {
    		message: "AdGuardمانع النوافذ المنبثقة من قبل"
    	},
    	userscript_name: {
    		message: "مانع النوافذ المنبثقة AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "لحظر الإعلانات المنبثقة على صفحات الويب"
    	},
    	on_navigation_by_popunder: {
    		message: "من المحتمل ان يكون هذا الانتقال إلى الصفحة الجديدة ناتجا عن الإطار المنبثق. هل ترغب في المتابعة ؟",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "مانع النوافذ المنبثقة احبط تنفيذ script لمنع أعاده توجيه الخلفية",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "مانع النوافذ المنبثقة يعمل في الخدمة"
    	},
    	ext_disabled: {
    		message: "$ DOMAIN $تم تعطيل مانع النوافذ المنبثقة بـ",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "لا يمكن تشغيل مانع النوافذ المنبثقة على هذا النطاق"
    	},
    	settings_saved: {
    		message: "الإعدادات المحفوظة"
    	}
    };
    var be = {
    	show_popup: {
    		message: "Паказаць %destUrl%"
    	},
    	continue_blocking: {
    		message: "Працягнуць блакаванне"
    	},
    	allow_from: {
    		message: "Дазволіць усплывальныя вокны на %origDomain%"
    	},
    	manage_pref: {
    		message: "Кіраваць наладамі..."
    	},
    	popup_text: {
    		message: "AdGuard запабег паказ %numPopup% усплывальных вокнаў на гэтым сайце"
    	},
    	options: {
    		message: "Опцыі"
    	},
    	silence_noti: {
    		message: "Не паказваць гэта паведамленне на %origDomain%"
    	},
    	site_input_ph: {
    		message: "Увядзіце імя сайта"
    	},
    	add_site: {
    		message: "Дадаць сайт"
    	},
    	add: {
    		message: "Дадаць"
    	},
    	allowed_empty: {
    		message: "Спіс выняткаў пусты"
    	},
    	allowed: {
    		message: "Выняткі"
    	},
    	silenced_empty: {
    		message: "Спіс сайтаў з адключанымі апавяшчэннямі пусты"
    	},
    	silenced: {
    		message: "Без апавяшчэнняў"
    	},
    	allowed_tooltip: {
    		message: "Усплывальныя вокны будуць дазволены на сайтах, пералічаных тут."
    	},
    	silenced_tooltip: {
    		message: "Апавяшчэнні пра заблакаваныя ўсплывальныя вокны не будуць адлюстроўвацца на сайтах, пералічаных тут."
    	},
    	installFrom: {
    		message: "Усталяваць з <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Крок 3: Абнавіце гэту старонку, каб перайсці да налад карыстацкага скрыпту"
    	},
    	noinst_ignore_if_ag: {
    		message: "Калі вы ўсталявалі AdGuard для Windows, вы можаце праігнараваць гэты крок, бо Блакавальнік усплывальнай рэкламы ўжо ўсталяваны."
    	},
    	noinst_rec: {
    		message: "(Рэкамендуецца)"
    	},
    	please_wait: {
    		message: "Калі ласка, пачакайце, спроба выявіць Блакавальнік усплывальнай рэкламы"
    	},
    	noinst_special_prog: {
    		message: "Для выкарыстання скрыпту вам, перадусім, патрэбна адмысловая праграма (ці пашырэнне), якая можа працаваць з карыстацкімі скрыптамі."
    	},
    	noinst_subtitle: {
    		message: "Блакавальнік усплывальнай рэкламы AdGuard не пастаўлены. Калі ласка, звярніцеся да інструкцыі ніжэй."
    	},
    	homepage: {
    		message: "Хатняя старонка"
    	},
    	noinst_step_1: {
    		message: "Крок 1: усталюйце праграму для кіравання карыстацкімі скрыптамі"
    	},
    	noinst_step_2: {
    		message: "Крок 2: карыстацкі скрыпт"
    	},
    	extension_name: {
    		message: "Блакавальнік усплывальнай рэкламы ад AdGuard"
    	},
    	userscript_name: {
    		message: "Блакавальнік усплывальнай рэкламы ад AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Блакуе ўсплывальную рэкламу на старонках"
    	},
    	on_navigation_by_popunder: {
    		message: "Гэты пераход на новую старонку найхутчэй выкліканы поп-андэрам. Усё адно працягнуць?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Блакавальнік усплывальнай рэкламы перапыніў выкананне скрыпту, каб перадухіліць фонавае пераадрасаванне",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Блакавальнік усплывальнай рэкламы гатоў да працы"
    	},
    	ext_disabled: {
    		message: "Блакавальнік усплывальнай рэкламы адключаны для $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Блакавальнік усплывальнай рэкламы не працуе на гэтым дамене"
    	},
    	settings_saved: {
    		message: "Налады захаваны"
    	}
    };
    var cs = {
    	show_popup: {
    		message: "Zobrazit %destUrl%"
    	},
    	continue_blocking: {
    		message: "Pokračovat v blokování"
    	},
    	allow_from: {
    		message: "Povolit vyskakovací okna pro %origDomain%"
    	},
    	manage_pref: {
    		message: "Spravovat předvolby"
    	},
    	popup_text: {
    		message: "AdGuard zabránil tomu, aby tato webová stránka otevřela vyskakovací okna: %numPopup%"
    	},
    	options: {
    		message: "Možnosti"
    	},
    	silence_noti: {
    		message: "Tuto zprávu nezobrazovat na %origDomain%"
    	},
    	site_input_ph: {
    		message: "Zadejte název stránky"
    	},
    	add_site: {
    		message: "Přidat stránku"
    	},
    	add: {
    		message: "Přidat"
    	},
    	allowed_empty: {
    		message: "Seznam výjimek je prázdný"
    	},
    	allowed: {
    		message: "Výjimky"
    	},
    	silenced_empty: {
    		message: "Seznam webových stránek s tichými oznámeními je prázdný"
    	},
    	silenced: {
    		message: "Umlčeno"
    	},
    	allowed_tooltip: {
    		message: "Vyskakovací okna jsou povolena na webových stránkách uvedených zde."
    	},
    	silenced_tooltip: {
    		message: "Oznámení o blokovaných vyskakovacích oknech se nezobrazí na zde uvedených webových stránkách."
    	},
    	installFrom: {
    		message: "Instalovat z <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Krok 3: Obnovte tuto stránku, abyste se dostali k nastavení uživatelských skriptů"
    	},
    	noinst_ignore_if_ag: {
    		message: "Pokud máte nainstalovanou službu AdGuard for Windows, můžete tento krok ignorovat. Uživatelský skript blokování vyskakovacích oken přichází předem nainstalovaný."
    	},
    	noinst_rec: {
    		message: "(Doporučeno)"
    	},
    	please_wait: {
    		message: "Čekejte prosím, zjišťuji Blokátor vyskakovacích oken"
    	},
    	noinst_special_prog: {
    		message: "Chcete-li používat uživatelský skript, potřebujete nejprve speciální program nebo rozšíření, které spustí uživatelský skript."
    	},
    	noinst_subtitle: {
    		message: "Uživatelský skript pro blokování vyskakovacích oken AdGuard není nainstalován. Pokyny naleznete níže."
    	},
    	homepage: {
    		message: "Domovská stránka"
    	},
    	noinst_step_1: {
    		message: "Krok 1: Nainstalujte správce uživatelských skriptů"
    	},
    	noinst_step_2: {
    		message: "Krok 2: Uživatelský skript"
    	},
    	extension_name: {
    		message: "AdGuard blokátor vyskakovacích oken"
    	},
    	userscript_name: {
    		message: "AdGuard blokátor vyskakovacích oken",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokuje vyskakovací reklamy na webových stránkách"
    	},
    	on_navigation_by_popunder: {
    		message: "Tento přechod na novou stránku bude pravděpodobně způsoben pop-under. Chcete pokračovat?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Blokátor vyskakovacích oken zrušil spuštění skriptu, aby zabránil přesměrování na pozadí",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Blokování vyskakovacích oken je v provozu"
    	},
    	ext_disabled: {
    		message: "Blokování vyskakovacích oken je zakázáno pro $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Blokování vyskakovacích oken nemůže běžet na této doméně"
    	},
    	settings_saved: {
    		message: "Nastavení uložena"
    	}
    };
    var da = {
    	show_popup: {
    		message: "Vis %destUrl%"
    	},
    	continue_blocking: {
    		message: "Fortsæt blokering"
    	},
    	allow_from: {
    		message: "Tillad pop-op'er for %origDomain%"
    	},
    	manage_pref: {
    		message: "Håndtere præferencer..."
    	},
    	popup_text: {
    		message: "AdGuard forhindrede dette websted i at åbne %numPopup% pop op-vinduer"
    	},
    	options: {
    		message: "Valgmuligheder"
    	},
    	silence_noti: {
    		message: "Vis ikke denne meddelelse på %origDomain%"
    	},
    	site_input_ph: {
    		message: "Angiv webstedsnavn"
    	},
    	add_site: {
    		message: "Tilføj et websted"
    	},
    	add: {
    		message: "Tilføj"
    	},
    	allowed_empty: {
    		message: "Hvidliste over websteder er tom"
    	},
    	allowed: {
    		message: "Hvidlistet"
    	},
    	silenced_empty: {
    		message: "Listen over websteder med tavse notifikationer er tom"
    	},
    	silenced: {
    		message: "Gjort tavse"
    	},
    	allowed_tooltip: {
    		message: "Pop-ups vil være tilladt på de websteder, som er angivet her."
    	},
    	silenced_tooltip: {
    		message: "Notifikationer om blokerede pop-ups vises ikke på de websteder, som er angivet her."
    	},
    	installFrom: {
    		message: "Installér fra <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Trin 3: Opfrisk siden for at kunne tilgå userscript-indstillingerne"
    	},
    	noinst_ignore_if_ag: {
    		message: "Har du AdGuard til Windows installeret, kan du ignorere dette trin, da Popup Blocker-userscriptet er forudinstalleret."
    	},
    	noinst_rec: {
    		message: "(Anbefalet)"
    	},
    	please_wait: {
    		message: "Afvent venligst, detekterer Popup Blocker"
    	},
    	noinst_special_prog: {
    		message: "For brug af et userscript kræves først og fremmest et særligt program/udvidelse, der kan afvikle userscripts."
    	},
    	noinst_subtitle: {
    		message: "AdGuard Popup Blocker-userscriptet er ikke installeret. Tjek nedenstående vejledning."
    	},
    	homepage: {
    		message: "Hjemmeside"
    	},
    	noinst_step_1: {
    		message: "Trin 1: Installér en userscript-håndtering"
    	},
    	noinst_step_2: {
    		message: "Trin 2: Userscript"
    	},
    	extension_name: {
    		message: "Popup Blocker fra AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Popup Blocker",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokerer pop-op annoncer på websider"
    	},
    	on_navigation_by_popunder: {
    		message: "Denne overgang til den nye side skyldes sandsynligvis en pop-under. Fortsæt?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Popup Blocker afbrød en scripteksekvering for at forhindre baggrundsomdirigering",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Popup Blocker er på vagt"
    	},
    	ext_disabled: {
    		message: "Popup Blocker er deaktiveret for $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Popup Blocker er deaktiveret på dette domæne"
    	},
    	settings_saved: {
    		message: "Indstillinger gemt"
    	}
    };
    var de = {
    	show_popup: {
    		message: "%destUrl% anzeigen"
    	},
    	continue_blocking: {
    		message: "Weiterhin sperren"
    	},
    	allow_from: {
    		message: "Pop-ups auf %origDomain% zulassen"
    	},
    	manage_pref: {
    		message: "Einstellungen verwalten …"
    	},
    	popup_text: {
    		message: "AdGuard hat auf dieser Website %numPopup% Pop-up-Fenster verhindert"
    	},
    	options: {
    		message: "Optionen"
    	},
    	silence_noti: {
    		message: "Diese Nachricht auf %origDomain% nicht anzeigen"
    	},
    	site_input_ph: {
    		message: "Seitenname eingeben"
    	},
    	add_site: {
    		message: "Eine Seite hinzufügen"
    	},
    	add: {
    		message: "Hinzufügen"
    	},
    	allowed_empty: {
    		message: "Liste der Ausnahmen ist leer"
    	},
    	allowed: {
    		message: "Ausnahmen"
    	},
    	silenced_empty: {
    		message: "Liste der Websites ohne Benachrichtigungen ist leer"
    	},
    	silenced: {
    		message: "Ausgeschaltet"
    	},
    	allowed_tooltip: {
    		message: "Pop-ups werden für die hier aufgeführten Domains zugelassen."
    	},
    	silenced_tooltip: {
    		message: "Benachrichtigungen für gesperrte Pop-ups werden auf den hier aufgeführten Websites nicht angezeigt."
    	},
    	installFrom: {
    		message: "Von <a>%name%</a> installieren"
    	},
    	noinst_step_3: {
    		message: "Schritt 3: Aktualisieren Sie diese Seite, um zu den Benutzerskript-Einstellungen zu übergehen"
    	},
    	noinst_ignore_if_ag: {
    		message: "Wenn Sie AdGuard für Windows installiert haben, können Sie diesen Schritt ignorieren, da das Benutzerskript für den Pop-up-Blocker bereits vorinstalliert ist."
    	},
    	noinst_rec: {
    		message: "(Empfohlen)"
    	},
    	please_wait: {
    		message: "Bitte warten Sie, der Pop-up-Blocker wird erkannt"
    	},
    	noinst_special_prog: {
    		message: "Um ein Benutzerskript verwendende können, benötigen Sie ein spezielles Programm, das Benutzerskripte ausführt."
    	},
    	noinst_subtitle: {
    		message: "AdGuard Pop-up-Blocker Benutzerskript ist nicht installiert. Bitte beachten Sie die folgende Anleitung."
    	},
    	homepage: {
    		message: "Startseite"
    	},
    	noinst_step_1: {
    		message: "Schritt 1: Installieren Sie einen Benutzerskript-Manager"
    	},
    	noinst_step_2: {
    		message: "Schritt 2: Benutzerskript"
    	},
    	extension_name: {
    		message: "Pop-up-Blocker von AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Pop-up-Blocker",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blockiert Anzeige-Pop-ups auf Websites"
    	},
    	on_navigation_by_popunder: {
    		message: "Diese Seiten-Navigation wird wahrscheinlich durch ein Pop-under verursacht. Möchten Sie fortfahren?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Pop-up-Blocker hat eine Skript-Ausführung abgebrochen, um eine Hintergrundumleitung zu verhindern",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Pop-up-Blocker verrichtet seinen Dienst"
    	},
    	ext_disabled: {
    		message: "Der Pop-up-Blocker ist für $DOMAIN$ deaktiviert",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Pop-up-Blocker funktioniert auf dieser Domain nicht"
    	},
    	settings_saved: {
    		message: "Einstellungen gespeichert"
    	}
    };
    var el = {
    	show_popup: {
    		message: "Εμφάνιση %destUrl%"
    	},
    	continue_blocking: {
    		message: "Συνέχεια αποκλεισμού"
    	},
    	allow_from: {
    		message: "Να επιτρέπονται τα αναδυόμενα παράθυρα για το %origDomain%"
    	},
    	manage_pref: {
    		message: "Διαχείριση προτιμήσεων..."
    	},
    	popup_text: {
    		message: "Το AdGuard εμπόδισε αυτόν τον ιστότοπο να ανοίξει %numPopup% αναδυόμενα παράθυρα"
    	},
    	options: {
    		message: "Επιλογές"
    	},
    	silence_noti: {
    		message: "Να μην εμφανίζεται αυτό το μήνυμα στο %origDomain%"
    	},
    	site_input_ph: {
    		message: "Εισαγάγετε όνομα ιστότοπου"
    	},
    	add_site: {
    		message: "Προσθήκη ιστοσελίδας"
    	},
    	add: {
    		message: "Προσθήκη"
    	},
    	allowed_empty: {
    		message: "Η λίστα των επιτρεπόμενων ιστότοπων είναι κενή"
    	},
    	allowed: {
    		message: "Επιτρέπεται"
    	},
    	silenced_empty: {
    		message: "Η λίστα των ιστότοπων σε σίγαση είναι κενή"
    	},
    	silenced: {
    		message: "Σίγαση"
    	},
    	allowed_tooltip: {
    		message: "Τα αναδυόμενα παράθυρα θα επιτρέπονται στους τομείς που αναφέρονται εδώ."
    	},
    	silenced_tooltip: {
    		message: "Οι ειδοποιήσεις για αποκλεισμένα αναδυόμενα παράθυρα δεν θα εμφανίζονται για τομείς που αναφέρονται εδώ."
    	},
    	installFrom: {
    		message: "Εγκατάσταση από {$startLink}{$name}{$endLink}"
    	},
    	noinst_step_3: {
    		message: "Βήμα 3: Ανανεώστε αυτήν τη σελίδα για να μεταβείτε στις ρυθμίσεις του userscript"
    	},
    	noinst_ignore_if_ag: {
    		message: "Εάν εγκαταστήσατε το AdGuard για Windows, μπορείτε να αγνοήσετε αυτό το βήμα καθώς το userscript για αποκλεισμό αναδυόμενων παραθύρων είναι προεγκατεστημένο."
    	},
    	noinst_rec: {
    		message: "(Συνιστάται)"
    	},
    	please_wait: {
    		message: "Παρακαλώ περιμένετε, ανίχνευση για Αποκλεισμό αναδυόμενων παραθύρων"
    	},
    	noinst_special_prog: {
    		message: "Πρώτα απ'όλα, για να χρησιμοποιήσετε ένα userscript χρειάζεστε ένα ειδικό πρόγραμμα ή επέκταση που εκτελεί userscripts."
    	},
    	noinst_subtitle: {
    		message: "Το userscript αποκλεισμός αναδυόμενων παραθύρων AdGuard δεν είναι εγκατεστημένο. Ανατρέξτε στις παρακάτω οδηγίες."
    	},
    	homepage: {
    		message: "Αρχική σελίδα"
    	},
    	noinst_step_1: {
    		message: "Βήμα 1: Εγκαταστήστε έναν διαχειριστή userscript"
    	},
    	noinst_step_2: {
    		message: "Βήμα 2: Userscript"
    	},
    	extension_name: {
    		message: "Αποκλεισμός αναδυόμενων παραθύρων από το AdGuard"
    	},
    	userscript_name: {
    		message: "Αποκλεισμός αναδυόμενων παραθύρων AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Αποκλείει αναδυόμενες διαφημίσεις σε ιστοσελίδες"
    	},
    	on_navigation_by_popunder: {
    		message: "Αυτή η μετάβαση σε νέα σελίδα είναι πιθανό να προκαλείται από ένα αναδυόμενο παράθυρο. Θέλετε να συνεχίσετε;",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Το Αποκλεισμός αναδυόμενων παραθύρων ακύρωσε μια εκτέλεση σεναρίου για να αποτρέψει την ανακατεύθυνση του φόντου",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Το Αποκλεισμός αναδυόμενων παραθύρων είναι σε λειτουργία"
    	},
    	ext_disabled: {
    		message: "Ο Αποκλεισμός αναδυόμενων παραθύρων είναι απενεργοποιημένος για το $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Ο Αποκλεισμός αναδυόμενων παραθύρων είναι απενεργοποιημένος για αυτόν τον τομέα"
    	},
    	settings_saved: {
    		message: "Οι ρυθμίσεις αποθηκεύτηκαν"
    	}
    };
    var es = {
    	show_popup: {
    		message: "Mostrar %destUrl%"
    	},
    	continue_blocking: {
    		message: "Continuar bloqueando"
    	},
    	allow_from: {
    		message: "Permitir ventanas emergentes en %origDomain%"
    	},
    	manage_pref: {
    		message: "Administrar preferencias..."
    	},
    	popup_text: {
    		message: "AdGuard impidió que este sitio web abriera %numPopup% ventanas emergentes"
    	},
    	options: {
    		message: "Opciones"
    	},
    	silence_noti: {
    		message: "No mostrar este mensaje en %origDomain%"
    	},
    	site_input_ph: {
    		message: "Ingrese el nombre del sitio"
    	},
    	add_site: {
    		message: "Añadir un sitio"
    	},
    	add: {
    		message: "Añadir"
    	},
    	allowed_empty: {
    		message: "La lista de permitido está vacía"
    	},
    	allowed: {
    		message: "Permitido"
    	},
    	silenced_empty: {
    		message: "La lista de sitios con notificaciones silenciadas está vacía"
    	},
    	silenced: {
    		message: "Silenciado"
    	},
    	allowed_tooltip: {
    		message: "Las ventanas emergentes estarán permitidas en los sitios web enumerados aquí."
    	},
    	silenced_tooltip: {
    		message: "Las notificaciones de ventanas emergentes bloqueadas no se mostrarán en los sitios web enumerados aquí."
    	},
    	installFrom: {
    		message: "Instalar desde <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Paso 3: Actualice esta página para acceder a la configuración del userscript"
    	},
    	noinst_ignore_if_ag: {
    		message: "Si tienes instalado AdGuard para Windows, puedes ignorar este paso ya que el userscript Popup Blocker viene preinstalado."
    	},
    	noinst_rec: {
    		message: "(recomendado)"
    	},
    	please_wait: {
    		message: "Espere por favor, detectando Popup Blocker"
    	},
    	noinst_special_prog: {
    		message: "En primer lugar, para usar un userscript necesitas un programa especial que ejecute el userscript."
    	},
    	noinst_subtitle: {
    		message: "AdGuard Popup Blocker no es instalado. Por favor, vea el manual abajo."
    	},
    	homepage: {
    		message: "Página de inicio"
    	},
    	noinst_step_1: {
    		message: "Paso 1: Instale el gestor de userscript"
    	},
    	noinst_step_2: {
    		message: "Paso 2: Userscript"
    	},
    	extension_name: {
    		message: "Popup Blocker por AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Popup Blocker",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Bloquea anuncios emergentes en sitios web"
    	},
    	on_navigation_by_popunder: {
    		message: "Es probable que esta transición a la nueva página sea causada por un elemento emergente. ¿Deseas continuar?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Popup Blocker canceló la ejecución de un script para evitar la redirección en segundo plano",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Popup Blocker está en servicio"
    	},
    	ext_disabled: {
    		message: "Popup Blocker está deshabilitado para $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Popup Blocker está deshabilitado para este dominio"
    	},
    	settings_saved: {
    		message: "Ajustes guardados"
    	}
    };
    var fa = {
    	show_popup: {
    		message: "نمایش %destUrl%"
    	},
    	continue_blocking: {
    		message: "ادامه مسدودسازی"
    	},
    	allow_from: {
    		message: "اجازه پاپ آپ ها در %origDomain%"
    	},
    	manage_pref: {
    		message: "مدیریت اولویت ها..."
    	},
    	popup_text: {
    		message: "AdGuard این وبسایت را از بازکردن %numPopup% پنجره پاپ آپ جلوگیری کرد"
    	},
    	options: {
    		message: "گزینه ها"
    	},
    	silence_noti: {
    		message: "این پیام را نشان نده در %origDomain%"
    	},
    	site_input_ph: {
    		message: "نام سایت را وارد کنید"
    	},
    	add_site: {
    		message: "افزودن یک سایت"
    	},
    	add: {
    		message: "افزودن"
    	},
    	allowed_empty: {
    		message: "لیست استثناها خالی است"
    	},
    	allowed: {
    		message: "استثناها"
    	},
    	silenced_empty: {
    		message: "لیست وبسایت ها با اطلاع رسانی خاموش شده،خالی است"
    	},
    	silenced: {
    		message: "خاموش شده"
    	},
    	allowed_tooltip: {
    		message: "پاپ آپ برای وبسایت هایی که در اینجا لیست شده،اجازه داده می شود."
    	},
    	silenced_tooltip: {
    		message: "اطلاع رسانی پاپ آپ مسدود شده برای وبسایت های لیست شده در اینجا نمایش داده نمیشود."
    	},
    	installFrom: {
    		message: "نصب از <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "گام 3:برای دریافت تنظیمات یوزراسکریپت این صفحه را تازه سازی کنید"
    	},
    	noinst_ignore_if_ag: {
    		message: "اگر شما AdGuard for Windows را نصب کرده اید، شما میتوانید این گام را چشمپوشی کنید چون یوزراسکریپت مسدودساز پاپ آپ از پیش نصب شده است."
    	},
    	noinst_rec: {
    		message: "(توصیه شده)"
    	},
    	please_wait: {
    		message: "منتظر بمانید،درحال تشخیص مسدودساز پاپ آپ"
    	},
    	noinst_special_prog: {
    		message: "اول از همه برای استفاده از یوزر اسکریپت نیاز به برنامه ویژه یا افزونه ای است که بتواند آن را اِجرا کند است."
    	},
    	noinst_subtitle: {
    		message: "یوزراسکریپت مسدودساز پاپ آپ AdGuard نصب نشده است. لطفا دستور العمل را در زیر مشاهده کنید."
    	},
    	homepage: {
    		message: "صفحه خانگی"
    	},
    	noinst_step_1: {
    		message: "گام 1:نصب مدیر یوزر اسکریپت"
    	},
    	noinst_step_2: {
    		message: "گام 2: یوزر اسکریپت"
    	},
    	extension_name: {
    		message: "مسدودساز پاپ-آپ AdGuard"
    	},
    	userscript_name: {
    		message: "مسدودساز پاپ-آپ AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "مسدودسازی تبلیغات پاپ آپ در صفحات وب."
    	},
    	on_navigation_by_popunder: {
    		message: "انتقال به این صفحه جدید احتمالا بخاطر یه پاپ-آندر انجام شده است. میخواهید ادامه دهید؟",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "مسدودساز پاپ-آپ اجرای کد را لغو کرده تا از ریدایرکت جبلوگیری شود",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "مسدودساز پاپ آپ در حال انجام وظیفه است"
    	},
    	ext_disabled: {
    		message: "مسدودساز پاپ آپ برای $DOMAIN$ غیر فعال شده است",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "مسدودساز پاپ آپ نمیتواند در این دامنه اجرا شود"
    	},
    	settings_saved: {
    		message: "تنظيمات ذخیره شد"
    	}
    };
    var fi = {
    	show_popup: {
    		message: "Avaa %destUrl%"
    	},
    	continue_blocking: {
    		message: "Jatka estoa"
    	},
    	allow_from: {
    		message: "Salli ponnahdukset verkkotunnukselta %origDomain%"
    	},
    	manage_pref: {
    		message: "Hallinnoi asetuksia..."
    	},
    	popup_text: {
    		message: "AdGuard esti tätä verkkosivustoa avaamasta %numPopup% ponnahdusta"
    	},
    	options: {
    		message: "Valinnat"
    	},
    	silence_noti: {
    		message: "Älä näytä tätä viestiä sivustolla %origDomain%"
    	},
    	site_input_ph: {
    		message: "Syötä sivuston nimi"
    	},
    	add_site: {
    		message: "Lisää sivusto"
    	},
    	add: {
    		message: "Lisää"
    	},
    	allowed_empty: {
    		message: "Lista on tyhjä"
    	},
    	allowed: {
    		message: "Sallitut"
    	},
    	silenced_empty: {
    		message: "Lista on tyjä"
    	},
    	silenced: {
    		message: "Mykistetty"
    	},
    	allowed_tooltip: {
    		message: "Tässä listattujen verkkotunnusten ponnahdukset sallitaan."
    	},
    	silenced_tooltip: {
    		message: "Tämän listan verkkotunnuksissa estetyistä ponnahduksista ei näytetä estoilmoituksia."
    	},
    	installFrom: {
    		message: "Asenna kohteesta <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Vaihe 3: Päivitä tämä sivu saadaksesi käyttäjäskriptin asetukset"
    	},
    	noinst_ignore_if_ag: {
    		message: "Jos asensit AdGuardin Windowsille, voit ohittaa tämän vaiheen, koska Ponnahdusesto-käyttäjäskripti sisältyy siihen."
    	},
    	noinst_rec: {
    		message: "(suositeltu)"
    	},
    	please_wait: {
    		message: "Odota hetki, Ponnahdusestoa havaitaan"
    	},
    	noinst_special_prog: {
    		message: "Käyttääksesi userscript-laajennuksia, tarvitset erityisesti niiden suorittamiseen tarkoitetun ohjelmiston tai laajennuksen."
    	},
    	noinst_subtitle: {
    		message: "AdGuard Ponnahdusesto -käyttäjäskriptiä ei ole asennettu. Katso ohjeet alta."
    	},
    	homepage: {
    		message: "Verkkosivusto"
    	},
    	noinst_step_1: {
    		message: "Vaihe 1: Asenna käyttäjäskriptien hallintamanageri"
    	},
    	noinst_step_2: {
    		message: "Vaihe 2: Käyttäjäskripti"
    	},
    	extension_name: {
    		message: "Ponnahdusesto AdGuardilta"
    	},
    	userscript_name: {
    		message: "AdGuard Ponnahdusesto",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Estää verkkosivujen ponnahdusmainokset."
    	},
    	on_navigation_by_popunder: {
    		message: "Siirtyminen toiselle sivulle johtui todennäköisesti taustalle piilottuneesta ponnahduksesta. Haluatko jatkaa?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Ponnahdusesto keskeytti komentosarjan estääkseen taustalla tapahtuvan uudelleenohjauksen",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Ponnahdusesto on käytössä"
    	},
    	ext_disabled: {
    		message: "Ponnahdusesto on poistettu käytöstä verkkotunnusessa $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Ponnahdusesto on poistettu käytöstä tässä verkkotunnuksessa"
    	},
    	settings_saved: {
    		message: "Asetukset tallennettiin"
    	}
    };
    var fr = {
    	show_popup: {
    		message: "Afficher %destUrl%"
    	},
    	continue_blocking: {
    		message: "Continuer le blocage"
    	},
    	allow_from: {
    		message: "Autoriser fenêtres pop-up pour %origDomain%"
    	},
    	manage_pref: {
    		message: "Administrer les préférences..."
    	},
    	popup_text: {
    		message: "AdGuard a empêché ce site web d'afficher %numPopup% fenêtres pop-up"
    	},
    	options: {
    		message: "Options"
    	},
    	silence_noti: {
    		message: "Ne pas afficher ce message sur %origDomain%"
    	},
    	site_input_ph: {
    		message: "Saisir le nom du site Web"
    	},
    	add_site: {
    		message: "Ajouter un site Web"
    	},
    	add: {
    		message: "Ajouter"
    	},
    	allowed_empty: {
    		message: "La liste des exceptions est vide"
    	},
    	allowed: {
    		message: "Autorisé"
    	},
    	silenced_empty: {
    		message: "La liste des sites web aux notifications silencieuses est vide"
    	},
    	silenced: {
    		message: "Silence imposé"
    	},
    	allowed_tooltip: {
    		message: "Fenêtres pop-up pour les sites web sur la liste vont être autorisés."
    	},
    	silenced_tooltip: {
    		message: "Les notifications pour les fenêtres pop-up bloquées depuis les sites web listés ci-dessous ne seront pas affichées."
    	},
    	installFrom: {
    		message: "Installer de <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Étape 3: actualisez cette page page pour accéder aux paramètres du script utilisateur"
    	},
    	noinst_ignore_if_ag: {
    		message: "Si vous avez installé AdGuard pour Windows auparavant, vous pouvez passer cette étape car le script utilisateur Bloqueur de fenêtres pop-up y est déjà pré-installé."
    	},
    	noinst_rec: {
    		message: "(Recommandé)"
    	},
    	please_wait: {
    		message: "Veuillez patienter, recherche de bloqueur des fenêtres pop-up en cours"
    	},
    	noinst_special_prog: {
    		message: "Tout d'abord, pour utiliser un script utilisateur vous avez besoin d'un programme spécial ou d'une extension qui gère les scripts utilisateur."
    	},
    	noinst_subtitle: {
    		message: "Le script utilisateur bloqueur de fenêtres pop-up n'est pas installé. Veuillez consulter le manuel ci-dessous."
    	},
    	homepage: {
    		message: "Page d'accueil"
    	},
    	noinst_step_1: {
    		message: "Étape 1: installer un logiciel géstionnaire de scripts utilisateurs"
    	},
    	noinst_step_2: {
    		message: "Étape 2: script utilisateur"
    	},
    	extension_name: {
    		message: "Bloqueur de fenêtres pop-up de AdGuard"
    	},
    	userscript_name: {
    		message: "Bloqueur de fenêtres pop-up de AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Bloque les fenêtres pop-up avec publicités intrusives sur les pages web"
    	},
    	on_navigation_by_popunder: {
    		message: "Cette transition vers la nouvelle page est susceptible d'être causée par un pop-under. Désirez-vous continuer?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Le bloqueur de pop-ups a interrompu l'exécution d'un script pour empêcher une redirection en arrière-plan",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Le bloqueur des fenêtres pop-up est en marche"
    	},
    	ext_disabled: {
    		message: "Le bloqueur de fenêtres pop-up est désactivé pour $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Le bloqueur de fenêtres pop-up ne marche pas sur ce domaine"
    	},
    	settings_saved: {
    		message: "Paramètres sauvegardés"
    	}
    };
    var he = {
    	show_popup: {
    		message: "הראה את %destUrl%"
    	},
    	continue_blocking: {
    		message: "המשך לחסום"
    	},
    	allow_from: {
    		message: "התר חלונות קופצים עבור %origDomain%"
    	},
    	manage_pref: {
    		message: "נהל העדפות…"
    	},
    	popup_text: {
    		message: "AdGuard מנע מאתר זה לפתוח %numPopup% חלונות קופצים"
    	},
    	options: {
    		message: "אפשרויות"
    	},
    	silence_noti: {
    		message: "אל תראה הודעה זו בתחום %origDomain%"
    	},
    	site_input_ph: {
    		message: "הכנס שם אתר"
    	},
    	add_site: {
    		message: "הוסף אתר"
    	},
    	add: {
    		message: "הוסף"
    	},
    	allowed_empty: {
    		message: "הרשימה של אתרים מותרים ריקה"
    	},
    	allowed: {
    		message: "מותרים"
    	},
    	silenced_empty: {
    		message: "הרשימה של אתרים מושתקים ריקה"
    	},
    	silenced: {
    		message: "מושתקים"
    	},
    	allowed_tooltip: {
    		message: "חלונות קופצים יותרו עבור תחומים שכתובים ברשימה כאן."
    	},
    	silenced_tooltip: {
    		message: "התראות עבור חלונות קופצים חסומים לא ייראו עבור תחומים שכתובים ברשימה כאן."
    	},
    	installFrom: {
    		message: "התקן מן <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "צעד 3: רענן דף זה כדי לעבור אל הגדרות תסריט המשתמש"
    	},
    	noinst_ignore_if_ag: {
    		message: "במקרה שהתקנת את AdGuard עבור Windows, אתה יכול להתעלם מצעד זה הואיל ותסריט המשתמש של חוסם החלונות הקופצים מגיע מותקן מראש."
    	},
    	noinst_rec: {
    		message: "(מומלץ)"
    	},
    	please_wait: {
    		message: "אנא המתן בעת גילוי חוסם החלונות הקופצים"
    	},
    	noinst_special_prog: {
    		message: "קודם כל, כדי להשתמש בתסריט משתמש אתה צריך תוכנה או הרחבה מיוחדות אשר מריצות תסריטי משתמש."
    	},
    	noinst_subtitle: {
    		message: "תסריט משתמש של חוסם חלונות קופצים של AdGuard אינו מותקן. אנא ראה את ההוראות למטה."
    	},
    	homepage: {
    		message: "דף הבית"
    	},
    	noinst_step_1: {
    		message: "צעד 1: התקן מנהל תסריטי משתמש"
    	},
    	noinst_step_2: {
    		message: "צעד 2: תסריט משתמש"
    	},
    	extension_name: {
    		message: "חוסם חלונות קופצים מאת AdGuard"
    	},
    	userscript_name: {
    		message: "חוסם חלונות קופצים של AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "חוסם פרסומות קופצות בדפי רשת"
    	},
    	on_navigation_by_popunder: {
    		message: "מעבר זה אל הדף החדש כנראה נגרם ע״י חלון קופץ מתחת. האם אתה רוצה להמשיך?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "חוסם החלונות הקופצים ביטל ביצוע תסריט כדי למנוע הכוונה ברקע",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "חוסם החלונות הקופצים פעיל"
    	},
    	ext_disabled: {
    		message: "חוסם החלונות הקופצים מושבת עבור $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "חוסם החלונות הקופצים מושבת עבור תחום זה"
    	},
    	settings_saved: {
    		message: "הגדרות נשמרו"
    	}
    };
    var hr = {
    	show_popup: {
    		message: "Prikaži %destUrl%"
    	},
    	continue_blocking: {
    		message: "Nastavi blokirati"
    	},
    	allow_from: {
    		message: "Dopusti skočne prozore za %origDomain%"
    	},
    	manage_pref: {
    		message: "Upravljanje postavkama..."
    	},
    	popup_text: {
    		message: "AdGuard je spriječio ovu web stranicu da otvori %numPopup% skočna prozora"
    	},
    	options: {
    		message: "Opcije"
    	},
    	silence_noti: {
    		message: "Ne pokazuj ovu poruku za %origDomain%"
    	},
    	site_input_ph: {
    		message: "Unesite naziv web stranice"
    	},
    	add_site: {
    		message: "Dodaj stranicu"
    	},
    	add: {
    		message: "Dodaj"
    	},
    	allowed_empty: {
    		message: "Lista dopuštenih stranica je prazna"
    	},
    	allowed: {
    		message: "Dopušteno"
    	},
    	silenced_empty: {
    		message: "Lista utišanih stranica je prazna"
    	},
    	silenced: {
    		message: "Utišano"
    	},
    	allowed_tooltip: {
    		message: "Popis domena na kojima su dopušteni skočni prozori."
    	},
    	silenced_tooltip: {
    		message: "Obavijesti za blokirane skočne prozore neće biti prikazane za navedene domene."
    	},
    	installFrom: {
    		message: "Instaliraj s {$startLink}{$name}{$endLink}"
    	},
    	noinst_step_3: {
    		message: "Korak 3: Osvježite ovu stranicu kako biste dobili userscript postavke"
    	},
    	noinst_ignore_if_ag: {
    		message: "Ako ste instalirali AdGuard za Windows, možete zanemariti ovaj korak jer je userscripta blokatora skočnih prozora, unaprijed instaliran."
    	},
    	noinst_rec: {
    		message: "(Preporučeno)"
    	},
    	please_wait: {
    		message: "Molimo pričekajte, otkrivamo bloker skočnih prozora"
    	},
    	noinst_special_prog: {
    		message: "Prije svega, za upotrebu userscripta potreban vam je poseban program ili proširenje koje pokreće userscripte."
    	},
    	noinst_subtitle: {
    		message: "Userscript od AdGuard Blokera skočnih prozora, nije uspješno instaliranja. Molimo pratite upute ispod."
    	},
    	homepage: {
    		message: "Početna stranica"
    	},
    	noinst_step_1: {
    		message: "Korak 1: Instalirajte userscript upravitelj"
    	},
    	noinst_step_2: {
    		message: "Korak 2: Userscript"
    	},
    	extension_name: {
    		message: "AdGuard Bloker skočnih prozora"
    	},
    	userscript_name: {
    		message: "AdGuard Bloker skočnih prozora",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokira skočne prozore na web stranicama"
    	},
    	on_navigation_by_popunder: {
    		message: "Prijelaz na novu stranicu je najvjerojatnije uzrokovan skrivenim skočnim prozorom. Želite li nastaviti?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Bloker skočnih prozora prekinuo je izvršavanje skripte kako bi spriječio preusmjeravanje u pozadini",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Bloker skočnih prozora je aktivan"
    	},
    	ext_disabled: {
    		message: "Bloker skočnih prozora je onemogućen za $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Bloker skočnih prozora je onemogućen za ovu domenu"
    	},
    	settings_saved: {
    		message: "Postavke su spremljene"
    	}
    };
    var hu = {
    	show_popup: {
    		message: "Mutasd %destUrl%"
    	},
    	continue_blocking: {
    		message: "Blokkolás folytatása"
    	},
    	allow_from: {
    		message: "Felugró ablakok engedélyezése itt: %origDomain%"
    	},
    	manage_pref: {
    		message: "Beállítások kezelése..."
    	},
    	popup_text: {
    		message: "Az AdGuard %numPopup% felugró ablak megjelenését akadályozta meg"
    	},
    	options: {
    		message: "Beállítások"
    	},
    	silence_noti: {
    		message: "Ne mutassa ezt az üzenetet itt: %origDomain%"
    	},
    	site_input_ph: {
    		message: "Írja be a webhely nevét"
    	},
    	add_site: {
    		message: "Webhely hozzáadása"
    	},
    	add: {
    		message: "Hozzáadás"
    	},
    	allowed_empty: {
    		message: "Az engedélyezett oldalak listája üres"
    	},
    	allowed: {
    		message: "Engedélyezett"
    	},
    	silenced_empty: {
    		message: "Az némított oldalak listája üres"
    	},
    	silenced: {
    		message: "Némított"
    	},
    	allowed_tooltip: {
    		message: "A felsorolt oldalakon engedélyezve lesznek a popup-ok."
    	},
    	silenced_tooltip: {
    		message: "A blokkolt felugró ablakok értesitései nem fognak megjelenni a követketző oldalakon."
    	},
    	installFrom: {
    		message: "Telepítés innen: <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "3. lépés: Töltse újra ezt az oldalt, hogy hozzáférjen a felhasználói szűrők beállitásaihoz"
    	},
    	noinst_ignore_if_ag: {
    		message: "Ha telepítette az AdGuard for Windowst, hagyja ki ezt a lépést, mivel a Popup Blocker userscript abban előre van telepítve."
    	},
    	noinst_rec: {
    		message: "(Ajánlott)"
    	},
    	please_wait: {
    		message: "Kérjük várjon, Popup Blocker detektálása"
    	},
    	noinst_special_prog: {
    		message: "Mindenekelőtt, szüksége van egy olyan speciális programra vagy kiegészítőre, ami képes userscripteket futtatni."
    	},
    	noinst_subtitle: {
    		message: "Az AdGuard Popup Blocker userscript nincs telepítve. Kérem tekintse meg a lépéseket alább."
    	},
    	homepage: {
    		message: "Kezdőlap"
    	},
    	noinst_step_1: {
    		message: "1. lépés: Userscript kezelő telepítése"
    	},
    	noinst_step_2: {
    		message: "2. lépés: Userscript"
    	},
    	extension_name: {
    		message: "Popup Blocker by AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Popup Blocker",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokkolja a felugró ablakban megjelenő reklámokat a webhelyeken"
    	},
    	on_navigation_by_popunder: {
    		message: "Az új oldalra való áttérést valószínűleg egy előugró ablak okozza. Kívánja folytatni?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "A Popup Blocker megszakította a szkript végrehajtását a háttérben történő átirányítás megakadályozása érdekében",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "A Popup Blocker működik"
    	},
    	ext_disabled: {
    		message: "A Popup Blocker ki van kapcsolva itt: $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "A Popup Blocker ki van kapcsolva ezen a domainen"
    	},
    	settings_saved: {
    		message: "Beállítások mentve"
    	}
    };
    var id = {
    	show_popup: {
    		message: "Tampilkan %destUrl%"
    	},
    	continue_blocking: {
    		message: "Lanjutkan pemblokiran"
    	},
    	allow_from: {
    		message: "Izinkan popup di %origDomain%"
    	},
    	manage_pref: {
    		message: "Kelola pengaturan..."
    	},
    	popup_text: {
    		message: "AdGuard mencegah situs web ini membuka %numPopup% jendela popup"
    	},
    	options: {
    		message: "Opsi"
    	},
    	silence_noti: {
    		message: "Jangan tampilkan pesan ini di %origDomain%"
    	},
    	site_input_ph: {
    		message: "Masukkan nama situs"
    	},
    	add_site: {
    		message: "Tambah situs"
    	},
    	add: {
    		message: "Tambah"
    	},
    	allowed_empty: {
    		message: "Daftar pengecualian masih kosong"
    	},
    	allowed: {
    		message: "Pengecualian"
    	},
    	silenced_empty: {
    		message: "Daftar situs web dengan pemberitahuan yang diheningkan masih kosong"
    	},
    	silenced: {
    		message: "Diheningkan"
    	},
    	allowed_tooltip: {
    		message: "Popup akan diizinkan di situs web yang tercantum di sini."
    	},
    	silenced_tooltip: {
    		message: "Notifikasi popup yang diblokir tidak akan ditampilkan di situs web yang tercantum di sini."
    	},
    	installFrom: {
    		message: "Pasang dari <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Tahap 3: Muat ulang halamana ini untuk masuk ke pengaturan userscript"
    	},
    	noinst_ignore_if_ag: {
    		message: "Jika Anda telah memasang AdGuard untuk Windows, Anda dapat mengabaikan langkah ini karena Pemblokir Popup sudah terpasang."
    	},
    	noinst_rec: {
    		message: "(Dianjurkan)"
    	},
    	please_wait: {
    		message: "Mohon tunggu, mendeteksi Pemblokir Popup"
    	},
    	noinst_special_prog: {
    		message: "Pertama-tama, untuk menggunakan userscript Anda memerlukan program atau ekstensi khusus yang dapat menjalankan userscript."
    	},
    	noinst_subtitle: {
    		message: "Userscript Pemblokir Popup AdGuard belum terpasang. Silakan lihat instruksi di bawah ini."
    	},
    	homepage: {
    		message: "Situs"
    	},
    	noinst_step_1: {
    		message: "Langkah 1: Pasang pengelola userscript"
    	},
    	noinst_step_2: {
    		message: "Langkah 2: Userscript"
    	},
    	extension_name: {
    		message: "Pemblokir Popup oleh AdGuard"
    	},
    	userscript_name: {
    		message: "Pemblokir Popup AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokir iklan popup di halaman web"
    	},
    	on_navigation_by_popunder: {
    		message: "Transisi ke laman baru ini kemungkinan disebabkan oleh sebuah pop-up. Apakah Anda ingin melanjutkan?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Popup Blocker menghentikan eksekusi skrip untuk mencegah perubahan laman di latar belakang",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Pemblokir Popup sedang bekerja"
    	},
    	ext_disabled: {
    		message: "Pemblokir Popup dinonaktifkan untuk $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Pemblokir Popup tidak dapat bekerja di domain ini"
    	},
    	settings_saved: {
    		message: "Pengaturan disimpan"
    	}
    };
    var it$1 = {
    	show_popup: {
    		message: "Visualizza %destUrl%"
    	},
    	continue_blocking: {
    		message: "Continua a bloccare"
    	},
    	allow_from: {
    		message: "Consenti pop-up per %origDomain%"
    	},
    	manage_pref: {
    		message: "Gestisci preferenze..."
    	},
    	popup_text: {
    		message: "AdGuard ha impedito a questo sito web di aprire {$numPopup} finestre pop-up"
    	},
    	options: {
    		message: "Opzioni"
    	},
    	silence_noti: {
    		message: "Non mostrare questo messaggio su %origDomain%"
    	},
    	site_input_ph: {
    		message: "Inserisci il nome del sito"
    	},
    	add_site: {
    		message: "Aggiungi un sito"
    	},
    	add: {
    		message: "Aggiungi"
    	},
    	allowed_empty: {
    		message: "La lista dei siti consentiti è vuota"
    	},
    	allowed: {
    		message: "Consentito"
    	},
    	silenced_empty: {
    		message: "La lista dei siti silenziati è vuota"
    	},
    	silenced: {
    		message: "Silenziato"
    	},
    	allowed_tooltip: {
    		message: "I pop-up verranno consentiti per i domini qui elencati."
    	},
    	silenced_tooltip: {
    		message: "Le notifiche dei pop-up bloccati non verranno mostrate nei domini qui indicati."
    	},
    	installFrom: {
    		message: "Installa da <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Passo 3: Ricarica questa pagina per ottenere le impostazioni dello script utente"
    	},
    	noinst_ignore_if_ag: {
    		message: "Se hai installato AdGuard per Windows, puoi ignorare questo passaggio poiché lo script utente Popup Blocker è preinstallato."
    	},
    	noinst_rec: {
    		message: "(Consigliato)"
    	},
    	please_wait: {
    		message: "Si prega di attendere, rilevamento di Popup Blocker in corso"
    	},
    	noinst_special_prog: {
    		message: "Prima di tutto, per utilizzare uno script utente è necessario un programma o un'estensione speciali per l'esecuzione di tali script."
    	},
    	noinst_subtitle: {
    		message: "Lo script utente AdGuard Popup Blocker non è installato. Ti invitiamo a consultare le istruzioni di seguito."
    	},
    	homepage: {
    		message: "Pagina principale"
    	},
    	noinst_step_1: {
    		message: "Passo 1: Installa un gestore di script utente"
    	},
    	noinst_step_2: {
    		message: "Passo 2: Script utente"
    	},
    	extension_name: {
    		message: "Blocca-popup di AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Popup Blocker",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blocca gli annunci pop-up sulle pagine web"
    	},
    	on_navigation_by_popunder: {
    		message: "È probabile che questa transizione alla nuova pagina sia causata da un pop-under. Desideri proseguire?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Popup Blocker ha interrotto l'esecuzione di uno script per impedire il reindirizzamento in secondo piano",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Popup Blocker è in servizio"
    	},
    	ext_disabled: {
    		message: "Popup Blocker è disattivato per $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Popup Blocker è disattivato su questo dominio"
    	},
    	settings_saved: {
    		message: "Impostazioni salvate"
    	}
    };
    var ja = {
    	show_popup: {
    		message: "%destUrl%を表示する"
    	},
    	continue_blocking: {
    		message: "ブロッキングを続ける"
    	},
    	allow_from: {
    		message: "%origDomain%のポップアップを許可する"
    	},
    	manage_pref: {
    		message: "設定を管理…"
    	},
    	popup_text: {
    		message: "AdGuardはこのウェブサイトが%numPopup%のポップアップウィンドウを開くのを防ぎました"
    	},
    	options: {
    		message: "オプション"
    	},
    	silence_noti: {
    		message: "%origDomain%にこのメッセージを表示しない"
    	},
    	site_input_ph: {
    		message: "サイト名を入力"
    	},
    	add_site: {
    		message: "サイトを追加する"
    	},
    	add: {
    		message: "追加"
    	},
    	allowed_empty: {
    		message: "許可済みサイトのリストは空です"
    	},
    	allowed: {
    		message: "例外"
    	},
    	silenced_empty: {
    		message: "消音済みサイトのリストは空です"
    	},
    	silenced: {
    		message: "消音済み"
    	},
    	allowed_tooltip: {
    		message: "ポップアップはここに記載されているドメインにとって許可されます。"
    	},
    	silenced_tooltip: {
    		message: "ブロックされたポップアップの通知は、ここにリストアップされているドメインでは表示されません。"
    	},
    	installFrom: {
    		message: "<a>%name%</a>からインストールする"
    	},
    	noinst_step_3: {
    		message: "ステップ3：このページを更新して、ユーザースクリプト設定を取得する"
    	},
    	noinst_ignore_if_ag: {
    		message: "AdGuard for Windows をインストールした場合は、ポップアップブロッカーのユーザスクリプトがあらかじめインストールされているので、このステップを無視して結構です。"
    	},
    	noinst_rec: {
    		message: "（推奨）"
    	},
    	please_wait: {
    		message: "ポップアップブロッカーを検出するまでお待ちください"
    	},
    	noinst_special_prog: {
    		message: "まず、ユーザスクリプトを使用するには、ユーザスクリプトを実行する特別なプログラムが必要です。"
    	},
    	noinst_subtitle: {
    		message: "AdGuardポップアップブロッカー・ユーザスクリプトがインストールされていません。 下記の指示をご覧ください。"
    	},
    	homepage: {
    		message: "ホームページ"
    	},
    	noinst_step_1: {
    		message: "ステップ1：ユーザースクリプト・マネージャをインストールする"
    	},
    	noinst_step_2: {
    		message: "ステップ２：ユーザスクリプト"
    	},
    	extension_name: {
    		message: "ポップアップブロッカー by AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard ポップアップブロッカー",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Webページでポップアップ広告をブロックします。"
    	},
    	on_navigation_by_popunder: {
    		message: "新しいページへの移動はポップアンダーによって生じた可能性があります。続行しますか？",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "ポップアップブロッカーはバックグラウンドリダイレクトを防ぐためにスクリプトの実行を中止しました",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "ポップアップブロッカー作動中"
    	},
    	ext_disabled: {
    		message: "$DOMAIN$に対してポップアップブロッカーは無効になっています",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "このドメインではポップアップブロッカーは動作できません"
    	},
    	settings_saved: {
    		message: "設定保存完了"
    	}
    };
    var ko = {
    	show_popup: {
    		message: "%destUrl% 표시"
    	},
    	continue_blocking: {
    		message: "계속 차단하기"
    	},
    	allow_from: {
    		message: "%origDomain%의 팝업 허용하기"
    	},
    	manage_pref: {
    		message: "환경 설정 관리..."
    	},
    	popup_text: {
    		message: "AdGuard가 이 웹사이트에서 %numPopup%개의 팝업 창을 차단하였습니다"
    	},
    	options: {
    		message: "옵션"
    	},
    	silence_noti: {
    		message: "%origDomain%에서 이 메세지 표시하지 않기"
    	},
    	site_input_ph: {
    		message: "웹 사이트 명을 입력하세요"
    	},
    	add_site: {
    		message: "웹 사이트 추가"
    	},
    	add: {
    		message: "추가"
    	},
    	allowed_empty: {
    		message: "허용된 웹 사이트 목록이 비어 있습니다"
    	},
    	allowed: {
    		message: "허용됨"
    	},
    	silenced_empty: {
    		message: "침묵된 사이트 목록이 비어 있습니다"
    	},
    	silenced: {
    		message: "침묵됨"
    	},
    	allowed_tooltip: {
    		message: "이 목록에 있는 주소의 팝업들은 허용됩니다."
    	},
    	silenced_tooltip: {
    		message: "이 목록에 있는 주소는 차단된 팝업 알림이 표시되지 않습니다."
    	},
    	installFrom: {
    		message: "<a>%name%</a> 에서 설치"
    	},
    	noinst_step_3: {
    		message: "3단계: 사용자 스크립트 설정을 받으려면 페이지를 새로고침하세요"
    	},
    	noinst_ignore_if_ag: {
    		message: "이미 Windows용 AdGuard를 설치했다면, 팝업 차단기 사용자 스크립트도 같이 설치되기 때문에 이 단계를 건너뛰실 수 있습니다."
    	},
    	noinst_rec: {
    		message: "(추천)"
    	},
    	please_wait: {
    		message: "잠시만 기다려주세요, 팝업 차단기를 찾는 중입니다"
    	},
    	noinst_special_prog: {
    		message: "제일 먼저, 유저스크립트를 사용하려면 유저스크립트를 실행하기 위한 특별한 프로그램 혹은 확장 프로그램이 필요합니다."
    	},
    	noinst_subtitle: {
    		message: "AdGuard 팝업 차단기 사용자 스크립트가 설치되어 있지 않습니다. 아래의 설명을 봐 주세요."
    	},
    	homepage: {
    		message: "홈페이지"
    	},
    	noinst_step_1: {
    		message: "1 단계: 사용자 스크립트 관리자를 설치하기"
    	},
    	noinst_step_2: {
    		message: "2 단계: 사용자 스크립트"
    	},
    	extension_name: {
    		message: "팝업 차단기 by AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard 팝업 차단기",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "웹 페이지에서 팝업 광고를 차단"
    	},
    	on_navigation_by_popunder: {
    		message: "이 새 페이지로의 이동은 팝언더 광고에 의한 것일 수 있습니다. 계속 하시겠습니까?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "팝업 차단기가 백그라운드 리디렉션을 방지하기 위해 스크립트 실행을 중단하였습니다",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "팝업 차단기는 임무를 수행 중 입니다"
    	},
    	ext_disabled: {
    		message: "팝업 차단기의 $DOMAIN$에서의 동작이 비활성화 되었습니다",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "팝업 차단기의 이 도메인에서의 동작이 비활성화 되었습니다"
    	},
    	settings_saved: {
    		message: "설정 저장됨"
    	}
    };
    var lt = {
    	show_popup: {
    		message: "Rodyti %destUrl%"
    	},
    	continue_blocking: {
    		message: "Tęsti blokavimą"
    	},
    	allow_from: {
    		message: "Leisti iššokančius langus %origDomain%"
    	},
    	manage_pref: {
    		message: "Tvarkyti nuostatas..."
    	},
    	popup_text: {
    		message: "„AdGuard“ neleido šiai svetainei atidaryti %numPopup% iššokančius langus"
    	},
    	options: {
    		message: "Parinktys"
    	},
    	silence_noti: {
    		message: "Nerodyti šio pranešimo %origDomain%"
    	},
    	site_input_ph: {
    		message: "Įveskite svetainės pavadinimą"
    	},
    	add_site: {
    		message: "Pridėti svetainę"
    	},
    	add: {
    		message: "Pridėti"
    	},
    	allowed_empty: {
    		message: "Leidžiamų svetainių sąrašas tuščias"
    	},
    	allowed: {
    		message: "Išimtys"
    	},
    	silenced_empty: {
    		message: "Svetainių su atjungtais pranešimais sąrašas tuščias"
    	},
    	silenced: {
    		message: "Be pranešimų"
    	},
    	allowed_tooltip: {
    		message: "Iššokantys langai bus leidžiami domenuose, kurie išvardyti čia."
    	},
    	silenced_tooltip: {
    		message: "Pranešimai apie užblokuotus iškylančiuosius langus nebus rodomi domenams, išvardytiems čia."
    	},
    	installFrom: {
    		message: "Įdiegti iš {$startLink}{$name}{$endLink}"
    	},
    	noinst_step_3: {
    		message: "3 žingsnis: Atnaujinkite šį puslapį, kad pasiektumėte naudotojo skripto nustatymus"
    	},
    	noinst_ignore_if_ag: {
    		message: "Jei įdiegėte AdGuard, skirtą Windows, galite praleisti šį žingsnį, nes iškylančių langų blokavimo programa jau bus įdiegta."
    	},
    	noinst_rec: {
    		message: "(Rekomenduojama)"
    	},
    	please_wait: {
    		message: "Prašome palaukti, bandoma aptikti iškylančių langų blokatorių"
    	},
    	noinst_special_prog: {
    		message: "Norint naudoti skriptus, jums reikia specialios programos arba plėtinio, kuris paleidžia skriptus."
    	},
    	noinst_subtitle: {
    		message: "AdGuard iškylančių langų blokatorius neįdiegtas. Prašome perskaityti žemiau pateiktą instrukciją."
    	},
    	homepage: {
    		message: "Pagrindinis puslapis"
    	},
    	noinst_step_1: {
    		message: "1 žingnis: įdiekite naudotojo skriptų tvarkyklę"
    	},
    	noinst_step_2: {
    		message: "2 žingsnis: naudotojo skriptas"
    	},
    	extension_name: {
    		message: "AdGuard iššokančių langų blokatorius"
    	},
    	userscript_name: {
    		message: "AdGuard iššokančiųjų langų blokatorius",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokuoja iššokančius skelbimus tinklalapiuose"
    	},
    	on_navigation_by_popunder: {
    		message: "Šis perėjimas į naują puslapį greičiausiai buvo įtakotas pop-under. Ar norite tęsti?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Iškylančių langų blokatorius nutraukė skripto vykdymą, kad būtų išvengta foninio peradresavimo",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Iškylančių langų blokatorius yra paruoštas"
    	},
    	ext_disabled: {
    		message: "Iškylančių langų blokatorius yra išjungtas domenui $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Iškylančių langų blokatorius yra išjungtas šiam domenui"
    	},
    	settings_saved: {
    		message: "Nustatymai išsaugoti"
    	}
    };
    var ms = {
    	show_popup: {
    		message: "Tunjukkan %destUrl%"
    	},
    	continue_blocking: {
    		message: "Terus menyekat"
    	},
    	allow_from: {
    		message: "Benarkan pop-timbul untuk %origDomain%"
    	},
    	manage_pref: {
    		message: "Urus keutamaan..."
    	},
    	popup_text: {
    		message: "AdGuard menghalang laman web ini daripada membuka %numPopup% tetingkap pop-timbul"
    	},
    	options: {
    		message: "Pilihan"
    	},
    	silence_noti: {
    		message: "Jangan tunjuk mesej ini pada %origDomain%"
    	},
    	site_input_ph: {
    		message: "Masukkan nama laman"
    	},
    	add_site: {
    		message: "Tambah laman"
    	},
    	add: {
    		message: "Tambah"
    	},
    	allowed_empty: {
    		message: "Senarai laman dibenarkan adalah kosong"
    	},
    	allowed: {
    		message: "Dibenarkan"
    	},
    	silenced_empty: {
    		message: "Senarai laman disenyapkan adalah kosong"
    	},
    	silenced: {
    		message: "Disenyapkan"
    	},
    	allowed_tooltip: {
    		message: "Poptimbul akan dibenarkan untuk domain disenarai di sini."
    	},
    	silenced_tooltip: {
    		message: "Pemberitahuan untuk poptimbul disekat tidak akan ditunjukkan untuk domain disenarai di sini."
    	},
    	installFrom: {
    		message: "Pasang dari <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Langkah 3: Segar semula laman ini untuk mendapat tetapan skrip pengguna"
    	},
    	noinst_ignore_if_ag: {
    		message: "Jika anda telah memasang AdGuard untuk Windows, anda bole mengabaikan langkah ini kerana skrip pengguna Penyekat Pop Timbul diprapasangkan."
    	},
    	noinst_rec: {
    		message: "(Disyorkan)"
    	},
    	please_wait: {
    		message: "Sila tunggu, mengesan Penyekat Pop Timbul"
    	},
    	noinst_special_prog: {
    		message: "Pertama sekali, untuk mengguna skrip pengguna anda perlu aturcara istimewa atau sambungan yang menjalankan skrip pengguna."
    	},
    	noinst_subtitle: {
    		message: "Skrip pengguna Penyekat Pop Timbul AdGuard tidak dipasang. Sila lihat arahan di bawah."
    	},
    	homepage: {
    		message: "Laman rumah"
    	},
    	noinst_step_1: {
    		message: "Langkah 1: Pasang pengurus skrip pengguna"
    	},
    	noinst_step_2: {
    		message: "Langkah 2: Skrip pengguna"
    	},
    	extension_name: {
    		message: "Penyekat Pop Timbul oleh AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Penyekat Pop Timbul",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Sekat pop timbul pada laman web"
    	},
    	on_navigation_by_popunder: {
    		message: "Peralihan ke laman baru ini kemungkinan disebabkan oleh pop-bawah. Anda ingin meneruskan?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Penyekat Pop Timbul menggugurkan pelaksanaan skrip bagi mengelakkan arah semula latar belakang",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Penyekat Pop Timbul sedang bertugas"
    	},
    	ext_disabled: {
    		message: "Penyekat Pop Timbul dinyahdayakan untuk $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Penyekat Pop Timbul dinyahdayakan untuk domain ini"
    	},
    	settings_saved: {
    		message: "Tetapan disimpan"
    	}
    };
    var no = {
    	show_popup: {
    		message: "Vis %destUrl%"
    	},
    	continue_blocking: {
    		message: "Fortsett blokkering"
    	},
    	allow_from: {
    		message: "Tillat popup-vinduer for %origDomain%"
    	},
    	manage_pref: {
    		message: "Administrer preferanser…"
    	},
    	popup_text: {
    		message: "AdGuard forhindret denne nettsiden i å åpne popup-vinduer for %numPopup%"
    	},
    	options: {
    		message: "Alternativer"
    	},
    	silence_noti: {
    		message: "Ikke vis denne meldingen for %origDomain%"
    	},
    	site_input_ph: {
    		message: "Oppgi sidenavn"
    	},
    	add_site: {
    		message: "Legg til en side"
    	},
    	add: {
    		message: "Legg til"
    	},
    	allowed_empty: {
    		message: "Lisen over unntak er tom"
    	},
    	allowed: {
    		message: "Unntak"
    	},
    	silenced_empty: {
    		message: "Liste over nettsider med dempede varsler er tom"
    	},
    	silenced: {
    		message: "Dempet"
    	},
    	allowed_tooltip: {
    		message: "Popup-vinduer vil bli tillatt for nettsider som er oppført her."
    	},
    	silenced_tooltip: {
    		message: "Blokkerte popup-vinduer vil ikke vises for nettsider som er oppført her."
    	},
    	installFrom: {
    		message: "Installer fra <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Trinn 3: Oppdater denne siden for å komme til brukerskript-innstillingene"
    	},
    	noinst_ignore_if_ag: {
    		message: "Hvis du har installert AdGuard for Windows, kan du ignorere dette trinnet, da brukerskript for popup-blokkering  kommer forhåndsinstallert."
    	},
    	noinst_rec: {
    		message: "(Anbefalt)"
    	},
    	please_wait: {
    		message: "Vennligst vent, oppdager popup-blokkereren"
    	},
    	noinst_special_prog: {
    		message: "Først av alt, for å bruke et brukerskript trenger du et spesielt program eller en utvidelse som kan kjøre brukerskript."
    	},
    	noinst_subtitle: {
    		message: "Brukerskript for AdGuards popup-blokkerer er ikke installert. Vennligst se instruksjonene nedenfor."
    	},
    	homepage: {
    		message: "Hjemmeside"
    	},
    	noinst_step_1: {
    		message: "Trinn 1: Installer en brukerskript-administerere"
    	},
    	noinst_step_2: {
    		message: "Stinn 2: Brukerskript"
    	},
    	extension_name: {
    		message: "Popup-blokkerer fra AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuards popup-blokkerer",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokker popup-annonser på nettsider"
    	},
    	on_navigation_by_popunder: {
    		message: "Omdirigeringen til den nye nettsiden er sannsynligvis forårsaket av en pop-under. Ønsker du å fortsette?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Popup Blocker avbrøt en skrift fra å kjøre for å hindre bakgrunnsomdirigering",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Popup-blokkereren er på vakt"
    	},
    	ext_disabled: {
    		message: "Popup-blokkereren er deaktivert for $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Popup-blokkereren kan ikke kjøre på dette domenet"
    	},
    	settings_saved: {
    		message: "Innstillinger lagret"
    	}
    };
    var pl = {
    	show_popup: {
    		message: "Pokaż %destUrl%"
    	},
    	continue_blocking: {
    		message: "Kontynuuj blokowanie"
    	},
    	allow_from: {
    		message: "Zezwalaj na wyskakujące okienka dla %origDomain%"
    	},
    	manage_pref: {
    		message: "Zarządzaj preferencjami..."
    	},
    	popup_text: {
    		message: "AdGuard zapobiegł na tej stronie otwarcie  %numPopup% wyskakujacego okienka."
    	},
    	options: {
    		message: "Opcje"
    	},
    	silence_noti: {
    		message: "Nie pokazuj tej wiadomości w %origDomain%"
    	},
    	site_input_ph: {
    		message: "Wprowadź nazwę witryny"
    	},
    	add_site: {
    		message: "Dodaj stronę"
    	},
    	add: {
    		message: "Dodaj"
    	},
    	allowed_empty: {
    		message: "Lista dozwolonych stron jest pusta"
    	},
    	allowed: {
    		message: "Dozwolona"
    	},
    	silenced_empty: {
    		message: "Lista uciszonych stron jest pusta"
    	},
    	silenced: {
    		message: "Uciszona"
    	},
    	allowed_tooltip: {
    		message: "Dla wymienionych tutaj stron dozwolone będą wyskakujące okienka."
    	},
    	silenced_tooltip: {
    		message: "Powiadomienia o zablokowanych wyskakujących okienkach nie będą wyświetlane dla stron tutaj wymienionych."
    	},
    	installFrom: {
    		message: "Instaluj z <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Krok 3: Odśwież tę stronę, aby przejść do ustawień skryptu użytkownika"
    	},
    	noinst_ignore_if_ag: {
    		message: "Jeśli zainstalowałeś AdGuard dla systemu Windows, możesz zignorować ten krok, gdy instalator funkcji Bloker wyskakujących okienek zostanie zainstalowany fabrycznie."
    	},
    	noinst_rec: {
    		message: "(Zalecane)"
    	},
    	please_wait: {
    		message: "Proszę czekać, wykrywam, uruchamiam bloker wyskakujących okienek"
    	},
    	noinst_special_prog: {
    		message: "Przede wszystkim, aby użyć skryptu użytkownika, potrzebujesz specjalnego programu, który uruchamia takie skrypty."
    	},
    	noinst_subtitle: {
    		message: "Bloker wyskakujących okienek AdGuard skrypt użytkownika nie jest zainstalowany. Zobacz instrukcję poniżej."
    	},
    	homepage: {
    		message: "Strona domowa"
    	},
    	noinst_step_1: {
    		message: "Krok 1: Zainstaluj menedżera skryptów użytkownika"
    	},
    	noinst_step_2: {
    		message: "Krok 2: Skrypty użytkownika"
    	},
    	extension_name: {
    		message: "Bloker wyskakujących okienek przez AdGuard"
    	},
    	userscript_name: {
    		message: "Bloker wyskakujących okienek przez AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokuje wyskakujące okienka na stronach internetowych"
    	},
    	on_navigation_by_popunder: {
    		message: "To przejście na nową stronę może być spowodowane przez pop-under. Czy chcesz kontynuować?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Bloker wyskakujących okienek przerwał wykonywanie skryptu, aby zapobiec przekierowaniu w tle",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Bloker wyskakujących okienek jest na służbie"
    	},
    	ext_disabled: {
    		message: "Bloker wyskakujących okienek jest wyłączony dla $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Bloker wyskakujących okienek nie może działać na tej domenie"
    	},
    	settings_saved: {
    		message: "Ustawienia zapisane"
    	}
    };
    var nl = {
    	show_popup: {
    		message: "Toon %destUrl%"
    	},
    	continue_blocking: {
    		message: "Doorgaan"
    	},
    	allow_from: {
    		message: "Pop-ups toestaan voor %origDomain%"
    	},
    	manage_pref: {
    		message: "Voorkeuren beheren..."
    	},
    	popup_text: {
    		message: "AdGuard heeft voorkomen dat deze website pop-upvensters van %numPopup% opende"
    	},
    	options: {
    		message: "Opties"
    	},
    	silence_noti: {
    		message: "Dit bericht niet weergeven voor %origDomain%"
    	},
    	site_input_ph: {
    		message: "Voer site naam in"
    	},
    	add_site: {
    		message: "Een site toevoegen"
    	},
    	add: {
    		message: "Toevoegen"
    	},
    	allowed_empty: {
    		message: "Lijst met toegestane sites is leeg"
    	},
    	allowed: {
    		message: "Toegestaan"
    	},
    	silenced_empty: {
    		message: "Lijst met sites waarvan de notificaties uit zijn gezet is leeg"
    	},
    	silenced: {
    		message: "Zonder notificaties"
    	},
    	allowed_tooltip: {
    		message: "Pop-ups worden toegestaan voor de domeinen in deze lijst."
    	},
    	silenced_tooltip: {
    		message: "Meldingen voor geblokkeerde pop-ups worden niet weergegeven voor domeinen in deze lijst."
    	},
    	installFrom: {
    		message: "Installeren vanaf <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Stap 3: Deze pagina vernieuwen om naar instellingen voor gebruikerscripts te gaan"
    	},
    	noinst_ignore_if_ag: {
    		message: "Als u AdGuard voor Windows heeft geïnstalleerd, kunt u deze stap negeren omdat het gebruikersscript voor pop-up blokkering vooraf is geïnstalleerd."
    	},
    	noinst_rec: {
    		message: "(Aanbevolen)"
    	},
    	please_wait: {
    		message: "Even geduld, detectie van de pop-up blokkering"
    	},
    	noinst_special_prog: {
    		message: "Om een gebruikersscript te gebruiken, heb je eerst een speciaal programma of extensie nodig die gebruikersscript uitvoert."
    	},
    	noinst_subtitle: {
    		message: "De AdGuard Popup Blocker-gebruikerscript is niet geïnstalleerd. Zie de onderstaande instructie."
    	},
    	homepage: {
    		message: "Startpagina"
    	},
    	noinst_step_1: {
    		message: "Stap 1: Een gebruikersscript beheerder installeren"
    	},
    	noinst_step_2: {
    		message: "Stap 2: Gebruikersscript"
    	},
    	extension_name: {
    		message: "Popup Blocker van AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Pop-up Blocker",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokkeert pop-upadvertenties op webpagina's"
    	},
    	on_navigation_by_popunder: {
    		message: "Deze overgang naar de nieuwe pagina wordt waarschijnlijk veroorzaakt door een onderliggend venster. Wil je doorgaan?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Pop-up Blocker heeft de uitvoering van een script afgebroken om een redirect in de achtergrond te voorkomen",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Pop-up Blocker is actief"
    	},
    	ext_disabled: {
    		message: "Pop-upblokkering is uitgeschakeld voor $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Pop-upblokkering is uitgeschakeld voor dit domein"
    	},
    	settings_saved: {
    		message: "Instellingen opgeslagen"
    	}
    };
    var pt = {
    	show_popup: {
    		message: "Mostrar %destUrl%"
    	},
    	continue_blocking: {
    		message: "Continuar bloqueando"
    	},
    	allow_from: {
    		message: "Permitir pop-ups em %origDomain%"
    	},
    	manage_pref: {
    		message: "Gerenciar preferências..."
    	},
    	popup_text: {
    		message: "O AdGuard impediu este site de abrir %numPopup% pop-ups"
    	},
    	options: {
    		message: "Opções"
    	},
    	silence_noti: {
    		message: "Não mostrar essa mensagem no %origDomain%"
    	},
    	site_input_ph: {
    		message: "Digite o nome do site"
    	},
    	add_site: {
    		message: "Adicionar um site"
    	},
    	add: {
    		message: "Adicionar"
    	},
    	allowed_empty: {
    		message: "A lista de sites permitidos está vazia"
    	},
    	allowed: {
    		message: "Exceções"
    	},
    	silenced_empty: {
    		message: "Lista de sites com notificações silenciadas está vazia"
    	},
    	silenced: {
    		message: "Silenciado"
    	},
    	allowed_tooltip: {
    		message: "Os pop-ups serão permitidos para sites listados aqui."
    	},
    	silenced_tooltip: {
    		message: "As notificações para pop-ups bloqueados não serão mostrados para sites listados aqui."
    	},
    	installFrom: {
    		message: "Instale da <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Passo 3: Atualize esta página para obter as configurações de script de usuário"
    	},
    	noinst_ignore_if_ag: {
    		message: "Se você instalou o AdGuard para Windows, você pode ignorar esta etapa, porque o script de usuário do Bloqueador de Pop-ups já vem pré-instalado."
    	},
    	noinst_rec: {
    		message: "(Recomendado)"
    	},
    	please_wait: {
    		message: "Por favor, aguarde enquanto detectamos o Bloqueador de Pop-ups"
    	},
    	noinst_special_prog: {
    		message: "Primeiro de tudo, para usar um script de usuário você precisa de um programa ou uma extensão especial para executar scripts de usuário."
    	},
    	noinst_subtitle: {
    		message: "O script de usuário do Bloqueador de Pop-ups do AdGuard não está instalado. Por favor, siga as instruções abaixo."
    	},
    	homepage: {
    		message: "Página Inicial"
    	},
    	noinst_step_1: {
    		message: "Etapa 1: Instale um gerenciador de script de usuário"
    	},
    	noinst_step_2: {
    		message: "Etapa 2: Script de Usuário"
    	},
    	extension_name: {
    		message: "Bloqueador de Pop-ups por AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Bloqueador de Pop-ups",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Bloqueia anúncios pop-ups dentro dos sites"
    	},
    	on_navigation_by_popunder: {
    		message: "Essa transição para a nova página provavelmente será causada por um pop-under. Você deseja continuar?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "O bloqueador de pop-ups interrompeu uma execução de script para evitar um redirecionamento em segundo plano",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Bloqueador de Pop-ups está de plantão"
    	},
    	ext_disabled: {
    		message: "Bloqueador de Pop-ups está desativado para $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "O bloqueador de pop-ups não pode ser executado neste domínio."
    	},
    	settings_saved: {
    		message: "Configurações salvas"
    	}
    };
    var ro = {
    	show_popup: {
    		message: "Arată %destUrl%"
    	},
    	continue_blocking: {
    		message: "Continuați blocarea"
    	},
    	allow_from: {
    		message: "Permiteți pop-up pentru %origDomain%"
    	},
    	manage_pref: {
    		message: "Gestiune preferințe..."
    	},
    	popup_text: {
    		message: "AdGuard a împiedicat acestui site să deschidă %numPopup% ferestre pop-up"
    	},
    	options: {
    		message: "Opțiuni"
    	},
    	silence_noti: {
    		message: "Nu afișați acest mesaj pe %origDomain%"
    	},
    	site_input_ph: {
    		message: "Introduceți numele de site"
    	},
    	add_site: {
    		message: "Adăugă site"
    	},
    	add: {
    		message: "Adaugă"
    	},
    	allowed_empty: {
    		message: "Lista de site-uri permise este goală"
    	},
    	allowed: {
    		message: "Permis"
    	},
    	silenced_empty: {
    		message: "Lista site-uri cu notificări amuțite este goală"
    	},
    	silenced: {
    		message: "Amuțit"
    	},
    	allowed_tooltip: {
    		message: "Popup-urile vor fi permise domeniilor enumerate aici."
    	},
    	silenced_tooltip: {
    		message: "Notificările pentru pop-up-uri blocate nu vor fi afișate domeniilor enumerate aici."
    	},
    	installFrom: {
    		message: "Instalați din <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Pasul 3: Actualizați pagina pentru a ajunge la setări userscript"
    	},
    	noinst_ignore_if_ag: {
    		message: "Dacă ați instalat AdGuard pentru Windows, ignorați acest pas, deoarece userscript-ul Blocant Pop-up vine preinstalat."
    	},
    	noinst_rec: {
    		message: "(Recomandat)"
    	},
    	please_wait: {
    		message: "Vă rugăm să așteptați, se detectează Blocantul Pop-up"
    	},
    	noinst_special_prog: {
    		message: "Mai întâi, folosirea unui userscript cere un program sau o extensie specială care rulează userscript-uri."
    	},
    	noinst_subtitle: {
    		message: "Blocantul Pop-up AdGuard nu este instalat. Vă rugăm să consultați instrucțiunea de mai jos."
    	},
    	homepage: {
    		message: "Homepage"
    	},
    	noinst_step_1: {
    		message: "Pasul 1: Instalați un manager userscript"
    	},
    	noinst_step_2: {
    		message: "Pasul 2: Userscript"
    	},
    	extension_name: {
    		message: "Blocant Pop-up de AdGuard"
    	},
    	userscript_name: {
    		message: "Blocant Pop-up AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blochează reclame pop-up pe pagini web"
    	},
    	on_navigation_by_popunder: {
    		message: "Tranziția la această noua pagină este probabil cauzată de un pop-under. Vrei să continui?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Blocantul Pop-up a oprit o execuție de script ca să prevină redirecționare în fundal",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Blocantul Pop-up lucrează"
    	},
    	ext_disabled: {
    		message: "Blocantul Pop-up e dezactivat pentru $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Blocantul Pop-up e dezactivat pentru acest domeniu"
    	},
    	settings_saved: {
    		message: "Setări salvate"
    	}
    };
    var ru = {
    	show_popup: {
    		message: "Показать %destUrl%"
    	},
    	continue_blocking: {
    		message: "Продолжить блокировку"
    	},
    	allow_from: {
    		message: "Разрешить всплывающие окна на %origDomain%"
    	},
    	manage_pref: {
    		message: "Управлять настройками..."
    	},
    	popup_text: {
    		message: "AdGuard предотвратил показ %numPopup% всплывающих окон на этом сайте"
    	},
    	options: {
    		message: "Опции"
    	},
    	silence_noti: {
    		message: "Не показывать это сообщение на %origDomain%"
    	},
    	site_input_ph: {
    		message: "Введите имя сайта"
    	},
    	add_site: {
    		message: "Добавить сайт"
    	},
    	add: {
    		message: "Добавить"
    	},
    	allowed_empty: {
    		message: "Список исключений пуст"
    	},
    	allowed: {
    		message: "Исключения"
    	},
    	silenced_empty: {
    		message: "Список сайтов с отключенными уведомлениями пуст"
    	},
    	silenced: {
    		message: "Без уведомлений"
    	},
    	allowed_tooltip: {
    		message: "Всплывающие окна будут разрешены на сайтах, перечисленных здесь."
    	},
    	silenced_tooltip: {
    		message: "Уведомления о заблокированных всплывающих окнах не будут отображаться на сайтах, перечисленных здесь."
    	},
    	installFrom: {
    		message: "Установить из <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Шаг 3: Обновите эту страницу, чтобы перейти к настройкам пользовательского скрипта"
    	},
    	noinst_ignore_if_ag: {
    		message: "Если вы установили AdGuard для Windows, вы можете проигнорировать этот шаг, так как Блокировщик всплывающей рекламы уже установлен."
    	},
    	noinst_rec: {
    		message: "Рекомендуется"
    	},
    	please_wait: {
    		message: "Пожалуйста, подождите, попытка обнаружить Блокировщик всплывающей рекламы"
    	},
    	noinst_special_prog: {
    		message: "Для использования скрипта вам, прежде всего, необходима специальная программа (или расширение), которая может работать с пользовательскими скриптами."
    	},
    	noinst_subtitle: {
    		message: "Блокировщик всплывающей рекламы AdGuard не установлен. Пожалуйста, обратитесь к инструкции ниже."
    	},
    	homepage: {
    		message: "Домашняя страница"
    	},
    	noinst_step_1: {
    		message: "Шаг 1: установите программу для управления пользовательскими скриптами"
    	},
    	noinst_step_2: {
    		message: "Шаг 2: пользовательский скрипт"
    	},
    	extension_name: {
    		message: "Блокировщик всплывающей рекламы от AdGuard"
    	},
    	userscript_name: {
    		message: "Блокировщик всплывающей рекламы от AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Блокирует всплывающую рекламу на страницах"
    	},
    	on_navigation_by_popunder: {
    		message: "Этот переход на новую страницу скорее всего вызван поп-андером. Всё равно продолжить?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Блокировщик всплывающей рекламы прервал исполнение скрипта, чтобы предотвратить фоновую переадресацию",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Блокировщик всплывающей рекламы готов к работе"
    	},
    	ext_disabled: {
    		message: "Блокировщик всплывающей рекламы отключен для $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Блокировщик всплывающей рекламы не работает на этом домене."
    	},
    	settings_saved: {
    		message: "Настройки сохранены"
    	}
    };
    var sk = {
    	show_popup: {
    		message: "Zobraziť %destUrl%"
    	},
    	continue_blocking: {
    		message: "Pokračovať v blokovaní"
    	},
    	allow_from: {
    		message: "Povoliť vyskakovacie okná pre %origDomain%"
    	},
    	manage_pref: {
    		message: "Spravovať preferencie..."
    	},
    	popup_text: {
    		message: "AdGuard zabránil tejto stránke otvoriť %numPopup% vyskakovacích okien"
    	},
    	options: {
    		message: "Voľby"
    	},
    	silence_noti: {
    		message: "Neukazovať túto správu na %origDomain%"
    	},
    	site_input_ph: {
    		message: "Zadajte meno stránky"
    	},
    	add_site: {
    		message: "Pridať stránku"
    	},
    	add: {
    		message: "Pridať"
    	},
    	allowed_empty: {
    		message: "Zoznam povolených stránok je prázdny"
    	},
    	allowed: {
    		message: "Povolené"
    	},
    	silenced_empty: {
    		message: "Zoznam stíšených stránok je prázdny"
    	},
    	silenced: {
    		message: "Stíšené"
    	},
    	allowed_tooltip: {
    		message: "Vyskakovacie okná budú povolené pre domény tu uvedené."
    	},
    	silenced_tooltip: {
    		message: "Upozornenia na blokované vyskakovacie okná sa nebudú zobrazovať pre domény tu uvedené."
    	},
    	installFrom: {
    		message: "Inštalovať z <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Krok 3: Obnovte túto stránku, aby ste sa dostali k nastaveniam používateľského skriptu"
    	},
    	noinst_ignore_if_ag: {
    		message: "Ak ste nainštalovali AdGuard pre Windows, môžete tento krok ignorovať, pretože používateľský skript Popup Blocker je už predinštalovaný."
    	},
    	noinst_rec: {
    		message: "(Odporúčané)"
    	},
    	please_wait: {
    		message: "Počkajte, kým sa nezistí blokovanie vyskakovacích okien"
    	},
    	noinst_special_prog: {
    		message: "V prvom rade je na používanie používateľského skriptu potrebný špeciálny program alebo rozšírenie, ktoré spúšťa používateľské skripty."
    	},
    	noinst_subtitle: {
    		message: "Nie je nainštalovaný používateľský skript blokovania vyskakovacích okien AdGuard. Prečítajte si pokyny uvedené nižšie."
    	},
    	homepage: {
    		message: "Domovská stránka"
    	},
    	noinst_step_1: {
    		message: "Krok 1: Inštalovať manažéra používateľských skriptov"
    	},
    	noinst_step_2: {
    		message: "Krok2: Používateľský skript"
    	},
    	extension_name: {
    		message: "Blokovač vyskakovacích okien od AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard blokovač vyskakovacích okien",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokuje vyskakovacie reklamy na webových stránkach"
    	},
    	on_navigation_by_popunder: {
    		message: "Tento prechod na novú stránku bude pravdepodobne spôsobený kontextovým oknom. Prajete si pokračovať?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Blokovanie vyskakovacích okien prerušilo vykonávanie skriptu, aby sa zabránilo presmerovaniu na pozadí",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Blokovanie vyskakovacích okien je v činnosti"
    	},
    	ext_disabled: {
    		message: "Blokovanie vyskakovacích okien je pre $DOMAIN$ vypnuté",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Blokovanie vyskakovacích okien je pre túto doménu vypnuté"
    	},
    	settings_saved: {
    		message: "Nastavenia boli uložené"
    	}
    };
    var sl = {
    	show_popup: {
    		message: " Prikaži %destUrl%"
    	},
    	continue_blocking: {
    		message: "Nadaljuj z zaviranjem"
    	},
    	allow_from: {
    		message: "Dovoli pojavna okna na %origDomain%"
    	},
    	manage_pref: {
    		message: "Upravljaj nastavitve..."
    	},
    	popup_text: {
    		message: "AdGuard je tej spletni strani preprečil odpiranje %numPopup% pojavnih oken"
    	},
    	options: {
    		message: "Možnosti"
    	},
    	silence_noti: {
    		message: "Ne prikazuj tega sporočila na %origDomain%"
    	},
    	site_input_ph: {
    		message: "Vnesite ime strani"
    	},
    	add_site: {
    		message: "Dodaj stran"
    	},
    	add: {
    		message: "Dodaj"
    	},
    	allowed_empty: {
    		message: "Seznam dovoljenih strani je prazen"
    	},
    	allowed: {
    		message: "Izjeme"
    	},
    	silenced_empty: {
    		message: "Seznam utišanih strani je prazen"
    	},
    	silenced: {
    		message: "Utišane strani"
    	},
    	allowed_tooltip: {
    		message: "Za tukaj navedene domene bodo dovoljena pojavna okna."
    	},
    	silenced_tooltip: {
    		message: "Obvestila o onemogočenih pojavnih oknih ne bodo prikazana za tukaj navedene domene."
    	},
    	installFrom: {
    		message: "Namesti z <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "3. korak: Osvežite to stran, da pridete do nastavitev uporabniškega skripta"
    	},
    	noinst_ignore_if_ag: {
    		message: "Če ste namestili AdGuard za Windows, lahko ta korak prezrete, saj je uporabniški skript za zaviranje pojavnih oken vnaprej nameščen."
    	},
    	noinst_rec: {
    		message: "(Priporočeno)"
    	},
    	please_wait: {
    		message: "Počakajte, zaznavanje Zaviralca pojavnih oken"
    	},
    	noinst_special_prog: {
    		message: "Najprej, za uporabo uporabniškega skripta potrebujete poseben program ali razširitev, ki lahko zažene uporabniške skripte."
    	},
    	noinst_subtitle: {
    		message: "AdGuard uporabniški skript Popup Blocker ni nameščen. Oglejte si spodnja navodila."
    	},
    	homepage: {
    		message: "Domača stran"
    	},
    	noinst_step_1: {
    		message: "1. korak: Namestite upravitelja uporabniških skriptov"
    	},
    	noinst_step_2: {
    		message: "2. korak: Uporabniški skript"
    	},
    	extension_name: {
    		message: "Zaviralec pojavnih oken z AdGuardom"
    	},
    	userscript_name: {
    		message: "AdGuard Zaviralec pojavnih oken",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokira pojavne oglase na spletnih straneh"
    	},
    	on_navigation_by_popunder: {
    		message: "Ta prehod na novo stran je verjetno posledica pojavnega okna. Ali želite nadaljevati?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Zaviralec pojavnih oken je prekinil izvajanje skripta, da bi preprečil preusmerjanje v ozadju",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Zaviralec pojavnih oken je na dolžnosti"
    	},
    	ext_disabled: {
    		message: "Zaviralec pojavnih oken je onemogočen za $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Zaviralec pojavnih oken je onemogočen za to domeno"
    	},
    	settings_saved: {
    		message: "Nastavitve so shranjene"
    	}
    };
    var ta = {
    	show_popup: {
    		message: "%destUrl% ஐக் காட்டு"
    	},
    	continue_blocking: {
    		message: "தடுப்பதைத் தொடரவும்"
    	},
    	allow_from: {
    		message: "%origDomain% க்கு பாப்-அப்களை அனுமதிக்கவும்"
    	},
    	manage_pref: {
    		message: "விருப்பங்களை நிர்வகிக்கவும்..."
    	},
    	popup_text: {
    		message: "AdGuard இந்த வலைத்தளத்தை %numPopup% பாப்-அப் திறப்பதைத் தடுத்தது"
    	},
    	options: {
    		message: "விருப்பங்கள்"
    	},
    	silence_noti: {
    		message: "இந்த செய்தியை %origDomain% இல் காட்ட வேண்டாம்"
    	},
    	site_input_ph: {
    		message: "தளத்தின் பெயரை உள்ளிடவும்"
    	},
    	add_site: {
    		message: "தளத்தைச் சேர்க்கவும்"
    	},
    	add: {
    		message: "சேர்க்கவும்"
    	},
    	allowed_empty: {
    		message: "அனுமதிக்கப்பட்ட தளங்களின் பட்டியல் காலியாக உள்ளது"
    	},
    	allowed: {
    		message: "அனுமதிக்கப்பட்டது"
    	},
    	silenced_empty: {
    		message: "அமைதியான தளங்களின் பட்டியல் காலியாக உள்ளது"
    	},
    	silenced: {
    		message: "அமைதியான அறிவிப்புகள்"
    	},
    	allowed_tooltip: {
    		message: "இங்கே பட்டியலிடப்பட்ட களங்களுக்கு பாப்அப்கள் அனுமதிக்கப்படும்."
    	},
    	silenced_tooltip: {
    		message: "இங்கே பட்டியலிடப்பட்ட களங்களுக்கு தடுக்கப்பட்ட பாப்அப்களுக்கான அறிவிப்புகள் காண்பிக்கப்படாது."
    	},
    	installFrom: {
    		message: "<a>%name%</a> இலிருந்து நிறுவவும்"
    	},
    	noinst_step_3: {
    		message: "படி 3: பயனர் ஸ்கிரிப்ட் அமைப்புகளைப் பெற இந்தப் பக்கத்தைப் புதுப்பிக்கவும்"
    	},
    	noinst_ignore_if_ag: {
    		message: "நீங்கள் விண்டோஸுக்கான AdGuard ஐ நிறுவியிருந்தால், பாப்அப் தடுப்பான் பயனர் ஸ்கிரிப்ட் முன்பே நிறுவப்பட்டிருப்பதால் இந்த படிநிலையை நீங்கள் புறக்கணிக்கலாம்."
    	},
    	noinst_rec: {
    		message: "(பரிந்துரைக்கப்படுகிறது)"
    	},
    	please_wait: {
    		message: "தயவுசெய்து காத்திருங்கள், பாப்அப் தடுப்பைக் கண்டறிகிறது"
    	},
    	noinst_special_prog: {
    		message: "முதலாவதாக, ஒரு பயனர் ஸ்கிரிப்டைப் பயன்படுத்த உங்களுக்கு ஒரு சிறப்பு நிரல் அல்லது பயனர் ஸ்கிரிப்ட்களை இயக்கும் நீட்டிப்பு தேவை."
    	},
    	noinst_subtitle: {
    		message: "AdGuard பாப்அப் தடுப்பான் பயனர் ஸ்கிரிப்ட் நிறுவப்படவில்லை. கீழே உள்ள வழிமுறைகளைப் பார்க்கவும்."
    	},
    	homepage: {
    		message: "முகப்புப்பக்கம்"
    	},
    	noinst_step_1: {
    		message: "படி 1: பயனர் ஸ்கிரிப்ட் மேலாளரை நிறுவவும்"
    	},
    	noinst_step_2: {
    		message: "படி 2: பயனர் ஸ்கிரிப்ட்"
    	},
    	extension_name: {
    		message: "AdGuard இன் பாப்அப் தடுப்பான்"
    	},
    	userscript_name: {
    		message: "AdGuard பாப்அப் தடுப்பான்",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "வலைப்பக்கங்களில் பாப்அப் விளம்பரங்களைத் தடுக்கிறது"
    	},
    	on_navigation_by_popunder: {
    		message: "புதிய பக்கத்திற்கான இந்த மாற்றம் ஒரு பாப்-அண்டர் காரணமாக ஏற்படக்கூடும். தொடர விரும்புகிறீர்களா?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "பின்னணி திருப்பிவிடப்படுவதைத் தடுக்க பாப்அப் தடுப்பான் ஸ்கிரிப்ட் செயல்பாட்டை நிறுத்தியது",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "பாப்அப் தடுப்பான் செயலில் உள்ளது"
    	},
    	ext_disabled: {
    		message: "$DOMAIN$ க்கு பாப்அப் தடுப்பான் முடக்கப்பட்டுள்ளது",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "இந்த களத்திற்கு பாப்அப் தடுப்பான் முடக்கப்பட்டுள்ளது"
    	},
    	settings_saved: {
    		message: "அமைப்புகள் சேமிக்கப்பட்டன"
    	}
    };
    var th = {
    	show_popup: {
    		message: "แสดง %destUrl%"
    	},
    	continue_blocking: {
    		message: "ปิดกั้นต่อไป"
    	},
    	allow_from: {
    		message: "อนุญาตป๊อปอัปสำหรับ %origDomain%"
    	},
    	manage_pref: {
    		message: "จัดการค่ากำหนด..."
    	},
    	popup_text: {
    		message: "AdGuard ป้องกันไม่ให้เว็บไซต์นี้เปิดหน้าต่างป๊อปอัพ %numPopup%"
    	},
    	options: {
    		message: "ตัวเลือก"
    	},
    	silence_noti: {
    		message: "อย่าแสดงข้อความนี้ใน %origDomain%"
    	},
    	site_input_ph: {
    		message: "ใส่ชื่อเว็บไซต์"
    	},
    	add_site: {
    		message: "เพิ่มเว็บไซต์"
    	},
    	add: {
    		message: "เพิ่ม"
    	},
    	allowed_empty: {
    		message: "รายการไซต์ที่อนุญาตว่างเปล่า"
    	},
    	allowed: {
    		message: "อนุญาต"
    	},
    	silenced_empty: {
    		message: "รายการไซต์ที่ถูกปิดกั้นว่างเปล่า"
    	},
    	silenced: {
    		message: "ปิดกั้น"
    	},
    	allowed_tooltip: {
    		message: "ป๊อปอัปจะได้รับอนุญาตสำหรับโดเมนที่แสดงที่นี่"
    	},
    	silenced_tooltip: {
    		message: "การแจ้งเตือนสำหรับป๊อปอัปที่ถูกปิดกั้นจะไม่แสดงสำหรับโดเมนที่แสดงที่นี่"
    	},
    	installFrom: {
    		message: "ติดตั้งจาก <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "ขั้นตอนที่ 3: รีเฟรชหน้านี้เพื่อไปที่การตั้งค่า userscript"
    	},
    	noinst_ignore_if_ag: {
    		message: "หากคุณติดตั้ง AdGuard สำหรับ Windows คุณสามารถข้ามขั้นตอนนี้ได้เนื่องจากผู้ใช้ Popup Blocker มาติดตั้งล่วงหน้า"
    	},
    	noinst_rec: {
    		message: "(แนะนำ)"
    	},
    	please_wait: {
    		message: "โปรดรอสักครู่ กำลังตรวจหา Popup Blocker"
    	},
    	noinst_special_prog: {
    		message: "ก่อนอื่น เพื่อใช้ userscript คุณต้องมีโปรแกรมหรือส่วนเสริมพิเศษที่รัน userscripts"
    	},
    	noinst_subtitle: {
    		message: "Userscript ของ AdGuard Popup Blocker ไม่ได้รับการติดตั้ง โปรดดูคำแนะนำด้านล่าง"
    	},
    	homepage: {
    		message: "หน้าหลัก"
    	},
    	noinst_step_1: {
    		message: "ขั้นตอนที่ 1: ติดตั้งตัวจัดการ usrscript"
    	},
    	noinst_step_2: {
    		message: "ขั้นตอนที่ 2: Userscript"
    	},
    	extension_name: {
    		message: "Popup Blocker โดย AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Popup Blocker",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "ปิดกั้นโฆษณาป๊อปอัพในหน้าเว็บ"
    	},
    	on_navigation_by_popunder: {
    		message: "การเปลี่ยนไปใช้หน้าใหม่นี้น่าจะเกิดจากป๊อปอันเดอร์ คุณต้องการทำต่อไปหรือไม่?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Popup Blocker ยกเลิกการทำงานของสคริปต์เพื่อป้องกันการเปลี่ยนพื้นหลัง",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Popup Blocker ทำหน้าที่"
    	},
    	ext_disabled: {
    		message: "Popup Blocker ถูกปิดใช้งานสำหรับ $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Popup Blocker ถูกปิดการใช้งานสำหรับโดเมนนี้"
    	},
    	settings_saved: {
    		message: "การตั้งค่าที่บันทึกไว้"
    	}
    };
    var tr = {
    	show_popup: {
    		message: "%destUrl% sitesini göster"
    	},
    	continue_blocking: {
    		message: "Engellemeye devam et"
    	},
    	allow_from: {
    		message: "%origDomain% için açılır pencerelere izin ver"
    	},
    	manage_pref: {
    		message: "Tercihleri yönet..."
    	},
    	popup_text: {
    		message: "AdGuard bu sitenin %numPopup% açılır pencere açmasını önledi"
    	},
    	options: {
    		message: "Ayarlar"
    	},
    	silence_noti: {
    		message: "Bu mesajı %origDomain% üzerinde gösterme"
    	},
    	site_input_ph: {
    		message: "Site adını girin"
    	},
    	add_site: {
    		message: "Site ekle"
    	},
    	add: {
    		message: "Ekle"
    	},
    	allowed_empty: {
    		message: "İzin verilen sitelerin listesi boş"
    	},
    	allowed: {
    		message: "İzin verilen"
    	},
    	silenced_empty: {
    		message: "Sessize alınmış olan sitelerin listesi boş"
    	},
    	silenced: {
    		message: "Sessize alınmış"
    	},
    	allowed_tooltip: {
    		message: "Burada listelenen alan adları için açılır pencerelere izin verilecektir."
    	},
    	silenced_tooltip: {
    		message: "Engellenen açılır pencerelere ilişkin bildirimler, burada listelenen alan adları için gösterilmeyecektir."
    	},
    	installFrom: {
    		message: "<a>%name%</a>'dan yükle"
    	},
    	noinst_step_3: {
    		message: "Adım 3: Kullanıcı betikleri ayarlarını almak için bu sayfayı yenile"
    	},
    	noinst_ignore_if_ag: {
    		message: "Windows için AdGuard yüklediyseniz, Açılır Pencere Engelleyici betiği önceden yüklü olarak geldiği için bu adımı görmezden gelebilirsiniz."
    	},
    	noinst_rec: {
    		message: "(Tavsiye edilen)"
    	},
    	please_wait: {
    		message: "Lütfen bekleyin, Açılır Pencere Engelleyici tespit ediliyor"
    	},
    	noinst_special_prog: {
    		message: "Bir kullanıcı betiği kullanmak için öncelikle kullanıcı betiği çalıştıran özel bir programa veya uzantıya ihtiyacınız var."
    	},
    	noinst_subtitle: {
    		message: "AdGuard Açılır Pencere Engelleyicisi kullanıcı betiği yüklü değil. Lütfen aşağıdaki talimata bakın."
    	},
    	homepage: {
    		message: "Ana sayfa"
    	},
    	noinst_step_1: {
    		message: "1. Adım: Bir kullanıcı betiği yöneticisi yükle"
    	},
    	noinst_step_2: {
    		message: "2. Adım: Kullanıcı betiği"
    	},
    	extension_name: {
    		message: "AdGuard ile Açılır Pencere Engelleyici"
    	},
    	userscript_name: {
    		message: "AdGuard Açılır Pencere Engelleyici",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Web sayfalarında açılır pencere reklamlarını engeller"
    	},
    	on_navigation_by_popunder: {
    		message: "Yeni sayfaya geçiş, bir gizli pencere nedeniyle meydana gelmiş olabilir. Devam etmek istiyor musunuz?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Açılır Pencere Engelleyici arka plan yönlendirmesini önlemek için bir komut dosyasının çalışmasını durdurdu",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Açılır Pencere Engelleyici görevinin başında"
    	},
    	ext_disabled: {
    		message: "Açılır Pencere Engelleyici $DOMAIN$ için devre dışı bırakıldı",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Açılır Pencere Engelleyici bu alan adı için devre dışı bırakıldı"
    	},
    	settings_saved: {
    		message: "Ayarlar kaydedildi"
    	}
    };
    var uk = {
    	show_popup: {
    		message: "Показати %destUrl%"
    	},
    	continue_blocking: {
    		message: "Продовжити блокування"
    	},
    	allow_from: {
    		message: "Дозволити спливні вікна для %origDomain%"
    	},
    	manage_pref: {
    		message: "Керувати налаштуваннями..."
    	},
    	popup_text: {
    		message: "AdGuard запобіг показу спливних вікон %numPopup% на цьому сайті"
    	},
    	options: {
    		message: "Параметри"
    	},
    	silence_noti: {
    		message: "Не показувати це повідомлення на %origDomain%"
    	},
    	site_input_ph: {
    		message: "Введіть назву сайту"
    	},
    	add_site: {
    		message: "Додати сайт"
    	},
    	add: {
    		message: "Додати"
    	},
    	allowed_empty: {
    		message: "Список винятків порожній"
    	},
    	allowed: {
    		message: "Винятки"
    	},
    	silenced_empty: {
    		message: "Список сайтів з вимкненими сповіщеннями порожній"
    	},
    	silenced: {
    		message: "Без повідомлень"
    	},
    	allowed_tooltip: {
    		message: "Спливні вікна будуть дозволені на сайтах з цього списку."
    	},
    	silenced_tooltip: {
    		message: "Повідомлення про заблоковані спливні вікна не відображатимуться на сайтах з цього списку."
    	},
    	installFrom: {
    		message: "Встановити з <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Крок 3: оновіть цю сторінку, щоб перейти до налаштувань розширення"
    	},
    	noinst_ignore_if_ag: {
    		message: "Якщо ви встановили AdGuard для Windows, можете пропустити цей крок, оскільки розширення «Блокувальник спливних вікон» уже встановлено. Ймовірно, його необхідно увімкнути в налаштуваннях AdGuard."
    	},
    	noinst_rec: {
    		message: "(Рекомендовано)"
    	},
    	please_wait: {
    		message: "Будь ласка, зачекайте, спроба виявити Блокувальник спливних вікон"
    	},
    	noinst_special_prog: {
    		message: "Щоб використовувати скрипт, потрібна спеціальна програма або браузерне розширення, що може працювати з користувацькими скриптами."
    	},
    	noinst_subtitle: {
    		message: "Розширення «Блокувальник спливних вікон AdGuard» не встановлено. Будь ласка, виконайте наступні кроки."
    	},
    	homepage: {
    		message: "Домашня сторінка"
    	},
    	noinst_step_1: {
    		message: "Крок 1: встановіть програму для керування користувацькими скриптами"
    	},
    	noinst_step_2: {
    		message: "Крок 2: користувацький скрипт"
    	},
    	extension_name: {
    		message: "Блокувальник спливних вікон AdGuard"
    	},
    	userscript_name: {
    		message: "Блокувальник спливних вікон AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Блокує спливну рекламу на вебсторінках"
    	},
    	on_navigation_by_popunder: {
    		message: "Цей перехід на нову сторінку, ймовірно, міг бути викликаний «поп-андером». Бажаєте продовжити?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Блокувальник спливних вікон перервав виконання скрипта, щоб запобігти фоновому перенаправленню",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Блокувальник спливних вікон готовий до роботи"
    	},
    	ext_disabled: {
    		message: "Блокувальник спливних вікон вимкнено для $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Блокувальник спливних вікон вимкнено для цього домена"
    	},
    	settings_saved: {
    		message: "Налаштування збережено"
    	}
    };
    var vi = {
    	show_popup: {
    		message: "Hiện %destUrl%"
    	},
    	continue_blocking: {
    		message: "Tiếp tục chặn"
    	},
    	allow_from: {
    		message: "Cho phép cửa sổ bật lên cho %origDomain%"
    	},
    	manage_pref: {
    		message: "Quản lý tùy chọn..."
    	},
    	popup_text: {
    		message: "AdGuard đã ngăn trang web này mở %numPopup% cửa sổ bật lên"
    	},
    	options: {
    		message: "Tuỳ chọn"
    	},
    	silence_noti: {
    		message: "Đừng hiển thị thông báo này trên %origDomain%"
    	},
    	site_input_ph: {
    		message: "Nhập tên trang web"
    	},
    	add_site: {
    		message: "Thêm một trang web"
    	},
    	add: {
    		message: "Thêm"
    	},
    	allowed_empty: {
    		message: "Danh sách các trang web được phép trống"
    	},
    	allowed: {
    		message: "Được phép"
    	},
    	silenced_empty: {
    		message: "Danh sách các trang im lặng trống"
    	},
    	silenced: {
    		message: "Im lặng"
    	},
    	allowed_tooltip: {
    		message: "Cửa sổ bật lên sẽ được phép cho các tên miền được liệt kê ở đây."
    	},
    	silenced_tooltip: {
    		message: "Thông báo cho cửa sổ bật lên bị chặn sẽ không được hiển thị cho các tên miền được liệt kê ở đây."
    	},
    	installFrom: {
    		message: "Cài đặt từ <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Bước 3: Làm mới trang này để có được cài đặt usercript"
    	},
    	noinst_ignore_if_ag: {
    		message: "Nếu bạn đã cài đặt AdGuard cho Windows, bạn có thể bỏ qua bước này vì bản mô tả người dùng Popup Blocker được cài đặt sẵn."
    	},
    	noinst_rec: {
    		message: "(Khuyến nghị)"
    	},
    	please_wait: {
    		message: "Xin vui lòng chờ, phát hiện Trình chặn Popup"
    	},
    	noinst_special_prog: {
    		message: "Trước hết, để sử dụng một userscript bạn cần một chương trình đặc biệt hoặc tiện ích mở rộng chạy userscripts."
    	},
    	noinst_subtitle: {
    		message: "Bản tin người dùng AdGuard Popup Blocker chưa được cài đặt. Xin vui lòng xem hướng dẫn dưới đây."
    	},
    	homepage: {
    		message: "Trang chủ"
    	},
    	noinst_step_1: {
    		message: "Bước 1: Cài đặt trình quản lý usrscript"
    	},
    	noinst_step_2: {
    		message: "Bước 2: Userscript"
    	},
    	extension_name: {
    		message: "Trình chặn Popup của AdGuard"
    	},
    	userscript_name: {
    		message: "AdGuard Popup Blocker",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Chặn quảng cáo bật lên trên các trang web"
    	},
    	on_navigation_by_popunder: {
    		message: "Việc chuyển đổi sang trang mới này có thể được gây ra bởi một cửa sổ bật xuống. Bạn có muốn tiếp tục?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Trình chặn Popup đã hủy bỏ việc thực thi tập lệnh để ngăn chuyển hướng nền",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Trình chặn Popup đang làm nhiệm vụ"
    	},
    	ext_disabled: {
    		message: "Trình chặn Popup bị vô hiệu hóa cho $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Trình chặn Popup bị vô hiệu hóa cho miền này"
    	},
    	settings_saved: {
    		message: "Đã lưu cài đặt"
    	}
    };
    var zh = {
    	show_popup: {
    		message: "显示 %destUrl%"
    	},
    	continue_blocking: {
    		message: "继续拦截"
    	},
    	allow_from: {
    		message: "允许 %origDomain% 弹窗"
    	},
    	manage_pref: {
    		message: "管理首选项..."
    	},
    	popup_text: {
    		message: "AdGuard 已防止此网站打开的 %numPopup%个弹窗"
    	},
    	options: {
    		message: "选项"
    	},
    	silence_noti: {
    		message: "在 %origDomain% 上不再显示此讯息"
    	},
    	site_input_ph: {
    		message: "输入网站名称"
    	},
    	add_site: {
    		message: "添加网站"
    	},
    	add: {
    		message: "添加"
    	},
    	allowed_empty: {
    		message: "允许的网站列表为空"
    	},
    	allowed: {
    		message: "允许"
    	},
    	silenced_empty: {
    		message: "禁止的网站列表"
    	},
    	silenced: {
    		message: "禁止"
    	},
    	allowed_tooltip: {
    		message: "此处列出的是允许弹窗的域。"
    	},
    	silenced_tooltip: {
    		message: "此处列出的是禁止弹出的域。"
    	},
    	installFrom: {
    		message: "安装从 <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "步骤3：刷新此页已获取用户脚本设置"
    	},
    	noinst_ignore_if_ag: {
    		message: "如您已安装 AdGuard for Windows，则您可忽略此步骤，因为其已预安装弹窗拦截器用户脚本。"
    	},
    	noinst_rec: {
    		message: "（推荐）"
    	},
    	please_wait: {
    		message: "请稍后，正在检测弹窗拦截器"
    	},
    	noinst_special_prog: {
    		message: "首先，要使用用户脚本，您需要特殊的程序的以运行用户脚本。"
    	},
    	noinst_subtitle: {
    		message: "AdGuard Popup Blocker 用户脚本未安装。请查看以下指示说明。"
    	},
    	homepage: {
    		message: "主页"
    	},
    	noinst_step_1: {
    		message: "步骤 1：安装用户脚本管理器"
    	},
    	noinst_step_2: {
    		message: "步骤 2：用户脚本"
    	},
    	extension_name: {
    		message: "AdGuard 弹窗拦截器"
    	},
    	userscript_name: {
    		message: "AdGuard 弹窗拦截器",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "拦截网页弹窗广告"
    	},
    	on_navigation_by_popunder: {
    		message: "此网页导航可能导致弹窗。您要继续？",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "PopupBlocker 已中止脚本执行以防止后台重新定向",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "弹窗拦截器工作中"
    	},
    	ext_disabled: {
    		message: "已在 $DOMAIN$ 上禁用弹窗拦截器",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "弹窗拦截器无法运行于此域之上"
    	},
    	settings_saved: {
    		message: "设置已保存"
    	}
    };
    var translations = {
    	en: en,
    	ar: ar,
    	be: be,
    	cs: cs,
    	da: da,
    	de: de,
    	el: el,
    	es: es,
    	fa: fa,
    	fi: fi,
    	fr: fr,
    	he: he,
    	hr: hr,
    	hu: hu,
    	id: id,
    	it: it$1,
    	ja: ja,
    	ko: ko,
    	lt: lt,
    	ms: ms,
    	no: no,
    	pl: pl,
    	nl: nl,
    	pt: pt,
    	"pt-PT": {
    	show_popup: {
    		message: "Mostrar %destUrl%"
    	},
    	continue_blocking: {
    		message: "Continuar a bloquear"
    	},
    	allow_from: {
    		message: "Permitir popups em %origDomain%"
    	},
    	manage_pref: {
    		message: "Gerir preferências..."
    	},
    	popup_text: {
    		message: "O AdGuard impediu que este sítio abrisse janelas popup de %numPopup%"
    	},
    	options: {
    		message: "Opções"
    	},
    	silence_noti: {
    		message: "Não mostrar esta mensagem em %origDomain%"
    	},
    	site_input_ph: {
    		message: "Insira o nome do sítio"
    	},
    	add_site: {
    		message: "Adicionar um sítio"
    	},
    	add: {
    		message: "Adicionar"
    	},
    	allowed_empty: {
    		message: "A lista de sítios permitidos está vazia"
    	},
    	allowed: {
    		message: "Excepções"
    	},
    	silenced_empty: {
    		message: "A lista de sítios com notificações silenciadas está vazia"
    	},
    	silenced: {
    		message: "Silenciado"
    	},
    	allowed_tooltip: {
    		message: "Popups serão permitidos nos sítios listados aqui."
    	},
    	silenced_tooltip: {
    		message: "As notificações de popups bloqueados não serão exibidas nos sítios listados aqui."
    	},
    	installFrom: {
    		message: "Instalar a partir de <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Passo 3: Atualize esta página para obter as configurações de script de utilizador"
    	},
    	noinst_ignore_if_ag: {
    		message: "Se tiver instalado o AdGuard para Windows, ignore essa etapa, pois o userscript do Popup Blocker vem pré-instalado."
    	},
    	noinst_rec: {
    		message: "(Recomendado)"
    	},
    	please_wait: {
    		message: "Por favor, aguarde, a detectar o Bloqueador de Popups"
    	},
    	noinst_special_prog: {
    		message: "Antes de tudo, para usar um userscript precisa de um programa ou extensão especial que possa executar scripts de utilizadores."
    	},
    	noinst_subtitle: {
    		message: "O userscript do AdGuard Popup Blocker não está instalado. Por favor, veja as instruções abaixo."
    	},
    	homepage: {
    		message: "Página Principal"
    	},
    	noinst_step_1: {
    		message: "Etapa 1: Instalar um gestor de userscript"
    	},
    	noinst_step_2: {
    		message: "Etapa 2: Script de utilizador"
    	},
    	extension_name: {
    		message: "Bloqueador de Popup por AdGuard"
    	},
    	userscript_name: {
    		message: "Bloqueador de Popup AdGuard",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Bloqueia anúncios popup em páginas da web."
    	},
    	on_navigation_by_popunder: {
    		message: "Esta transição para a nova página  será  provavelmente causada por um popunder. Deseja continuar?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "PopupBlocker abortou uma execução de script para evitar o redireccionamento em segundo plano",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "O bloqueador de popups está em serviço"
    	},
    	ext_disabled: {
    		message: "O bloqueador de popups está desativado para $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "O Bloqueador de popups não pode ser executado neste domínio"
    	},
    	settings_saved: {
    		message: "As definições foram guardadas"
    	}
    },
    	ro: ro,
    	ru: ru,
    	sk: sk,
    	sl: sl,
    	"sr-CS": {
    	show_popup: {
    		message: "Prikaži %destUrl%"
    	},
    	continue_blocking: {
    		message: "Nastavi sa blokiranjem"
    	},
    	allow_from: {
    		message: "Dozvoli iskačuće prozore za %origDomain%"
    	},
    	manage_pref: {
    		message: "Upravljaj postavkama..."
    	},
    	popup_text: {
    		message: "AdGuard je sprečio ovaj sajt da otvori %numPopup% iskačućih prozora"
    	},
    	options: {
    		message: "Opcije"
    	},
    	silence_noti: {
    		message: "Ne prikazuj ovu poruku na %origDomain%"
    	},
    	site_input_ph: {
    		message: "Unesite ime sajta"
    	},
    	add_site: {
    		message: "Dodaj sajt"
    	},
    	add: {
    		message: "Dodaj"
    	},
    	allowed_empty: {
    		message: "Lista dozvoljenih sajtova je prazna"
    	},
    	allowed: {
    		message: "Dozvoljeno"
    	},
    	silenced_empty: {
    		message: "Lista utišanih sajtova je prazna"
    	},
    	silenced: {
    		message: "Utišano"
    	},
    	allowed_tooltip: {
    		message: "Iskačući prozori će biti dozvoljeni za ovde prikazane domene."
    	},
    	silenced_tooltip: {
    		message: "Obaveštenja o blokiranim iskačućim prozorima neće biti prikazivana za ovde prikazane domene."
    	},
    	installFrom: {
    		message: "Instaliraj sa <a>%name%</a>"
    	},
    	noinst_step_3: {
    		message: "Korak 3: Osvežite ovu stranicu da dođete do userscript postavki"
    	},
    	noinst_ignore_if_ag: {
    		message: "Ako ste instalirali AdGuard za Windows, ovaj korak možete zanemariti jer je userscript za blokiranje iskačućih prozora preinstaliran."
    	},
    	noinst_rec: {
    		message: "(preporučuje se)"
    	},
    	please_wait: {
    		message: "Molim sačekajte, otkrivam blokatora iskačućih prozora"
    	},
    	noinst_special_prog: {
    		message: "Pre svega, za kkorišćenje userscript vam je potreban poseban program ili proširenje koje pokreće userscripts."
    	},
    	noinst_subtitle: {
    		message: "AdGuard userscript blokator iskačućih prozora nije instaliran. Pogledajte uputstva ispod."
    	},
    	homepage: {
    		message: "Početna stranica"
    	},
    	noinst_step_1: {
    		message: "Korak 1: Instalirajte usrscript upravljača"
    	},
    	noinst_step_2: {
    		message: "Korak 2: Userscript"
    	},
    	extension_name: {
    		message: "Blokator iskačućih prozora od AdGuard-a"
    	},
    	userscript_name: {
    		message: "AdGuard blokator iskačućih prozora",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "Blokira iskačuće reklame na veb stranicama"
    	},
    	on_navigation_by_popunder: {
    		message: "Ovo preusmerenje na novu stranicu je verovatno uzrokovano iskačućim prozorom. Želite li da nastavite?",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "Blokator iskačućih prozora je odbacio izvršenje skripte kako bi sprečio pozadinsko preusmerenje",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "Blokator iskačućih prozora je na dužnosti"
    	},
    	ext_disabled: {
    		message: "Blokator iskačućih prozora je isključen za $DOMAIN$",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "Blokator iskačućih prozora je isključen za ovaj domen"
    	},
    	settings_saved: {
    		message: "Postavke sačuvane"
    	}
    },
    	ta: ta,
    	th: th,
    	tr: tr,
    	uk: uk,
    	vi: vi,
    	zh: zh,
    	"zh-HK": {
    	show_popup: {
    		message: "顯示 %destUrl%"
    	},
    	continue_blocking: {
    		message: "繼續封鎖"
    	},
    	allow_from: {
    		message: "允許 %origDomain% 的彈出式視窗"
    	},
    	manage_pref: {
    		message: "管理偏好設定"
    	},
    	popup_text: {
    		message: "AdGuard 已阻止此網站開啟 %numPopup% 個彈出式視窗"
    	},
    	options: {
    		message: "選項"
    	},
    	silence_noti: {
    		message: "不再 %origDomain% 上提示"
    	},
    	site_input_ph: {
    		message: "輸入網站名稱"
    	},
    	add_site: {
    		message: "新增網站"
    	},
    	add: {
    		message: "新增"
    	},
    	allowed_empty: {
    		message: "允許清單為空的"
    	},
    	allowed: {
    		message: "已允許"
    	},
    	silenced_empty: {
    		message: "已靜音清單為空的"
    	},
    	silenced: {
    		message: "已靜音"
    	},
    	allowed_tooltip: {
    		message: "允許彈出式視窗網域清單"
    	},
    	silenced_tooltip: {
    		message: "已設定靜音不通知的網域清單"
    	},
    	installFrom: {
    		message: "從 {$startLink}{$name}{$endLink} 安裝"
    	},
    	noinst_step_3: {
    		message: "步驟 3：重新整理網頁來設定使用者腳本"
    	},
    	noinst_ignore_if_ag: {
    		message: "如果您已安裝 AdGuard for Windows，您可以不必安裝這個使用者腳本，此功能已內建於 AdGuard for Windows 。"
    	},
    	noinst_rec: {
    		message: "（推薦）"
    	},
    	please_wait: {
    		message: "正在偵測彈出式視窗封鎖器，請稍候"
    	},
    	noinst_special_prog: {
    		message: "首先，要使用一個使用者腳本您需要特殊的程式或瀏覽器的擴充套件。"
    	},
    	noinst_subtitle: {
    		message: "彈出式視窗封鎖器腳本尚未安裝。請閱讀以下使用說明。"
    	},
    	homepage: {
    		message: "首頁"
    	},
    	noinst_step_1: {
    		message: "步驟 1：安裝使用者腳本管理器"
    	},
    	noinst_step_2: {
    		message: "步驟 2：準備好使用者腳本"
    	},
    	extension_name: {
    		message: "由 AdGuard 提供的彈出式視窗封鎖器"
    	},
    	userscript_name: {
    		message: "AdGuard 彈出式視窗封鎖器",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "封鎖網頁上的彈出式視窗廣告"
    	},
    	on_navigation_by_popunder: {
    		message: "頁面轉跳可能是由彈出式視窗進行的，您要繼續嗎？",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "彈出式視窗封鎖器已阻止網頁內的腳本運作避免網頁被重新導向",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "彈出式視窗封鎖器正在運作"
    	},
    	ext_disabled: {
    		message: "彈出式視窗封鎖器已在 $DOMAIN$ 上停用",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "彈出式視窗封鎖器已在此網域上停用"
    	},
    	settings_saved: {
    		message: "已儲存設定"
    	}
    },
    	"zh-TW": {
    	show_popup: {
    		message: "顯示 %destUrl%"
    	},
    	continue_blocking: {
    		message: "繼續封鎖"
    	},
    	allow_from: {
    		message: "允許在 %origDomain% 的彈出式視窗"
    	},
    	manage_pref: {
    		message: "管理偏好設定…"
    	},
    	popup_text: {
    		message: "AdGuard 已防止此網站開啟 %numPopup% 個彈出式視窗"
    	},
    	options: {
    		message: "選項"
    	},
    	silence_noti: {
    		message: "不要於 %origDomain% 上顯示該訊息"
    	},
    	site_input_ph: {
    		message: "輸入站名"
    	},
    	add_site: {
    		message: "新增一個網站"
    	},
    	add: {
    		message: "新增"
    	},
    	allowed_empty: {
    		message: "已允許的網站之清單為空"
    	},
    	allowed: {
    		message: "已允許的"
    	},
    	silenced_empty: {
    		message: "已靜默的網站之清單為空"
    	},
    	silenced: {
    		message: "已靜默的"
    	},
    	allowed_tooltip: {
    		message: "在這裡被列出的網域，彈出式視窗將被允許。"
    	},
    	silenced_tooltip: {
    		message: "在這裡被列出的網域，關於已封鎖的彈出式視窗之通知將不被顯示。"
    	},
    	installFrom: {
    		message: "從 <a>%name%</a> 安裝"
    	},
    	noinst_step_3: {
    		message: "步驟 3：重新整理此頁面以到達使用者腳本設定"
    	},
    	noinst_ignore_if_ag: {
    		message: "如果您已安裝 AdGuard for Windows，您可忽略該步驟，因為彈出式視窗封鎖器使用者腳本變為已預安裝的。"
    	},
    	noinst_rec: {
    		message: "（被建議的）"
    	},
    	please_wait: {
    		message: "請稍候，正在檢測彈出式視窗封鎖器"
    	},
    	noinst_special_prog: {
    		message: "首先，為使用一個使用者腳本，您需要執行使用者腳本之專門的程式或擴充功能。"
    	},
    	noinst_subtitle: {
    		message: "AdGuard 彈出式視窗封鎖器使用者腳本未被安裝。請查看下面的用法說明。"
    	},
    	homepage: {
    		message: "首頁"
    	},
    	noinst_step_1: {
    		message: "步驟 1：安裝使用者腳本管理器"
    	},
    	noinst_step_2: {
    		message: "步驟 2：使用者腳本"
    	},
    	extension_name: {
    		message: "由 AdGuard 提供之彈出式視窗封鎖器"
    	},
    	userscript_name: {
    		message: "AdGuard 彈出式視窗封鎖器",
    		platform: [
    			"userscript",
    			"userscript_settings"
    		]
    	},
    	extension_description: {
    		message: "封鎖於網頁上之彈出式視窗廣告"
    	},
    	on_navigation_by_popunder: {
    		message: "此至新的頁面之轉換很可能是由一個背彈式視窗引起。您想要繼續嗎？",
    		platform: [
    			"userscript"
    		]
    	},
    	aborted_popunder_execution: {
    		message: "彈出式視窗封鎖器已中止腳本執行以防止背景重新導向",
    		platform: [
    			"userscript"
    		]
    	},
    	ext_enabled: {
    		message: "彈出式視窗封鎖器執勤中"
    	},
    	ext_disabled: {
    		message: "在 $DOMAIN$，彈出式視窗封鎖器被禁用",
    		placeholders: {
    			domain: {
    				content: "$1"
    			}
    		}
    	},
    	ext_disabled_default: {
    		message: "在此網域，彈出式視窗封鎖器被禁用"
    	},
    	settings_saved: {
    		message: "設定被儲存"
    	}
    }
    };

    // TODO get this from twosky.config after Locales type get exported from @adguard/translate
    var BASE_LOCALE = 'en';
    var getLocale = function (locale) {
        if (locale in translations) {
            return locale;
        }
        var dashed = locale.replace('_', '-');
        if (dashed in translations) {
            return dashed;
        }
        var lowercased = locale.toLowerCase();
        if (lowercased in translations) {
            return lowercased;
        }
        var lowercaseddashed = dashed.toLowerCase();
        if (lowercaseddashed in translations) {
            return lowercaseddashed;
        }
        var splitted = lowercaseddashed.split('-')[0];
        if (splitted in translations) {
            return splitted;
        }
        return null;
    };
    var getBaseUILanguage = function () { return BASE_LOCALE; };
    // TODO replace any after export Locales from @adguard/translate
    /**
     * Returns currently selected locale or base locale
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var getUILanguage = function () {
        var language;
        if (window.navigator.languages) {
            // eslint-disable-next-line prefer-destructuring
            language = window.navigator.languages[0];
        }
        else {
            language = window.navigator.language;
        }
        var locale = getLocale(language);
        if (!locale) {
            return getBaseUILanguage();
        }
        return locale;
    };
    var getBaseMessage = function (key) {
        var baseLocale = getBaseUILanguage();
        var localeMessages = translations[baseLocale];
        var message;
        if (localeMessages && key in localeMessages) {
            message = localeMessages[key].message;
        }
        else {
            // eslint-disable-next-line max-len, no-console
            console.error("[AdGuard PopUp Blocker] Couldn't find message by key \"".concat(key, "\" in base locale. Please report support"));
            message = key;
        }
        return message;
    };
    /**
     * Returns message by key
     */
    var getMessage = function (key) {
        var locale = getUILanguage();
        var localeMessages = translations[locale];
        var message;
        if (localeMessages && key in localeMessages) {
            message = localeMessages[key].message;
        }
        else {
            message = getBaseMessage(key);
        }
        return message;
    };
    var i18n = {
        getMessage: getMessage,
        getUILanguage: getUILanguage,
        getBaseMessage: function (key) { return key; },
        getBaseUILanguage: getBaseUILanguage,
    };

    var n,l,u,s=[];function y(l,u,i){var t,r,o,f={};for(o in u)"key"==o?t=u[o]:"ref"==o?r=u[o]:f[o]=u[o];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps)void 0===f[o]&&(f[o]=l.defaultProps[o]);return p(l,f,t,r,null)}function p(n,i,t,r,o){var f={type:n,props:i,key:t,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==o?++u:o};return null==o&&null!=l.vnode&&l.vnode(f),f}n=s.slice,l={__e:function(n,l,u,i){for(var t,r,o;l=l.__;)if((t=l.__c)&&!t.__)try{if((r=t.constructor)&&null!=r.getDerivedStateFromError&&(t.setState(r.getDerivedStateFromError(n)),o=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(n,i||{}),o=t.__d),o)return t.__E=t}catch(l){n=l;}throw n}},u=0,"function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout;

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }

    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }

    var NODE_TYPES;

    (function (NODE_TYPES) {
      NODE_TYPES["PLACEHOLDER"] = "placeholder";
      NODE_TYPES["TEXT"] = "text";
      NODE_TYPES["TAG"] = "tag";
      NODE_TYPES["VOID_TAG"] = "void_tag";
    })(NODE_TYPES || (NODE_TYPES = {}));

    var isTextNode = function isTextNode(node) {
      return node.type === NODE_TYPES.TEXT;
    };
    var isTagNode = function isTagNode(node) {
      return node.type === NODE_TYPES.TAG;
    };
    var isPlaceholderNode = function isPlaceholderNode(node) {
      return node.type === NODE_TYPES.PLACEHOLDER;
    };
    var isVoidTagNode = function isVoidTagNode(node) {
      return node.type === NODE_TYPES.VOID_TAG;
    };
    var placeholderNode = function placeholderNode(value) {
      return {
        type: NODE_TYPES.PLACEHOLDER,
        value: value
      };
    };
    var textNode = function textNode(str) {
      return {
        type: NODE_TYPES.TEXT,
        value: str
      };
    };
    var tagNode = function tagNode(tagName, children) {
      var value = tagName.trim();
      return {
        type: NODE_TYPES.TAG,
        value: value,
        children: children
      };
    };
    var voidTagNode = function voidTagNode(tagName) {
      var value = tagName.trim();
      return {
        type: NODE_TYPES.VOID_TAG,
        value: value
      };
    };
    /**
     * Checks if target is node
     * @param target
     */

    var isNode$1 = function isNode(target) {
      if (typeof target === 'string') {
        return false;
      }

      return !!target.type;
    };

    var STATE;

    (function (STATE) {
      /**
       * Parser function switches to the text state when parses simple text,
       * or content between open and close tags
       */
      STATE["TEXT"] = "text";
      /**
       * Parser function switches to the tag state when meets open tag brace ("<"), and switches back,
       * when meets closing tag brace (">")
       */

      STATE["TAG"] = "tag";
      /**
       * Parser function switches to the placeholder state when meets in the text
       * open placeholders brace ("{") and switches back to the text state,
       * when meets close placeholder brace ("}")
       */

      STATE["PLACEHOLDER"] = "placeholder";
    })(STATE || (STATE = {}));

    var CONTROL_CHARS = {
      TAG_OPEN_BRACE: '<',
      TAG_CLOSE_BRACE: '>',
      CLOSING_TAG_MARK: '/',
      PLACEHOLDER_MARK: '%'
    };
    /**
     * Checks if text length is enough to create text node
     * If text node created, then if stack is not empty it is pushed into stack,
     * otherwise into result
     * @param context
     */

    var createTextNodeIfPossible = function createTextNodeIfPossible(context) {
      var text = context.text;

      if (text.length > 0) {
        var node = textNode(text);

        if (context.stack.length > 0) {
          context.stack.push(node);
        } else {
          context.result.push(node);
        }
      }

      context.text = '';
    };
    /**
     * Checks if lastFromStack tag has any attributes
     * @param lastFromStack
     */


    var hasAttributes = function hasAttributes(lastFromStack) {
      // e.g. "a class" or "a href='#'"
      var tagStrParts = lastFromStack.split(' ');
      return tagStrParts.length > 1;
    };
    /**
     * Handles text state
     */


    var textStateHandler = function textStateHandler(context) {
      var currChar = context.currChar,
          currIdx = context.currIdx; // switches to the tag state

      if (currChar === CONTROL_CHARS.TAG_OPEN_BRACE) {
        context.lastTextStateChangeIdx = currIdx;
        return STATE.TAG;
      } // switches to the placeholder state


      if (currChar === CONTROL_CHARS.PLACEHOLDER_MARK) {
        context.lastTextStateChangeIdx = currIdx;
        return STATE.PLACEHOLDER;
      } // remains in the text state


      context.text += currChar;
      return STATE.TEXT;
    };
    /**
     * Handles placeholder state
     * @param context
     */


    var placeholderStateHandler = function placeholderStateHandler(context) {
      var currChar = context.currChar,
          currIdx = context.currIdx,
          lastTextStateChangeIdx = context.lastTextStateChangeIdx,
          placeholder = context.placeholder,
          stack = context.stack,
          result = context.result,
          str = context.str;

      if (currChar === CONTROL_CHARS.PLACEHOLDER_MARK) {
        // if distance between current index and last state change equal to 1,
        // it means that placeholder mark was escaped by itself e.g. "%%",
        // so we return to the text state
        if (currIdx - lastTextStateChangeIdx === 1) {
          context.text += str.substring(lastTextStateChangeIdx, currIdx);
          return STATE.TEXT;
        }

        createTextNodeIfPossible(context);
        var node = placeholderNode(placeholder); // push node to the appropriate stack

        if (stack.length > 0) {
          stack.push(node);
        } else {
          result.push(node);
        }

        context.placeholder = '';
        return STATE.TEXT;
      }

      context.placeholder += currChar;
      return STATE.PLACEHOLDER;
    };
    /**
     * Switches current state to the tag state and returns tag state handler
     */


    var tagStateHandler = function tagStateHandler(context) {
      var currChar = context.currChar,
          text = context.text,
          stack = context.stack,
          result = context.result,
          lastTextStateChangeIdx = context.lastTextStateChangeIdx,
          currIdx = context.currIdx,
          str = context.str;
      var tag = context.tag; // if found tag end ">"

      if (currChar === CONTROL_CHARS.TAG_CLOSE_BRACE) {
        // if the tag is close tag e.g. </a>
        if (tag.indexOf(CONTROL_CHARS.CLOSING_TAG_MARK) === 0) {
          // remove slash from tag
          tag = tag.substring(1);
          var children = [];

          if (text.length > 0) {
            children.push(textNode(text));
            context.text = '';
          }

          var pairTagFound = false; // looking for the pair to the close tag

          while (!pairTagFound && stack.length > 0) {
            var lastFromStack = stack.pop(); // if tag from stack equal to close tag

            if (lastFromStack === tag) {
              // create tag node
              var node = tagNode(tag, children); // and add it to the appropriate stack

              if (stack.length > 0) {
                stack.push(node);
              } else {
                result.push(node);
              }

              children = [];
              pairTagFound = true;
            } else if (isNode$1(lastFromStack)) {
              // add nodes between close tag and open tag to the children
              children.unshift(lastFromStack);
            } else {
              if (typeof lastFromStack === 'string' && hasAttributes(lastFromStack)) {
                throw new Error("Tags in string should not have attributes: ".concat(str));
              } else {
                throw new Error("String has unbalanced tags: ".concat(str));
              }
            }

            if (stack.length === 0 && children.length > 0) {
              throw new Error("String has unbalanced tags: ".concat(str));
            }
          }

          context.tag = '';
          return STATE.TEXT;
        } // if the tag is void tag e.g. <img/>


        if (tag.lastIndexOf(CONTROL_CHARS.CLOSING_TAG_MARK) === tag.length - 1) {
          tag = tag.substring(0, tag.length - 1);
          createTextNodeIfPossible(context);

          var _node = voidTagNode(tag); // add node to the appropriate stack


          if (stack.length > 0) {
            stack.push(_node);
          } else {
            result.push(_node);
          }

          context.tag = '';
          return STATE.TEXT;
        }

        createTextNodeIfPossible(context);
        stack.push(tag);
        context.tag = '';
        return STATE.TEXT;
      } // If we meet open tag "<" it means that we wrongly moved into tag state


      if (currChar === CONTROL_CHARS.TAG_OPEN_BRACE) {
        context.text += str.substring(lastTextStateChangeIdx, currIdx);
        context.lastTextStateChangeIdx = currIdx;
        context.tag = '';
        return STATE.TAG;
      }

      context.tag += currChar;
      return STATE.TAG;
    };
    /**
     * Parses string into AST (abstract syntax tree) and returns it
     * e.g.
     * parse("String to <a>translate</a>") ->
     * ```
     *      [
     *           { type: 'text', value: 'String to ' },
     *           { type: 'tag', value: 'a', children: [{ type: 'text', value: 'translate' }] }
     *      ];
     * ```
     * Empty string is parsed into empty AST (abstract syntax tree): "[]"
     * If founds unbalanced tags, it throws error about it
     *
     * @param {string} str - message in simplified ICU like syntax without plural support
     */


    var parser = function parser() {
      var _STATE_HANDLERS;

      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var context = {
        /**
         * Stack is used to keep and search nested tag nodes
         */
        stack: [],

        /**
         * Result is stack where function allocates nodes
         */
        result: [],

        /**
         * Current char index
         */
        currIdx: 0,

        /**
         * Saves index of the last state change from the text state,
         * used to restore parsed text if we moved into other state wrongly
         */
        lastTextStateChangeIdx: 0,

        /**
         * Accumulated tag value
         */
        tag: '',

        /**
         * Accumulated text value
         */
        text: '',

        /**
         * Accumulated placeholder value
         */
        placeholder: '',

        /**
         * Parsed string
         */
        str: str
      };
      var STATE_HANDLERS = (_STATE_HANDLERS = {}, _defineProperty(_STATE_HANDLERS, STATE.TEXT, textStateHandler), _defineProperty(_STATE_HANDLERS, STATE.PLACEHOLDER, placeholderStateHandler), _defineProperty(_STATE_HANDLERS, STATE.TAG, tagStateHandler), _STATE_HANDLERS); // Start from text state

      var currentState = STATE.TEXT;

      while (context.currIdx < str.length) {
        context.currChar = str[context.currIdx];
        var currentStateHandler = STATE_HANDLERS[currentState];
        currentState = currentStateHandler(context);
        context.currIdx += 1;
      }

      var result = context.result,
          text = context.text,
          stack = context.stack,
          lastTextStateChangeIdx = context.lastTextStateChangeIdx; // Means that tag or placeholder nodes were not closed, so we consider them as text

      if (currentState !== STATE.TEXT) {
        var restText = str.substring(lastTextStateChangeIdx);

        if ((restText + text).length > 0) {
          result.push(textNode(text + restText));
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (text.length > 0) {
          result.push(textNode(text));
        }
      }

      if (stack.length > 0) {
        throw new Error("String has unbalanced tags: ".concat(context.str));
      }

      return result;
    };

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
    /**
     * Helper functions used by default to assemble strings from tag nodes
     * @param tagName
     * @param children
     */

    var createStringElement = function createStringElement(tagName, children) {
      if (children) {
        return "<".concat(tagName, ">").concat(children, "</").concat(tagName, ">");
      }

      return "<".concat(tagName, "/>");
    };
    /**
     * Creates map with default values for tag converters
     */


    var createDefaultValues = function createDefaultValues() {
      return {
        p: function p(children) {
          return createStringElement('p', children);
        },
        b: function b(children) {
          return createStringElement('b', children);
        },
        strong: function strong(children) {
          return createStringElement('strong', children);
        },
        tt: function tt(children) {
          return createStringElement('tt', children);
        },
        s: function s(children) {
          return createStringElement('s', children);
        },
        i: function i(children) {
          return createStringElement('i', children);
        }
      };
    };
    /**
     * This function accepts an AST (abstract syntax tree) which is a result
     * of the parser function call, and converts tree nodes into array of strings replacing node
     * values with provided values.
     * Values is a map with functions or strings, where each key is related to placeholder value
     * or tag value
     * e.g.
     * string "text <tag>tag text</tag> %placeholder%" is parsed into next AST
     *
     *      [
     *          { type: 'text', value: 'text ' },
     *          {
     *              type: 'tag',
     *              value: 'tag',
     *              children: [{ type: 'text', value: 'tag text' }],
     *          },
     *          { type: 'text', value: ' ' },
     *          { type: 'placeholder', value: 'placeholder' }
     *      ];
     *
     * this AST after format and next values
     *
     *      {
     *          // here used template strings, but it can be react components as well
     *          tag: (chunks) => `<b>${chunks}</b>`,
     *          placeholder: 'placeholder text'
     *      }
     *
     * will return next array
     *
     * [ 'text ', '<b>tag text</b>', ' ', 'placeholder text' ]
     *
     * as you can see, <tag> was replaced by <b>, and placeholder was replaced by placeholder text
     *
     * @param ast - AST (abstract syntax tree)
     * @param values
     */


    var format = function format() {
      var ast = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var result = [];

      var tmplValues = _objectSpread(_objectSpread({}, createDefaultValues()), values);

      var i = 0;

      while (i < ast.length) {
        var currentNode = ast[i]; // if current node is text node, there is nothing to change, append value to the result

        if (isTextNode(currentNode)) {
          result.push(currentNode.value);
        } else if (isTagNode(currentNode)) {
          var children = _toConsumableArray(format(currentNode.children, tmplValues));

          var value = tmplValues[currentNode.value];

          if (value) {
            // TODO consider using strong typing
            if (typeof value === 'function') {
              result.push(value(children.join('')));
            } else {
              result.push(value);
            }
          } else {
            throw new Error("Value ".concat(currentNode.value, " wasn't provided"));
          }
        } else if (isVoidTagNode(currentNode)) {
          var _value = tmplValues[currentNode.value]; // TODO consider using strong typing

          if (_value && typeof _value === 'string') {
            result.push(_value);
          } else {
            throw new Error("Value ".concat(currentNode.value, " wasn't provided"));
          }
        } else if (isPlaceholderNode(currentNode)) {
          var _value2 = tmplValues[currentNode.value]; // TODO consider using strong typing

          if (_value2 && typeof _value2 === 'string') {
            result.push(_value2);
          } else {
            throw new Error("Value ".concat(currentNode.value, " wasn't provided"));
          }
        }

        i += 1;
      }

      return result;
    };
    /**
     * Function gets AST (abstract syntax tree) or string and formats messages,
     * replacing values accordingly
     * e.g.
     *      const message = formatter('<a>some text</a>', {
     *          a: (chunks) => `<a href="#">${chunks}</a>`,
     *      });
     *      console.log(message); // ['<a href="#">some text</a>']
     * @param message
     * @param [values]
     */


    var formatter = function formatter(message, values) {
      var ast = parser(message);
      var preparedValues = {}; // convert values to strings if not a function

      if (values) {
        Object.keys(values).forEach(function (key) {
          var value = values[key]; // TODO consider using strong typing

          if (typeof value === 'function') {
            preparedValues[key] = value;
          } else {
            preparedValues[key] = String(value);
          }
        });
      }

      return format(ast, preparedValues);
    };

    var _pluralFormsCount;

    var AvailableLocales;

    (function (AvailableLocales) {
      AvailableLocales["az"] = "az";
      AvailableLocales["bo"] = "bo";
      AvailableLocales["dz"] = "dz";
      AvailableLocales["id"] = "id";
      AvailableLocales["ja"] = "ja";
      AvailableLocales["jv"] = "jv";
      AvailableLocales["ka"] = "ka";
      AvailableLocales["km"] = "km";
      AvailableLocales["kn"] = "kn";
      AvailableLocales["ko"] = "ko";
      AvailableLocales["ms"] = "ms";
      AvailableLocales["th"] = "th";
      AvailableLocales["tr"] = "tr";
      AvailableLocales["vi"] = "vi";
      AvailableLocales["zh"] = "zh";
      AvailableLocales["zh_cn"] = "zh_cn";
      AvailableLocales["zh_tw"] = "zh_tw";
      AvailableLocales["af"] = "af";
      AvailableLocales["bn"] = "bn";
      AvailableLocales["bg"] = "bg";
      AvailableLocales["ca"] = "ca";
      AvailableLocales["da"] = "da";
      AvailableLocales["de"] = "de";
      AvailableLocales["el"] = "el";
      AvailableLocales["en"] = "en";
      AvailableLocales["eo"] = "eo";
      AvailableLocales["es"] = "es";
      AvailableLocales["et"] = "et";
      AvailableLocales["eu"] = "eu";
      AvailableLocales["fa"] = "fa";
      AvailableLocales["fi"] = "fi";
      AvailableLocales["fo"] = "fo";
      AvailableLocales["fur"] = "fur";
      AvailableLocales["fy"] = "fy";
      AvailableLocales["gl"] = "gl";
      AvailableLocales["gu"] = "gu";
      AvailableLocales["ha"] = "ha";
      AvailableLocales["he"] = "he";
      AvailableLocales["hu"] = "hu";
      AvailableLocales["is"] = "is";
      AvailableLocales["it"] = "it";
      AvailableLocales["ku"] = "ku";
      AvailableLocales["lb"] = "lb";
      AvailableLocales["ml"] = "ml";
      AvailableLocales["mn"] = "mn";
      AvailableLocales["mr"] = "mr";
      AvailableLocales["nah"] = "nah";
      AvailableLocales["nb"] = "nb";
      AvailableLocales["ne"] = "ne";
      AvailableLocales["nl"] = "nl";
      AvailableLocales["nn"] = "nn";
      AvailableLocales["no"] = "no";
      AvailableLocales["oc"] = "oc";
      AvailableLocales["om"] = "om";
      AvailableLocales["or"] = "or";
      AvailableLocales["pa"] = "pa";
      AvailableLocales["pap"] = "pap";
      AvailableLocales["ps"] = "ps";
      AvailableLocales["pt"] = "pt";
      AvailableLocales["pt_pt"] = "pt_pt";
      AvailableLocales["pt_br"] = "pt_br";
      AvailableLocales["so"] = "so";
      AvailableLocales["sq"] = "sq";
      AvailableLocales["sv"] = "sv";
      AvailableLocales["sw"] = "sw";
      AvailableLocales["ta"] = "ta";
      AvailableLocales["te"] = "te";
      AvailableLocales["tk"] = "tk";
      AvailableLocales["ur"] = "ur";
      AvailableLocales["zu"] = "zu";
      AvailableLocales["am"] = "am";
      AvailableLocales["bh"] = "bh";
      AvailableLocales["fil"] = "fil";
      AvailableLocales["fr"] = "fr";
      AvailableLocales["gun"] = "gun";
      AvailableLocales["hi"] = "hi";
      AvailableLocales["hy"] = "hy";
      AvailableLocales["ln"] = "ln";
      AvailableLocales["mg"] = "mg";
      AvailableLocales["nso"] = "nso";
      AvailableLocales["xbr"] = "xbr";
      AvailableLocales["ti"] = "ti";
      AvailableLocales["wa"] = "wa";
      AvailableLocales["be"] = "be";
      AvailableLocales["bs"] = "bs";
      AvailableLocales["hr"] = "hr";
      AvailableLocales["ru"] = "ru";
      AvailableLocales["sr"] = "sr";
      AvailableLocales["uk"] = "uk";
      AvailableLocales["cs"] = "cs";
      AvailableLocales["sk"] = "sk";
      AvailableLocales["ga"] = "ga";
      AvailableLocales["lt"] = "lt";
      AvailableLocales["sl"] = "sl";
      AvailableLocales["mk"] = "mk";
      AvailableLocales["mt"] = "mt";
      AvailableLocales["lv"] = "lv";
      AvailableLocales["pl"] = "pl";
      AvailableLocales["cy"] = "cy";
      AvailableLocales["ro"] = "ro";
      AvailableLocales["ar"] = "ar";
    })(AvailableLocales || (AvailableLocales = {}));

    var getPluralFormId = function getPluralFormId(locale, number) {
      var _supportedForms;

      if (number === 0) {
        return 0;
      }

      var slavNum = number % 10 === 1 && number % 100 !== 11 ? 1 : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20) ? 2 : 3;
      var supportedForms = (_supportedForms = {}, _defineProperty(_supportedForms, AvailableLocales.az, 1), _defineProperty(_supportedForms, AvailableLocales.bo, 1), _defineProperty(_supportedForms, AvailableLocales.dz, 1), _defineProperty(_supportedForms, AvailableLocales.id, 1), _defineProperty(_supportedForms, AvailableLocales.ja, 1), _defineProperty(_supportedForms, AvailableLocales.jv, 1), _defineProperty(_supportedForms, AvailableLocales.ka, 1), _defineProperty(_supportedForms, AvailableLocales.km, 1), _defineProperty(_supportedForms, AvailableLocales.kn, 1), _defineProperty(_supportedForms, AvailableLocales.ko, 1), _defineProperty(_supportedForms, AvailableLocales.ms, 1), _defineProperty(_supportedForms, AvailableLocales.th, 1), _defineProperty(_supportedForms, AvailableLocales.tr, 1), _defineProperty(_supportedForms, AvailableLocales.vi, 1), _defineProperty(_supportedForms, AvailableLocales.zh, 1), _defineProperty(_supportedForms, AvailableLocales.zh_tw, 1), _defineProperty(_supportedForms, AvailableLocales.zh_cn, 1), _defineProperty(_supportedForms, AvailableLocales.af, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.bn, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.bg, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ca, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.da, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.de, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.el, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.en, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.eo, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.es, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.et, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.eu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.fa, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.fi, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.fo, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.fur, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.fy, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.gl, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.gu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ha, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.he, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.hu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.is, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.it, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ku, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.lb, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ml, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.mn, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.mr, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.nah, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.nb, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ne, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.nl, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.nn, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.no, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.oc, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.om, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.or, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pa, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pap, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ps, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pt, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pt_pt, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pt_br, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.so, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.sq, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.sv, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.sw, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ta, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.te, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.tk, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ur, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.zu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.am, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.bh, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.fil, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.fr, number === 0 || number >= 2 ? 2 : 1), _defineProperty(_supportedForms, AvailableLocales.gun, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.hi, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.hy, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.ln, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.mg, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.nso, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.xbr, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.ti, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.wa, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.be, slavNum), _defineProperty(_supportedForms, AvailableLocales.bs, slavNum), _defineProperty(_supportedForms, AvailableLocales.hr, slavNum), _defineProperty(_supportedForms, AvailableLocales.ru, slavNum), _defineProperty(_supportedForms, AvailableLocales.sr, slavNum), _defineProperty(_supportedForms, AvailableLocales.uk, slavNum), _defineProperty(_supportedForms, AvailableLocales.cs, number === 1 ? 1 : number >= 2 && number <= 4 ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.sk, number === 1 ? 1 : number >= 2 && number <= 4 ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.ga, number === 1 ? 1 : number === 2 ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.lt, number % 10 === 1 && number % 100 !== 11 ? 1 : number % 10 >= 2 && (number % 100 < 10 || number % 100 >= 20) ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.sl, number % 100 === 1 ? 1 : number % 100 === 2 ? 2 : number % 100 === 3 || number % 100 === 4 ? 3 : 4), _defineProperty(_supportedForms, AvailableLocales.mk, number % 10 === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.mt, number === 1 ? 1 : number === 0 || number % 100 > 1 && number % 100 < 11 ? 2 : number % 100 > 10 && number % 100 < 20 ? 3 : 4), _defineProperty(_supportedForms, AvailableLocales.lv, number === 0 ? 0 : number % 10 === 1 && number % 100 !== 11 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pl, number === 1 ? 1 : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 12 || number % 100 > 14) ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.cy, number === 1 ? 0 : number === 2 ? 1 : number === 8 || number === 11 ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.ro, number === 1 ? 1 : number === 1 || number % 100 > 0 && number % 100 < 20 ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.ar, number === 0 ? 0 : number === 1 ? 1 : number === 2 ? 2 : number % 100 >= 3 && number % 100 <= 10 ? 3 : number % 100 >= 11 && number % 100 <= 99 ? 4 : 5), _supportedForms);
      return supportedForms[locale];
    };

    var pluralFormsCount = (_pluralFormsCount = {}, _defineProperty(_pluralFormsCount, AvailableLocales.az, 2), _defineProperty(_pluralFormsCount, AvailableLocales.bo, 2), _defineProperty(_pluralFormsCount, AvailableLocales.dz, 2), _defineProperty(_pluralFormsCount, AvailableLocales.id, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ja, 2), _defineProperty(_pluralFormsCount, AvailableLocales.jv, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ka, 2), _defineProperty(_pluralFormsCount, AvailableLocales.km, 2), _defineProperty(_pluralFormsCount, AvailableLocales.kn, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ko, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ms, 2), _defineProperty(_pluralFormsCount, AvailableLocales.th, 2), _defineProperty(_pluralFormsCount, AvailableLocales.tr, 2), _defineProperty(_pluralFormsCount, AvailableLocales.vi, 2), _defineProperty(_pluralFormsCount, AvailableLocales.zh, 2), _defineProperty(_pluralFormsCount, AvailableLocales.zh_cn, 2), _defineProperty(_pluralFormsCount, AvailableLocales.zh_tw, 2), _defineProperty(_pluralFormsCount, AvailableLocales.af, 3), _defineProperty(_pluralFormsCount, AvailableLocales.bn, 3), _defineProperty(_pluralFormsCount, AvailableLocales.bg, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ca, 3), _defineProperty(_pluralFormsCount, AvailableLocales.da, 3), _defineProperty(_pluralFormsCount, AvailableLocales.de, 3), _defineProperty(_pluralFormsCount, AvailableLocales.el, 3), _defineProperty(_pluralFormsCount, AvailableLocales.en, 3), _defineProperty(_pluralFormsCount, AvailableLocales.eo, 3), _defineProperty(_pluralFormsCount, AvailableLocales.es, 3), _defineProperty(_pluralFormsCount, AvailableLocales.et, 3), _defineProperty(_pluralFormsCount, AvailableLocales.eu, 3), _defineProperty(_pluralFormsCount, AvailableLocales.fa, 3), _defineProperty(_pluralFormsCount, AvailableLocales.fi, 3), _defineProperty(_pluralFormsCount, AvailableLocales.fo, 3), _defineProperty(_pluralFormsCount, AvailableLocales.fur, 3), _defineProperty(_pluralFormsCount, AvailableLocales.fy, 3), _defineProperty(_pluralFormsCount, AvailableLocales.gl, 3), _defineProperty(_pluralFormsCount, AvailableLocales.gu, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ha, 3), _defineProperty(_pluralFormsCount, AvailableLocales.he, 3), _defineProperty(_pluralFormsCount, AvailableLocales.hu, 3), _defineProperty(_pluralFormsCount, AvailableLocales.is, 3), _defineProperty(_pluralFormsCount, AvailableLocales.it, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ku, 3), _defineProperty(_pluralFormsCount, AvailableLocales.lb, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ml, 3), _defineProperty(_pluralFormsCount, AvailableLocales.mn, 3), _defineProperty(_pluralFormsCount, AvailableLocales.mr, 3), _defineProperty(_pluralFormsCount, AvailableLocales.nah, 3), _defineProperty(_pluralFormsCount, AvailableLocales.nb, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ne, 3), _defineProperty(_pluralFormsCount, AvailableLocales.nl, 3), _defineProperty(_pluralFormsCount, AvailableLocales.nn, 3), _defineProperty(_pluralFormsCount, AvailableLocales.no, 3), _defineProperty(_pluralFormsCount, AvailableLocales.oc, 3), _defineProperty(_pluralFormsCount, AvailableLocales.om, 3), _defineProperty(_pluralFormsCount, AvailableLocales.or, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pa, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pap, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ps, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pt, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pt_pt, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pt_br, 3), _defineProperty(_pluralFormsCount, AvailableLocales.so, 3), _defineProperty(_pluralFormsCount, AvailableLocales.sq, 3), _defineProperty(_pluralFormsCount, AvailableLocales.sv, 3), _defineProperty(_pluralFormsCount, AvailableLocales.sw, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ta, 3), _defineProperty(_pluralFormsCount, AvailableLocales.te, 3), _defineProperty(_pluralFormsCount, AvailableLocales.tk, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ur, 3), _defineProperty(_pluralFormsCount, AvailableLocales.zu, 3), _defineProperty(_pluralFormsCount, AvailableLocales.am, 2), _defineProperty(_pluralFormsCount, AvailableLocales.bh, 2), _defineProperty(_pluralFormsCount, AvailableLocales.fil, 2), _defineProperty(_pluralFormsCount, AvailableLocales.fr, 3), _defineProperty(_pluralFormsCount, AvailableLocales.gun, 2), _defineProperty(_pluralFormsCount, AvailableLocales.hi, 2), _defineProperty(_pluralFormsCount, AvailableLocales.hy, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ln, 2), _defineProperty(_pluralFormsCount, AvailableLocales.mg, 2), _defineProperty(_pluralFormsCount, AvailableLocales.nso, 2), _defineProperty(_pluralFormsCount, AvailableLocales.xbr, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ti, 2), _defineProperty(_pluralFormsCount, AvailableLocales.wa, 2), _defineProperty(_pluralFormsCount, AvailableLocales.be, 4), _defineProperty(_pluralFormsCount, AvailableLocales.bs, 4), _defineProperty(_pluralFormsCount, AvailableLocales.hr, 4), _defineProperty(_pluralFormsCount, AvailableLocales.ru, 4), _defineProperty(_pluralFormsCount, AvailableLocales.sr, 4), _defineProperty(_pluralFormsCount, AvailableLocales.uk, 4), _defineProperty(_pluralFormsCount, AvailableLocales.cs, 4), _defineProperty(_pluralFormsCount, AvailableLocales.sk, 4), _defineProperty(_pluralFormsCount, AvailableLocales.ga, 4), _defineProperty(_pluralFormsCount, AvailableLocales.lt, 4), _defineProperty(_pluralFormsCount, AvailableLocales.sl, 5), _defineProperty(_pluralFormsCount, AvailableLocales.mk, 3), _defineProperty(_pluralFormsCount, AvailableLocales.mt, 5), _defineProperty(_pluralFormsCount, AvailableLocales.lv, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pl, 4), _defineProperty(_pluralFormsCount, AvailableLocales.cy, 4), _defineProperty(_pluralFormsCount, AvailableLocales.ro, 4), _defineProperty(_pluralFormsCount, AvailableLocales.ar, 6), _pluralFormsCount);
    var PLURAL_STRING_DELIMITER = '|';

    var checkForms = function checkForms(str, locale, key) {
      var forms = str.split(PLURAL_STRING_DELIMITER);

      if (forms.length !== pluralFormsCount[locale]) {
        throw new Error("Invalid plural string \"".concat(key, "\" for locale ").concat(locale, ": ").concat(forms.length, " given; need: ").concat(pluralFormsCount[locale]));
      }
    };
    /**
     * Returns plural form corresponding to number
     * @param str
     * @param number
     * @param locale - current locale
     * @param key - message key
     */

    var getForm = function getForm(str, number, locale, key) {
      checkForms(str, locale, key);
      var forms = str.split(PLURAL_STRING_DELIMITER);
      var currentForm = getPluralFormId(locale, number);
      return forms[currentForm].trim();
    };

    function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    var defaultMessageConstructor = function defaultMessageConstructor(formatted) {
      return formatted.join('');
    };

    var Translator = /*#__PURE__*/function () {
      function Translator(i18n, messageConstructor, values) {
        _classCallCheck(this, Translator);

        this.i18n = i18n;
        this.messageConstructor = messageConstructor || defaultMessageConstructor;
        this.values = values || {};
      }
      /**
       * Retrieves message and translates it, substituting parameters where necessary
       * @param key - translation message key
       * @param params - values used to substitute placeholders and tags
       */


      _createClass(Translator, [{
        key: "getMessage",
        value: function getMessage(key) {
          var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var message = this.i18n.getMessage(key);

          if (!message) {
            message = this.i18n.getBaseMessage(key);

            if (!message) {
              throw new Error("Was unable to find message for key: \"".concat(key, "\""));
            }
          }

          var formatted = formatter(message, _objectSpread$1(_objectSpread$1({}, this.values), params));
          return this.messageConstructor(formatted);
        }
        /**
         * Retrieves correct plural form and translates it
         * @param key - translation message key
         * @param number - plural form number
         * @param params - values used to substitute placeholders or tags if necessary,
         * if params has "count" property it will be overridden by number (plural form number)
         */

      }, {
        key: "getPlural",
        value: function getPlural(key, number) {
          var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var message = this.i18n.getMessage(key);
          var language = this.i18n.getUILanguage();

          if (!message) {
            message = this.i18n.getBaseMessage(key);

            if (!message) {
              throw new Error("Was unable to find message for key: \"".concat(key, "\""));
            }

            language = this.i18n.getBaseUILanguage();
          }

          var form = getForm(message, number, language, key);
          var formatted = formatter(form, _objectSpread$1(_objectSpread$1(_objectSpread$1({}, this.values), params), {}, {
            count: number
          }));
          return this.messageConstructor(formatted);
        }
      }]);

      return Translator;
    }();

    function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
    /**
     * Creates translation function for strings used in the React components
     * We do not import React directly, because translator module can be used
     * in the modules without React too
     *
     * e.g.
     * const translateReact = createReactTranslator(getMessage, React);
     * in locales folder you should have messages.json file
     * ```
     * message:
     *     "popup_auth_agreement_consent": {
     *          "message": "You agree to our <eula>EULA</eula>",
     *      },
     * ```
     *
     * this message can be retrieved and translated into react components next way:
     *
     * const component = translateReact('popup_auth_agreement_consent', {
     *          eula: (chunks) => (
     *              <button
     *                  className="auth__privacy-link"
     *                  onClick={handleEulaClick}
     *              >
     *                  {chunks}
     *              </button>
     *          ),
     *       });
     *
     * Note how functions in the values argument can be used with handlers
     *
     * @param i18n - object with methods which get translated message by key and return current locale
     * @param React - instance of react library
     */

    var createReactTranslator = function createReactTranslator(i18n, react, defaults) {
      /**
       * Helps to build nodes without values
       *
       * @param tagName
       * @param children
       */
      var createReactElement = function createReactElement(tagName, children) {
        if (children) {
          return react.createElement(tagName, null, react.Children.toArray(children));
        }

        return react.createElement(tagName, null);
      };
      /**
       * Function creates default values to be used if user didn't provide function values for tags
       */


      var createDefaultValues = function createDefaultValues() {
        var externalDefaults = {};

        if (defaults) {
          defaults.tags.forEach(function (t) {
            externalDefaults[t.key] = function (children) {
              return createReactElement(t.createdTag, children);
            };
          });
        }

        if (defaults !== null && defaults !== void 0 && defaults.override) {
          return externalDefaults;
        }

        return _objectSpread$2({
          p: function p(children) {
            return createReactElement('p', children);
          },
          b: function b(children) {
            return createReactElement('b', children);
          },
          strong: function strong(children) {
            return createReactElement('strong', children);
          },
          tt: function tt(children) {
            return createReactElement('tt', children);
          },
          s: function s(children) {
            return createReactElement('s', children);
          },
          i: function i(children) {
            return createReactElement('i', children);
          }
        }, externalDefaults);
      };

      var reactMessageConstructor = function reactMessageConstructor(formatted) {
        var reactChildren = react.Children.toArray(formatted); // if there is only strings in the array we join them

        if (reactChildren.every(function (child) {
          return typeof child === 'string';
        })) {
          return reactChildren.join('');
        }

        return reactChildren;
      };

      var defaultValues = createDefaultValues();
      return new Translator(i18n, reactMessageConstructor, defaultValues);
    };

    function A(n, l) {
      return l = l || [], null == n || "boolean" == typeof n || (Array.isArray(n) ? n.some(function (n) {
        A(n, l);
      }) : l.push(n)), l;
    }

    "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;

    function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
    /**
     * Creates translation function for strings used in the Preact components
     * We do not import Preact directly, because translator module can be used
     * in the modules without Preact too
     *
     * e.g.
     * const translatePreact = createPreactTranslator(getMessage, Preact);
     * in locales folder you should have messages.json file
     * ```
     * message:
     *     "popup_auth_agreement_consent": {
     *          "message": "You agree to our <eula>EULA</eula>",
     *      },
     * ```
     *
     * this message can be retrieved and translated into preact components next way:
     *
     * const component = translatePreact('popup_auth_agreement_consent', {
     *          eula: (chunks) => (
     *              <button
     *                  className="auth__privacy-link"
     *                  onClick={handleEulaClick}
     *              >
     *                  {chunks}
     *              </button>
     *          ),
     *       });
     *
     * Note how functions in the values argument can be used with handlers
     *
     * @param i18n - object with methods which get translated message by key and return current locale
     * @param Preact - instance of preact library
     */

    var createPreactTranslator = function createPreactTranslator(i18n, preact, defaults) {
      /**
       * Helps to build nodes without values
       *
       * @param tagName
       * @param children
       */
      var createPreactElement = function createPreactElement(tagName, children) {
        if (children) {
          return preact.createElement(tagName, null, A(children));
        }

        return preact.createElement(tagName, null);
      };
      /**
       * Function creates default values to be used if user didn't provide function values for tags
       */


      var createDefaultValues = function createDefaultValues() {
        var externalDefaults = {};

        if (defaults) {
          defaults.tags.forEach(function (t) {
            externalDefaults[t.key] = function (children) {
              return createPreactElement(t.createdTag, children);
            };
          });
        }

        if (defaults !== null && defaults !== void 0 && defaults.override) {
          return externalDefaults;
        }

        return _objectSpread$3({
          p: function p(children) {
            return createPreactElement('p', children);
          },
          b: function b(children) {
            return createPreactElement('b', children);
          },
          strong: function strong(children) {
            return createPreactElement('strong', children);
          },
          tt: function tt(children) {
            return createPreactElement('tt', children);
          },
          s: function s(children) {
            return createPreactElement('s', children);
          },
          i: function i(children) {
            return createPreactElement('i', children);
          }
        }, externalDefaults);
      };

      var preactMessageConstructor = function preactMessageConstructor(formatted) {
        var preactChildren = A(formatted); // if there is only strings in the array we join them

        if (preactChildren.every(function (child) {
          return typeof child === 'string';
        })) {
          return preactChildren.join('');
        }

        return preactChildren;
      };

      var defaultValues = createDefaultValues();
      return new Translator(i18n, preactMessageConstructor, defaultValues);
    };

    /**
     * Creates translator instance strings, by default for simple strings
     * @param i18n - function which returns translated message by key
     * @param messageConstructor - function that will collect messages
     * @param values - map with default values for tag converters
     */

    var createTranslator = function createTranslator(i18n, messageConstructor, values) {
      return new Translator(i18n, messageConstructor, values);
    };

    var translate = {
      createTranslator: createTranslator,
      createReactTranslator: createReactTranslator,
      createPreactTranslator: createPreactTranslator
    };

    /**
     * Retrieves localized messages by key, formats and converts into react components or string
     */
    translate.createPreactTranslator(i18n, {
        createElement: y,
    });

    /**
     * Retrieves localized messages by key, formats and converts into react components or string
     */
    var translator = translate.createTranslator(i18n);

    /**
     * @fileoverview There are some unfortunate cases where throwing inside a script is necessary
     * for seamless user experience. When a popunder script tries to replicate a window to a popup
     * and navigate the window to some ads landing page, it usually uses methods of `location` object
     * and we cannot add a layer of check on those methods (they are all non-configurable).
     * See https://github.com/AdguardTeam/PopupBlocker/issues/14, nothing prevent from popunder scripts
     * using it at any time. Currently, the only reliable way is to abort script execution on an attempt
     * to open a popup window which must happen before calling `location` methods.
     * To do so, during popup detection, we additionaly checks if the target of the popup is identical
     * to the current window or `href` attribute of a clicked anchor, and triggers aborting in such cases.
     */
    var externalErrorId;
    function abort() {
        log.closeAllGroup();
        externalErrorId = Math.random().toString(36).substr(7);
        // eslint-disable-next-line no-console
        console.warn(translator.getMessage('aborted_popunder_execution'));
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw new ProxyServiceExternalError(externalErrorId);
    }

    // @ts-ignore
    var matches = Element.prototype.matches || Element.prototype.msMatchesSelector;
    var closest = 'closest' in Element.prototype
        ? function (el, selector) { return el.closest(selector); } : function (el, selector) {
        while (el) {
            if (matches.call(el, selector)) {
                return el;
            }
            // eslint-disable-next-line no-param-reassign
            el = el.parentElement;
        }
        return null;
    };
    /**
     * This serves as an allowlist on various checks where we block re-triggering of events.
     * See dom/dispatchEvent.ts.
     */
    function targetsAreChainable(prev, next) {
        if (prev.nodeType === 3 /* Node.TEXT_NODE */) {
            // Based on observation that certain libraries re-triggers
            // an event on text nodes on its parent due to iOS quirks.
            // eslint-disable-next-line no-param-reassign
            prev = prev.parentNode;
        }
        return prev === next;
    }
    var getTagName = function (el) { return el.nodeName.toUpperCase(); };
    /**
     * Detects about:blank, about:srcdoc urls.
     */
    var ABOUT_PROTOCOL = 'about:';
    var reEmptyUrl = new RegExp("^".concat(ABOUT_PROTOCOL));
    var isEmptyUrl = function (url) { return reEmptyUrl.test(url); };
    var frameElementDesc = Object.getOwnPropertyDescriptor(window, 'frameElement')
        || Object.getOwnPropertyDescriptor(Window.prototype, 'frameElement');
    frameElementDesc.get;

    /**
     * @fileoverview Utility functions for instanceof checks against DOM classes. Used for type casting.
     * Since it is common for us to cross the border of browsing contexts, instanceof
     * check for DOM element is not reliable.
     */
    function isMouseEvent(event) {
        return 'clientX' in event;
    }
    function isTouchEvent(event) {
        return 'touches' in event;
    }
    /**/
    function isNode(el) {
        return 'nodeName' in el;
    }
    function isElement(el) {
        return 'id' in el;
    }
    function isHTMLElement(el) {
        return 'style' in el;
    }
    /**/
    var toString = Object.prototype.toString;
    function isWindow(el) {
        return toString.call(el) === '[object Window]';
    }
    function isLocation(el) {
        return toString.call(el) === '[object Location]';
    }
    /**/
    function isUndef(obj) {
        return typeof obj === 'undefined';
    }
    /**/
    function isClickEvent(evt) {
        var type = evt.type;
        return type === 'click' || type === 'mousedown' || type === 'mouseup';
    }

    /* eslint-disable prefer-destructuring */
    var defineProperty$1 = Object.defineProperty;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    /* eslint-enable prefer-destructuring */
    var objectKeys = Object.keys;
    var functionApply = Function.prototype.apply;
    var functionCall = Function.prototype.call;
    var functionBind = Function.prototype.bind;
    var functionToString = Function.prototype.toString;
    var ProxyCtor = window.Proxy;
    // Conditional export workaround for tsickle
    var reflectNamespace = {};
    if (ProxyCtor) {
        reflectNamespace.reflectGetOwnProperty = Reflect.getOwnPropertyDescriptor;
        reflectNamespace.reflectDefineProperty = Reflect.defineProperty;
        reflectNamespace.reflectGet = Reflect.get;
        reflectNamespace.reflectSet = Reflect.set;
        reflectNamespace.reflectDeleteProperty = Reflect.deleteProperty;
        reflectNamespace.reflectOwnKeys = Reflect.ownKeys;
        reflectNamespace.reflectApply = Reflect.apply;
    }
    window.setTimeout.bind(window);
    getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
    getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentDocument').get;
    getOwnPropertyDescriptor(MessageEvent.prototype, 'source').get;
    var captureStackTrace = Error.captureStackTrace;

    var crypto = window.crypto || window.msCrypto;
    var getRandomStr = crypto ? function () {
        var buffer = new Uint8Array(24);
        crypto.getRandomValues(buffer);
        return window.btoa(String.fromCharCode.apply(null, buffer));
    } : (function () {
        var counter = Date.now() % 1e9;
        // eslint-disable-next-line no-plusplus
        return function () { return "".concat(Math.floor(Math.random() * 1000000000)).concat(counter++); };
    })();

    var reCommonProtocol = /^http/;
    /**
     * There are certain browser quirks regarding how they treat non-string values
     * provided as arguments of `window.open`, and we can't rely on third-party scripts
     * playing nicely with it.
     * undefined --> 'about:blank'
     * null --> 'about:blank', except for Firefox, in which it is converted to 'null'.
     * false --> 'about:blank', except for Edge, in which it is converted to 'false'.
     * These behaviors are different from how anchor tag's href attributes behaves with non-string values.
     */
    var convertToString = function (href) {
        if (typeof href !== 'string') {
            if (href instanceof Object) {
                // eslint-disable-next-line no-param-reassign
                href = String(href);
            }
            else {
                // eslint-disable-next-line no-param-reassign
                href = '';
            }
        }
        return href;
    };
    /**
     * Creates an object that implements properties of Location api.
     * It resolves the provided href within a context of a current browsing context.
     */
    var createLocation = function (href) {
        var anchor = document.createElement('a');
        anchor.href = href;
        // https://gist.github.com/disnet/289f113e368f1bfb06f3
        if (anchor.host === '') {
            // eslint-disable-next-line no-self-assign
            anchor.href = anchor.href;
        }
        return anchor;
    };
    /**
     * Parses a url and returns 3 strings.
     * The first string is a `displayUrl`, which will be used to show as
     * a shortened url. The second string is a `canonicalUrl`, which is used to match against allowlist data in gmWrapper.
     * The third string is a full absolute url.
     */
    var createUrl = function (href) {
        // eslint-disable-next-line no-param-reassign
        href = convertToString(href);
        var location = createLocation(href);
        var displayUrl;
        var canonicalUrl;
        var protocol = location.protocol;
        if (reCommonProtocol.test(protocol)) {
            displayUrl = location.href.slice(protocol.length + 2);
            canonicalUrl = location.hostname;
        }
        else {
            displayUrl = href;
            var i = href.indexOf(',');
            canonicalUrl = i === -1 ? href : href.slice(0, i);
        }
        return [displayUrl, canonicalUrl, location.href];
    };

    /**
     * A polyfill for the WeakMap that covers only the most basic usage.
     * Originally based on {@link https://github.com/Polymer/WeakMap}
     */
    var counter = Date.now() % 1e9;
    var defineProperty = Object.defineProperty;
    var WeakMapPolyfill = /** @class */ (function () {
        function WeakMapPolyfill() {
            this.$name = "__st".concat(Math.floor(Math.random() * 1000000000)).concat(counter += 1, "__");
        }
        WeakMapPolyfill.prototype.set = function (key, value) {
            var entry = key[this.$name];
            if (entry && entry[0] === key)
                entry[1] = value;
            else
                defineProperty(key, this.$name, { value: [key, value], writable: true });
            return this;
        };
        WeakMapPolyfill.prototype.get = function (key) {
            var entry = key[this.$name];
            return entry[0] === key ? entry[1] : undefined;
        };
        WeakMapPolyfill.prototype.delete = function (key) {
            var entry = key[this.$name];
            if (!entry)
                return false;
            var hasValue = entry[0] === key;
            entry[0] = entry[1] = undefined;
            return hasValue;
        };
        WeakMapPolyfill.prototype.has = function (key) {
            var entry = key[this.$name];
            if (!entry)
                return false;
            return entry[0] === key;
        };
        return WeakMapPolyfill;
    }());
    var nativeWeakMapSupport = typeof WeakMap === 'function';
    /**
     * Firefox has a buggy WeakMap implementation as of 58. It won't accept
     * certain objects which are relatively recently added to the engine.
     * {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1391116}
     * {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1351501}
     * A similar error prevents using `AudioBuffer` as a key.
     */
    !nativeWeakMapSupport ? false : (function () {
        if (typeof DOMPoint !== 'function') {
            return false;
        }
        var key = new DOMPoint();
        var weakmap = new WeakMap();
        try {
            weakmap.set(key, undefined); // Firefox 58 throws here.
            return false;
        }
        catch (e) {
            log.print('Buggy WeakMap support');
            return true;
        }
    }());
    var SafeWeakMap = nativeWeakMapSupport ? WeakMap : WeakMapPolyfill;

    var CurrentMouseEvent = /** @class */ (function () {
        function CurrentMouseEvent() {
            var mousedownQueue = [];
            var mouseupQueue = [];
            var clickQueue = [];
            var removeFromQueue = function (array, el) {
                var i = array.indexOf(el);
                if (i !== -1) {
                    array.splice(i, 1);
                }
            };
            var captureListener = function (queue) { return function (evt) {
                queue.push(evt);
                /**
                     * Schedules dequeueing in next task. It will be executed once all event handlers
                     * for the current event fires up. Note that task queue is flushed between the end of
                     * `mousedown` event handlers and the start of `mouseup` event handlers, but may not between
                     * the end of `mouseup` and `click` depending on browsers.
                     */
                setTimeout(removeFromQueue.bind(null, queue, evt));
            }; };
            window.addEventListener('mousedown', captureListener(mousedownQueue), true);
            window.addEventListener('mouseup', captureListener(mouseupQueue), true);
            window.addEventListener('click', captureListener(clickQueue), true);
            /**
             * Some events in event queues may have been finished firing event handlers,
             * either by bubbling up to `window` or by `Event#(stopPropagation,stopImmediatePropagation)`
             * or by `Event#cancelBubble`. Such events will satisfy `.currentTarget === null`. We skip
             * such events.
             */
            var getLatest = function (queue) {
                var l = queue.length;
                var evt;
                while (!evt || !evt.currentTarget) {
                    if (l === 0) {
                        return undefined;
                    }
                    // eslint-disable-next-line no-plusplus
                    evt = queue[--l];
                }
                return evt;
            };
            /**
             * When there are latest events of different types,
             * we choose the latest one.
             */
            var compareTimestamp = function (a, b) {
                if (!a) {
                    return 1;
                }
                if (!b) {
                    return -1;
                }
                return b.timeStamp - a.timeStamp;
            };
            this.getCurrentMouseEvent = function () {
                log.call('getCurrentClickEvent');
                var md = getLatest(mousedownQueue);
                var mu = getLatest(mouseupQueue);
                var cl = getLatest(clickQueue);
                var evt = [cl, md, mu].sort(compareTimestamp)[0];
                log.print('Retrieved event is: ', evt);
                log.callEnd();
                return evt;
            };
        }
        return CurrentMouseEvent;
    }());

    /* eslint-disable no-bitwise */
    /**
     * Detects a common stacking context root pattern.
     * Stacking context root: https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
     * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
     */
    function isArtificialStackingContextRoot(el) {
        var _a = getComputedStyle(el), zIndex = _a.zIndex, position = _a.position, opacity = _a.opacity;
        if ((position !== 'static' && zIndex !== 'auto')
            || parseFloat(opacity) < 1) {
            if (parseInt(zIndex, 10) > 1000) {
                return true;
            }
        }
        return false;
    }
    function numsAreClose(x, y, threshold) {
        return (((x - y) / threshold) | 0) === 0;
    }
    /**
     * @param w view.innerWidth
     * @param h view.innerHeight
     */
    function rectAlmostCoversView(rect, w, h) {
        var left = rect.left, right = rect.right, top = rect.top, bottom = rect.bottom;
        return numsAreClose(left, 0, w >> 4)
            && numsAreClose(right, w, w >> 4)
            && numsAreClose(top, 0, h >> 4)
            && numsAreClose(bottom, h, h >> 4);
    }
    var eventTargetIsRootNode = function (el) {
        if (isWindow(el)) {
            return true;
        }
        if (isNode(el)) {
            var name_1 = getTagName(el);
            // Technically, document.body can be a frameset node,
            // but ui events originating from its child frames won't propagate
            // past the frame border, so such cases are irrelevant.
            // https://www.w3.org/TR/html401/present/frames.html
            if (name_1 === '#DOCUMENT' || name_1 === 'HTML' || name_1 === 'BODY') {
                return true;
            }
        }
        return false;
    };
    /**
     * Detects common overlay pattern.
     * @param el an element to check whether it is an overlay.
     * @return true if el is an overlay.
     */
    function maybeOverlay(el) {
        if (!isHTMLElement(el)) {
            return false;
        } // not an HTMLElement instance
        var view = el.ownerDocument.defaultView;
        var w = view.innerWidth;
        var h = view.innerHeight;
        if (rectAlmostCoversView(el.getBoundingClientRect(), w, h)) {
            // Find artificial stacking context root
            do {
                if (isArtificialStackingContextRoot(el)) {
                    return true;
                }
                // eslint-disable-next-line no-param-reassign, no-cond-assign
            } while (el = el.parentElement);
        }
        // ToDo: the element may have been modified in the event handler.
        // We may still test it using the inline style attribute.
        return false;
    }

    /* eslint-disable @typescript-eslint/no-shadow, no-param-reassign, no-underscore-dangle */
    // eslint-disable-next-line import/no-mutable-exports
    var use_proxy = false;
    if (!NO_PROXY) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        use_proxy = typeof ProxyCtor !== 'undefined';
    }
    /**
     * Why not use Proxy on production version?
     * Using proxy instead of an original object in some places require overriding Function#bind,apply,call,
     * and replacing such native codes into js implies serious performance effects on codes completely unrelated to popups.
     */
    /**
     * Issue 102: Keep native RegExp methods.
     * RegExp.prototype.test, even though being a native function,
     * may call third-party code outside our membrane.
     * Instead, we need to use `exec` whenever possible.
     */
    var _reflect = ProxyCtor
        ? reflectNamespace.reflectApply
        : ((function () {
            /**
             * It is not possible to emulate `Reflect.apply` simply with references to `Function#apply`
             * and such.
             * Instead, we create a random property key, and attach `Function#call` as a
             * non-writable non-enumerable non-configurable property of `Function#apply` and use it
             * to call `Function.prototype.apply.call`.
             * @todo make this success deterministically
             */
            var PRIVATE_PROPERTY;
            do {
                PRIVATE_PROPERTY = Math.random();
            } while (PRIVATE_PROPERTY in functionApply);
            defineProperty$1(functionApply, PRIVATE_PROPERTY, { value: functionCall });
            return function (target, thisArg, args) { return functionApply[PRIVATE_PROPERTY](target, thisArg, args); };
        })());
    // Lodash isNative
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    new RegExp("^".concat(functionToString.call(hasOwnProperty)
        .replace(reRegExpChar, '\\$&')
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?'), "$"));
    var proxyToReal = new SafeWeakMap();
    var realToProxy = new SafeWeakMap();
    function copyProperty(orig, wrapped, prop) {
        var desc = getOwnPropertyDescriptor(orig, prop);
        if (desc && desc.configurable) {
            desc.value = orig[prop];
            defineProperty$1(wrapped, prop, desc);
        }
    }
    function makeFunctionWrapper(orig, applyHandler) {
        var wrapped;
        var proxy = realToProxy.get(orig);
        if (proxy) {
            return proxy;
        }
        if (use_proxy) {
            wrapped = new ProxyCtor(orig, { apply: applyHandler });
        }
        else {
            // eslint-disable-next-line prefer-rest-params
            wrapped = function () { return applyHandler(orig, this, arguments); };
            copyProperty(orig, wrapped, 'name');
            copyProperty(orig, wrapped, 'length');
        }
        proxyToReal.set(wrapped, orig);
        realToProxy.set(orig, wrapped);
        return wrapped;
    }
    /**
     * Internal errors shall not be re-thrown and will be reported in dev versions.
     */
    function reportIfInternalError(error, target) {
        if (error instanceof ProxyServiceExternalError) {
            return true;
        }
        log.print('Internal error from proxyService:', error);
        log.print('from a target:', target);
        return false;
    }
    /**
     * This addresses {@link https://github.com/AdguardTeam/PopupBlocker/issues/91}
     */
    var WrappedExecutionContext = /** @class */ (function () {
        function WrappedExecutionContext(orig, thisArg, wrapper) {
            this.orig = orig;
            this.thisArg = thisArg;
            this.wrapper = wrapper;
            this.originalInvoked = false; // friend class ProxyService
            // Can't use this.invokeTarget = this.invokeTarget.bind(this); as it accesses unsafe functions.
            this.invokeTarget = _reflect(functionBind, this.invokeTarget, [this]);
        }
        // Throws ProxyServiceExternalError
        WrappedExecutionContext.prototype.invokeTarget = function (args, thisArg) {
            if (thisArg === void 0) { thisArg = this.thisArg; }
            if (this.originalInvoked) {
                log.throwMessage('A wrapped target was invoked more than once.', 1);
            }
            this.originalInvoked = true;
            try {
                // Calls `this.orig`, using Reflect.apply when supported.
                return _reflect(this.orig, thisArg, args);
            }
            catch (e) {
                // Errors thrown from target functions are re-thrown.
                if (captureStackTrace) {
                    // When possible, strip out inner functions from stack trace
                    try {
                        captureStackTrace(e, this.wrapper);
                    }
                    catch (e) {
                        // `e` thrown from this.orig may not be an instance of error
                        // and in such cases captureStackTrace will throw.
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw new ProxyServiceExternalError(e);
            }
        };
        return WrappedExecutionContext;
    }());
    var defaultApplyHandler = function (ctxt, args) { return ctxt.invokeTarget(args); };
    function makeSafeFunctionWrapper(orig, applyHandler) {
        if (applyHandler === void 0) { applyHandler = defaultApplyHandler; }
        var wrapped;
        // eslint-disable-next-line consistent-return
        var rawApplyHandler = function (orig, _this, _arguments) {
            var context = new WrappedExecutionContext(orig, _this, wrapped);
            try {
                return applyHandler(context, _arguments);
            }
            catch (error) {
                if (reportIfInternalError(error, orig)) {
                    // error is an external error; re-throws it.
                    throw error.original;
                }
                // error is an internal error - this is caused by our code, which should be fixed.
                if (!context.originalInvoked) {
                    // Try to make up the original call, in order to preserve the contract.
                    try {
                        return context.invokeTarget(_arguments);
                    }
                    catch (error) {
                        if (reportIfInternalError(error, orig)) {
                            // Re-throws an external error.
                            throw error.original;
                        }
                    }
                }
            }
        };
        wrapped = makeFunctionWrapper(orig, rawApplyHandler);
        return wrapped;
    }
    function wrapMethod(obj, prop, applyHandler) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            obj[prop] = makeSafeFunctionWrapper(obj[prop], applyHandler);
        }
    }

    /* eslint-disable consistent-return, no-continue, @typescript-eslint/no-unused-vars */
    /**
     * The above was not enough for many cases, mostly because event handlers can be attached in
     * strict context and Function.arguments can be mutated in function calls.
     *
     * Below we patch jQuery internals to create a mapping of native events and jQuery events.
     * jQuery sets `currentTarget` property on jQuery event instances while triggering event handlers.
     */
    var JQueryEventStack = /** @class */ (function () {
        function JQueryEventStack(jQuery) {
            var _this = this;
            this.jQuery = jQuery;
            this.eventMap = new SafeWeakMap();
            this.eventStack = [];
            /**
             * Wraps jQuery.event.dispatch.
             * It is used in jQuery to call event handlers attached via $(..).on and such,
             * in case of native events and $(..).trigger().
             */
            this.dispatchApplyHandler = function (ctxt, _arguments) {
                var event = _arguments[0];
                _this.eventStack.push(event);
                try {
                    return ctxt.invokeTarget(_arguments);
                }
                finally {
                    // Make sure that the eventStack is cleared up even if a dispatching fails.
                    _this.eventStack.pop();
                }
            };
            /**
             * Wraps jQuery.event.fix
             */
            this.fixApplyHandler = function (ctxt, _arguments) {
                var event = _arguments[0];
                var ret = ctxt.invokeTarget(_arguments);
                if (_this.isNativeEvent(event)) {
                    if ((isMouseEvent(event) && isClickEvent(event)) || isTouchEvent(event)) {
                        _this.eventMap.set(event, ret);
                    }
                }
                return ret;
            };
        }
        JQueryEventStack.initialize = function () {
            // Attempts to patch before any other page's click event handler is executed.
            window.addEventListener('mousedown', JQueryEventStack.attemptPatch, true);
            window.addEventListener('touchstart', JQueryEventStack.attemptPatch, true);
        };
        // eslint-disable-next-line consistent-return
        JQueryEventStack.getCurrentJQueryTarget = function (event) {
            var jQueries = JQueryEventStack.jQueries;
            for (var i = 0, l = jQueries.length; i < l; i += 1) {
                var jQuery_1 = jQueries[i];
                var stack = JQueryEventStack.jqToStack.get(jQuery_1);
                if (isUndef(stack)) {
                    continue;
                }
                var currentTarget = stack.getNestedTarget(event);
                if (!currentTarget) {
                    continue;
                }
                return currentTarget;
            }
        };
        JQueryEventStack.attemptPatch = function () {
            var jQuery = JQueryEventStack.detectionHeuristic();
            if (isUndef(jQuery)) {
                return;
            }
            if (JQueryEventStack.jQueries.indexOf(jQuery) !== -1) { /* Already patched */
                return;
            }
            new SafeWeakMap();
            JQueryEventStack.jQueries.push(jQuery);
            JQueryEventStack.jqToStack.set(jQuery, new JQueryEventStack(jQuery).wrap());
        };
        JQueryEventStack.detectionHeuristic = function () {
            // @ts-ignore
            var jQuery = window.jQuery || window.$;
            if (typeof jQuery !== 'function') {
                return;
            }
            if (!('noConflict' in jQuery)) {
                return;
            }
            // Test for private property
            if (!('_data' in jQuery)) {
                return;
            }
            // eslint-disable-next-line consistent-return
            return jQuery;
        };
        JQueryEventStack.prototype.isNativeEvent = function (event) {
            return event && typeof event === 'object' && !event[this.jQuery.expando];
        };
        JQueryEventStack.prototype.getRelatedJQueryEvent = function (event) {
            return this.eventMap.get(event);
        };
        JQueryEventStack.noConflictApplyHandler = function (ctxt, _arguments) {
            var deep = _arguments[0];
            ctxt.invokeTarget(_arguments);
            if (deep === true) {
                // Patch another jQuery instance exposed to window.jQuery.
                JQueryEventStack.attemptPatch();
            }
        };
        JQueryEventStack.prototype.wrap = function () {
            var jQuery = this.jQuery;
            wrapMethod(jQuery.event, 'dispatch', this.dispatchApplyHandler);
            wrapMethod(jQuery.event, 'fix', this.fixApplyHandler);
            wrapMethod(jQuery, 'noConflict', JQueryEventStack.noConflictApplyHandler);
            return this;
        };
        /**
         * Performs a smart detection of `currentTarget`.
         * Getting it from the current `window.event`'s related jQuery.Event is not sufficient;
         * See {@link https://github.com/AdguardTeam/PopupBlocker/issues/90}.
         *
         * This is a heuristic to determine an 'intended target' that is useful in detection of
         * unwanted popups; It does not claim to be a perfect solution.
         */
        JQueryEventStack.prototype.getNestedTarget = function (event) {
            var eventStack = this.eventStack;
            if (eventStack.length === 0) {
                return;
            }
            // The root event must be of related to provided event.
            var root = this.getRelatedJQueryEvent(event);
            if (eventStack.indexOf(event) === -1 && eventStack.indexOf(root) === -1) {
                return;
            }
            /** ******************************************************************************************

                If there are remaining events in the stack, and the next nested event is "related"
                to the current event, we take it as a "genuine" event that is eligible to extract
                currentTarget information.
                Why test "related"ness? Suppose a third-party script adds event listeners like below:

                  $(document).on('click', () => { $(hiddenElement).trigger('click'); });
                  $(hiddenElement).on('click', () => { openPopup(); } );

                We need to take `document` as a "genuine" target in such cases. As such,
                despite some theoretical possibilities, we take a leap of faith "that only real-world
                re-triggering that preserves the intention of user input are those which triggers
                event on the target itself again or on its descendent nodes".

            * */
            var current = root;
            for (var i = 1, l = eventStack.length; i < l; i += 1) {
                var next = eventStack[i];
                // prev event is related to next event
                // only if next.target contains current.target.
                var nextTarget = next.target;
                if (isNode(nextTarget)) {
                    if (targetsAreChainable(current.target, nextTarget)) {
                        current = this.isNativeEvent(next) ? this.getRelatedJQueryEvent(next) : next;
                        continue;
                    }
                    else {
                        break;
                    }
                }
                else if (isWindow(nextTarget)) {
                    return nextTarget;
                }
                else {
                    // If a target of a jQuery event is not a node nor window,
                    // it is not what we are expecting for.
                    return;
                }
            }
            return current.currentTarget;
        };
        JQueryEventStack.jQueries = [];
        JQueryEventStack.jqToStack = new SafeWeakMap();
        return JQueryEventStack;
    }());
    JQueryEventStack.initialize();
    var getCurrentJQueryTarget = JQueryEventStack.getCurrentJQueryTarget;
    /**
     * React production build by default attaches an event listener to `document`
     * and processes all events in its internel 'event hub'. It should be possible
     * to retrieve information about the intended target component or target element
     * technically, but for now, we instead fallback to allowing events whose `currentTarget`
     * is `document`. It needs to be improved if it causes missed popups on websites
     * which use react and popups at the same time, or it is challenged by popup scripts.
     */
    // When `window.__REACT_DEVTOOLS_GLOBAL_HOOK__` property exists, react will access and call
    // some of its methods. We use it as a hack to detect react instances.
    // We can always harden this by replicating the `hook` object here, at a cost of maintainance burden.
    function isInOfficialDevtoolsScript() {
        if (document.head) {
            return false;
        }
        var script = document.currentScript;
        if (!script) {
            return false;
        }
        var textContent = script.textContent;
        // https://github.com/facebook/react-devtools/blob/master/backend/installGlobalHook.js#L147
        if (textContent.indexOf('^_^') !== -1) {
            return true;
        }
        return false;
    }
    var HOOK_PROPERTY_NAME = '__REACT_DEVTOOLS_GLOBAL_HOOK__';
    var accessedReactInternals = false;
    if (!hasOwnProperty.call(window, HOOK_PROPERTY_NAME)) {
        var nextID_1 = 0;
        var tempValue_1 = {
            // Create a dummy function for preact compatibility
            // https://github.com/AdguardTeam/PopupBlocker/issues/119
            // Add more property for NextJS compatibility
            // https://github.com/AdguardTeam/PopupBlocker/issues/219
            // Important: This object properties have to be quoted to keep its name after minification
            renderers: new Map(),
            supportsFiber: true,
            inject: function (injected) {
                // eslint-disable-next-line no-plusplus
                return nextID_1++;
            },
            onScheduleFiberRoot: function (id, root, children) { },
            onCommitFiberRoot: function (id, root, maybePriorityLevel, didError) { },
            onCommitFiberUnmount: function () { },
        }; // to be used as window.__REACT_DEVTOOLS_GLOBAL_HOOK__
        defineProperty$1(tempValue_1, 'isDisabled', {
            get: function () {
                accessedReactInternals = true;
                // Signals that a devtools is disabled, to minimize possible breakages.
                // https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberDevToolsHook.js#L40
                return true;
            },
            set: function () { },
        });
        defineProperty$1(window, HOOK_PROPERTY_NAME, {
            get: function () {
                if (isInOfficialDevtoolsScript()) {
                    return undefined; // So that it re-defines the property
                }
                return tempValue_1;
            },
            set: function (i) { },
            configurable: true, // So that react-devtools can re-define it
        });
    }
    var reactRootSelector = '[data-reactroot]';
    var reactIdSelector = '[data-reactid]';
    function isReactInstancePresent() {
        if (!!document.querySelector(reactRootSelector) || !!document.querySelector(reactIdSelector)) {
            return true;
        }
        if (accessedReactInternals) {
            return true;
        }
        // Otherwise, react-devtools could have overridden the hook.
        var hook = window[HOOK_PROPERTY_NAME];
        if (typeof hook !== 'object') {
            return false;
        }
        var _renderers = hook._renderers;
        if (typeof _renderers !== 'object' || _renderers === null) {
            return false;
        }
        if (objectKeys(_renderers).length === 0) {
            return false;
        }
        return true;
    }
    /**
     * https://github.com/google/jsaction
     */
    function jsActionTarget(event) {
        var target = event.target;
        if (isElement(target)) {
            var type = event.type;
            var possibleTarget = closest(target, "[jsaction*=\"".concat(type, ":\"]"));
            if (possibleTarget && Object.prototype.hasOwnProperty.call(possibleTarget, '__jsaction')) {
                // eslint-disable-next-line no-underscore-dangle
                var action = possibleTarget.__jsaction;
                if (Object.prototype.hasOwnProperty.call(action, type)) {
                    return possibleTarget;
                }
            }
        }
    }

    /**
     * On IE 10 and lower, window.event is a `MSEventObj` instance which does not implement `target` property.
     * We use a polyfill for such cases.
     */
    var supported = 'event' in window && (!('documentMode' in document) || (document.documentMode === 11));
    var currentMouseEvent;
    if (!supported) {
        log.print('window.event is not supported.');
        currentMouseEvent = (new CurrentMouseEvent()).getCurrentMouseEvent;
    }
    else {
        log.print('window.event is supported.');
    }
    /**
     * Gets the event that is being currently handled.
     * @suppress {es5Strict}
     */
    function retrieveEvent() {
        log.call('Retrieving event');
        var win = window;
        var currentEvent;
        if (supported) {
            currentEvent = win.event;
            while (!currentEvent) {
                var parent_1 = win.parent;
                if (parent_1 === win) {
                    break;
                }
                // @ts-ignore
                win = parent_1;
                try {
                    currentEvent = win.event;
                }
                catch (e) {
                    // Cross-origin error
                    break;
                }
            }
        }
        else {
            currentEvent = currentMouseEvent();
        }
        if (!currentEvent) {
            log.print('window.event does not exist, trying to get event from Function.caller');
            try {
                // eslint-disable-next-line no-restricted-properties, no-caller
                var caller = arguments.callee;
                var touched = new SafeWeakMap();
                while (caller.caller) {
                    caller = caller.caller;
                    if (touched.has(caller)) {
                        /* eslint-disable @typescript-eslint/no-throw-literal */
                        if (DEBUG) {
                            // TODO make preprocessor plugin to cut these from beta and release builds
                            throw 'Recursion in the call stack';
                        }
                        else {
                            throw null;
                        }
                        /* eslint-enable @typescript-eslint/no-throw-literal */
                    }
                    touched.set(caller, true);
                }
                log.print('Reached at the top of caller chain.');
                if (caller.arguments && caller.arguments[0] && 'target' in caller.arguments[0]) {
                    // eslint-disable-next-line prefer-destructuring
                    currentEvent = caller.arguments[0];
                    log.print('The function at the bottom of the stack has an expected type. The current event is:', currentEvent);
                }
                else {
                    log.print('The function at the bottom of the call stack does not have an expected type.', caller.arguments[0]);
                }
            }
            catch (e) {
                log.print('Getting event from Function.caller failed, due to an error:', e);
            }
        }
        else {
            log.print('window.event exists, of which the value is:', currentEvent);
        }
        log.callEnd();
        return currentEvent;
    }
    /**
     * @param event Optional argument, an event to test with. Default value is currentEvent.
     * @return True if the event is legit, false if it is something that we should not allow window.open or dispatchEvent.
     */
    var verifyEvent = log.connect(function (event) {
        if (event) {
            if ((!isMouseEvent(event) || !isClickEvent(event)) && !isTouchEvent(event)) {
                return true;
            }
            var currentTarget = event.currentTarget;
            if (currentTarget) {
                log.print('Event is:', event);
                log.print('currentTarget is: ', currentTarget);
                if (eventTargetIsRootNode(currentTarget)) {
                    var eventPhase = event.eventPhase;
                    log.print("Phase is: ".concat(eventPhase));
                    // Workaround for jsaction
                    var maybeJsActionTarget = jsActionTarget(event);
                    if (maybeJsActionTarget) {
                        log.print('maybeJsActionTarget');
                        if (eventTargetIsRootNode(maybeJsActionTarget)) {
                            return false;
                        }
                        log.print('jsActionTarget is not a root');
                        return true;
                    }
                    if (eventPhase === 1 /* Event.CAPTURING_PHASE */ || eventPhase === 2 /* Event.AT_TARGET */) {
                        // eslint-disable-next-line max-len
                        log.print('VerifyEvent - the current event handler is suspicious, for the current target is either window, document, html, or body.');
                        return false;
                    }
                    // eslint-disable-next-line max-len
                    log.print('VerifyEvent - the current target is document/html/body, but the event is in a bubbling phase.');
                    // Workaround for jQuery
                    var jQueryTarget = getCurrentJQueryTarget(event);
                    if (jQueryTarget) {
                        log.print('jQueryTarget exists: ', jQueryTarget);
                        // Performs the check with jQueryTarget again.
                        if (eventTargetIsRootNode(jQueryTarget)
                            || (isElement(jQueryTarget) && maybeOverlay(jQueryTarget))) {
                            return false;
                        }
                        // Workaround for React
                    }
                    else if (!isReactInstancePresent()
                        || (isNode(currentTarget) && getTagName(currentTarget) !== '#DOCUMENT')) {
                        return false;
                    }
                    // When an overlay is being used, checking for useCapture is not necessary.
                }
                else if (isElement(currentTarget) && maybeOverlay(currentTarget)) {
                    // eslint-disable-next-line max-len
                    log.print('VerifyEvent - the current event handler is suspicious, for the current target looks like an artificial overlay.');
                    return false;
                }
            }
        }
        return true;
        // eslint-disable-next-line prefer-rest-params
    }, 'Verifying event', function () { return arguments[0]; });

    var expect$6 = chai.expect;
    var getEvt$1 = function () {
        var evt = document.createEvent('MouseEvents');
        window.event = evt;
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
        return evt;
    };
    describe('retrieveEvent', function () {
        it('returns window.event if available', function () {
            if ('event' in window) {
                var desc = Object.getOwnPropertyDescriptor(window, 'event');
                if (desc && desc.set) {
                    // Otherwise, the 'hack' of setting window.event directly for testing won't work. IE works in this way.
                    var evt = getEvt$1();
                    window.event = evt;
                    expect$6(retrieveEvent()).to.be.equal(evt);
                    window.event = undefined;
                }
            }
        });
        it('retrieves value from the call stack when window.event is unavailable', function (done) {
            var evt = getEvt$1();
            window.event = evt;
            var retrieved;
            setTimeout((function () {
                window.event = undefined;
                retrieved = retrieveEvent();
                expect$6(retrieved).to.be.equal(evt);
                done();
            }).bind(null, evt), 100);
        });
    });
    describe('verifyEvent', function () {
        it('returns true for non-dispatched events', function () {
            var evt = getEvt$1();
            window.event = evt;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect$6(verifyEvent(evt)).to.be.true;
        });
        it('returns false for events of which currentTarget is document', function () {
            var evt = getEvt$1();
            document.addEventListener('click', function (event) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                expect$6(verifyEvent(event)).to.be.false;
            });
            document.dispatchEvent(evt);
        });
    });

    var expect$5 = chai.expect;
    describe('maybeOverlay', function () {
        it('detects position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647', function () {
            var el = document.createElement('div');
            el.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647';
            document.body.appendChild(el);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect$5(maybeOverlay(el)).to.be.true;
            document.body.removeChild(el);
        });
    });

    var currentEvent = (new CurrentMouseEvent()).getCurrentMouseEvent;
    var expect$4 = chai.expect;
    var getEvt = function (type) {
        var evt = document.createEvent('MouseEvents');
        window.event = document.createEvent('MouseEvents');
        evt.initMouseEvent(type, true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
        return evt;
    };
    var types = ['mousedown', 'mouseup', 'click'];
    // Gets a random mouseevent type.
    var getType = function () { return types[Math.floor(Math.random() * 3)]; };
    describe('CurrentMouseEvent', function () {
        it('retrieves a current mouse event in multiple nested event handlers', function (done) {
            this.timeout(5000);
            var LIMIT = 1000;
            var counter = 0;
            var pr = typeof Promise !== 'undefined' ? Promise : { resolve: function () { return ({ then: function (fn) { fn(); } }); } };
            var getRndEvt = function () {
                var evt = getEvt(getType());
                // @ts-ignore
                evt.counter = counter;
                return evt;
            };
            var callback = function (evt) {
                counter += 1;
                // Tests whether currentEvent returns the right event.
                var _a = currentEvent(), timeStamp = _a.timeStamp, offsetX = _a.offsetX, offsetY = _a.offsetY;
                expect$4(timeStamp).to.equal(evt.timeStamp);
                expect$4(offsetX).to.equal(evt.offsetX);
                expect$4(offsetY).to.equal(evt.offsetY);
                if (counter < LIMIT) {
                    switch (counter % 7) {
                        case 0:
                            document.body.dispatchEvent(getRndEvt());
                            break;
                        case 1:
                            pr.resolve().then(function () { document.body.dispatchEvent(getRndEvt()); });
                            break;
                        case 2:
                        case 3:
                        case 4:
                            document.body.dispatchEvent(getRndEvt());
                            break;
                    }
                }
                // Occasionally stops bubbling.
                switch (counter % 10) {
                    case 0:
                        evt.stopPropagation();
                        break;
                    case 1:
                        evt.stopImmediatePropagation();
                        break;
                    case 2:
                        // eslint-disable-next-line no-param-reassign
                        evt.cancelBubble = true;
                        break;
                }
            };
            document.addEventListener('mousedown', callback);
            document.addEventListener('mousedown', callback, true);
            document.body.addEventListener('mousedown', callback);
            document.addEventListener('mouseup', callback);
            document.addEventListener('mouseup', callback, true);
            document.body.addEventListener('mouseup', callback);
            document.addEventListener('click', callback);
            document.addEventListener('click', callback, true);
            document.body.addEventListener('click', callback);
            document.body.dispatchEvent(getRndEvt());
            setTimeout(function () {
                setTimeout(function () {
                    setTimeout(function () {
                        setTimeout(function () {
                            setTimeout(function () {
                                // eslint-disable-next-line no-console
                                console.log("dispatched total ".concat(counter, " events"));
                                done();
                            }, 500);
                        });
                    });
                });
            });
        });
    });

    // Expose mocked GM_api to the global scope
    function mockGMApi() {
        var GM_storage = Object.create(null);
        function GM_getValue(key, defaultValue) {
            if (key in GM_storage) {
                return GM_storage[key];
            }
            return defaultValue;
        }
        function GM_setValue(key, newValue) {
            GM_storage[key] = newValue;
        }
        function GM_listValues() {
            return Object.keys(GM_storage);
        }
        function GM_deleteValue(key) {
            delete GM_storage[key];
        }
        // This one is actually not part of native GM methods
        function GM_clearStorage() {
            GM_storage = Object.create(null);
        }
        window.GM_getValue = GM_getValue;
        window.GM_setValue = GM_setValue;
        window.GM_deleteValue = GM_deleteValue;
        window.GM_listValues = GM_listValues;
        window.GM_clearStorage = GM_clearStorage;
    }
    // GM api must be mocked before migration and settings start
    mockGMApi();

    /**
     * Legal storage keys as of v3
     * Moved to a separate file to avoid cyclic deps
     */
    var StorageKey = {
        DataVersion: 'ver',
        InstanceId: '#id',
        AllowedDomains: "allowed" /* OptionName.Allowed */,
        SilencedDomains: "silenced" /* OptionName.Silenced */,
    };

    /**
     * AdGuard for desktop only implements GM_setValue, GM_getValue and GM_listValues methods
     * so Storage is introduced to simplify GM API consuming by wrapping methods that are available
     * and deriving the rest
     */
    var GMWrapper = /** @class */ (function () {
        function GMWrapper() {
            this.listenersCount = 0;
            this.valueListeners = {};
        }
        GMWrapper.prototype.notifyListeners = function (key, oldValue, newValue) {
            var listeners = this.valueListeners[key];
            if (Array.isArray(listeners)) {
                listeners.forEach(function (listenerData) { return listenerData.listener(key, oldValue, newValue, false); });
            }
        };
        /**
         * Gets value from storage
         *
         * @param key a string specifying the key for which the value should be retrieved
         * @param defaultValue value to be returned if the key does not exist in the extension's storage
         * @returns value of the specified key from the storage, or the default value if the key does not exist
         */
        GMWrapper.prototype.getValue = function (key, defaultValue) {
            return GM_getValue(key, defaultValue);
        };
        GMWrapper.prototype.deleteValue = function (key) {
            GM_deleteValue(key);
        };
        /**
         * Sets the value of a specific key in the userscript's storage
         *
         * @param key key for which the value should be set
         * @param newValue value to be set for the key
         */
        GMWrapper.prototype.setValue = function (key, newValue) {
            var oldValue = this.getValue(key);
            GM_setValue(key, newValue);
            if (oldValue !== newValue) {
                this.notifyListeners(key, oldValue, newValue);
            }
        };
        /**
         * Adds listener for changes to the value of a specific key in the userscript's storage
         *
         * Note: This function is uniformity measure as AdGuard for desktop doesn't implement GM_addValueChangeListener;
         * listener removal is not needed and so not implemented, and listener id is returned to conform with
         * original GM_addValueChangeListener method
         *
         * @param key the key for which changes should be monitored
         * @param listener callback function that will be called when the value of the key changes
         * @returns returns an id that can be used to remove the listener later
         */
        GMWrapper.prototype.addValueChangeListener = function (key, listener) {
            if (typeof listener !== 'function') {
                throw new Error('Invalid listener');
            }
            var listenersArray = this.valueListeners[key];
            var listenerObj = {
                id: this.listenersCount += 1,
                listener: listener,
            };
            if (Array.isArray(listenersArray)) {
                listenersArray.push(listenerObj);
            }
            else {
                this.valueListeners[key] = [listenerObj];
            }
            return listenerObj.id;
        };
        /**
         * Gets a list of keys of all stored data
         */
        GMWrapper.prototype.listValues = function () {
            return GM_listValues();
        };
        /**
         * Sets new storage
         */
        GMWrapper.prototype.setStorage = function (storage) {
            var _this = this;
            // Remove old values
            var keys = this.listValues();
            keys.forEach(this.deleteValue);
            // Set new values
            Object.entries(storage).forEach(function (entry) {
                var key = entry[0], value = entry[1];
                _this.setValue(key, value);
            });
        };
        /**
         * Iterate through script manager storage
         */
        GMWrapper.prototype.iterateStorage = function (callback) {
            var _this = this;
            var keys = this.listValues();
            keys.forEach(function (key) {
                var value = _this.getValue(key, '');
                callback(key, value);
            });
        };
        return GMWrapper;
    }());
    var gmWrapper = new GMWrapper();

    var isDomainValueV1 = function (value) { return typeof value === 'object' && value !== null && 'whitelisted' in value; };
    var Migrator = /** @class */ (function () {
        function Migrator() {
            this.ALLOWED_DOMAINS_STORAGE_KEY_V2 = 'whitelist';
            this.OPTION_VALUES_DELIMITER = ',';
        }
        /**
         * Migrate allowed domains to v2 data version
         */
        /**
         * V1:
         * {
         *     "#id": "eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9",
         *     "ver": "1",
         *     "test.com": {
         *          "whitelisted": true
         *      },
         *      "whitelist": "example.com,domain.org"
         * }
         * =>
         * V2:
         * {
         *     "#id": "eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9",
         *     "ver": "2",
         *     "whitelist": "test.com,example.com,domain.org",
         * }
         */
        Migrator.prototype.migrateFromV1toV2 = function () {
            var _this = this;
            var storageV2 = {};
            var whitelist = [];
            gmWrapper.iterateStorage(function (key, value) {
                if (value === '') {
                    return;
                }
                if (typeof value === 'string') {
                    if (key === StorageKey.InstanceId) {
                        // Keep instance id
                        storageV2[key] = value;
                        return;
                    }
                    if (key === _this.ALLOWED_DOMAINS_STORAGE_KEY_V2) {
                        // Collect domains that are already allowed as list
                        whitelist.push(value.split(_this.OPTION_VALUES_DELIMITER));
                        return;
                    }
                }
                if (isDomainValueV1(value) && whitelist.indexOf(key) === -1) {
                    whitelist.push(key);
                }
            });
            storageV2[this.ALLOWED_DOMAINS_STORAGE_KEY_V2] = whitelist.join(this.OPTION_VALUES_DELIMITER);
            storageV2.ver = '2';
            gmWrapper.setStorage(storageV2);
        };
        /**
         * Migrate stored domains to unified 'allowed' and 'silenced' v3 data version
         */
        /**
         * V2:
         * {
         *     "#id": "eOywxeWbTSPleyiD4zXxmt/NRkokUCs3",
         *     "ver": "2",
         *     "whitelist": "example.com,test.com",
         *     "silenced.ru": "1",
         *     "silenced-domain2.org": "1",
         *     "not_silenced.ru": "0"
         * }
         * =>
         * V3:
         * {
         *     "#id": "eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9",
         *     "ver": "3",
         *     "allowed": "example.com, domain.org",
         *     "silenced": "silenced-domain.org, silenced-domain2.org"
         * }
         */
        Migrator.prototype.migrateFromV2toV3 = function () {
            var _this = this;
            var storageV3 = {};
            var allowed = [];
            var silenced = [];
            gmWrapper.iterateStorage(function (key, value) {
                // Version key is to be manually set later
                if (typeof value !== 'string' || key === StorageKey.DataVersion) {
                    return;
                }
                if (key === StorageKey.InstanceId) {
                    // Keep instance id
                    storageV3[key] = value;
                    return;
                }
                if (key === _this.ALLOWED_DOMAINS_STORAGE_KEY_V2) {
                    // Collect domains that are already allowed as list
                    allowed.push(value.split(_this.OPTION_VALUES_DELIMITER));
                    return;
                }
                // At this moment only silenced domains should've left
                // V2 stores them in keys
                if (value === '1') {
                    silenced.push(key);
                }
            });
            storageV3[StorageKey.AllowedDomains] = allowed.join(this.OPTION_VALUES_DELIMITER);
            storageV3[StorageKey.SilencedDomains] = silenced.join(this.OPTION_VALUES_DELIMITER);
            storageV3.ver = '3';
            gmWrapper.setStorage(storageV3);
        };
        Migrator.prototype.migrateDataIfNeeded = function () {
            var dataVersion = parseFloat(gmWrapper.getValue(StorageKey.DataVersion, '1'));
            // Cover 1.* versions
            if (dataVersion < 2) {
                this.migrateFromV1toV2();
                dataVersion = 2;
            }
            if (dataVersion === 2) {
                this.migrateFromV2toV3();
            }
        };
        return Migrator;
    }());
    var migrator = new Migrator();

    var _a;
    /**
     * Represents singe userscript option
     */
    var Option = /** @class */ (function () {
        function Option(name) {
            var _this = this;
            /**
             * Updates self, used at init, storage migration and manual storage input
             */
            this.updateList = function () {
                var listStringified = gmWrapper.getValue(_this.name, '');
                _this.list = listStringified ? listStringified.split(',') : [];
            };
            this.pushSelfToStorage = function () { return gmWrapper.setValue(_this.name, _this.list.join(',')); };
            this.getList = function () { return _this.list; };
            /**
             * Checks if given string is already stored
             * @param value arbitrary string value
             */
            this.isMember = function (value) { return _this.list.includes(value); };
            /**
             * Pushes item to script storage and saves it to own list
             * @param item arbitrary string
             */
            this.addItem = function (item) {
                if (_this.isMember(item)) {
                    return;
                }
                _this.list.push(item);
                _this.pushSelfToStorage();
            };
            /**
             * Removes items from script storage and own list
             */
            this.removeItem = function (item) {
                if (!_this.isMember(item)) {
                    return;
                }
                _this.list = _this.list.filter(function (domain) { return domain !== item; });
                _this.pushSelfToStorage();
            };
            this.name = name;
            this.updateList();
            gmWrapper.addValueChangeListener(this.name, this.updateList);
        }
        return Option;
    }());
    var optionsApi = (_a = {},
        _a["allowed" /* OptionName.Allowed */] = new Option("allowed" /* OptionName.Allowed */),
        _a["silenced" /* OptionName.Silenced */] = new Option("silenced" /* OptionName.Silenced */),
        _a);

    /**
     * Manages options change and consuming
     */
    var SettingsDao = /** @class */ (function () {
        function SettingsDao() {
            var _this = this;
            this.allowed = optionsApi["allowed" /* OptionName.Allowed */];
            this.silenced = optionsApi["silenced" /* OptionName.Silenced */];
            this.isMemberOf = function (listName, value) { return _this[listName].isMember(value); };
        }
        SettingsDao.prototype.migrateDataIfNeeded = function () {
            migrator.migrateDataIfNeeded();
        };
        SettingsDao.prototype.setListItem = function (listName, domain, cb) {
            this[listName].addItem(domain);
            this.flushPageCache();
            if (typeof cb === 'function') {
                cb();
            }
        };
        SettingsDao.prototype.getInstanceID = function () {
            var instanceID = gmWrapper.getValue(StorageKey.InstanceId);
            if (typeof instanceID === 'undefined') {
                instanceID = getRandomStr();
                gmWrapper.setValue(StorageKey.InstanceId, instanceID);
                this.flushPageCache();
            }
            return instanceID;
        };
        /**
         * Force flush the current page cache.
         * This is an ugly solution for https://github.com/AdguardTeam/PopupBlocker/issues/131
         */
        SettingsDao.prototype.flushPageCache = function () {
            var xhr = new window.XMLHttpRequest();
            xhr.open('GET', window.location.href, true);
            xhr.setRequestHeader('Pragma', 'no-cache');
            xhr.setRequestHeader('Expires', '-1');
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.send();
        };
        return SettingsDao;
    }());
    var settingsDao = new SettingsDao();

    var migrationStorageV1V2 = {
        init: {
            '#id': 'eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9',
            ver: '1',
            'test.com': {
                whitelisted: true,
            },
            whitelist: 'example.com,domain.org',
        },
        expected: {
            '#id': 'eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9',
            ver: '2',
            whitelist: 'test.com,example.com,domain.org',
        },
    };
    var migrationStorageV2V3 = {
        init: {
            '#id': 'eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9',
            ver: '2',
            whitelist: 'test.com,example.com,domain.org',
            'silenced.domain.org': '1',
            'silenced.domain2.org': '1',
            'unsilenced.domain2.org': '0',
        },
        expected: {
            '#id': 'eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9',
            ver: '3',
            allowed: 'test.com,example.com,domain.org',
            silenced: 'silenced.domain.org,silenced.domain2.org',
        },
    };
    var migrationStorageV1V3 = {
        init: migrationStorageV1V2.init,
        expected: {
            '#id': 'eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9',
            ver: '3',
            allowed: 'test.com,example.com,domain.org',
            silenced: '',
        },
    };

    var expect$3 = chai.expect;
    var ALLOWED_DOMAINS_STORAGE_KEY_V2 = 'whitelist';
    describe('Settings migration', function () {
        afterEach(window.GM_clearStorage);
        it('settigsDao should migrate data from v1 to v3 version properly', function () {
            gmWrapper.setStorage(migrationStorageV1V3.init);
            settingsDao.migrateDataIfNeeded();
            expect$3(gmWrapper.getValue(StorageKey.DataVersion)).to.equal('3');
            var expectedToBeAllowed = [
                'test.com',
                'example.com',
                'domain.org',
            ];
            expectedToBeAllowed.forEach(function (domain) {
                expect$3(settingsDao.isMemberOf("allowed" /* OptionName.Allowed */, domain)).to.equal(true);
                expect$3(settingsDao.isMemberOf("silenced" /* OptionName.Silenced */, domain)).to.equal(false);
            });
        });
        it('should transform data from v1.* to v2', function () {
            var init = migrationStorageV1V2.init, expected = migrationStorageV1V2.expected;
            gmWrapper.setStorage(init);
            migrator.migrateFromV1toV2();
            var keys = gmWrapper.listValues();
            expect$3(keys.length).to.equal(3);
            expect$3(gmWrapper.getValue(StorageKey.DataVersion)).to.equal('2');
            expect$3(gmWrapper.getValue(StorageKey.InstanceId)).to.equal(expected[StorageKey.InstanceId]);
            expect$3(gmWrapper.getValue(ALLOWED_DOMAINS_STORAGE_KEY_V2)).to.equal(expected.whitelist);
        });
        it('should transform data from v2 to v3', function () {
            var init = migrationStorageV2V3.init, expected = migrationStorageV2V3.expected;
            gmWrapper.setStorage(init);
            migrator.migrateFromV2toV3();
            var keys = gmWrapper.listValues();
            expect$3(keys.length).to.equal(4);
            expect$3(gmWrapper.getValue(StorageKey.DataVersion)).to.equal('3');
            expect$3(gmWrapper.getValue(StorageKey.InstanceId)).to.equal(expected[StorageKey.InstanceId]);
            expect$3(gmWrapper.getValue(StorageKey.AllowedDomains)).to.equal(expected.allowed);
            expect$3(gmWrapper.getValue(StorageKey.SilencedDomains)).to.equal(expected.silenced);
        });
        it('should transform data from v1 to v3', function () {
            var init = migrationStorageV1V3.init, expected = migrationStorageV1V3.expected;
            gmWrapper.setStorage(init);
            migrator.migrateDataIfNeeded();
            var keys = gmWrapper.listValues();
            expect$3(keys.length).to.equal(4);
            expect$3(gmWrapper.getValue(StorageKey.DataVersion)).to.equal('3');
            expect$3(gmWrapper.getValue(StorageKey.InstanceId)).to.equal(expected[StorageKey.InstanceId]);
            expect$3(gmWrapper.getValue(StorageKey.AllowedDomains)).to.equal(expected.allowed);
            expect$3(gmWrapper.getValue(StorageKey.SilencedDomains)).to.equal('');
        });
    });

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    // JQueryEventStack is initialized in the module.
    var expect$2 = chai.expect;
    describe('JQueryEventStack', function () { return __awaiter(void 0, void 0, void 0, function () {
        // Test implementations
        function testOnJQuery(jQuery, prev) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve) {
                            describe("jQuery ".concat(jQuery.version), function () {
                                function checkVersions(done) {
                                    this.timeout(10000);
                                    // Run tests after `prev` test ends.
                                    prev.then(function () {
                                        // Check that the jQuery currently loaded has the expected version.
                                        expect$2($.fn.jquery).to.equal(jQuery.version);
                                        done();
                                    });
                                }
                                before(checkVersions);
                                it("detects simple target in ".concat(jQuery.version), function (done) {
                                    $('#JQueryTestRoot').one('click', function () {
                                        var expected = JQueryTestRoot;
                                        var got = JQueryEventStack.getCurrentJQueryTarget(window.event);
                                        expect$2(got).to.equal(expected);
                                        done();
                                    });
                                    $('#JQueryTestRoot').click();
                                });
                                it("detects delegated target in ".concat(jQuery.version), function (done) {
                                    $(document).one('click', '#JQueryTestRoot', function () {
                                        var expected = JQueryTestRoot;
                                        var got = JQueryEventStack.getCurrentJQueryTarget(window.event);
                                        expect$2(got).to.equal(expected);
                                        done();
                                    });
                                    $('#JQueryTestRoot').click();
                                });
                                it("detects nested delegated target in ".concat(jQuery.version), function (done) {
                                    $(document).one('click', function (evt) {
                                        var target = evt.target;
                                        $(target).trigger('CustomClick_1');
                                    });
                                    $(document).one('CustomClick_1', 'body', function (evt) {
                                        var target = evt.target;
                                        $(target).trigger('CustomClick_2');
                                    });
                                    $('#JQueryTestRoot').one('CustomClick_2', function () {
                                        var expected = JQueryTestRoot;
                                        var got = JQueryEventStack.getCurrentJQueryTarget(window.event);
                                        expect$2(got).to.equal(expected);
                                        done();
                                    });
                                    $('#JQueryTestRoot').click();
                                });
                                it("ignores jumps in delgated targets ".concat(jQuery.version), function (done) {
                                    $(document).one('click', function (evt) {
                                        var target = evt.target;
                                        $(target).trigger('CustomClick_1');
                                    });
                                    $(document).one('CustomClick_1', 'body', function (evt) {
                                        var target = evt.target;
                                        $(target).trigger('CustomClick_2');
                                    });
                                    $('#JQueryTestRoot').one('CustomClick_2', function () {
                                        $('head').trigger('CustomClick_3');
                                    });
                                    $('head').one('CustomClick_3', function () {
                                        var expected = JQueryTestRoot;
                                        var got = JQueryEventStack.getCurrentJQueryTarget(window.event);
                                        expect$2(got).to.equal(expected);
                                        done();
                                    });
                                    $('#JQueryTestRoot').click();
                                });
                                it("works in a nested dispatch task ".concat(jQuery.version), function (done) {
                                    $(document).one('click', '#JQueryTestRoot', function (evt) {
                                        $(document).one('click', '#JQueryTestRoot', function () {
                                            var expected = JQueryTestRoot;
                                            var got = JQueryEventStack.getCurrentJQueryTarget(window.event);
                                            expect$2(got).to.equal(expected);
                                            done();
                                        });
                                        var target = evt.target;
                                        target.click();
                                    });
                                });
                                after(function () {
                                    $.noConflict(true); // Expose the previously-loaded jQuery to the global scope
                                    // for the next test.
                                    resolve();
                                });
                            });
                        })];
                });
            });
        }
        var JQueryTestRoot, jQueryVersions, tests, prev, _i, jQueryVersions_1, jQuery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    JQueryTestRoot = window.JQueryTestRoot;
                    jQueryVersions = [
                        { version: '3.3.1', url: 'https://code.jquery.com/jquery-3.3.1.min.js' },
                        { version: '2.2.4', url: 'https://code.jquery.com/jquery-2.2.4.min.js' },
                        { version: '1.12.4', url: 'https://code.jquery.com/jquery-1.12.4.min.js' },
                    ];
                    tests = [];
                    prev = Promise.resolve();
                    // Test for the lastly loaded jQuery, then test for the previous one by executing
                    // $.noConflict(true), and so on.
                    // eslint-disable-next-line no-restricted-syntax
                    for (_i = 0, jQueryVersions_1 = jQueryVersions; _i < jQueryVersions_1.length; _i++) {
                        jQuery = jQueryVersions_1[_i];
                        // @ts-ignore
                        tests.push(prev = testOnJQuery(jQuery, prev));
                    }
                    document.body.click(); // So that JQueryEventStack patches the initial jQuery.
                    // Run tests
                    return [4 /*yield*/, Promise.all(tests)];
                case 1:
                    // Run tests
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });

    /**
     * If an empty iframe which does not have an associacted http request tries to open a popup
     * within a time specified by this constant, it will be blocked.
     */
    var TIME_MINIMUM_BEFORE_POPUP = 200;
    var createOpen = function (index, events) {
        log.print('index:', index);
        var evt = events[index][0];
        if (evt.$type === 0 /* TLEventType.CREATE */ && getTime() - evt.$timeStamp < TIME_MINIMUM_BEFORE_POPUP) {
            log.print('time difference is less than a threshold');
            /**
             * A test here is meant to block attempts to call window.open from iframes which
             * was created later than 200 milliseconds ago. Such techniques are mostly used
             * by popup/popunder scripts on Firefox.
             *
             * In an issue https://github.com/AdguardTeam/PopupBlocker/issues/63, a pop-up
             * window of Google Hangout is created with chrome-extension://... url, and it
             * contains an iframe having domain hangouts.google.com, and inside it it immediately
             * calls window.open with empty url in order to obtain reference to certain browsing
             * context.
             *
             * A delicate issue revealed by https://github.com/AdguardTeam/PopupBlocker/issues/98
             * is that such a meant-to-be empty iframe can have non-empty `location` object.
             * This is caused by `document.open`, which is in effect identical to performing another
             * navigation, i.e. replacing associated `document` object, setting location from
             * initiating origin, etc. I refer to
             * {@link https://bugs.chromium.org/p/chromium/issues/detail?id=742049} for more info.
             *
             * Therefore, we take advantage of `performance.timing` api to determine whether the
             * empty iframe has an associated HTTP request.
             */
            var browsingContext = evt.$data.thisOrReceiver;
            log.print('testing context is: ', browsingContext);
            var isSameOriginChildContext = browsingContext.frameElement !== null;
            if (isSameOriginChildContext) {
                var timing = browsingContext.performance.timing;
                var fetchStart = timing.fetchStart, responseEnd = timing.responseEnd;
                if (fetchStart === 0 || fetchStart === responseEnd) {
                    return false;
                }
            }
        }
        return true;
    };
    var createOpen$1 = log.connect(createOpen, 'Performing create test');

    var aboutBlank = function (index, events) {
        // if there is a blocked popup within 100 ms, do not allow opening popup with url about:blank.
        // It is a common technique used by popunder scripts on FF to regain focus of the current window.
        var latestOpenEvent = events[index][events[index].length - 1];
        var now = latestOpenEvent.$timeStamp;
        if (latestOpenEvent.$type === 1 /* TLEventType.APPLY */
            && latestOpenEvent.$name === 'open'
            && isEmptyUrl(convertToString(latestOpenEvent.$data.arguments[0]))) {
            log.print('The latest event is open(\'about:blank\')');
            var l = events.length;
            // eslint-disable-next-line no-plusplus
            while (l-- > 0) {
                var frameEvents = events[l];
                var k = frameEvents.length;
                // eslint-disable-next-line no-plusplus
                while (k-- > 0) {
                    var event_1 = frameEvents[k];
                    if (now - event_1.$timeStamp > 200) {
                        break;
                    }
                    if (event_1.$name === 'open' && event_1.$type === 1 /* TLEventType.APPLY */) {
                        if (event_1.$data.externalContext.mocked) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };
    var aboutBlank$1 = log.connect(aboutBlank, 'Performing aboutBlank test');

    /**
     * If a popup/popunder script tries to navigate a popup window to a target a link on which
     * a user has clicked within an interval specified by this constant, it will abort script execution.
     */
    var NAVIGATION_TIMING_THRESOLD = 200;
    var navigatePopupToItself = function (index, events, incoming) {
        var $type = incoming.$type;
        var $name = incoming.$name;
        if ((($name === 'assign' || $name === 'replace') && $type === 1 /* TLEventType.APPLY */)
            || (($name === 'location' || $name === 'href') && $type === 3 /* TLEventType.SET */)) {
            var currentHref = window.location.href; // ToDo: Consider making this work on empty iframes
            var incomingData = incoming.$data;
            var newLocation = String(incomingData.arguments[0]);
            var thisArg = incomingData.thisOrReceiver;
            if (newLocation === currentHref) {
                // Performs a check that it is a modification of a mocked object.
                // Non-determinism here is inevitable, due to our decoupled approach in timeline implementation.
                // This may be improved in future.
                if ((incoming.$name === 'location' && !isWindow(thisArg))
                    || !isLocation(thisArg)) {
                    log.print('navigatePopupToItself - tried to navigate a blocked popup to itself');
                    abort();
                }
            }
            // Look up a recent event record for a blocked popup
            var currentFrameRecords = events[index];
            var l = currentFrameRecords.length;
            // eslint-disable-next-line no-plusplus
            while (l--) {
                var evt = currentFrameRecords[l];
                if (incoming.$timeStamp - evt.$timeStamp > NAVIGATION_TIMING_THRESOLD) {
                    // Do not lookup too old event
                    break;
                }
                var context_1 = evt.$data.externalContext; // supposedly
                if (context_1 && context_1.mocked
                    && context_1.defaultEventHandlerTarget === newLocation) {
                    // eslint-disable-next-line max-len
                    log.print('navigatePopupToItself - tried to navigate a blocked popup to a target of a recently blocked popup initiator');
                    abort();
                }
            }
        }
        return true;
    };

    var TimelineEvent = /** @class */ (function () {
        function TimelineEvent($type, $name, $data) {
            this.$type = $type;
            this.$name = $name;
            this.$data = $data;
            this.$timeStamp = getTime();
        }
        return TimelineEvent;
    }());

    var beforeTest = [createOpen$1, aboutBlank$1];
    var afterTest = [navigatePopupToItself];
    var EVENT_RETENTION_LENGTH = 5000;
    var Timeline = /** @class */ (function () {
        function Timeline() {
            this.events = [];
            this.isRecording = false;
        }
        /**
         * When an event is registered, it performs some checks by calling functions of type `condition`
         * which accepts an existing events as a first argument, and an incoming event as a second argument.
         * An object at which the event is happened is included in the event as a `data` property,
         * and such functions can act on it appropriately, for example, it can close a popup window.
         */
        Timeline.prototype.registerEvent = function (event, index) {
            if (this.isRecording) {
                var name_1 = event.$name ? event.$name.toString() : '';
                log.print("Timeline.registerEvent: ".concat(event.$type, " ").concat(name_1), event.$data);
            }
            var i = afterTest.length;
            // eslint-disable-next-line no-plusplus
            while (i--) {
                afterTest[i](index, this.events, event);
            }
            var frameEvents = this.events[index];
            frameEvents.push(event);
            if (!this.isRecording) {
                setTimeout(function () {
                    frameEvents.splice(frameEvents.indexOf(event), 1);
                }, EVENT_RETENTION_LENGTH);
            }
        };
        /**
         * Wrapped window.open calls this. If it returns false, it does not call window.open.
         * beforeTests are basically the same as the afterTests except that
         * it does not accept a second argument.
         */
        Timeline.prototype.canOpenPopup = function (index) {
            log.call('Inquiring events timeline about whether window.open can be called...');
            var i = beforeTest.length;
            // eslint-disable-next-line no-plusplus
            while (i--) {
                if (!beforeTest[i](index, this.events)) {
                    log.print('false');
                    log.callEnd();
                    return false;
                }
            }
            log.print('true');
            log.callEnd();
            return true;
        };
        Timeline.prototype.onNewFrame = function (window) {
            var pos = this.events.push([]) - 1;
            // Registers a unique event when a frame is first created.
            // It passes the `window` object of the frame as a value of `$data` property.
            this.registerEvent(new TimelineEvent(0 /* TLEventType.CREATE */, undefined, {
                thisOrReceiver: window,
            }), pos);
            return pos;
        };
        /**
         * Below methods are used only for logging & testing purposes.
         * It does not provide any functionality to block popups,
         * and is stipped out in production builds.
         * In dev build, the timeline instance is exposed to the global scope with a name '__t',
         * and one can call below methods of it to inspect how the popup script calls browser apis.
         * In test builds, it is used to access a private member `events`.
         */
        Timeline.prototype['startRecording'] = function () {
            this.isRecording = true;
        };
        /**
         * Returns an array. Its elements corresponds to frames to which the current window
         * has access, and the first element corresponds to the current window.
         */
        Timeline.prototype['takeRecords'] = function () {
            this.isRecording = false;
            var res = this.events.map(function (el) { return (Array.prototype.slice.call(el)); });
            var now = getTime();
            var l = this.events.length;
            // eslint-disable-next-line no-plusplus
            while (l-- > 0) {
                var frameEvents = this.events[l];
                while (frameEvents[0]) {
                    if (now - frameEvents[0].$timeStamp > EVENT_RETENTION_LENGTH) {
                        frameEvents.shift();
                    }
                    else {
                        break;
                    }
                }
            }
            return res;
        };
        return Timeline;
    }());
    var timeline = new Timeline();
    /**
     * These are called from the outside of the code,
     * so we have to make sure that call structures of those are not modified.
     * It is removed in minified builds, see the gulpfile.
     */
    function cc_export() {
        // @ts-ignore
        window.registerEvent = timeline.registerEvent;
        // @ts-ignore
        window.canOpenPopup = timeline.canOpenPopup;
        // @ts-ignore
        window.onNewFrame = timeline.onNewFrame;
    }
    cc_export();
    if (RECORD) {
        // TODO make preprocessor plugin to cut these from beta and release builds
        // @ts-ignore
        window.__t = timeline; // eslint-disable-line no-underscore-dangle
    }

    var expect$1 = chai.expect;
    describe('Timeline', function () {
        it('records must be empty when it is first created', function () {
            var records = timeline.takeRecords();
            expect$1(records.length).to.equal(0);
        });
        it('should log when Timeline#onNewFrame is called first', function () {
            timeline.onNewFrame(window);
            var firstEvent = timeline.takeRecords()[0][0];
            expect$1(firstEvent.$type).to.equal(0 /* TLEventType.CREATE */);
        });
    });

    var expect = chai.expect;
    describe('createUrl', function () {
        it('returns a domain part only for usual urls', function () {
            var url = 'https://subdomain.domain.com/some/path/and?query=param#and#hash';
            var _a = createUrl(url), displayUrl = _a[0], canonicalUrl = _a[1];
            expect(displayUrl).to.equal('subdomain.domain.com/some/path/and?query=param#and#hash');
            expect(canonicalUrl).to.equal('subdomain.domain.com');
        });
        it('includes protocol too for non-http, https url schemes', function () {
            var _a;
            var url1 = 'about:blank';
            var _b = createUrl(url1), displayUrl = _b[0], canonicalUrl = _b[1];
            expect(displayUrl).to.equal('about:blank');
            expect(canonicalUrl).to.equal('about:blank');
            var url2 = 'data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E';
            _a = createUrl(url2), displayUrl = _a[0], canonicalUrl = _a[1];
            expect(displayUrl).to.equal('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
            expect(canonicalUrl).to.equal('data:text/html');
        });
    });

})();
