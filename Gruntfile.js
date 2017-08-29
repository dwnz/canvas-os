module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                sourceMap: true
            },
            os: {
                src: ['js/**'],
                dest: 'dist/os.js'
            }
        },

        watch: {
            files: ['js/**'],
            tasks: ['concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat', 'watch']);
};