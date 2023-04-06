import React from 'preact';
import {
    useState,
    useReducer,
    useCallback,
} from 'preact/hooks';
import {
    OptionInterface,
    OptionItem,
    OptionList,
} from '../../../../../storage/Option';
import { SettingHeader } from '../SettingHeader';
import { SettingItem } from '../SettingItem';
import { Modal } from '../Modal';
import { Portal } from '../../Portal';

export const enum ActionType {
    Add = 'add',
    Remove = 'remove',
}

export type Action = {
    type: ActionType,
    item: OptionItem
};

const reducer = (state: OptionList, action: Action) => {
    const { type, item } = action;
    let nextState = [...state];

    if (type === ActionType.Add && !state.includes(item)) {
        nextState.push(item);
    }

    if (type === ActionType.Remove && state.includes(item)) {
        nextState = nextState.filter((domain) => domain !== item);
    }

    return nextState;
};

type SettingBlockProps = {
    messages: Record<string, string>,
    option: OptionInterface
};

/**
 * Manages userscript's settings storage (allowed/silenced domains)
 */
export const SettingBlock: React.FunctionalComponent<SettingBlockProps> = ({
    messages,
    option,
}) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [domains, dispatch] = useReducer<OptionList, Action, OptionList>(
        reducer,
        [],
        option.getList,
    );

    const showModal = useCallback(() => setIsModalOpen(true), []);

    const hideModal = useCallback(() => setIsModalOpen(false), []);

    const addItem = useCallback((item: string) => {
        dispatch({ type: ActionType.Add, item });
        option.addItem(item);
    }, [option]);

    const removeItem = useCallback((item: string) => {
        dispatch({ type: ActionType.Remove, item });
        option.removeItem(item);
    }, [option]);

    return (
        <>
            {isModalOpen && (
                <Portal>
                    <Modal hideModal={hideModal} addItem={addItem} />
                </Portal>
            )}
            <div class="settings__block">
                <SettingHeader messages={messages} showModal={showModal} />
                {domains.map((item) => (
                    <SettingItem key={item} item={item} removeItem={removeItem} />
                ))}
            </div>
        </>
    );
};
