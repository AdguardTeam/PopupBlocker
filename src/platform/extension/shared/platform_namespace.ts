/**
 * Callback-based extension api namespace.
 */

export default <typeof chrome>(typeof chrome !== 'undefined' ? chrome : browser);
