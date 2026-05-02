import {
    context,
    getCurrentParticipants
} from '../../index.js';

export {
    initialize,
};

function initialize() {
    const { powerUserSettings } = context();
    const canInitialize = 'macros' in context() && powerUserSettings.experimental_macro_engine;

	if (!canInitialize) return;

    const { macros } = context();
    const { category } = macros;

    macros.register('groupPresent', {
        handler: function () {
            const participants = getCurrentParticipants().present;
            const characters = participants.map((avatar) => {
                const character = context().characters.find(char => char.avatar === avatar);
                return character && character?.name ? character.name : null;
            });

            const charactersFiltered = characters.filter(name => name !== null);

            return charactersFiltered?.length ? charactersFiltered.join(', ') : '';
        },
        category: category.NAMES,
        description: 'Returns the names of characters detected by Presence as present in the current group chat.',
        returns: 'list of character names'
    });
}