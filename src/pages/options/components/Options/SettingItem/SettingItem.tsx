import React from 'preact';
import { useCallback } from 'preact/hooks';

type SettingItemProps = {
    item: string,
    removeItem: (item:string)=>void
};

export const SettingItem: React.FunctionalComponent<SettingItemProps> = ({
    item,
    removeItem,
}) => {
    const clickHandler = useCallback(() => removeItem(item), [item, removeItem]);

    return (
        <div class="settings__row">
            <div class="settings__name">
                {item}
            </div>
            <button
                onClick={clickHandler}
                class="settings__del"
            />
        </div>
    );
};
