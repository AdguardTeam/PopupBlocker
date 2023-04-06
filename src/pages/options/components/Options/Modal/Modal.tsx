import React from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { isValidDomain } from '../../../utils';
import { preactTranslator, translator } from '../../../../../i18n';

type ModalProps = {
    hideModal: ()=>void,
    addItem: (item: string)=>void,
};

export const Modal: React.FunctionalComponent<ModalProps> = ({
    hideModal,
    addItem,
}) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleChange = useCallback((event: Event) => {
        const inputElement = event.target as HTMLInputElement;
        setInputValue(inputElement.value);
    }, []);

    const handleSubmit = useCallback((event: Event) => {
        event.preventDefault();
        if (isValidDomain(inputValue)) {
            addItem(inputValue);
            hideModal();
        }
    }, [hideModal, addItem, inputValue]);

    return (
        <div class="settings settings-modal">
            <div class="settings__in settings__in--popup">
                <div class="settings__close" onClick={hideModal} />
                <div class="settings__title">
                    {preactTranslator.getMessage('add_site')}
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        onInput={handleChange}
                        class="settings__input"
                        type="text"
                        placeholder={translator.getMessage('site_input_ph')}
                    />
                    <button
                        class="settings__submit"
                        type="submit"
                    >
                        {preactTranslator.getMessage('add_site')}
                    </button>
                </form>
            </div>
        </div>
    );
};
