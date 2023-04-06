import { settingsDao } from '../storage/SettingsDao';
import { AlertController } from '../ui/alert/AlertController';
import { UserscriptApiFacade } from '../storage/UserscriptApiFacade';

const alertController = new AlertController(settingsDao, () => {
    window.open(
        'https://link.adtidy.org/forward.html?action=popup_blocker_options&from=content_script&app=popup_blocker',
        '__popupBlocker_options_page__',
    );
});
const csApiFacade = new UserscriptApiFacade(settingsDao, alertController);

const BRIDGE_KEY = csApiFacade.expose();

settingsDao.migrateDataIfNeeded();

export {
    csApiFacade,
    BRIDGE_KEY,
};
