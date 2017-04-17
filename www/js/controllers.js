var token = "token";

angular.module('starter.controllers', ['services', 'googlechart'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };


})

.controller('UesCtrl', function($scope, $state, $ionicPopup, serviceHttp, $window,localStorageService,  $ionicSlideBoxDelegate) {


  //$ionicSlideBoxDelegate.enableSlide(true);
if(localStorageService.get(token) == null) {
  $state.go('app.login');
}

  $scope.loading = true;

serviceHttp.ues(localStorageService.get(token))

    .success(function(data, status){
      console.log(data);
      $scope.my_ues = data.my_ues;
      $scope.other_ues = data.other_ues;
      $scope.loading = false;
    })


    .error(function (data, status){
      //if(status == "401") {
      $state.go('app.logout');
      //}
      console.log(data);
      //$scope.showAlert();
      //$scope.loading = false;
    });

    $scope.inscriptionAlert = function(id) {
      var alertPopup = $ionicPopup.confirm({
        title: 'Inscription',
        template: 'Voulez vous vous inscrire à l\'UE ?',
        buttons:[
          { text: "Annuler",
            onTap:function(e){
              return false;
            }
          },
          {
            text: "Enregistrer",
            type: 'button-positive',
            onTap: function (e) {
              return true;
            }
          }
        ]
      });

      alertPopup.then(function(res){
        if(res) {
          serviceHttp.inscriptionUe(localStorageService.get(token), id)
            .success(function(data, status){
              console.log("dataaaaa"+data);
              //$state.go('app.ues', null, {reload:true, inherit:false});
              $window.location.reload();
              //$window.location.reload(true);
              //$state.reload();

            })


            .error(function (data, status){
              $scope.inscriptionError();
              console.log(data);
            });

        }
      });


    };

  $scope.inscriptionError = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Inscription',
      template: 'Erreur'
    });
  };


})
.controller('QuestionCtrl', function($scope, $state, $stateParams, $log,$ionicSlideBoxDelegate ,$ionicSideMenuDelegate ,$ionicHistory, $ionicNavBarDelegate,
                                     serviceHttp, localStorageService, $ionicPopup) {

  //Désactiver le slide menu gauche
  //$scope.disableSwipe = function() {
    //$ionicSlideBoxDelegate.enableSlide(true);
  //};*/

  //$ionicSideMenuDelegate.canDragContent(true);

  //Désactiver le bouton retour arrière
  $scope.disableHistory = function(){
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
  };

  if(localStorageService.get(token) == null) {
    $state.go('app.login');
  }




  $scope.loading = true;
  var isOpen;
  serviceHttp.getQuestion(localStorageService.get(token), $stateParams.questionId)

    .success(function(data, status){
      console.log(data);
      isOpen = data.question.opened;
      $scope.session_id = data.question.session_id;
      if(isOpen == "0" ){
        $scope.showAlert();
      } else {

        $scope.question = {
          number: data.question.number,
          question: data.question.title,
          isCheckBox: false,
          responses: []
        };
        var i = 0;
        data.question.propositions.forEach(function (e) {
          if (e.verdict == 1)
            i++;
          $scope.question.responses.push(e);
        });

        if (i > 1)
          $scope.question.isCheckBox = true;

        $scope.loading = false;

      }
    })

    .error(function (data, status){
      //$state.go('app.logout');
      console.log(data);
    });

    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Alerte',
        template: 'Question pas encore ouverte'
      });

      alertPopup.then(function(res) {
        console.log($scope.session_id);
        if($ionicHistory.viewHistory().backView == null){
          $scope.disableHistory();
        }
        $state.go('app.seance', {seanceId:$scope.session_id});
      });
    };


  $scope.formModel = [
    responses = []
  ];


  $scope.checked=true;


  $scope.changementR = function(){
    $scope.checked = false;
    console.log($scope.formModel);
  };

  $scope.changementC = function(){

    //if($scope.formModel.reponses.length != 0)
    /*$scope.formModel.responses.forEach(function(e){
      console.log(e);

    });*/

    console.log($scope.formModel);
    var i = 0;
    Object.keys($scope.formModel.responses).forEach(function(key,index) {

      //console.log($scope.formModel.responses[key]);
      if($scope.formModel.responses[key] == true){
        if(key == -1){
          $scope.formModel.responses[key] = false;
        }
        i = i+1;
      }

    });
    //console.log(i);
    //i = 0;
    if(i>0)
      $scope.checked = false;
    else
      $scope.checked = true;
    //console.log($scope.formModel.responses);
  };

  $scope.iDontKnow = function(){

    console.log($scope.formModel);
    var i = 0;
    if($scope.formModel.responses[-1] == true){
        i = i+1;
      Object.keys($scope.formModel.responses).forEach(function(key,index) {
        if(key != -1){
          $scope.formModel.responses[key] = false;
        }
      });
    }
    /*Object.keys($scope.formModel.responses).forEach(function(key,index) {
      if($scope.formModel.responses[key] == true){
        i = i+1;
      }

    });*/
    //console.log(i);
    //i = 0;
    if(i>0)
      $scope.checked = false;
    else
      $scope.checked = true;
    //console.log($scope.formModel.responses);
  };

  $log.info($stateParams);
  $scope.numero = $stateParams.questionId;



  /*$scope.nextQuestion = function($index){
    //alert($index);
    //$scope.current = $index;

    /*
    * Faire ici le traitement de chaque réponse
    * */
    /*$ionicSlideBoxDelegate.slide($index);
    $scope.checked=true;
  }*/

  $scope.validerQuestion = function() {
    $scope.loading = true;
    var responses ={};
    if($scope.question.isCheckBox){
      //Checkbox


      //parcours de toutes les propositions
      $scope.question.responses.forEach(function(e){
        if((typeof $scope.formModel.responses[e.number] === 'undefined' ) || !($scope.formModel.responses[e.number]))
          $scope.formModel.responses[e.number] = "false";
        else
          $scope.formModel.responses[e.number] = "true";

      });

      //Clonage du formModel
      responses = Object.assign({},$scope.formModel.responses);

      if(!(typeof responses[-1] === 'undefined')){
        delete responses[-1];
      }

      console.log(responses);

    }else{
      //Radio

      $scope.question.responses.forEach(function(e){
          responses[e.number] = "false";
      });

      if($scope.formModel.response != "-1")
        responses[$scope.formModel.response] = "true";
      console.log(responses);
    }
    console.log("AFTER");
    console.log(responses);
    console.log("SCOPE");
    console.log($scope.formModel.responses);
    serviceHttp.setResponses(localStorageService.get(token), $stateParams.questionId, responses)

      .success(function(data, status){
        console.log(data);

        console.log($ionicHistory.viewHistory());
        if(!($ionicHistory.viewHistory().backView == null)){
          $ionicHistory.goBack();
        }else{
          $scope.disableHistory();
          $state.go('app.seance', {seanceId:$scope.session_id});
        }

      })


      .error(function (data, status){

        // if(status == "401")
        //$state.go('app.logout');
        console.log(data);
        //$scope.showAlert();
        //$scope.loading = false;
      });

    //console.log($scope.formModel);
    //$state.go('app.resultats');

  };
})

  .controller ('UeCtrl', function($scope, $state, $stateParams,serviceHttp, localStorageService){

    if(localStorageService.get(token)== null) {
      $state.go('app.login');
    }

    $scope.loading = true;

    serviceHttp.sessions(localStorageService.get(token), $stateParams.ueId)

      .success(function(data, status){
        console.log(data.ue.sessions);
        $scope.data = data.ue.sessions;
        $scope.loading = false;
      })


      .error(function (data, status){

        // if(status == "401")
        $state.go('app.logout');
        console.log(data);
        //$scope.showAlert();
        //$scope.loading = false;
      });



})

  .controller ('SeanceCtrl', function($scope, $state, $stateParams, $ionicHistory, serviceHttp, localStorageService){

    if(localStorageService.get(token)== null) {
      $state.go('app.login');
    }

    $scope.loading = true;

    serviceHttp.questions(localStorageService.get(token), $stateParams.seanceId)

      .success(function(data, status){
        console.log(data.session.questions);
        $scope.data = data.session.questions;
        $scope.loading = false;
      })


      .error(function (data, status){

        // if(status == "401")
        $state.go('app.logout');
        console.log(data);
        //$scope.showAlert();
        //$scope.loading = false;
      });

  })

  .controller('LoginCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, $timeout, $ionicPopup,
                                    localStorageService, serviceHttp) {

    if(localStorageService.get(token) != null)
      $state.go('app.ues');

    $ionicHistory.nextViewOptions({
      disableBack: true
    }); // Desactiver le bouton back vers la page login
    $ionicSideMenuDelegate.canDragContent(false); //Desactiver le slide menu gauche
    //$state.go('app.search');


    // Perform the login action when the user submits the login form

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system


    // An alert dialog
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Problème !',
        template: 'Erreur de connexion !'
      });
    };

    $scope.loading = false;
    $scope.doLogin = function() {
      //$log.info('Doing login', $scope.loginData);

      //console.log($scope.loginData.username);



      $scope.loading = true;


      serviceHttp.login($scope.loginData.username, $scope.loginData.password)


      .success(function(data, status){
        if(status=='200'){
          console.log(status);
          $scope.loading = false;
          console.log(data);
          localStorageService.set(token, data.token);
          $state.go('app.ues');
        }else{
          console.log(data);
          console.log(status);
          $scope.showAlert();
          $scope.loading = false;
        }

      })


      .error(function (data, status){

        console.log(data);
        $scope.showAlert();
        $scope.loading = false;
      });

      //loginService.logIn('mouuuuuuu');


      /*$timeout(function() {
        $scope.showAlert();
        $scope.loading = false;
      }, 2000);*/
    };


 })
  .controller('LogoutCtrl', function($scope, $state, localStorageService){

    localStorageService.clearAll(token);
    /*
      Do not forget to send à http request to kill a token in the server after logout.
     */
    $state.go('app.login');

  })

  .controller('StatsCtrl', function($scope, $stateParams, localStorageService, serviceHttp){

    $scope.loading = true;
    var cols = [];
    var rows = [];
    $scope.myChartObject = {};
    serviceHttp.getStats(localStorageService.get(token), $stateParams.questionId)

      .success(function(data, status){
        console.log(data)
        $scope.question = {
          title : data.question.title,
          number : data.question.number,
          propositions : data.question.propositions
        };

        cols.push({id:"t", label: data.question.title, type: "string"});
        cols.push({id:"s", label: "Tour 1", type: "number"});
        //cols.push({id:"s", label: "Tour 2", type: "number"});

        data.question.propositions.forEach(function (e) {
          rows.push({c:[
            {v: e.number},
            {v: e.stat.responses_count}
          ]})
        });
        $scope.myChartObject.data = {"cols":cols, "rows":rows};
        console.log(rows);

        $scope.myChartObject.type = "Bar";
        $scope.myChartObject.options = {
          'title': 'How Much Pizza I Ate Last Night'
        };
        $scope.loading = false;
      })


      .error(function (data, status){

        // if(status == "401")
        $state.go('app.logout');
        console.log(data);
        //$scope.showAlert();
        //$scope.loading = false;
      });

/*
    $scope.myChartObject.data = {"cols": [
      {id: "t", label: "Topping", type: "string"},
      {id: "s", label: "Slices", type: "number"},
      {id: "s", label: "Essai", type: "number"}
    ], "rows": [
      {c: [
        {v: "Mushrooms"},
        {v: 3},
        {v: 5},
      ]},
      {c: [
        {v: "Olives"},
        {v: 31}
      ]},
      {c: [
        {v: "Zucchini"},
        {v: 1},
      ]},
      {c: [
        {v: "Pepperoni"},
        {v: 2},
      ]}
    ]};
*/

  })
;
