// This Source Code Form is subject to the terms of the Mozilla Public
// license, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

interface EvListener<T extends Function> {
    addListener: (callback: T) => void;
    removeListener: (listener: T) => void;
    hasListener: (listener: T) => boolean;
}

type Listener<T> = EvListener<(arg: T) => void>;

declare namespace browser.alarms {
    type Alarm = {
        name: string,
        scheduledTime: number,
        periodInMinutes?: number,
    };

    type When = {
        when?: number,
        periodInMinutes?: number,
    };
    type DelayInMinutes = {
        delayInMinutes?: number,
        periodInMinutes?: number,
    };
    function create(name?: string, alarmInfo?: When | DelayInMinutes): void;
    function get(name?: string): Promise<Alarm|undefined>;
    function getAll(): Promise<Alarm[]>;
    function clear(name?: string): Promise<boolean>;
    function clearAll(): Promise<boolean>;

    const onAlarm: Listener<Alarm>;
}

declare namespace browser.bookmarks {
    type BookmarkTreeNodeUnmodifiable = "managed";
    type BookmarkTreeNodeType = "bookmark"|"folder"|"separator";
    type BookmarkTreeNode = {
        id: string,
        parentId?: string,
        index?: number,
        url?: string,
        title: string,
        dateAdded?: number,
        dateGroupModified?: number,
        unmodifiable?: BookmarkTreeNodeUnmodifiable,
        children?: BookmarkTreeNode[],
        type?: BookmarkTreeNodeType,
    };

    type CreateDetails = {
        parentId?: string,
        index?: number,
        title?: string,
        url?: string,
    };

    function create(bookmark: CreateDetails): Promise<BookmarkTreeNode>;
    function get(idOrIdList: string|string[]): Promise<BookmarkTreeNode[]>;
    function getChildren(id: string): Promise<BookmarkTreeNode[]>;
    function getRecent(numberOfItems: number): Promise<BookmarkTreeNode[]>;
    function getSubTree(id: string): Promise<[BookmarkTreeNode]>;
    function getTree(): Promise<[BookmarkTreeNode]>;

    type Destination = {
        parentId: string,
        index?: number,
    } | {
        index: number,
        parentId?: string,
    };
    function move(id: string, destination: Destination): Promise<BookmarkTreeNode>;
    function remove(id: string): Promise<void>;
    function removeTree(id: string): Promise<void>;
    function search(query: string|{
        query?: string,
        url?: string,
        title?: string,
    }): Promise<BookmarkTreeNode[]>;
    function update(id: string, changes: { title: string, url: string }): Promise<BookmarkTreeNode>;

    const onCreated: EvListener<(id: string, bookmark: BookmarkTreeNode) => void>;
    const onRemoved: EvListener<(id: string, removeInfo: {
        parentId: string,
        index: number,
        node: BookmarkTreeNode,
    }) => void>;
    const onChanged: EvListener<(id: string, changeInfo: {
        title: string,
        url?: string,
    }) => void>;
    const onMoved: EvListener<(id: string, moveInfo: {
        parentId: string,
        index: number,
        oldParentId: string,
        oldIndex: number,
    }) => void>;
}

declare namespace browser.browserAction {
    type ColorArray = [number, number, number, number];
    type ImageDataType = ImageData;

    function setTitle(details: { title: string, tabId?: number }): void;
    function getTitle(details: { tabId?: number }): Promise<string>;

    type IconViaPath = {
        path: string | object,
        tabId?: number,
    };

    type IconViaImageData = {
        imageData: ImageDataType,
        tabId?: number,
    };
    function setIcon(details: IconViaPath | IconViaImageData): Promise<void>;
    function setPopup(details: { popup: string, tabId?: number }): void;
    function getPopup(details: { tabId?: number }): Promise<string>;
    function setBadgeText(details: { text: string, tabId?: number }): void;
    function getBadgeText(details: { tabId?: number }): Promise<string>;
    function setBadgeBackgroundColor(details: { color: string|ColorArray, tabId?: number }): void;
    function getBadgeBackgroundColor(details: { tabId?: number }): Promise<ColorArray>;
    function enable(tabId?: number): void;
    function disable(tabId?: number): void;

    const onClicked: Listener<browser.tabs.Tab>;
}

declare namespace browser.browsingData {
    type DataTypeSet = {
        cache?: boolean,
        cookies?: boolean,
        downloads?: boolean,
        fileSystems?: boolean,
        formData?: boolean,
        history?: boolean,
        indexedDB?: boolean,
        localStorage?: boolean,
        passwords?: boolean,
        pluginData?: boolean,
        serverBoundCertificates?: boolean,
        serviceWorkers?: boolean,
    };

    type DataRemovalOptions = {
        since?: number,
        originTypes?: { unprotectedWeb: boolean },
    };

    function remove(removalOptions: DataRemovalOptions, dataTypes: DataTypeSet): Promise<void>;
    function removeCache(removalOptions?: DataRemovalOptions): Promise<void>;
    function removeCookies(removalOptions: DataRemovalOptions): Promise<void>;
    function removeDownloads(removalOptions: DataRemovalOptions): Promise<void>;
    function removeFormData(removalOptions: DataRemovalOptions): Promise<void>;
    function removeHistory(removalOptions: DataRemovalOptions): Promise<void>;
    function removePasswords(removalOptions: DataRemovalOptions): Promise<void>;
    function removePluginData(removalOptions: DataRemovalOptions): Promise<void>;
    function settings(): Promise<{
        options: DataRemovalOptions,
        dataToRemove: DataTypeSet,
        dataRemovalPermitted: DataTypeSet,
    }>;
}

declare namespace browser.commands {
    type Command = {
        name?: string,
        description?: string,
        shortcut?: string,
    };

    function getAll(): Promise<Command[]>;

    const onCommand: Listener<string>;
}

