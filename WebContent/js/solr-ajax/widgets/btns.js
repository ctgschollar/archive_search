
$(function() {
	$( "button" ).button();
	
	$( "#searchOptions" ).accordion({
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
	
	$( "#btnSearch" ).click(function( event ) {
		console.log($( '#inpSearch' ).val());
		search(true);
		
	});
	
	$( "#inpSearch" ).keyup(function(e){
	    if(e.keyCode == 13)
	    {
	    	search(true);
	    }});
	
	$( "#btnSearchOptions").click(function (event){
		if ( $( "#searchOptions").hasClass("opened") ){
			$( "#searchOptions").accordion( "option","active", false );
			searchOpen = false;
		}
		else{
			$( "#searchOptions").accordion( "option","active", 0 );
			searchOpen = true;
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

function setDelete(){
//	alert("set delete");
	$( ".confirm" ).each (function(){
//		console.log( $( this ).attr("value") );
		$( this ).dialog({
			autoOpen: false,
			modal:true,
			width:400,
			buttons:{
				"Delete":function() {
					values = $( this ).attr("value").split(":");
					console.log(values);
					deleteProduct(values[0], values[1]);
					$( this ).dialog( "close" );
				},
				"Cancel":function() {
					$( this ).dialog( "close" );
				}
			}
		});
	});
	$( ".delete" ).each (function(){
//		alert ("setting delete");
		$( this ).click(function(event){
			console.log ($( this ).val());
//			values = this.value.split(":");
//			console.log(values);
//			deleteProduct(values[0], values[1]);
			$( '#dlg'+$( this ).val() ).dialog( "open" );
		});
	});
}

function setClipboards (){
	var clipboardClients = new Array();
//Copy to clipboard
$( ".toClipboard" ).each(function(){
//	alert ("CLIPBOARDING");
	var index = clipboardClients.length;
	clipboardClients.push (new ZeroClipboard( $( this ) ) );
	clipboardClients[index].on( "ready", function( readyEvent ) {
	 // alert( "ZeroClipboard SWF is ready!" );
//		clipboardClients[index].on( "aftercopy", function( event ) {
     // `this` === `client`
     // `event.target` === the element that was clicked
//		event.target.style.display = "none";
		//alert("Copied text to clipboard: " + event.data["text/plain"] );
//		} );
	} );
} );
}

var getProductByIdStr = '<?xml version="1.0"?>'+
'<methodCall>'+
   '<methodName>filemgr.getProductById</methodName>'+
      '<params>'+
         '<param>'+
            '<value><string>REPLACE</string></value>'+
         '</param>'+
      '</params>'+
'</methodCall>';

var removeProductStr = '<?xml version="1.0"?>'+
'<methodCall>'+
   '<methodName>filemgr.removeProduct</methodName>'+
      '<params>'+
            'REPLACE'+
      '</params>'+
'</methodCall>';

var removeFileStr = '<?xml version="1.0"?>'+
'<methodCall>'+
'<methodName>filemgr.removeFile</methodName>'+
   '<params>'+
      '<param>'+
         '<value><string>REPLACE</string></value>'+
      '</param>'+
   '</params>'+
'</methodCall>';


function deleteProduct (productId, dataStoreReference) {  
    	console.log (productId);
    	$.ajax({url:"http://kat-archive.kat.ac.za:9100",
    			type: "post",
    			data:getProductByIdStr.replace('REPLACE', productId),
    			dataType:"application/x-www-form-urlencoded",
    				complete:function (xhr, status) {
    			        xmlResponse = $.parseXML(xhr.responseText);
    			        $xml = $( xmlResponse );
    			        console.log(dataStoreReference);
    			        
    			        var product = "";    			        
			        	$xml.find("param").each(function(){
			        		product = $(this)[0].outerHTML;
			        	});
			        	console.log(product);
    			        
    			        $.ajax({url:"http://kat-archive.kat.ac.za:9100",
    		    			type: "post",
    		    			data:removeFileStr.replace('REPLACE', dataStoreReference),
    		    			dataType:"application/x-www-form-urlencoded",
    		    				complete:function (xhr, status) {
    		    			        xmlResponse = $.parseXML(xhr.responseText);
    		    			        console.log("RemoveFile response");
    		    			        $xml = $( xmlResponse );
    		    			        console.log($xml);
    		    			        var success = "";
    		    			        $xml.find("methodResponse").each(function(){
    		    			        	success = $(this)[0].textContent;
    		    			        });
    		    			        console.log(success);
    		    			        
    		    			        if (success == "1"){
    		    			        	$.ajax({url:"http://kat-archive.kat.ac.za:9100",
    		        		    			type: "post",
    		        		    			data:removeProductStr.replace('REPLACE', product),
    		        		    			dataType:"application/x-www-form-urlencoded",
    		        		    				complete:function (xhr, status) {
    		        		    			        xmlResponse = $.parseXML(xhr.responseText);
    		        		    			        $xml = $( xmlResponse );
    		        		    			        console.log("RemoveProduct response");
    		        		    			        console.log($xml);
    		        		    			        $xml.find("methodResponse").each(function(){
    		        		    			        	success = $(this)[0].textContent;
    		        		    			        });
    		        		    			        console.log(success);
    		        		    			        if (success == "1"){
    		        		    			        	search(false);
    		        		    			        }
    		        		    			        else
    		        		    			        	alert ("Remove Product From Solr Failed");
    		        		    			        
    		        		    		}});
    		    			        }
    		    			        else
    		    			        	alert("Delete File Failed");
    		    		}});
    			        
    			        
    			        
    			        
    			        
//    			        var names = new Array();
//    			        	$xml.find("value").each(function(){
//    			        		if ($(this)[0].childElementCount == 0){
//    			        			if($(this)[0].previousSibling != null && $(this)[0].previousSibling.nodeName == "name" && $(this)[0].previousSibling.textContent == "dataStoreReference")
//    			        				dataStoreReference = $(this)[0].textContent;
//    			        		}
//    			        	});
    			        
    			        	
    			        }
    				}
    	);
} 

$(window).bind('beforeunload',function(){
	$( '#inpSearch' ).val("");
	$.datepicker._clearDate($( '#dpFrom '));
	$.datepicker._clearDate($( '#dpTo '));
	$( '#inpObserver' ).val("");
	$( '#inpExpID' ).val("");
	$( '#inpTarget' ).val("");
	});

var searchOpen = false;
function search(saveHistory){
	Manager.store.remove('fq');
	Manager.store.remove('q');
	Manager.store.remove('sort');
	//Replace here to allow wild cards between search terms. Sometimes a underscore is used instead of a space, so need to handle both cases)
	searchval = $( '#inpSearch' ).val();
	if (searchval == "")
		searchval = "*";
//	products = "(CAS.ProductTypeName:KatFile OR CAS.ProductTypeName:RTSTelescopeProduct OR CAS.ProductTypeName:MeerKATAR1TelescopeProduct)";
	products = "( CAS.ProductTypeName:NA";
	console.log("KATFILE");
	console.log ($( '#chkKATFile' ).prop( "checked" ));
	console.log("RTSFILE");
	console.log ($( '#chkRTSFile' ).attr("checked"));
	console.log("AR1FILE");
	console.log ($( '#chkRTSFile' ).attr("checked"));
	
	if ( $( '#chkKATFile' ).prop( "checked" )){
		products += " OR CAS.ProductTypeName:KatFile";
	}
	if ( $( '#chkRTSFile' ).prop( "checked" ) ){
		products += " OR CAS.ProductTypeName:RTSTelescopeProduct";
	}
	if ( $( '#chkAR1File' ).prop( "checked" ) ){
		products += " OR CAS.ProductTypeName:MeerKATAR1TelescopeProduct";
	}
	
	products += " )";
		
	console.log("PRODUCTS");
	console.log(products);
	Manager.store.addByValue('q', products + ' AND ' + searchval);
	Manager.store.addByValue('sort', 'score desc, StartTime desc');
	startDate = $( "#dpFrom" ).datepicker("getDate");
	endDate = $( "#dpTo" ).datepicker("getDate");
	observer = $( '#inpObserver' ).val();
	experimentID = $( '#inpExpID' ).val();
	target = $( '#inpTarget' ).val();
	if (startDate != null & endDate != null){
		//This line grabs the times from the dateselectors, subtracts 2 hours to get to SAST and adds the range to the query
		Manager.store.addByValue('fq',"StartTime:[" + moment(startDate).subtract(2,'hours').format('YYYY-MM-DDTHH:mm:ss[Z]') + " TO " + moment(endDate).subtract(2,'hours').format('YYYY-MM-DDTHH:mm:ss[Z]') + "]");
	}
	else if (startDate != null){
		Manager.store.addByValue('fq',"StartTime:[" + moment(startDate).subtract(2,'hours').format('YYYY-MM-DDTHH:mm:ss[Z]') + " TO NOW]");
	}
	console.log (observer);
	Manager.store.addByValue('fq','CAS.ProductTransferStatus:"RECEIVED"');
	if (observer != "")
		Manager.store.addByValue('fq',"Observer:"+observer);
	if (experimentID != ""){
		Manager.store.addByValue('fq',"ExperimentID:"+experimentID);
	}
	if (target != ""){
		Manager.store.addByValue('fq','Targets:"'+target+'"');
	}
	if (saveHistory){
		var endstr = null;
		var startstr = null
		if (endDate != null)
			endstr = endDate.getMonth()+1+"/"+endDate.getDate()+"/"+endDate.getFullYear();
		if (startDate != null)
			startstr = startDate.getMonth()+1+"/"+startDate.getDate()+"/"+startDate.getFullYear();
				
		state = {"search":$( '#inpSearch' ).val(),
				'startDate': startstr,
				'endDate': endstr,
				'observer': observer,
				'experimentID':experimentID,
				'target':target,
				'searchOpen':searchOpen,
				'RTS':$( '#chkRTSFile' ).prop( "checked" ),
				'KAT7':$( '#chkKATFile' ).prop( "checked" ),
				'AR1':$( '#chkAR1File' ).prop( "checked" )};
		
		history.pushState(state, '', '#'+JSON.stringify(state));
		}
	Manager.doRequest();
	if (searchOpen){
		$( "#searchOptions" ).accordion( "option","active", 0 );
		console.log("Yo");
	}
}





//Handle pressing back button
$(window).on("popstate", function() {
	state = history.state;
	console.log(history);
	console.log(state);
	
	setState(state);	
	search(false);
	printState();
  });

function setState(state){
	console.log('Before state');
	printState();
	if (state == null)
		state = {"search":"*"};
	if (state["searchOpen"]){
		console.log("Yo");
		$( "#searchOptions" ).accordion( "option","active", 0 );
	}
	$( '#inpSearch' ).val( state["search"] );
	if (state["startDate"] != null){
		console.log("startDate = " + state["startDate"]);
//		$( '#dpFrom ').datepicker("setDate",Date.parse(state["startDate"]));
//		$( '#dpFrom ').datepicker("defaultDate",Date.parse(state["startDate"]));
		$( '#dpFrom ').val(state["startDate"]);
	}
	else
		$.datepicker._clearDate($( '#dpFrom '));
	if (state["endDate"] != null){
//		$( '#dpTo' ).datepicker("setDate",Date.parse(state["endDate"]));
		$( '#dpTo' ).prop("Date",Date.parse(state["endDate"]));
		$( '#dpTo ').val(state["endDate"]);
		console.log("endDate = " + state["endDate"]);
	}
	else
		$.datepicker._clearDate($( '#dpTo '));
	$( '#inpObserver' ).val(state["observer"]);
	$( '#inpExpID' ).val(state["experimentID"]);
	$( '#inpTarget' ).val(state["target"]);
	$( '#chkRTSFile' ).prop( "checked",state["RTS"]);
	$( '#chkKATFile' ).prop( "checked",state["KAT7"]);
	$( '#chkAR1File' ).prop( "checked",state["AR1"]);
	

}

function printState(){
	console.log ('inpSearch ' + $( '#inpSearch' ).val());
	console.log  ('dpFrom ' + $( "#dpFrom" ).datepicker("getDate"));
	console.log ('dpTo ' + $( "#dpTo" ).datepicker("getDate"));
	console.log('inpObserver ' + $( '#inpObserver' ).val());
	console.log('inpExpID ' + $( '#inpExpID' ).val());
	console.log( 'inpTarget ' + $('#inpTarget' ).val());
	console.log('chkRTSFile ' + $( '#chkRTSFile' ).prop( "checked"));
	console.log('chkKATFile ' + $( '#chkKATFile' ).prop( "checked"));
	console.log('chkAR1File ' + $('#chkAR1File' ).prop( "checked"));
}

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
	
	$( ".collapsible:not(#searchOptions)" ).accordion({
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