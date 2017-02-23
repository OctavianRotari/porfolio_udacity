module.exports = function(grunt){

  require('load-grunt-tasks')(grunt);

  var config = grunt.file.readYAML('Gruntconfig.yml');

  grunt.initConfig({
    sass: {
      dist: {
        expand: true,
        cwd: config.scssDir,
        destination: config.cssDir,
        ext: '.css'
      }
    },
    watch: {
    }
  })

  grunt.registerTask('default', ['sass', 'watch'])
}