declare namespace browser.contextMenus {
    type ContextType = "all" | "page" | "frame" | "page" | "link" | "editable" | "image" | "selection"
        | "video" | "audio" | "launcher" | "browser_action" | "page_action" | "password" | "tab";

    type ItemType = "normal" | "checkbox" | "radio" | "separator";

    type OnClickData = {
        menuItemId: number|string,
        modifiers: string[],
        editable: boolean,
        parentMenuItemId?: number|string,
        mediaType?: string,
        linkUrl?: string,
        srcUrl?: string,
        pageUrl?: string,
        frameUrl?: string,
        selectionText?: string,
        wasChecked?: boolean,
        checked?: boolean,
    };

    const ACTION_MENU_TOP_LEVEL_LIMIT: number;

    function create(createProperties: {
        type?: ItemType,
        id?: string,
        title?: string,
        checked?: boolean,
        command?: "_execute_browser_action" | "_execute_page_action" | "_execute_sidebar_action",
        contexts?: ContextType[],
        onclick?: (info: OnClickData, tab: browser.tabs.Tab) => void,
        parentId?: number|string,
        documentUrlPatterns?: string[],
        targetUrlPatterns?: string[],
        enabled?: boolean,
    }, callback?: () => void): number|string;
    function update(id: number|string, updateProperties: {
        type?: ItemType,
        title?: string,
        checked?: boolean,
        contexts?: ContextType[],
        onclick?: (info: OnClickData, tab: browser.tabs.Tab) => void,
        parentId?: number|string,
        documentUrlPatterns?: string[],
        targetUrlPatterns?: string[],
        enabled?: boolean,
    }): Promise<void>;
    function remove(menuItemId: number|string): Promise<void>;
    function removeAll(): Promise<void>;

    const onClicked: EvListener<(info: OnClickData, tab: browser.tabs.Tab) => void>;
}

declare namespace browser.contextualIdentities {
    type IdentityColor = "blue" | "turquoise" | "green" | "yellow" | "orange" | "red" | "pink" | "purple";
    type IdentityIcon = "fingerprint" | "briefcase" | "dollar" | "cart" | "circle";

    type ContextualIdentity = {
        cookieStoreId: string,
        color: IdentityColor,
        icon: IdentityIcon,
        name: string,
    };

    function create(details: {
        name: string,
        color: IdentityColor,
        icon: IdentityIcon,
    }): Promise<ContextualIdentity>;
    function get(cookieStoreId: string): Promise<ContextualIdentity|null>;
    function query(details: { name?: string }): Promise<ContextualIdentity[]>;
    function update(cookieStoreId: string, details: {
        name: string,
        color: IdentityColor,
        icon: IdentityIcon,
    }): Promise<ContextualIdentity>;
    function remove(cookieStoreId: string): Promise<ContextualIdentity|null>;
}

declare namespace browser.cookies {
    type Cookie = {
        name: string,
        value: string,
        domain: string,
        hostOnly: boolean,
        path: string,
        secure: boolean,
        httpOnly: boolean,
        session: boolean,
        expirationDate?: number,
        storeId: string,
    };

    type CookieStore = {
        id: string,
        tabIds: number[],
    };

    type OnChangedCause = "evicted" | "expired" | "explicit" | "expired_overwrite"| "overwrite";

    function get(details: { url: string, name: string, storeId?: string }): Promise<Cookie|null>;
    function getAll(details: {
        url?: string,
        name?: string,
        domain?: string,
        path?: string,
        secure?: boolean,
        session?: boolean,
        storeId?: string,
    }): Promise<Cookie[]>;
    function set(details: {
        url: string,
        name?: string,
        domain?: string,
        path?: string,
        secure?: boolean,
        httpOnly?: boolean,
        expirationDate?: number,
        storeId?: string,
    }): Promise<Cookie>;
    function remove(details: { url: string, name: string, storeId?: string }): Promise<Cookie|null>;
    function getAllCookieStores(): Promise<CookieStore[]>;

    const onChanged: Listener<{ removed: boolean, cookie: Cookie, cause: OnChangedCause }>;
}

declare namespace browser.devtools.inspectedWindow {
    const tabId: number;

    function eval(expression: string): Promise<[
        any,
        { isException: boolean, value: string } | { isError: boolean, code: string }
    ]>;

    function reload(reloadOptions?: {
        ignoreCache?: boolean,
        userAgent?: string,
        injectedScript?: string,
    }): void;
}

declare namespace browser.devtools.network {
    const onNavigated: Listener<string>;
}

declare namespace browser.devtools.panels {
    type ExtensionPanel = {
        onShown: Listener<Window>,
        onHidden: Listener<void>,
    };

    function create(title: string, iconPath: string, pagePath: string): Promise<ExtensionPanel>;
}

declare namespace browser.downloads {
    type FilenameConflictAction = "uniquify" | "overwrite" | "prompt";

    type InterruptReason = "FILE_FAILED" | "FILE_ACCESS_DENIED" | "FILE_NO_SPACE"
                         | "FILE_NAME_TOO_LONG" | "FILE_TOO_LARGE" | "FILE_VIRUS_INFECTED"
                         | "FILE_TRANSIENT_ERROR" | "FILE_BLOCKED" | "FILE_SECURITY_CHECK_FAILED"
                         | "FILE_TOO_SHORT"
                         | "NETWORK_FAILED" | "NETWORK_TIMEOUT" | "NETWORK_DISCONNECTED"
                         | "NETWORK_SERVER_DOWN" | "NETWORK_INVALID_REQUEST"
                         | "SERVER_FAILED" | "SERVER_NO_RANGE" | "SERVER_BAD_CONTENT"
                         | "SERVER_UNAUTHORIZED" | "SERVER_CERT_PROBLEM" | "SERVER_FORBIDDEN"
                         | "USER_CANCELED" | "USER_SHUTDOWN" | "CRASH";

