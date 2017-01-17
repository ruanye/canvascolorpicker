/**
 * gulp 配置
 */
const gulp = require('gulp'),
     
      browsersync = require('browser-sync');
  
    
//开启自动刷新

gulp.task('server',()=>{
     browsersync.init({
        server: {
            baseDir: './',
        },
        port: 8081
       
    });
    gulp.watch("./**/*").on('change', browsersync.reload);

 
});






















