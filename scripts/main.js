import { appendGIFToSpells } from './spells.js';
import { MODULE_ID } from "./types.js";

Hooks.once("ready", () => {
    if (!game.user.isGM) return;
    const endpoint = game.settings.get(MODULE_ID, "endpoint");
    const token = game.settings.get(MODULE_ID, "token");
    if (!endpoint || !token) ui.notifications.warn(`${MODULE_ID}: set endpoint and token in the module settings.`);
});

Hooks.once('init', () => {
    console.log(`[${MODULE_ID}] Initializing module.`);
    game.settings.register(MODULE_ID, "endpoint", { name: "Endpoint", scope: "world", config: true, type: String, default: "" });
    game.settings.register(MODULE_ID, "token", { name: "Token", hint: "Your API token. Keep it secret!", scope: "world", config: true, type: String, default: "" });
});

Hooks.once('setup', () => {
    console.log(`[${MODULE_ID}] Setup complete.`);

    Hooks.on("dnd5e.renderChatMessage", (message, html) => {
        try {
            appendGIFToSpells(message, html);
        } catch (err) {
            console.debug(MODULE_ID, err);
        }
    });
});