const app = angular.module('app', ['ngRoute', 'angularUtils.directives.dirPagination']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: './src/authentication/adminLogin.html',
        controller: 'adminLoginController'
    }).when('/adminDashboard', {
            templateUrl: './src/dashboard/adminDashboard.html',
            controller: 'adminController'
    }).when('/newMovie', {
        templateUrl: './src/movie/newMovie.html',
        controller: 'newMovieController'
    }).when('/movies', {
        templateUrl: './src/movie/movies.html',
        controller: 'movieController'
    }).when('/userLogin', {
        templateUrl: './src/authentication/userLogin.html',
        controller: 'userLoginController'
    }).when('/userDashboard', {
        templateUrl: './src/dashboard/userDashboard.html',
        controller: 'userController'
    }).when('/userRegister', {
        templateUrl: './src/authentication/registerUser.html',
        controller: 'userRegisterController'
    }).when('/userMovies', {
        templateUrl: './src/movie/userMovies.html',
        controller: 'userMovieController'
    }).when('/bookings', {
        templateUrl: './src/movie/bookings.html',
        controller: 'bookingsController'
    }).when('/newBooking', {
        templateUrl: './src/movie/newBooking.html',
        controller: 'newBookingController'
    }).otherwise({
         template: '404'
     })
});

//Admin login controller
app.controller('adminLoginController' , function($scope,$location,$http,$rootScope) {
    $scope.goToUserLogin = function () {
        $location.path('/userLogin');
    };

    $scope.adminLogin = function () {
        $scope.loader = true;
        var username = $scope.username;
        var password = $scope.password;
        $http({
            method: 'POST',
            url: 'http://localhost:8081/user/login?position=Admin',
            data: {
                username : username,
                password  : password
                }
        }).then(function(response) {
            $scope.loader = false;
            if(response.data.status === 1){
                $rootScope.token = "Bearer "+response.data.token;
                alert(response.data.message);
                $location.path('/adminDashboard');
            }else {
                alert("Wrong Credentials!");
            }

        });
    };
});

//Admin Dashboard Controller
app.controller('adminController', function ($scope,$location) {
    $scope.logOut = function () {
        $location.path('/');
    }
    $scope.movies = function () {
        $location.path('/movies');
    }
});

//New Movie Controller
app.controller('newMovieController', function ($scope, $location, $http, $rootScope) {
    $scope.creditList = [
        {score: 1},
        {score: 0}
    ];
    $scope.addApplication = function () {
        $scope.loader = true;
        const name = $scope.name;
        const date = $scope.date;
        const price = $scope.price;
        const showTime = $scope.showTime;
        const status = $scope.status;
        const owner = $scope.owner;
        const tickets = $scope.tickets;
        if(status === "1"){
            value = true;
        } else{
            value = false;
        }
        $http({
            method: 'POST',
            url: 'http://localhost:8081/movie/register',
            headers: {'Authorization': $rootScope.token},
            data: {
                    name: name,
                    date: date,
                    price: price,
                    showTime: showTime,
                    owner: owner,
                    status: value,
                    availableTickets: tickets
                  }
        }).then(function(response) {
            if(response.data.status === 1){
                $scope.loader = false;
                alert("New Movie Registered!!");
                $location.path('/movies')
            }
        });
    };
    $scope.back = function () {
        $location.path('/movies');
    }
});

//Movies Controller
app.controller('movieController', function ($scope, $location, $http, $rootScope) {
    $scope.movies = [];
    $http({
        method: 'GET',
        url: 'http://localhost:8081/movie/all',
        headers: {'Authorization': $rootScope.token},
    }).then(function(response) {
        $scope.movies = response.data.movies;
    });

    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.back = function () {
        $location.path('/adminDashboard');
    }

    $scope.newMovie = function () {
        $location.path('/newMovie');
    }

    $scope.remove = function(id){
        $http({
            method: 'POST',
            url: 'http://localhost:8081/movie/remove?id='+id,
            headers: {'Authorization': $rootScope.token}
        }).then(function(response) {
            if(response.data.status === 1){
               alert("Movie Removed");
                $location.path('/adminDashboard');
            }else{
                alert("Error Occurred!, Please try again")
            }
        });
    }
});

