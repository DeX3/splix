var app = angular.module( "splix" );

app.controller( "SplitterCtrl", function( $scope,
                                          $timeout,
                                          $ionicPopup ) {

    var canvas = angular.element( "canvas#canvas" );
    var ctx = canvas[0].getContext( "2d" );

    var w = canvas.width();
    var h = canvas.height();
    
    canvas.attr( "width", w );
    canvas.attr( "height", h );
    
    var centerX = w/2;
    var centerY = (h - $("div.numpad").height())/2.13;
    var radius = w/2.5;

    $scope.persons = [];
    $scope.expenses = [];

    $(window).resize( reorderPersons );
    $timeout( reorderPersons );

    
    $timeout( function() {
        addPerson( { name: "Roman" } );
        addPerson( { name: "Dani" } );
    }, 100 ); 

    $scope.currentValue = "0.00";
    $scope.total = 0;
    $scope.onKeyPress = function( key ) {

        var value = parseFloat( $scope.currentValue, 10 );
        if( value === 0 ) {
            $scope.currentValue = "";
        }

        if( typeof key === "number" ) {
            $scope.currentValue += key + "";
        } else if( key === "comma" &&
                   $scope.currentValue.indexOf( "." ) < 0 ) {
            $scope.currentValue += ".";
        } else if( key === "del" && $scope.currentValue.length > 0 ) {

            $scope.currentValue = $scope.currentValue.substring(
                0,
                $scope.currentValue.length - 1
            );
        }

        value = parseFloat( $scope.currentValue, 10 );
        if( value === 0 || $scope.currentValue.length === 0 ) {
            $scope.currentValue = "0.00";
        }

    };

    $scope.addPerson = function() {
        var popup = $ionicPopup.prompt( {
            title: "Add person",
            template: "Enter name",
            inputType: "text",
            inputPlaceholder: "Person name"
        } ).then( function(name) {
            addPerson( { name: name } );
        } );
    };

    $scope.onOver = function( evt, ui ) {

        var id = evt.target.id;
        
        if( id === "total" ) {
            ctx.beginPath();
            
            var pct = 0;
            $scope.persons.forEach( function( person ) {
                pct += 1/($scope.persons.length + 1);
                var pt = getPointOnPersonArc( pct );
                ctx.beginPath();
                ctx.moveTo( centerX, centerY );
                ctx.lineTo( pt.x, pt.y );
                var elem = $( "div.person#person-" + person.id );
                ctx.strokeStyle = elem.css( "background-color" );
                ctx.lineWidth = 40;
                ctx.stroke();
            } );

            $scope.allSelected = !$scope.allSelected;

            $scope.$digest();

            
        } else {
            id = parseInt( id.match( /person-(\d+)/ )[1], 10 );

            $scope.allSelected = false;

            var person = getPersonById( id );
            person.selected = !person.selected;
            $scope.$digest();
        }

    };

    $scope.onOut = function() {
        ctx.clearRect( 0, 0, canvas.width(), canvas.height() );
    };

    $scope.selectedPersons = {};

    $scope.onStop = function( evt, ui ) {
        
        var id = evt.target.id;

        var expense = {
            amount: parseFloat( $scope.currentValue, 10 ),
            persons: []
        };

        var selectedPersons = [];
        $scope.persons.forEach( function( person ) {
            if( person.selected || $scope.allSelected ) {
                selectedPersons.push( person );
            }
        } );
        $scope.allSelected = false;

        if( selectedPersons.length > 0 ) {

            var share = expense.amount / selectedPersons.length;
            selectedPersons.forEach( function( person ) {
                person.total += share;
                expense.persons.push( person );
                person.selected = false;
            } );

            $scope.total += expense.amount;
            $scope.currentValue = "0.00";
            $( "div#input" ).hide( "size" );
            $timeout( reorderPersons, 500 );
        } else {
            reorderPersons();
        }

        ctx.clearRect( 0, 0, canvas.width(), canvas.height() );
    };

    function getPersonById( id ) {

        var found = null;
        $scope.persons.some( function( person ) {
            if( person.id == id ) {
                found = person;
                return false;
            }
        } );

        return found;
    }

    var currentId = 0;
    function addPerson( data ) {
        
        var person = {
            id: currentId++,
            name: data.name,
            total: 0.00
        };

        $scope.persons.push( person );
        $timeout( reorderPersons );
    }

    function reorderPersons() {

        w = canvas.width();
        h = canvas.height();
        
        canvas.attr( "width", w );
        canvas.attr( "height", h );
        
        centerX = w/2;
        centerY = (h - $("div.numpad").height())/2.13;
        radius = w/2.75;

        /*
        ctx.beginPath();
        ctx.arc( centerX, centerY, radius, 0, 2*Math.PI );
        ctx.stroke();
        */

        centerOn( $("div#total"), w/4, { x: centerX, y: centerY } );

        $( "div#total span" ).css( {
            "line-height": $( "div#total" ).height() + "px"
        } );

        var inputElem = $( "div#input" );

        centerOn( inputElem, w/3, getPointOnCircle(0.25) );
        inputElem.show();
        //drawCircleOnCircle( 0.25, w/7.5, $("div#input") );
        $( "div#input span" ).css( {
            "line-height": $( "div#input" ).height() + "px"
        } );

        var pct = 0;
        $scope.persons.forEach( function( person ) {
            pct += 1/($scope.persons.length + 1);

            var pt = getPointOnPersonArc( pct );
            var elem = $( "div.person#person-" + person.id );
            centerOn( elem, w/4.5, pt );
        } );

    }

    function centerOn( elem, size, pt ) {

        elem.width( size );
        elem.height( size );
        
        elem.css( {
            left: (pt.x - size/2) + "px",
            top: (pt.y - size/2) + "px",
            "border-radius": size/2 + "px"
        } );
    }

    function getPointOnPersonArc( pct ) {
        pct = pct * 0.8 + 0.35;
        pct %= 1;

        return getPointOnCircle( pct );
    }

    function getPointOnCircle( pct ) {
        
        var rad = pct * 2 * Math.PI;

        return {
            x: centerX + Math.cos( rad ) * radius,
            y: centerY + Math.sin( rad ) * radius
        };
    }

} );