    type DangerType = "file" | "url" | "content" | "uncommon" | "host" | "unwanted" | "safe"
                    | "accepted";

    type State = "in_progress" | "interrupted" | "complete";

    type DownloadItem = {
        id: number,
        url: string,
        referrer: string,
        filename: string,
        incognito: boolean,
        danger: string,
        mime: string,
        startTime: string,
        endTime?: string,
        estimatedEndTime?: string,
        state: string,
        paused: boolean,
        canResume: boolean,
        error?: string,
        bytesReceived: number,
        totalBytes: number,
        fileSize: number,
        exists: boolean,
        byExtensionId?: string,
        byExtensionName?: string,
    };

    type Delta<T> = {
        current?: T,
        previous?: T,
    };

    type StringDelta = Delta<string>;
    type DoubleDelta = Delta<number>;
    type BooleanDelta = Delta<boolean>;
    type DownloadTime = Date|string|number;

    type DownloadQuery = {
        query?: string[],
        startedBefore?: DownloadTime,
        startedAfter?: DownloadTime,
        endedBefore?: DownloadTime,
        endedAfter?: DownloadTime,
        totalBytesGreater?: number,
        totalBytesLess?: number,
        filenameRegex?: string,
        urlRegex?: string,
        limit?: number,
        orderBy?: string,
        id?: number,
        url?: string,
        filename?: string,
        danger?: DangerType,
        mime?: string,
        startTime?: string,
        endTime?: string,
        state?: State,
        paused?: boolean,
        error?: InterruptReason,
        bytesReceived?: number,
        totalBytes?: number,
        fileSize?: number,
        exists?: boolean,
    };

    function download(options: {
        url: string,
        filename?: string,
        conflictAction?: string,
        saveAs?: boolean,
        method?: string,
        headers?: { [key: string]: string },
        body?: string,
    }): Promise<number>;
    function search(query: DownloadQuery): Promise<DownloadItem[]>;
    function pause(downloadId: number): Promise<void>;
    function resume(downloadId: number): Promise<void>;
    function cancel(downloadId: number): Promise<void>;
    // unsupported: function getFileIcon(downloadId: number, options?: { size?: number }):
    //              Promise<string>;
    function open(downloadId: number): Promise<void>;
    function show(downloadId: number): Promise<void>;
    function showDefaultFolder(): void;
    function erase(query: DownloadQuery): Promise<number[]>;
    function removeFile(downloadId: number): Promise<void>;
    // unsupported: function acceptDanger(downloadId: number): Promise<void>;
    // unsupported: function drag(downloadId: number): Promise<void>;
    // unsupported: function setShelfEnabled(enabled: boolean): void;

    const onCreated: Listener<DownloadItem>;
    const onErased: Listener<number>;
    const onChanged: Listener<{
        id: number,
        url?: StringDelta,
        filename?: StringDelta,
        danger?: StringDelta,
        mime?: StringDelta,
        startTime?: StringDelta,
        endTime?: StringDelta,
        state?: StringDelta,
        canResume?: BooleanDelta,
        paused?: BooleanDelta,
        error?: StringDelta,
        totalBytes?: DoubleDelta,
        fileSize?: DoubleDelta,
        exists?: BooleanDelta,
    }>;
}

declare namespace browser.events {
    type UrlFilter = {
        hostContains?: string,
        hostEquals?: string,
        hostPrefix?: string,
        hostSuffix?: string,
        pathContains?: string,
        pathEquals?: string,
        pathPrefix?: string,
        pathSuffix?: string,
        queryContains?: string,
        queryEquals?: string,
        queryPrefix?: string,
        querySuffix?: string,
        urlContains?: string,
        urlEquals?: string,
        urlMatches?: string,
        originAndPathMatches?: string,
        urlPrefix?: string,
        urlSuffix?: string,
        schemes?: string[],
        ports?: Array<number|number[]>,
    };
}

declare namespace browser.extension {
    type ViewType = "tab" | "notification" | "popup";

    const lastError: string|null;
    const inIncognitoContext: boolean;

    function getURL(path: string): string;
    function getViews(fetchProperties?: { type?: ViewType, windowId?: number }): Window[];
    function getBackgroundPage(): Window;
    function isAllowedIncognitoAccess(): Promise<boolean>;
    function isAllowedFileSchemeAccess(): Promise<boolean>;
    // unsupported: events as they are deprecated
}

declare namespace browser.extensionTypes {
    type ImageFormat = "jpeg" | "png";
    type ImageDetails = {
        format: ImageFormat,
        quality: number,
    };
    type RunAt = "document_start" | "document_end" | "document_idle";
    type InjectDetails = {
        allFrames?: boolean,
        code?: string,
        file?: string,
        frameId?: number,
        matchAboutBlank?: boolean,
        runAt?: RunAt,
    };
    type InjectDetailsCSS = InjectDetails & { cssOrigin?: "user" | "author" };
}

declare namespace browser.history {
    type TransitionType = "link" | "typed" | "auto_bookmark" | "auto_subframe" | "manual_subframe"
                        | "generated" | "auto_toplevel" | "form_submit" | "reload" | "keyword"
                        | "keyword_generated";

    type HistoryItem = {
        id: string,
        url?: string,
        title?: string,
        lastVisitTime?: number,
        visitCount?: number,
        typedCount?: number,
    };

    type VisitItem = {
        id: string,
        visitId: string,
        VisitTime?: number,
        refferingVisitId: string,
        transition: TransitionType,
    };

    function search(query: {
        text: string,
        startTime?: number|string|Date,
        endTime?: number|string|Date,
        maxResults?: number,
    }): Promise<HistoryItem[]>;

    function getVisits(details: { url: string }): Promise<VisitItem[]>;

