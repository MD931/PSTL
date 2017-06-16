//Adresse de l'api du serveur
var server = "http://ec2-34-201-121-8.compute-1.amazonaws.com/api/";

angular.module('services', [])

.factory('serviceHttp', function($http){

    return{
        //Récuperation des UE's
        ues: function(token){
            return $http.get(server+'ues?token='+token);
        },

        //Récuperation des séances
        sessions: function(token, ue){
            return $http.get(server+'ues/'+ue+'/sessions?token='+token);
        },

        //Récuperation de la liste des sessions d'une séance
        questions: function(token, session){
          return $http.get(server+'sessions/'+session+'/questions?token='+token);
        },

        //Inscription à une UE
        inscriptionUe: function(token, id){
          data = {};
          return $http.post(server+'ues/'+id+'/subscribe?token='+token, data, { timeout: 1000 });
        },

        //Récuperation des propositions d'une UE
        getQuestion: function(token, id){
          return $http.get(server+'questions/'+id+'/propositions?token='+token);
        },

        //Envoi des réponses d'une question
        setResponses: function(token, id, data){
          return $http.post(server+'questions/'+id+'/responses?token='+token, data);
        },

        //Récuperation des statistiques d'une question
        getStats: function(token, id){
          return $http.get(server+'stat/question/'+id+'?token='+token);
        },

        //Voir si un utilisateur est un enseignant ou étudiant
        getRoles: function(token){
          return $http.get(server+'user/role?token='+token);
        },

        //Connection
        login: function(user, pass){
          var data = {
            username: user,
            password: pass
          };
          return $http.post(server+'auth', data)
        }
    }
});
