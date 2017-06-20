import gulp from 'gulp';
import gulpIgnore from 'gulp-ignore';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import runSequence from 'run-sequence';
import ts from 'gulp-typescript';
import tslint from 'gulp-tslint';
import typescript from 'typescript';
import debug from 'gulp-debug';
import merge from 'merge2';

const tsProject = ts.createProject('tsconfig.json'
                                  , { typescript: typescript
                                    , rootDir: __dirname
                                  });

const tslintReportOption = { emitError: false };

gulp.task('typescript', function() {
  const tsResult =
    gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tslint({
          configuration:'./tslint.json',
          formattersDirectory:'./node_modules/custom-tslint-formatters/formatters',
          formatter: 'grouped'
        }))
        .pipe(tslint.report(tslintReportOption))
        .pipe(debug({title: 'tsc :'}))
        .pipe(tsProject(ts.reporter.longReporter()));

  // NOTE: we need to split the typescript definitions (which should not go
  // through babel) from the actual .ts files (that should go through babel)
  return merge(
    [ tsResult.dts
              .pipe(gulp.dest('dist')),
      tsResult.js
              .pipe(debug({title: 'babel:'}))
              .pipe(babel()) // transpile with babel
              .pipe(sourcemaps.write('.'))
              .pipe(gulp.dest('dist')) // write files to output
    ]
  );
});

gulp.task('default', cb =>{
  runSequence('typescript', cb);
});
