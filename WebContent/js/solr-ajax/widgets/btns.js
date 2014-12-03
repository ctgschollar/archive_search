
$(function() {
	$( "button" ).button();
	
	$( "#btnSearch" ).click(function( event ) {
		console.log($( '#inpSearch' ).val());
		search();
		
	});
	
	$( "#inpSearch" ).keyup(function(e){
	    if(e.keyCode == 13)
	    {
	    	search();
	    }});
	
	$( "#btnSearchOptions").click(function (event){
		if ( $( "#searchOptions").hasClass("opened") ){
			$( "#searchOptions").accordion( "option","active", false );
		}
		else{
			$( "#searchOptions").accordion( "option","active", 0 );
		}
	});
	
	$( ".seeFiles" ).click(function (event){
		collapsibleid = "#collapseSeeFiles" + this.id.substring(3,this.id.length);
		console.log(collapsibleid);
		if ( $( collapsibleid ).hasClass("opened") ){
			$( collapsibleid ).accordion( "option","active", false );
		}
		else{
			$( collapsibleid ).accordion( "option","active", 0 );
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
		$( '#dpFrom' ).datepicker("option","maxDate", selectedDate);
	}});
});

function search(){
	Manager.store.remove('fq');
	searchval = $( '#inpSearch' ).val();
	if (searchval == "")
		searchval = "*";
	Manager.store.addByValue('q','(CAS.ProductTypeName:KatFile OR CAS.ProductTypeName:RTSTelescopeProduct) AND ' + searchval);
	Manager.store.addByValue('sort', 'StartTime desc');
	startDate = $( "#dpFrom" ).datepicker("getDate");
	endDate = $( "#dpTo" ).datepicker("getDate");
	observer = $( '#inpObserver' ).val();
	experimentID = $( '#inpExpID' ).val();
	if (startDate != null & endDate != null){
		//This line grabs the times from the dateselectors, subtracts 2 hours to get to SAST and adds the range to the query
		Manager.store.addByValue('fq',"StartTime:[" + moment(startDate).subtract(2,'hours').format('YYYY-MM-DDTHH:mm:ss[Z]') + " TO " + moment(endDate).subtract(2,'hours').format('YYYY-MM-DDTHH:mm:ss[Z]') + "]");
	}
	else if (startDate != null){
		Manager.store.addByValue('fq',"StartTime:[" + moment(startDate).subtract(2,'hours').format('YYYY-MM-DDTHH:mm:ss[Z]') + " TO NOW]");
	}
	console.log (observer);
	if (observer != "")
		Manager.store.addByValue('fq',"Observer:"+observer);
	if (experimentID != ""){
		Manager.store.addByValue('fq',"ExperimentID:"+experimentID);
	}
	Manager.doRequest();
	history.pushState({"search":$( '#inpSearch' ).val(),
		'startDate': startDate,
		'endDate': endDate}, '', $(this).attr("href"));
}

//Handle pressing back button
$(window).on("popstate", function() {
	state = history.state;
	console.log(state);
	if (state == null)
		state = {"search":"*:*"};
	Manager.store.addByValue('q','(CAS.ProductTypeName:KatFile OR CAS.ProductTypeName:RTSTelescopeProduct) AND ' + state["search"]);
	Manager.store.addByValue('sort', 'StartTime desc');
	$( '#inpSearch' ).val( state["search"] );
	if (startDate != null & endDate != null){
		//This line grabs the times from the dateselectors, subtracts 2 hours to get to SAST and adds the range to the query
		Manager.store.addByValue('fq',"StartTime:[" + moment(startDate).subtract(2,'hours').format('YYYY-MM-DDTHH:mm:ss[Z]') + " TO " + moment(endDate).subtract(2,'hours').format('YYYY-MM-DDTHH:mm:ss[Z]') + "]");
	}
	Manager.doRequest();
//    loadPage(location.href);
  });

//function clickHandler(e) {
////  history.pushState({"search":$( '#inpSearch' ).val()}, null, "http://kat-archive.kat.ac.za:8983/Archive_Browser/");
//  history.pushState(data, event.target.textContent, event.target.href);
//  console.log("Woo!");
//
//  return event.preventDefault();
//}

//$(function() {
//	  $("button").click(function() {
//	    history.pushState({"Search:"}, '', $(this).attr("href"));
//	    return false;
//	  });
//	});


$( document ).ajaxComplete(function() {
$( ".collapsible" ).accordion({
	collapsible: true,
	active: false,
	heightStyle:"content",
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