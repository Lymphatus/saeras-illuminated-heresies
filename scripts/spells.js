import { MODULE_ID } from "./types.js";

export function appendGIFToSpells(message, html, context) {
    try {
        const spellName = getSpellName(message);
        if (!spellName) {
            return;
        }

        if (html.querySelector(".sih-spell-gif")) {
            console.warn(`[${MODULE_ID}] Spell GIF already exists in chat message.`);
            return;
        }

        const gif = createGIF(spellName);
        if (!gif) {
            return;
        }
        appendGIF(html, gif);
    } catch (error) {
        console.error(`[${MODULE_ID}] Error in appendGIFToSpells:`, error);
    }
}

function getSpellName(message) {
    if (message.type?.toLowerCase() !== 'usage' || message.system?.item?.type?.toLowerCase() !== 'spell') {
        return null;
    }

    const spellName = message.system?.item?.name || message.getAssociatedItem?.()?.name;
    if (!spellName) {
        console.warn(`[${MODULE_ID}] No spell name found in chat message.`);
        return null;
    }
    return spellName;
}

function createGIF(spellName) {
    const endpoint = game.settings.get(MODULE_ID, "endpoint").replace(/\/+$/, "");
    const token = game.settings.get(MODULE_ID, "token");
    if (!endpoint || !token) {
        return null;
    }
    const gifContainer = document.createElement("div");
    gifContainer.classList.add("sih-spell-gif");
    const gifImage = document.createElement("img");
    gifImage.src = getGIFPath(endpoint, token, spellName);
    gifImage.alt = spellName;
    gifImage.onerror = () => gifContainer.remove();
    gifContainer.appendChild(gifImage);
    return gifContainer;
}

function getGIFTarget(html) {
    // dnd5e hides the description from players on concealed cards, so the GIF must go outside it
    if (html.querySelector(".chat-card .card-header[data-concealed]")) {
        return null;
    }
    return html.querySelector(".chat-card .card-description .wrapper");
}

function appendGIF(html, gifContainer) {
    const target = getGIFTarget(html);
    if (target === null) {
        console.log(`[${MODULE_ID}] Appending GIF container to chat message HTML as fallback.`);
        (html.querySelector(".message-content") ?? html).appendChild(gifContainer);
    } else {
        console.log(`[${MODULE_ID}] Appending GIF container to target element.`, target, gifContainer);
        target.appendChild(gifContainer);
    }
}

function getGIFPath(endpoint, token, spellName) {
    return `${endpoint}/img/${encodeURIComponent(spellName)}?k=${encodeURIComponent(token)}`;
}