    function addUrl(details: {
        url: string,
        title?: string,
        transition?: TransitionType,
        visitTime?: number|string|Date,
    }): Promise<void>;

    function deleteUrl(details: { url: string }): Promise<void>;

    function deleteRange(range: {
        startTime: number|string|Date,
        endTime: number|string|Date,
    }): Promise<void>;

    function deleteAll(): Promise<void>;

    const onVisited: Listener<HistoryItem>;

    // TODO: Ensure that urls is not `urls: [string]` instead
    const onVisitRemoved: Listener<{ allHistory: boolean, urls: string[] }>;
}

declare namespace browser.i18n {
    type LanguageCode = string;

    function getAcceptLanguages(): Promise<LanguageCode[]>;

    function getMessage(messageName: string, substitutions?: string|string[]): string;

    function getUILanguage(): LanguageCode;

    function detectLanguage(text: string): Promise<{
        isReliable: boolean,
        languages: { language: LanguageCode, percentage: number }[],
    }>;
}

declare namespace browser.identity {
    function getRedirectURL(): string;
    function launchWebAuthFlow(details: { url: string, interactive: boolean }): Promise<string>;
}

declare namespace browser.idle {
    type IdleState = "active" | "idle" /* unsupported: | "locked" */;

    function queryState(detectionIntervalInSeconds: number): Promise<IdleState>;
    function setDetectionInterval(intervalInSeconds: number): void;

    const onStateChanged: Listener<IdleState>;
}

declare namespace browser.management {
    type ExtensionInfo = {
        description: string,
        // unsupported: disabledReason: string,
        enabled: boolean,
        homepageUrl: string,
        hostPermissions: string[],
        icons: { size: number, url: string }[],
        id: string,
        installType: "admin" | "development" | "normal" | "sideload" | "other";
        mayDisable: boolean,
        name: string,
        // unsupported: offlineEnabled: boolean,
        optionsUrl: string,
        permissions: string[],
        shortName: string,
        // unsupported: type: string,
        updateUrl: string,
        version: string,
        // unsupported: versionName: string,
    };

    function getSelf(): Promise<ExtensionInfo>;
    function uninstallSelf(options: { showConfirmDialog: boolean, dialogMessage: string }): Promise<void>;
}

declare namespace browser.notifications {
    type TemplateType = "basic" /* | "image" | "list" | "progress" */;

    type NotificationOptions = {
        type: TemplateType,
        message: string,
        title: string,
        iconUrl?: string,
    };

    function create(id: string|null, options: NotificationOptions): Promise<string>;

    function clear(id: string): Promise<boolean>;

    function getAll(): Promise<{ [key: string]: NotificationOptions }>;

    const onClosed: Listener<string>;

    const onClicked: Listener<string>;
}

declare namespace browser.omnibox {
    type OnInputEnteredDisposition = "currentTab" | "newForegroundTab" | "newBackgroundTab";
    type SuggestResult = {
        content: string,
        description: string,
    };

    function setDefaultSuggestion(suggestion: { description: string }): void;

    const onInputStarted: Listener<void>;
    const onInputChanged:
        EvListener<(text: string, suggest: (arg: SuggestResult[]) => void) => void>;
    const onInputEntered:
        EvListener<(text: string, disposition: OnInputEnteredDisposition) => void>;
    const onInputCancelled: Listener<void>;
}

declare namespace browser.pageAction {
    type ImageDataType = ImageData;

    function show(tabId: number): void;

    function hide(tabId: number): void;

    function setTitle(details: { tabId: number, title: string }): void;

    function getTitle(details: { tabId: number }): Promise<string>;

    function setIcon(details: {
        tabId: number,
        path?: string|object,
        imageData?: ImageDataType,
    }): Promise<void>;

    function setPopup(details: { tabId: number, popup: string }): void;

    function getPopup(details: { tabId: number }): Promise<string>;

    const onClicked: Listener<browser.tabs.Tab>;
}

declare namespace browser.permissions {
    type Permission = "activeTab" | "alarms" |
        "bookmarks" | "browsingData" | "browserSettings" |
        "contextMenus" | "contextualIdentities" | "cookies" |
        "downloads" | "downloads.open" |
        "find" | "geolocation" | "history" |
        "identity" | "idle" |
        "management" | "menus" |
        "nativeMessaging" | "notifications" |
        "pkcs11" | "privacy" | "proxy" |
        "sessions" | "storage" |
        "tabs" | "theme" | "topSites" |
        "webNavigation" | "webRequest" | "webRequestBlocking";

    type Permissions = {
        origins?: string[],
        permissions?: Permission[]
    };

    function contains(permissions: Permissions): Promise<boolean>;

    function getAll(): Promise<Permissions>;

    function remove(permissions: Permissions): Promise<boolean>;

    function request(permissions: Permissions): Promise<boolean>;

    // Not yet support in Edge and Firefox:
    // const onAdded: Listener<Permissions>;
    // const onRemoved: Listener<Permissions>;
}

declare namespace browser.runtime {
    const lastError: string | null;
    const id: string;

    type Port = {
        name: string,
        disconnect(): void,
        error: object,
        onDisconnect: {
            addListener(cb: (port: Port) => void): void,
            removeListener(): void,
        },
        onMessage: {
            addListener(cb: (message: object) => void): void,
            removeListener(): void,
        },
        postMessage(message: object): void,
        sender?: runtime.MessageSender,
    };

    type MessageSender = {
        tab?: browser.tabs.Tab,
        frameId?: number,
        id?: string,
        url?: string,
        tlsChannelId?: string,
    };

    type PlatformOs =  "mac" | "win" | "android" | "cros" | "linux" | "openbsd";
    type PlatformArch =  "arm" | "x86-32" | "x86-64";
    type PlatformNaclArch = "arm" | "x86-32" | "x86-64";

    type PlatformInfo = {
        os: PlatformOs,
        arch: PlatformArch,
    };

