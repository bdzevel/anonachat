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
					targetDir: "public/lib",
					layout: 'byComponent',
					cleanTargetDir: true,
					cleanBowerDir: true
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-bower-task");

	grunt.registerTask("default", ['bower']);
};