var token = "token";

angular.module('starter.controllers', ['services', 'googlechart'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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

  //Liste des UE's
.controller('UesCtrl', function($scope, $state, $ionicPopup, serviceHttp, $window,localStorageService,  $ionicSlideBoxDelegate) {

  //Si le token n'existe pas on redirige vers la page de login
if(localStorageService.get(token) == null) {
  $state.go('app.login');
}
  //Chargement pour afficher l'icone de chargement
  $scope.loading = true;

//Récuperation des UE's
serviceHttp.ues(localStorageService.get(token))

    .success(function(data, status){
      console.log(data);

      //Les UE's auxquelle l'étudiant est inscrit
      $scope.my_ues = data.my_ues;

      //Les UE's auxquelle il est pas inscrit
      $scope.other_ues = data.other_ues;

      //On mets le loading à false
      $scope.loading = false;
    })


    .error(function (data, status){
      $state.go('app.logout');
      console.log(data);
    });

    //Alerte à lancer si l'étudiant veut s'inscrire à une UE
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

      //Alerte à afficher si l'inscription à l'UE a échoué
      $scope.inscriptionError = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Inscription',
          template: 'Erreur'
        });
      };

      //D'après le choix de l'étudiant si il veut s'incrire à l'UE ou pas
      alertPopup.then(function(res){
        if(res) {
          serviceHttp.inscriptionUe(localStorageService.get(token), id)
            .success(function(data, status){
              //Si il s'inscrit on raffraichit la page
              $window.location.reload();
            })

            //Si y'a une erreur lors de l'inscription on affiche une alerte
            .error(function (data, status){
              $scope.inscriptionError();
            });

        }
      });


    };


})