    // type RequestUpdateCheckStatus = "throttled" | "no_update" | "update_available";
    type OnInstalledReason = "install" | "update" | "chrome_update" | "shared_module_update";
    type OnRestartRequiredReason = "app_update" | "os_update" | "periodic";

    function getBackgroundPage(): Promise<Window>;
    function openOptionsPage(): Promise<void>;

    // TODO: Explicitly expose every property of the manifest
    function getManifest(): object;
    function getURL(path: string): string;
    function setUninstallURL(url: string): Promise<void>;
    function reload(): void;
    // Will not exist: https://bugzilla.mozilla.org/show_bug.cgi?id=1314922
    // function RequestUpdateCheck(): Promise<RequestUpdateCheckStatus>;
    function connect(
        extensionId?: string,
        connectInfo?: { name?: string, includeTlsChannelId?: boolean }
    ): Port;
    function connectNative(application: string): Port;

    function sendMessage<T = any, U = any>(
        message: T
    ): Promise<U>;
    function sendMessage<T = any, U = any>(
        message: T,
        options: { includeTlsChannelId?: boolean, toProxyScript?: boolean }
    ): Promise<U>;
    function sendMessage<T = any, U = any>(
        extensionId: string,
        message: T,
    ): Promise<U>;
    function sendMessage<T = any, U = any>(
        extensionId: string,
        message: T,
        options?: { includeTlsChannelId?: boolean, toProxyScript?: boolean }
    ): Promise<U>;

    function sendNativeMessage(
        application: string,
        message: object
    ): Promise<object|void>;
    function getPlatformInfo(): Promise<PlatformInfo>;
    function getBrowserInfo(): Promise<{
        name: string,
        vendor: string,
        version: string,
        buildID: string,
    }>;
    // Unsupported: https://bugzilla.mozilla.org/show_bug.cgi?id=1339407
    // function getPackageDirectoryEntry(): Promise<any>;

    const onStartup: Listener<void>;
    const onInstalled: Listener<{
        reason: OnInstalledReason,
        previousVersion?: string,
        id?: string,
    }>;
    // Unsupported
    // const onSuspend: Listener<void>;
    // const onSuspendCanceled: Listener<void>;
    // const onBrowserUpdateAvailable: Listener<void>;
    // const onRestartRequired: Listener<OnRestartRequiredReason>;
    const onUpdateAvailable: Listener<{ version: string }>;
    const onConnect: Listener<Port>;

    const onConnectExternal: Listener<Port>;

    type onMessagePromise = (
        message: object,
        sender: MessageSender,
        sendResponse: (response: object) => boolean
    ) => Promise<void>;

    type onMessageBool = (
        message: object,
        sender: MessageSender,
        sendResponse: (response: object) => Promise<void>
    ) => boolean;

    type onMessageVoid = (
        message: object,
        sender: MessageSender,
        sendResponse: (response: object) => Promise<void>
    ) => void;

    type onMessageEvent = onMessagePromise | onMessageBool | onMessageVoid;
    const onMessage: EvListener<onMessageEvent>;

    const onMessageExternal: EvListener<onMessageEvent>;
}

declare namespace browser.sessions{
    type Filter = { maxResults?: number }

    type Session = {
        lastModified: number,
        tab: browser.tabs.Tab,
        window: browser.windows.Window
    }

    const MAX_SESSION_RESULTS: number

    function getRecentlyClosed(filter?: Filter): Promise<Session[]>

    function restore(sessionId: string): Promise<Session>

    function setTabValue(tabId: number, key: string, value: string|object): Promise<void>

    function getTabValue(tabId: number, key: string): Promise<void|string|object>

    function removeTabValue(tabId: number, key: string): Promise<void>

    function setWindowValue(windowId: number, key: string, value: string|object): Promise<void>

    function getWindowValue(windowId: number, key: string): Promise<void|string|object>

    function removeWindowValue(windowId: number, key: string): Promise<void>

    const onChanged: EvListener<()=>void>

}

declare namespace browser.sidebarAction {
    type ImageDataType = ImageData;

    function setPanel(details: { panel: string, tabId?: number }): void;

    function getPanel(details: { tabId?: number }): Promise<string>;

    function setTitle(details: { title: string, tabId?: number }): void;

    function getTitle(details: { tabId?: number }): Promise<string>;

    type IconViaPath = {
        path: string | { [index: number]: string },
        tabId?: number,
    };

    type IconViaImageData = {
        imageData: ImageDataType | { [index: number]: ImageDataType },
        tabId?: number,
    };

    function setIcon(details: IconViaPath | IconViaImageData): Promise<void>;

    function open(): Promise<void>;

    function close(): Promise<void>;
}

declare namespace browser.storage {

    // Non-firefox implementations don't accept all these types
    type StorageValue =
        string |
        number |
        boolean |
        null |
        undefined |
        RegExp |
        ArrayBuffer |
        Uint8ClampedArray |
        Uint8Array |
        Uint16Array |
        Uint32Array |
        Int8Array |
        Int16Array |
        Int32Array |
        Float32Array |
        Float64Array |
        DataView |
        StorageArray |
        StorageMap |
        StorageSet |
        StorageObject;

    // The Index signature makes casting to/from classes or interfaces a pain.
    // Custom types are OK.
    interface StorageObject {
        [key: string]: StorageValue;
    }
    // These have to be interfaces rather than types to avoid a circular
    // definition of StorageValue
    interface StorageArray extends Array<StorageValue> {}
    interface StorageMap extends Map<StorageValue,StorageValue> {}
    interface StorageSet extends Set<StorageValue> {}

    interface Get {
        (keys?: string|string[]|null): Promise<StorageObject>;
        /* <T extends StorageObject>(keys: T): Promise<{[K in keyof T]: T[K]}>; */
        <T extends StorageObject>(keys: T): Promise<T>;
    }

