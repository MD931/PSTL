app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    //Précéder le nom du localstorage par le nom de l'app
    .setPrefix(appName)
    //Utilisation du localStorage au lieu de sessionStorage ou les cookies
    .setStorageType('localStorage');
});
app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.timeout = 1000;
}]);
