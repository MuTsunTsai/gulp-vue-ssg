import through from 'through2';
import stream from 'stream';
import PluginError from 'plugin-error';
import * as esbuild from 'esbuild';

import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

import type { Component } from 'vue';
import type File from 'vinyl';
import type { Plugin } from 'esbuild';

function requireFromString(src) {
	const Module = module.constructor as any;
	const m = new Module();
	m.paths = module.paths; // so that node resolves the modules correctly
	m._compile(src, __dirname + '/virtual.js');
	return m.exports;
}

async function getRoot(options: vueSsgOption) {
	if(typeof options.appRoot != 'string') return options.appRoot;
	const result = await esbuild.build({
		entryPoints: [options.appRoot],
		bundle: true,
		treeShaking: true,
		format: 'cjs',
		platform: 'node',
		external: ['vue'],
		charset: 'utf8',
		write: false,
		plugins: options.plugins,
	});
	const content = new TextDecoder("utf-8").decode(result.outputFiles[0].contents);
	return requireFromString(content).default;
}

async function renderSSG(options: vueSsgOption) {
	const App = await getRoot(options);
	const ssg = createSSRApp(App);
	return await renderToString(ssg);
}

// For CommonJS default export
export = function(options: vueSsgOption): stream.Transform {
	const cleanup: () => void = options.useDOM ? require('global-jsdom')() : () => { };

	function transform(this: stream.Transform, file: File, encoding: BufferEncoding, callback: through.TransformCallback) {
		if(file.isNull()) return callback(null, file);
		if(file.isStream()) {
			return callback(new PluginError('gulp-vue-ssg', 'Streaming not supported'));
		}

		const content = file.contents?.toString(encoding || 'utf8') ?? "";

		renderSSG(options).then(html => {
			const result = content.replace(options.injectTo ?? '__VUE_SSG__', html);
			file.contents = Buffer.from(result, encoding);
			cleanup();
			callback(null, file);
		});
	}
	return through.obj(transform);
}

interface vueSsgOption {
	appRoot: string | Component;
	plugins?: Plugin[];
	injectTo?: string;
	useDOM?: boolean;
}