    type StorageArea = {
        get: Get,
        // unsupported: getBytesInUse: (keys: string|string[]|null) => Promise<number>,
        set: (keys: StorageObject) => Promise<void>,
        remove: (keys: string|string[]) => Promise<void>,
        clear: () => Promise<void>,
    };

    type StorageChange = {
        oldValue?: any,
        newValue?: any,
    };

    const sync: StorageArea;
    const local: StorageArea;
    // unsupported: const managed: StorageArea;

    type ChangeDict = { [field: string]: StorageChange };
    type StorageName = "sync"|"local" /* |"managed" */;

    const onChanged: EvListener<(changes: ChangeDict, areaName: StorageName) => void>;
}

declare namespace browser.tabs {
    type MutedInfoReason = "capture" | "extension" | "user";
    type MutedInfo = {
        muted: boolean,
        extensionId?: string,
        reason: MutedInfoReason,
    };
    // TODO: Specify PageSettings properly.
    type PageSettings = object;
    type Tab = {
        active: boolean,
        audible?: boolean,
        autoDiscardable?: boolean,
        cookieStoreId?: string,
        discarded?: boolean,
        favIconUrl?: string,
        height?: number,
        highlighted: boolean,
        id?: number,
        incognito: boolean,
        index: number,
        isArticle: boolean,
        isInReaderMode: boolean,
        lastAccessed: number,
        mutedInfo?: MutedInfo,
        openerTabId?: number,
        pinned: boolean,
        selected: boolean,
        sessionId?: string,
        status?: string,
        title?: string,
        url?: string,
        width?: number,
        windowId: number,
    };

    type TabStatus = "loading" | "complete";
    type WindowType = "normal" | "popup" | "panel" | "devtools";
    type ZoomSettingsMode = "automatic" | "disabled" | "manual";
    type ZoomSettingsScope = "per-origin" | "per-tab";
    type ZoomSettings = {
        defaultZoomFactor?: number,
        mode?: ZoomSettingsMode,
        scope?: ZoomSettingsScope,
    };

    const TAB_ID_NONE: number;

    function connect(tabId: number, connectInfo?: { name?: string, frameId?: number }): browser.runtime.Port;
    function create(createProperties: {
        active?: boolean,
        cookieStoreId?: string,
        index?: number,
        openerTabId?: number,
        pinned?: boolean,
        // deprecated: selected: boolean,
        url?: string,
        windowId?: number,
    }): Promise<Tab>;
    function captureVisibleTab(
        windowId?: number,
        options?: browser.extensionTypes.ImageDetails
    ): Promise<string>;
    function detectLanguage(tabId?: number): Promise<string>;
    function duplicate(tabId: number): Promise<Tab>;
    function executeScript(
        tabId: number|undefined,
        details: browser.extensionTypes.InjectDetails
    ): Promise<object[]>;
    function get(tabId: number): Promise<Tab>;
    // deprecated: function getAllInWindow(): x;
    function getCurrent(): Promise<Tab>;
    // deprecated: function getSelected(windowId?: number): Promise<browser.tabs.Tab>;
    function getZoom(tabId?: number): Promise<number>;
    function getZoomSettings(tabId?: number): Promise<ZoomSettings>;
    // unsupported: function highlight(highlightInfo: {
    //     windowId?: number,
    //     tabs: number[]|number,
    // }): Promise<browser.windows.Window>;
    function insertCSS(tabId: number|undefined, details: browser.extensionTypes.InjectDetailsCSS): Promise<void>;
    function removeCSS(tabId: number|undefined, details: browser.extensionTypes.InjectDetails): Promise<void>;
    function move(tabIds: number|number[], moveProperties: {
        windowId?: number,
        index: number,
    }): Promise<Tab|Tab[]>;
    function print(): Promise<void>;
    function printPreview(): Promise<void>;
    function query(queryInfo: {
        active?: boolean,
        audible?: boolean,
        // unsupported: autoDiscardable?: boolean,
        cookieStoreId?: string,
        currentWindow?: boolean,
        discarded?: boolean,
        highlighted?: boolean,
        index?: number,
        muted?: boolean,
        lastFocusedWindow?: boolean,
        pinned?: boolean,
        status?: TabStatus,
        title?: string,
        url?: string|string[],
        windowId?: number,
        windowType?: WindowType,
    }): Promise<Tab[]>;
    function reload(tabId?: number, reloadProperties?: { bypassCache?: boolean }): Promise<void>;
    function remove(tabIds: number|number[]): Promise<void>;
    function saveAsPDF(pageSettings: PageSettings): Promise<
        'saved' |
        'replaced' |
        'canceled' |
        'not_saved' |
        'not_replaced'
    >;
    function sendMessage<T = any, U = object>(tabId: number, message: T, options?: { frameId?: number }): Promise<U|void>;
    // deprecated: function sendRequest(): x;
    function setZoom(tabId: number|undefined, zoomFactor: number): Promise<void>;
    function setZoomSettings(tabId: number|undefined, zoomSettings: ZoomSettings): Promise<void>;
    function update(tabId: number|undefined, updateProperties: {
        active?: boolean,
        // unsupported: autoDiscardable?: boolean,
        // unsupported: highlighted?: boolean,
        loadReplace?: boolean,
        muted?: boolean,
        openerTabId?: number,
        pinned?: boolean,
        // deprecated: selected?: boolean,
        url?: string,
    }): Promise<Tab>;

