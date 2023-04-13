import { settingsDao } from '../storage/SettingsDao';
import { AlertController } from '../ui/alert/AlertController';
import { UserscriptApiFacade } from '../storage/UserscriptApiFacade';
import { OPTIONS_PAGE_URL, OPTIONS_PAGE_CONTEXT_NAME } from '../shared';

const alertController = new AlertController(settingsDao, () => {
    window.open(
        OPTIONS_PAGE_URL,
        OPTIONS_PAGE_CONTEXT_NAME,
    );
});
const csApiFacade = new UserscriptApiFacade(settingsDao, alertController);

const BRIDGE_KEY = csApiFacade.expose();

settingsDao.migrateDataIfNeeded();

export {
    csApiFacade,
    BRIDGE_KEY,
};
