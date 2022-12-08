import gulp from 'gulp';
import esbuild from 'gulp-esbuild';
import newer from 'gulp-newer';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

export default () =>
	gulp.src('src/index.ts')
		.pipe(newer({
			dest: 'dist/index.js',
			extra: [__filename, 'tsconfig.json'],
		}))
		.pipe(esbuild({
			format: "cjs",
			sourcemap: 'linked',
			sourcesContent: false,
			sourceRoot: "../src",
		}))
		.pipe(gulp.dest('dist'));