    const onActivated: Listener<{ tabId: number, windowId: number }>;
    const onAttached: EvListener<(tabId: number, attachInfo: {
        newWindowId: number,
        newPosition: number,
    }) => void>;
    const onCreated: Listener<Tab>;
    const onDetached: EvListener<(tabId: number, detachInfo: {
        oldWindowId: number,
        oldPosition: number,
    }) => void>;
    const onHighlighted: Listener<{ windowId: number, tabIds: number[] }>;
    const onMoved: EvListener<(tabId: number, moveInfo: {
        windowId: number,
        fromIndex: number,
        toIndex: number,
    }) => void>;
    const onRemoved: EvListener<(tabId: number, removeInfo: {
        windowId: number,
        isWindowClosing: boolean,
    }) => void>;
    const onReplaced: EvListener<(addedTabId: number, removedTabId: number) => void>;
    const onUpdated: EvListener<(tabId: number, changeInfo: {
        audible?: boolean,
        discarded?: boolean,
        favIconUrl?: string,
        mutedInfo?: MutedInfo,
        pinned?: boolean,
        status?: string,
        title?: string,
        url?: string,
    }, tab: Tab) => void>;
    const onZoomChanged: Listener<{
        tabId: number,
        oldZoomFactor: number,
        newZoomFactor: number,
        zoomSettings: ZoomSettings,
    }>;
}

declare namespace browser.topSites {
    type MostVisitedURL = {
        title: string,
        url: string,
    };
    function get(): Promise<MostVisitedURL[]>;
}

declare namespace browser.webNavigation {
    type TransitionType = "link" | "auto_subframe" | "form_submit" | "reload";
                        // unsupported: | "typed" | "auto_bookmark" | "manual_subframe"
                        //              | "generated" | "start_page" | "keyword"
                        //              | "keyword_generated";

    type TransitionQualifier = "client_redirect" | "server_redirect" | "forward_back";
                               // unsupported: "from_address_bar";

    function getFrame(details: {
        tabId: number,
        processId: number,
        frameId: number,
    }): Promise<{ errorOccured: boolean, url: string, parentFrameId: number }>;

    function getAllFrames(details: { tabId: number }): Promise<{
        errorOccured: boolean,
        processId: number,
        frameId: number,
        parentFrameId: number,
        url: string,
    }[]>;

    interface NavListener<T> {
        addListener: (callback: (arg: T) => void, filter?: {
            url: browser.events.UrlFilter[],
        }) => void;
        removeListener: (callback: (arg: T) => void) => void;
        hasListener: (callback: (arg: T) => void) => boolean;
    }

    type DefaultNavListener = NavListener<{
        tabId: number,
        url: string,
        processId: number,
        frameId: number,
        timeStamp: number,
    }>;

    type TransitionNavListener = NavListener<{
        tabId: number,
        url: string,
        processId: number,
        frameId: number,
        timeStamp: number,
        transitionType: TransitionType,
        transitionQualifiers: TransitionQualifier[],
    }>;

    const onBeforeNavigate: NavListener<{
        tabId: number,
        url: string,
        processId: number,
        frameId: number,
        parentFrameId: number,
        timeStamp: number,
    }>;

    const onCommitted: TransitionNavListener;

    const onCreatedNavigationTarget: NavListener<{
        sourceFrameId: number,
        // Unsupported: sourceProcessId: number,
        sourceTabId: number,
        tabId: number,
        timeStamp: number,
        url: string,
        windowId: number,
    }>;

    const onDOMContentLoaded: DefaultNavListener;

    const onCompleted: DefaultNavListener;

    const onErrorOccurred: DefaultNavListener; // error field unsupported

    const onReferenceFragmentUpdated: TransitionNavListener;

    const onHistoryStateUpdated: TransitionNavListener;
}

declare namespace browser.webRequest {
    type ResourceType = "main_frame" | "sub_frame" | "stylesheet" | "script" | "image" | "object"
                      | "xmlhttprequest" | "xbl" | "xslt" | "ping" | "beacon" | "xml_dtd" | "font"
                      | "media" | "websocket" | "csp_report" | "imageset" | "web_manifest"
                      | "other";

    type RequestFilter = {
        urls: string[],
        types?: ResourceType[],
        tabId?: number,
        windowId?: number,
    };

    type HttpHeaders = ({ name: string, binaryValue: number[], value?: string }
                        | { name: string, value: string, binaryValue?: number[] })[];

    type BlockingResponse = {
        cancel?: boolean,
        redirectUrl?: string,
        requestHeaders?: HttpHeaders,
        responseHeaders?: HttpHeaders,
        // unsupported: authCredentials?: { username: string, password: string },
    };

    type UploadData = {
        bytes?: ArrayBuffer,
        file?: string,
    };

    const MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES: number;

    function handlerBehaviorChanged(): Promise<void>;

    // TODO: Enforce the return result of the addListener call in the contract
    //       Use an intersection type for all the default properties
    interface ReqListener<T, U> {
        addListener: (
            callback: (arg: T) => void,
            filter: RequestFilter,
            extraInfoSpec?: Array<U>,
        ) => BlockingResponse|Promise<BlockingResponse>;
        removeListener: (callback: (arg: T) => void) => void;
        hasListener: (callback: (arg: T) => void) => boolean;
    }

    const onBeforeRequest: ReqListener<{
        requestId: string,
        url: string,
        method: string,
        frameId: number,
        parentFrameId: number,
        requestBody?: {
            error?: string,
            formData?: { [key: string]: string[] },
            raw?: UploadData[],
        },
        tabId: number,
        type: ResourceType,
        timeStamp: number,
        originUrl: string,
    }, "blocking"|"requestBody">;

    const onBeforeSendHeaders: ReqListener<{
        requestId: string,
        url: string,
        method: string,
        frameId: number,
        parentFrameId: number,
        tabId: number,
        type: ResourceType,
        timeStamp: number,
        originUrl: string,
        requestHeaders?: HttpHeaders,
    }, "blocking"|"requestHeaders">;

    const onSendHeaders: ReqListener<{
        requestId: string,
        url: string,
        method: string,
        frameId: number,
        parentFrameId: number,
        tabId: number,
        type: ResourceType,
        timeStamp: number,
        originUrl: string,
        requestHeaders?: HttpHeaders,
    }, "requestHeaders">;

