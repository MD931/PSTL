app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix(appName)
    .setStorageType('localStorage');
});
