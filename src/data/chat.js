/**
 * Chat configuration and constants for the swAI assistant.
 */
import swaiAvatar192 from '../assets/swai-avatar-192.webp';

export const ASSISTANT_NAME = 'swAI';
export const ASSISTANT_SUBTITLE = "Swalih's AI assistant";
export const HERO_CARD_TITLE = 'Ask swAI anything';

/**
 * Avatar image source.
 * Set to empty string '' or null to test/use the inline SVG robot avatar fallback.
 * If the image fails to load (onError), SwaiAvatar will also automatically fall back to the SVG.
 */
export const AVATAR_SRC = swaiAvatar192;
