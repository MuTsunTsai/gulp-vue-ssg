import through2 = require('gulp-through2');
import esbuild = require('esbuild');

const { createSSRApp } = require('vue');
const { renderToString } = require('vue/server-renderer');

import type stream from 'stream';
import type { Component, App } from 'vue';

function requireFromString(src: string) {
	const Module = module.constructor as any;
	const m = new Module();
	m.paths = module.paths; // so that node resolves the modules correctly
	m._compile(src, __dirname + '/virtual.js');
	return m.exports;
}

async function getRoot(options: vueSsgOption) {
	if(typeof options.appRoot == 'object') return options.appRoot;
	const esbuildOptions: esbuild.BuildOptions = Object.assign({
		outfile: 'main.js', // this is necessary for handling sfc containing styles
		entryPoints: [options.appRoot as string],
		bundle: true,
		treeShaking: true,
		format: 'cjs',
		platform: 'node',
		external: ['vue'],
		charset: 'utf8',
		write: false,
		options: options.plugins,
	}, options.esbuildOptions);
	const result = await esbuild.build(esbuildOptions);
	const content = new TextDecoder("utf-8").decode(result.outputFiles![0].contents);
	return requireFromString(content).default;
}

async function renderSSG(options: vueSsgOption) {
	const App = await getRoot(options);
	const ssg = createSSRApp(App);
	options.appOptions?.(ssg);
	return await renderToString(ssg);
}

// For CommonJS default export
export = function(options: vueSsgOption): stream.Transform {
	const cleanup: () => void = options.useDOM ? require('global-jsdom')() : () => { };

	return through2(
		async (content, file) => {
			const vueMode = file.extname == '.vue' && options.appRoot === undefined;
			if(vueMode) {
				options.appRoot = file.path;
				file.extname = ".html";
			}

			const html = await renderSSG(options);
			const result = vueMode ? html : content.replace(options.injectTo ?? '__VUE_SSG__', html);
			cleanup();
			return result;
		},
	);
}

interface vueSsgOption {
	appRoot?: string | Component;
	plugins?: esbuild.Plugin[];
	esbuildOptions?: esbuild.BuildOptions;
	appOptions?: (app: App) => void;
	injectTo?: string;
	useDOM?: boolean;
}
