import gulp from 'gulp';

// Or you can use any Vue3 plugin of your choice.
import esVue from 'esbuild-plugin-vue-next';

// You would use 'gulp-vue-ssg' instead here
import ssg from '../dist/index.js';

export const vue = () => gulp.src('app.vue')
	.pipe(ssg({
		esbuildOptions: {
			plugins: [esVue()],
			target: 'es2019',
		},
		useDOM: true,
	}))
	.pipe(gulp.dest('../build'));

export default () => gulp.src('index.htm')
	.pipe(ssg({
		appRoot: 'app.vue',
		esbuildOptions: {
			plugins: [esVue()],
			target: 'es2019',
		},
		useDOM: true,
	}))
	.pipe(gulp.dest('../build'));
