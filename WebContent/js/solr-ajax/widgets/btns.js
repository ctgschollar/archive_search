
$(function() {
	$( "button" ).button();
	
	$( "#btnSearch" ).click(function( event ) {
		console.log($( '#inpSearch' ).val());
		Manager.store.addByValue('q',$( '#inpSearch' ).val());
		Manager.doRequest();
	});
});

$( document ).ajaxComplete(function() {
$( ".collapsible" ).accordion({
	collapsible: true,
	active: false,
	activate: function(event, ui) {
        $( this ).addClass("opened");}
	});

//collapse opened details on double click
$( ".details" ).dblclick(function(){
	$( ".collapsible.opened" ).accordion( "option", "active", false );
	$( window ).delay(1000).scrollTop( $( this ).offset().top - 180 ); //return to the result you opened

});
//console.log("YOLO");
//$( ".collapsible" ).each( function() {
//	console.log("Yolo");
//	console.log(this.id);
//});
});