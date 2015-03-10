
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
	$( ".delete" ).each (function(){
//		alert ("setting delete");
		$( this ).click(function(event){
//			alert ("clicked");
			values = this.value.split(":");
			console.log(values);
			deleteProduct(values[0], values[1]);
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
	searchval = $( '#inpSearch' ).val().replace(" ", "*");
	if (searchval == "")
		searchval = "*";
	products = "(CAS.ProductTypeName:KatFile OR CAS.ProductTypeName:RTSTelescopeProduct)";
	console.log("KATFILE");
	console.log ($( '#chkKATFile' ).prop( "checked" ));
	console.log("RTSFILE");
	console.log ($( '#chkRTSFile' ).attr("checked"));
	if ( $( '#chkKATFile' ).prop( "checked" ) & !$( '#chkRTSFile' ).prop( "checked" ) ){
		products = "CAS.ProductTypeName:KatFile";
	}
	else if ( !$( '#chkKATFile' ).prop( "checked" ) & $( '#chkRTSFile' ).prop( "checked" ) ){
		products = "CAS.ProductTypeName:RTSTelescopeProduct";
	}
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
	if (observer != "")
		Manager.store.addByValue('fq',"Observer:"+observer);
	if (experimentID != ""){
		Manager.store.addByValue('fq',"ExperimentID:"+experimentID);
	}
	if (target != ""){
		Manager.store.addByValue('fq','Targets:"'+target+'"');
	}
	if (saveHistory){
		history.pushState({"search":$( '#inpSearch' ).val(),
			'startDate': startDate,
			'endDate': endDate,
			'observer': observer,
			'experimentID':experimentID,
			'target':target,
			'searchOpen':searchOpen}, '', $(this).attr("href"));
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
	
	if (state == null)
		state = {"search":"*"};
	if (state["searchOpen"]){
		console.log("Yo");
		$( "#searchOptions" ).accordion( "option","active", 0 );
	}
	$( '#inpSearch' ).val( state["search"] );
	if (state["startDate"] != null)
		$( '#dpFrom ').datepicker("setDate",state["startDate"]);
	else
		$.datepicker._clearDate($( '#dpFrom '));
	if (state["endDate"] != null)
		$( '#dpTo' ).datepicker("setDate",state["endDate"]);
	else
		$.datepicker._clearDate($( '#dpTo '));
	$( '#inpObserver' ).val(state["observer"]);
	$( '#inpExpID' ).val(state["experimentID"]);
	$( '#inpTarget' ).val(state["target"]);
	
	
	search(false);
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