//Affichage de la question
.controller('QuestionCtrl', function($scope, $state, $stateParams, $log,$ionicSlideBoxDelegate ,$ionicSideMenuDelegate ,$ionicHistory, $ionicNavBarDelegate,
                                     serviceHttp, localStorageService, $ionicPopup) {

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

  // Variable pour voir si la question est ouverte ou non
  var isOpen;

  //Récupération de la question à partir du serveur
  serviceHttp.getQuestion(localStorageService.get(token), $stateParams.questionId)
    .success(function(data, status){


      isOpen = data.question.opened;
      $scope.session_id = data.question.session_id;

      //Si la question n'est pas ouverte on affiche une alerte
      if(isOpen == "0" ){
        $scope.showAlert();
      } else {
        $scope.question = {
          number: data.question.number,
          question: data.question.title,
          isCheckBox: false,
          responses: []
        };

        //============== Voir le nombre de propositions correctes pour afficher une checkbox ou radio
        var i = 0;
        data.question.propositions.forEach(function (e) {
          if (e.verdict == 1)
            i++;
          $scope.question.responses.push(e);
        });
        if (i > 1)
          $scope.question.isCheckBox = true;
        //============== Fin

        $scope.loading = false;

      }

      //Récuperation du role de l'utilisateur, si c'est un enseignant
      //afficher un bouton pour voir les statistiques
      serviceHttp.getRoles(localStorageService.get(token))
        .success(function(data, status){
          if(data.role.pivot.role_id == "2"){
            $scope.enseignant = true;
          }
        });
    })
    .error(function (data, status){
      console.log(data);
    });

    //Alerte si une question n'est pas ouverte
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Alerte',
        template: 'Question pas encore ouverte'
      });

      //On redirige l'utilisateur vers la séance si la question n'est pas ouverte
      alertPopup.then(function(res) {
        console.log($scope.session_id);
        if($ionicHistory.viewHistory().backView == null){
          $scope.disableHistory();
        }
        $state.go('app.seance', {seanceId:$scope.session_id});
      });
    };

    //Tableau ou on enregistre la réponses des étudiants
  $scope.formModel = [
    responses = []
  ];

  //Variable qui controle si au moins une réponse a été selectionné
  //pour l'affichage du bouton Valider
  $scope.checked=true;

  //Pour la radio dés qu'une réponse est selectionnée, elle peut plus être déselectionné
  $scope.changementR = function(){
    $scope.checked = false;
  };

  //Pour les checkbox
  $scope.changementC = function(){
    var i = 0;
    //Voir le nombre de réponses sélectionné
    Object.keys($scope.formModel.responses).forEach(function(key,index) {

      if($scope.formModel.responses[key] == true){
        if(key == -1){
          $scope.formModel.responses[key] = false;
        }
        i = i+1;
      }

    });

    //Si le nombre de réponse est supérieur à 0 on affiche le bouton Valider
    if(i>0)
      $scope.checked = false;
    else
      $scope.checked = true;
  };

  // Traitement lorsqu'un utilisateur clique sur "Je ne sais pas"
  // Décocher les autres réponses
  $scope.iDontKnow = function(){
    var i = 0;
    if($scope.formModel.responses[-1] == true){
        i = i+1;
      Object.keys($scope.formModel.responses).forEach(function(key,index) {
        if(key != -1){
          $scope.formModel.responses[key] = false;
        }
      });
    }

    if(i>0)
      $scope.checked = false;
    else
      $scope.checked = true;
  };
  //======================== Fin traitement

  $log.info($stateParams);
  $scope.numero = $stateParams.questionId;


  // Lors de la validation des réponses de l'utilisateur
  $scope.validerQuestion = function() {
    $scope.loading = true;
    //Variable ou on stocke les réponses
    var responses ={};

    //Checkbox
    if($scope.question.isCheckBox){
      //Parcours de toutes les propositions
      //Si une question n'est pas présente ou est fausse dans le formMedel lui mettre false
      //Sinon lui mettre true
      $scope.question.responses.forEach(function(e){
        if((typeof $scope.formModel.responses[e.number] === 'undefined' ) || !($scope.formModel.responses[e.number]))
          $scope.formModel.responses[e.number] = "false";
        else
          $scope.formModel.responses[e.number] = "true";

      });

      //Clonage du formModel
      responses = Object.assign({},$scope.formModel.responses);

      //On supprime la réponse "Je ne sais pas" si elle est présente
      //dans le JSON à envoyer au serveur
      if(!(typeof responses[-1] === 'undefined')){
        delete responses[-1];
      }

      console.log(responses);

    }else{//Radio

      //Parcours de toutes les réponses et leurs mettre false
      $scope.question.responses.forEach(function(e){
          responses[e.number] = "false";
      });

      //Après mettre la bonne réponse à True si il n'a pas selectionné "Je ne sais pas"
      if($scope.formModel.response != "-1")
        responses[$scope.formModel.response] = "true";
      console.log(responses);
    }

    serviceHttp.setResponses(localStorageService.get(token), $stateParams.questionId, responses)
      .success(function(data, status){
        $scope.disableHistory();
        $state.go('app.seance', {seanceId:$scope.session_id});
        /*if(!($ionicHistory.viewHistory().backView == null)){
          $ionicHistory.goBack();
        }else{
          $scope.disableHistory();
          $state.go('app.seance', {seanceId:$scope.session_id});
        }*/

      })

      .error(function (data, status){
        $scope.errorSoumissionAlert();
      });

    $scope.errorSoumissionAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Alerte',
        template: 'Erreur lors de la soumission des réponses.'
      });

      alertPopup.then(function(res) {
        console.log($scope.session_id);
        if($ionicHistory.viewHistory().backView == null){
          $scope.disableHistory();
        }
        $state.go('app.seance', {seanceId:$scope.session_id});
      });
    };
  };
})

  //Récuperation de la liste des séances d'une UE
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
        $state.go('app.logout');
      });
})

  //Récuperation de la liste des questions d'une séance
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
        $state.go('app.logout');
      });

  })

  //Controlleur de login
  .controller('LoginCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, $timeout, $ionicPopup,
                                    localStorageService, serviceHttp) {

    if(localStorageService.get(token) != null)
      $state.go('app.ues');

    $ionicHistory.nextViewOptions({
      disableBack: true
    }); // Desactiver le bouton back vers la page login

    $ionicSideMenuDelegate.canDragContent(false); //Desactiver le slide menu gauche

    //Un alerte si y a une erreur de connexion
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Problème !',
        template: 'Erreur de connexion !'
      });
    };
    $scope.loading = false;

    $scope.doLogin = function() {
      $scope.loading = true;

      serviceHttp.login($scope.loginData.username, $scope.loginData.password)


      .success(function(data, status){
        $scope.loading = false;
        if(status=='200'){
          //On enregistre le token dans le localStorage
          localStorageService.set(token, data.token);
          //On redirige vers la liste des UE's
          $state.go('app.ues');
        }else{
          $scope.showAlert();
        }

      })
      .error(function (data, status){
        $scope.showAlert();
        $scope.loading = false;
      });

    };


 })
  .controller('LogoutCtrl', function($scope, $state, localStorageService){

    //On supprime le token
    localStorageService.clearAll(token);

    //On redirige vers la page de login
    $state.go('app.login');

  })

  //Affichage des statistiques
  .controller('StatsCtrl', function($scope, $stateParams, localStorageService, serviceHttp){

    $scope.loading = true;
    var cols = [];
    var rows = [];
    $scope.myChartObject = {};

    //Récuperation des statistiques
    serviceHttp.getStats(localStorageService.get(token), $stateParams.questionId)


      .success(function(data, status){

        //Voir si c'est un enseignant
        serviceHttp.getRoles(localStorageService.get(token))
          .success(function(data, status){
            if(data.role.pivot.role_id == "2"){
              $scope.enseignant = true;
            }
          });
        $scope.question = {
          id: data.question.id,
          title : data.question.title,
          number : data.question.number,
          propositions : data.question.propositions
        };

        //On construit le graphe
        cols.push({id:"t", label: data.question.title, type: "string"});
        cols.push({id:"s", label: "Tour 1", type: "number"});
        //cols.push({id:"s", label: "Tour 2", type: "number"});

        //On ajoute les stats sur le graphe
        data.question.propositions.forEach(function (e) {
          if(e.number == "0"){
            rows.push({
              c: [
                {v: "Je ne sais pas"},
                {v: e.stat.responses_count}
              ]
            })
          }else {
            rows.push({
              c: [
                {v: e.number},
                {v: e.stat.responses_count}
              ]
            })
          }
        });

        $scope.myChartObject.data = {"cols":cols, "rows":rows};
        console.log(rows);

        $scope.myChartObject.type = "Bar";
        $scope.myChartObject.options = {
          'title': data.question.title
        };
        $scope.loading = false;
      })
      .error(function (data, status){
        $state.go('app.logout');
      });
  });
