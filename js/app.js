// configures loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: '../js/app',
    paths: {
        lib: '../lib',
        Player: '../lib/kierki/js/Player'
    }
});

// starts loading the main app file
requirejs(['GameBox']);
