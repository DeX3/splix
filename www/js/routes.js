var app = angular.module( "splix" );

app.config( function( $stateProvider, $urlRouterProvider ) {
    
    $urlRouterProvider.otherwise( "/splitter" );

    $stateProvider
        .state( "splitter", {
            url: "/splitter",
            templateUrl: "views/splitter.html",
            controller: "SplitterCtrl"
        } );
} );
