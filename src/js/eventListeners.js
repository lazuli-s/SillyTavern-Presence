import {
    log,
    onChatChanged,
    onGenerationAfterCommands,
    onNewMessage,
    toggleVisibilityAllMessages,
    isActive,
    eventTypes,
    eventSource,
} from "../../index.js";

export function startListeners() {
    eventSource.on(eventTypes.CHAT_CHANGED, async function (...args) {
        log("CHAT_CHANGED", args);

        if (!isActive()) return;

        onChatChanged({forceUpdate: true});
    });

    eventSource.on(eventTypes.CHARACTER_MESSAGE_RENDERED, async function (...args) {
        log("CHARACTER_MESSAGE_RENDERED", args);

        if (!isActive()) return;

        onChatChanged();
    });

    eventSource.on(eventTypes.USER_MESSAGE_RENDERED, async function (...args) {
        log("USER_MESSAGE_RENDERED", args);

        if (!isActive()) return;

        onChatChanged();
    });

    eventSource.makeFirst(eventTypes.GENERATION_AFTER_COMMANDS, async function (...args) {
        log("GENERATION_AFTER_COMMANDS", args);

        if (!isActive()) return;

        await onGenerationAfterCommands(...args);
    });

    eventSource.makeFirst(eventTypes.MESSAGE_RECEIVED, async function (...args) {
        log("MESSAGE_RECEIVED", args);

        if (!isActive()) return;

        await onNewMessage(...args);
        await toggleVisibilityAllMessages(true);
    });

    eventSource.makeLast(eventTypes.MESSAGE_SENT, async function (...args) {
        log("MESSAGE_SENT", args);

        if (!isActive()) return;

        await onNewMessage(...args);
    });

    eventSource.makeFirst(eventTypes.GENERATION_STOPPED, async function (...args) {
        log("GENERATION_STOPPED", args);

        if (!isActive()) return;

        await toggleVisibilityAllMessages(true);
    });
}
