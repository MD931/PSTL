app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix(appName)
    .setStorageType('localStorage');
});
app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.timeout = 1000;
}]);
