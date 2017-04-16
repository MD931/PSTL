//var server = "http://ec2-54-85-60-73.compute-1.amazonaws.com/api/";
var server = "http://127.0.0.1:8000/api/";
angular.module('services', [])

.factory('serviceHttp', function($http){

    return{
        ues: function(token){
            return $http.get(server+'ues?token='+token);
        },
        sessions: function(token, ue){
            return $http.get(server+'ues/'+ue+'/sessions?token='+token);
        },
        questions: function(token, session){
          return $http.get(server+'sessions/'+session+'/questions?token='+token);
        },
        inscriptionUe: function(token, id){
          data = {};
          return $http.post(server+'ues/'+id+'/subscribe?token='+token, data);
        },
        getQuestion: function(token, id){
          return $http.get(server+'questions/'+id+'/propositions?token='+token);
        },
        setResponses: function(token, id, data){
          return $http.post(server+'questions/'+id+'/responses?token='+token, data);
        },
        login: function(user, pass){
          var data = {
            username: user,
            password: pass
          };
          return $http.post(server+'auth', data)
        }
    }
});