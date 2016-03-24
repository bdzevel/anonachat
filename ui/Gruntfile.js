"use strict";

module.exports = function(grunt)
{
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		bower:
		{
			install:
			{
				options:
				{
					targetDir: "dist/public/lib",
					layout: "byComponent",
					cleanTargetDir: true,
					cleanBowerDir: true
				}
			}
		},
		browserify:
		{
			app:
			{
				src: "app.jsx",
				dest: "dist/anonachat-ui-react.js",
				options: { transform: ["reactify"] }
			}
		},
		uglify:
		{
			app:
			{
				files: { "dist/anonachat-ui-react.js": "dist/anonachat-ui-react.js" }
			},
			options:
			{
				compress: true,
				mangle: true,
				sourceMap: true,
				sourceMapName: "dist/anonachat-ui-react.map"
			}
		}
	});

	grunt.loadNpmTasks("grunt-bower-task");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask("default", ["bower", "browserify", "uglify"]);
	
};