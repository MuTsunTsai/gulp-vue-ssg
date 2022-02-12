# gulp-vue-ssg

> Gulp plugin for Vue3 static site generation (SSG).

![](https://img.shields.io/badge/Gulp-4.0-red)
![](https://img.shields.io/badge/Vue-3.0-brightgreen)

This plugin compiles .vue files (using [esbuild](https://www.npmjs.com/package/esbuild)) and performs static site generation for [client hydration](https://vuejs.org/guide/scaling-up/ssr.html#client-hydration).

## License

MIT &copy; Mu-Tsun Tsai

## Install

```bash
npm install gulp-vue-ssg --save-dev
```

## Usage

```javascript
import gulp from 'gulp';
import ssg from 'gulp-vue-ssg';

// Or you can use any Vue3 plugin of your choice.
import esVue from 'esbuild-plugin-vue-next';

export default () => gulp.src('src/index.htm')
	.pipe(ssg({
		appRoot: 'src/app.vue',
		plugins: [esVue()],

		/**
		 * Where to inject the compiled result. Optional.
		 * Default value is `__VUE_SSG__`.
		 */
		injectTo: '__VUE_SSG__',

		/**
		 * Whether DOM is needed during generation. Optional.
		 * Default value is `false`.
		 *
		 * In theory, SSG generation is not supposed to depend
		 * on DOM, but your app may depend on a package that
		 * throws errors if DOM is not available, and in those
		 * cases you can set this to true to make things work.
		 *
		 * You need to install optional dependency `jsdom` and
		 * `global-jsdom` to use this.
		 */
		useDOM: true,
	}))
	.pipe(gulp.dest('dist'));
```

And this plugin will bundle and compile `src/app.vue` and inject the result to `__VUE_SSG__` in `src/index.htm`.
