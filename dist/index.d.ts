import type { Transform } from 'stream';
import type { Plugin } from 'esbuild';
import type { Component, App } from 'vue';

declare const vueSsg: (options: vueSsgOption) => Transform;

export default vueSsg;

interface vueSsgOption {
	/** Path of the root component .vue file, or you could also pass a pre-compiled component directly. */
	appRoot?: string | Component;

	/** esbuild plugins. You can use any plugin of your choice. */
	plugins?: Plugin[];

	/** Additional setups to the created Vue app. */
	appOptions?: (app: App) => void;

	/** Where to inject the compiled result. Default value is `__VUE_SSG__`. */
	injectTo?: string;

	/**
	 * Whether DOM is needed during generation.
	 *
	 * In theory, SSG generation is not supposed to depend on DOM,
	 * but your app may depend on a package that throws errors if DOM is not available,
	 * and in those cases you can set this to true to make things work.
	 *
	 * You need to install optional dependency `jsdom` and `global-jsdom` to use this.
	 */
	useDOM?: boolean;
}