//User Login Controller
app.controller('userLoginController' , function($scope,$location,$http,$rootScope) {
    $scope.goToAdminLogin = function () {
        $location.path('/');
    };

    $scope.userLogin = function () {
        $scope.loader = true;
        const username = $scope.username;
        const password = $scope.password;
        $http({
            method: 'POST',
            url: 'http://localhost:8081/user/login?position=User',
            data: {
                username : username,
                password  : password
            }
        }).then(function(response) {
            $scope.loader = false;
            if(response.data.status === 1){
                $rootScope.token = "Bearer "+response.data.token;
                $rootScope.userId = response.data.id;
                alert(response.data.message);
                $location.path('/userDashboard');
            }else {
                alert("Wrong Credentials!");
            }

        });
    };

    $scope.signUp = function (){
        $location.path('/userRegister');
    }
});

//User Dashboard Controller
app.controller('userController', function ($scope,$location) {
    $scope.logOut = function () {
        $location.path('/userLogin');
    }
    $scope.movies = function () {
        $location.path('/userMovies');
    }
    $scope.bookings = function (){
        $location.path("/bookings");
    }
});

//Register User Controller
app.controller('userRegisterController', function ($scope, $location, $http, $rootScope) {
    $scope.registerUser = function () {
        $scope.loader = true;
        const name = $scope.name;
        const username = $scope.username;
        const password = $scope.password;
        const mobile = $scope.mobile;
        const position = "User"
        $http({
            method: 'POST',
            url: 'http://localhost:8081/user/register',
            headers: {'Authorization': $rootScope.token},
            data: {
                name: name,
                username: username,
                password: password,
                mobile: mobile,
                position: position
            }
        }).then(function(response) {
            if(response.data.status === 1){
                $scope.loader = false;
                alert("New User Registered!!");
                $location.path('/userLogin')
            }
        });
    };
    $scope.back = function () {
        $location.path('/movies');
    }
});

//User Movies Controller
app.controller('userMovieController', function ($scope, $location, $http, $rootScope) {
    $scope.movies = [];
    $http({
        method: 'GET',
        url: 'http://localhost:8081/movie/all',
        headers: {'Authorization': $rootScope.token},
    }).then(function(response) {
        $scope.movies = response.data.movies;
    });

    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.back = function () {
        $location.path('/userDashboard');
    }
});

//Ticket Booking Controller
app.controller('bookingsController', function ($scope, $location, $http, $rootScope) {
    $scope.bookings = [];
    $http({
        method: 'GET',
        url: 'http://localhost:8081/movie/allBookings?id='+$rootScope.userId,
        headers: {'Authorization': $rootScope.token},
    }).then(function(response) {
        $scope.bookings = response.data.tickets;
    });

    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.back = function () {
        $location.path('/userDashboard');
    }

    $scope.newBooking = function (){
        $location.path('/newBooking');
    }

    $scope.remove = function(id){
        $http({
            method: 'POST',
            url: 'http://localhost:8081/movie/cancel?id='+id,
            headers: {'Authorization': $rootScope.token}
        }).then(function(response) {
            if(response.data.status === 1){
                alert("Booking Canceled");
                $location.path('/userDashboard');
            }else{
                alert("Error Occurred!, Please try again")
            }
        });
    }
});

//New Booking Controller
app.controller('newBookingController', function ($scope, $location, $http, $rootScope) {
    $scope.addBooking = function () {
        $scope.loader = true;
        const name = $scope.name;
        const date = $scope.date;
        const count = $scope.ticketCount;
        const showTime = $scope.showTime;
        $http({
            method: 'POST',
            url: 'http://localhost:8081/movie/booking',
            headers: {'Authorization': $rootScope.token},
            data: {
                movie: name,
                date: date,
                ticketCount: count,
                showTime: showTime,
                paymentStatus: false,
                userId: $rootScope.userId
            }
        }).then(function(response) {
            if(response.data.status === 1){
                $scope.loader = false;
                alert("New Booking Added!!");
                $location.path('/bookings');
            }else{
                alert(response.data.message);
                $location.path('/bookings')
            }
        });
    };
    $scope.back = function () {
        $location.path('/bookings');
    }
});



