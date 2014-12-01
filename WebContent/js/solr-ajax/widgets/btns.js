
$(function() {
	$( "button" ).button();
	
	$( "#btnSearch" ).click(function( event ) {
		console.log($( '#inpSearch' ).val());
		Manager.store.addByValue('q','(CAS.ProductTypeName:KatFile OR CAS.ProductTypeName:RTSTelescopeProduct) AND ' + $( '#inpSearch' ).val());
		Manager.store.addByValue('sort', 'StartTime desc');
		Manager.doRequest();
	});
	
	$( "#btnSearchOptions").click(function (event){
		if ( $( "#searchOptions").hasClass("opened") ){
			$( "#searchOptions").accordion( "option","active", false );
		}
		else{
			$( "#searchOptions").accordion( "option","active", 0 );
		}
	});
	
	$( "#dpFrom" ).datepicker({
		maxDate:0,
		onClose: function(selectedDate){
		$( '#dpTo' ).datepicker("option","minDate", selectedDate);
	}});
	$( "#dpTo" ).datepicker({
		maxDate:0,
		onClose: function(selectedDate){
		$( '#dpFrom' ).datepicker("option","minDate", selectedDate);
	}});
});

$( document ).ajaxComplete(function() {
$( ".collapsible" ).accordion({
	collapsible: true,
	active: false,
	activate: function(event, ui) {
		if ( $( this ).hasClass("opened") ){
			$( this ).removeClass("opened");
		} else {
        	$( this ).addClass("opened");
        }}
	});

//collapse opened details on double click
$( ".details" ).dblclick(function(){
	$( ".collapsible.opened" ).accordion( "option", "active", false );
	$( window ).delay(1000).scrollTop( $( this ).offset().top - 180 ); //return to the result you opened

});
});