    const onHeadersReceived: ReqListener<{
        requestId: string,
        url: string,
        method: string,
        frameId: number,
        parentFrameId: number,
        tabId: number,
        type: ResourceType,
        timeStamp: number,
        originUrl: string,
        statusLine: string,
        responseHeaders?: HttpHeaders,
        statusCode: number,
    }, "blocking"|"responseHeaders">;

    const onAuthRequired: ReqListener<{
        requestId: string,
        url: string,
        method: string,
        frameId: number,
        parentFrameId: number,
        tabId: number,
        type: ResourceType,
        timeStamp: number,
        scheme: string,
        realm?: string,
        challenger: { host: string, port: number },
        isProxy: boolean,
        responseHeaders?: HttpHeaders,
        statusLine: string,
        statusCode: number,
    }, "blocking"|"responseHeaders">;

    const onResponseStarted: ReqListener<{
        requestId: string,
        url: string,
        method: string,
        frameId: number,
        parentFrameId: number,
        tabId: number,
        type: ResourceType,
        timeStamp: number,
        originUrl: string,
        ip?: string,
        fromCache: boolean,
        statusLine: string,
        responseHeaders?: HttpHeaders,
        statusCode: number,
    }, "responseHeaders">;

    const onBeforeRedirect: ReqListener<{
        requestId: string,
        url: string,
        method: string,
        frameId: number,
        parentFrameId: number,
        tabId: number,
        type: ResourceType,
        timeStamp: number,
        originUrl: string,
        ip?: string,
        fromCache: boolean,
        statusCode: number,
        redirectUrl: string,
        statusLine: string,
        responseHeaders?: HttpHeaders,
    }, "responseHeaders">;

    const onCompleted: ReqListener<{
        requestId: string,
        url: string,
        method: string,
        frameId: number,
        parentFrameId: number,
        tabId: number,
        type: ResourceType,
        timeStamp: number,
        originUrl: string,
        ip?: string,
        fromCache: boolean,
        statusCode: number,
        statusLine: string,
        responseHeaders?: HttpHeaders,
    }, "responseHeaders">;

    const onErrorOccurred: ReqListener<{
        requestId: string,
        url: string,
        method: string,
        frameId: number,
        parentFrameId: number,
        tabId: number,
        type: ResourceType,
        timeStamp: number,
        originUrl: string,
        ip?: string,
        fromCache: boolean,
        error: string,
    }, void>;
}

declare namespace browser.windows {
    type WindowType = "normal" | "popup" | "panel" | "devtools";

    type WindowState = "normal" | "minimized" | "maximized" | "fullscreen" | "docked";

    type Window = {
        id?: number,
        focused: boolean,
        top?: number,
        left?: number,
        width?: number,
        height?: number,
        tabs?: browser.tabs.Tab[],
        incognito: boolean,
        type?: WindowType,
        state?: WindowState,
        alwaysOnTop: boolean,
        sessionId?: string,
    };

    type CreateType = "normal" | "popup" | "panel" | "detached_panel";

    const WINDOW_ID_NONE: number;

    const INDOW_ID_CURRENT: number;

    function get(windowId: number, getInfo?: {
        populate?: boolean,
        windowTypes?: WindowType[],
    }): Promise<browser.windows.Window>;

    function getCurrent(getInfo?: {
        populate?: boolean,
        windowTypes?: WindowType[],
    }): Promise<browser.windows.Window>;

    function getLastFocused(getInfo?: {
        populate?: boolean,
        windowTypes?: WindowType[],
    }): Promise<browser.windows.Window>;

    function getAll(getInfo?: {
        populate?: boolean,
        windowTypes?: WindowType[],
    }): Promise<browser.windows.Window[]>;

    // TODO: url and tabId should be exclusive
    function create(createData?: {
        url?: string|string[],
        tabId?: number,
        left?: number,
        top?: number,
        width?: number,
        height?: number,
        // unsupported: focused?: boolean,
        incognito?: boolean,
        type?: CreateType,
        state?: WindowState,
    }): Promise<browser.windows.Window>;

    function update(windowId: number, updateInfo: {
        left?: number,
        top?: number,
        width?: number,
        height?: number,
        focused?: boolean,
        drawAttention?: boolean,
        state?: WindowState,
    }): Promise<browser.windows.Window>;

    function remove(windowId: number): Promise<void>;

    const onCreated: Listener<browser.windows.Window>;

    const onRemoved: Listener<number>;

    const onFocusChanged: Listener<number>;
}

declare namespace browser.theme {

    type Theme = {
        images: ThemeImages,
        colors: ThemeColors,
        properties?: ThemeProperties,
    };

    type ThemeImages = {
        headerURL: string,
        theme_frame?: string,
        additional_backgrounds?: string[],
    };

    type ThemeColors = {
        accentcolor: string,
        textcolor: string,
        frame?: [number, number, number],
        tab_text?: [number, number, number],
        toolbar?: string,
        toolbar_text?: string,
        toolbar_field?: string,
        toolbar_field_text?: string,
    };

    type ThemeProperties = {
        additional_backgrounds_alignment: Alignment[],
        additional_backgrounds_tiling: Tiling[],
    }

    type Alignment =
        | 'bottom' | 'center' | 'left' | 'right' | 'top'
        | 'center bottom' | 'center center' | 'center top'
        | 'left bottom' | 'left center' | 'left top'
        | 'right bottom' | 'right center' | 'right top';

    type Tiling = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';

    function getCurrent(): Promise<Theme>;
    function getCurrent(windowId: number): Promise<Theme>;
    function update(theme: Theme): Promise<void>;
    function update(windowId: number, theme: Theme): Promise<void>;
    function reset(): Promise<void>;
    function reset(windowId: number): Promise<void>;
}