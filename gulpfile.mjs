import gulp from 'gulp';
import ts from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
import newer from 'gulp-newer';

const project = ts.createProject("tsconfig.json");
export default () =>
	project.src()
		.pipe(newer({
			dest: 'dist/index.js',
			extra: ['tsconfig.json'],
		}))
		.pipe(sourcemaps.init())
		.pipe(project())
		.pipe(sourcemaps.write('.', { includeContent: false }))
		.pipe(gulp.dest('dist'));
