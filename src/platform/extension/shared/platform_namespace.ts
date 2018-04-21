/**
 * Callback-based extension api namespace.
 */

export default <typeof chrome>(typeof chrome === 'object' ? chrome : window["browser"])