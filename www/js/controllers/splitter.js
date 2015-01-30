var app = angular.module( "splix" );

app.controller( "SplitterCtrl", function( $scope,
                                          $timeout,
                                          $window ) {

    $scope.persons = [
        {
            elem: $( "div.person#person1" )
        },
        {
            elem: $( "div.person#person2" )
        }
    ];

    $(window).resize( reorderPersons );

    $timeout( reorderPersons );


    $scope.currentValue = "0.00";
    $scope.total = 0;
    $scope.onKeyPress = function( key ) {

        var value = parseInt( $scope.currentValue, 10 );
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

        value = parseInt( $scope.currentValue, 10 );
        if( value === 0 || $scope.currentValue.length === 0 ) {
            $scope.currentValue = "0.00";
        }

    };

    function reorderPersons() {
        var canvas = angular.element( "canvas#canvas" );
        var ctx = canvas[0].getContext( "2d" );

        var w = canvas.width();
        var h = canvas.height();
        
        canvas.attr( "width", w );
        canvas.attr( "height", h );
        
        var centerX = w/2;
        var centerY = h/3.4;
        var radius = w/2.5;

        ctx.beginPath();
        ctx.arc( centerX, centerY, radius, 0, 2*Math.PI );
        ctx.stroke();

        $( "div#total" ).width( w/5 );
        $( "div#total" ).height( w/5 );
        $( "div#total" ).css( {
            left: centerX - (w/5)/2,
            top: centerY - (w/5)/2
        } );

        $( "div#total span" ).css( {
            "line-height": $( "div#total" ).height() + "px"
        } );

        drawCircleOnCircle( 0.25, w/7.5, $("div#input") );
        $( "div#input span" ).css( {
            "line-height": $( "div#input" ).height() + "px"
        } );

        var pct = 0;
        $scope.persons.forEach( function( person ) {
            pct += 1/($scope.persons.length + 1);
            drawPerson( person, pct );
        } );


        // draws a person's circle along the great circle, leaving out the
        // bottom area
        function drawPerson( person, pct ) {

            pct = pct * 0.8 + 0.35;
            pct %= 1;

            drawCircleOnCircle( pct, w/10, person.elem );
        }

        function drawCircleOnCircle( pct, circleRadius, elem ) {
            var rad = pct * 2 * Math.PI;

            var y = Math.sin( rad ) * radius;
            var x = Math.cos( rad ) * radius;

            if( elem ) {
                elem.width( (circleRadius * 2) + "px" );
                elem.height( (circleRadius * 2) + "px" );
                elem.css( {
                    left: centerX + x - circleRadius,
                    top: centerY + y - circleRadius
                } );
            }
            
            ctx.beginPath();
            ctx.fillStyle = "#efefef";
            ctx.arc( centerX + x,
                     centerY + y,
                     circleRadius,
                     circleRadius,
                     0,
                     2*Math.PI );
            ctx.fill();
            ctx.arc( centerX + x,
                     centerY + y,
                     circleRadius,
                     circleRadius,
                     0,
                     2*Math.PI );
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }


} );
