var reductions = {};
var reductionState = {};


$(function() {
	
	$( "button" ).button();
	
	$( "#orderBy" ).selectmenu();
	
	
	
	var reduction_num_regex = new RegExp("[0-9]{1,2}[._]?[0-9]{1,2}");
	
	//Grab list of reductions	
	$.post(
			"http://kat-archive.kat.ac.za:8983/solr/collection1/select?q=CAS.ProductTypeName:*ReductionProduct AND ReductionName:['' TO *]&rows=100&fl=ReductionName&wt=json&group=true&group.field=ReductionName&wt=json&json.wrf=?",
	{},
	function(data, status) {
//		console.log(data['grouped']);

		for (var i = 0; i < data["grouped"]["ReductionName"]['groups'].length; i++){
			var group = data["grouped"]["ReductionName"]['groups'][i]["groupValue"];
			
			res = reduction_num_regex.exec(group);
//			console.log(res);
			if (res != null)
				var reductionName = group.substring(0,res.index).replace(/[._]/g,'').trim() + " " + res[0].replace('_','.') + " " + group.substring(res.index+res[0].length).replace(/[._]/g,' ').trim();
			else
				reductionName = group;
			if (reductions[reductionName])
				reductions[reductionName] = reductions[reductionName] + " OR '" + group + "'";
			else 
				reductions[reductionName] = "'" + group + "'";

		}
		
//		console.log(reduction);

		var reduction_regex = new RegExp(".*[0-9]{1,2}.[0-9]{1,2}");
		$.each(Object.keys(reductions).sort(), function(index,value){
			
			res = reduction_regex.exec(value);
			if (!res)
				res = [value];
			
			console.log(res[0]);
			console.log(reductionState[res[0]]);
			
			if (reductionState[res[0]] != undefined)
				$( "#reductionChoice" ).append("<option value='"+value+"'>" + value + "</option>");
			else
				$( "#reductionChoice" ).append("<option value='"+value+"' selected='selected'>" + value + "</option>");
		});
		
		$( "#reductionChoice" ).multiselect();
		
		search(false);
		
		
	},
	"json");
	
	$( "#chkReductionsOnly").change(function(){
		if ( $( '#chkReductionsOnly' ).prop( "checked" ) ){
			$( ".ui-multiselect" ).show(0);
//			console.log ("visible");
		}
		else{
			$( ".ui-multiselect" ).hide(0);
//			console.log("hidden");
		}
	});
	
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
//		console.log($( '#inpSearch' ).val());
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
//		console.log(collapsibleid);
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
//					console.log(values);
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
//			console.log ($( this ).val());
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
//    	console.log (productId);
    	$.ajax({url:"http://kat-archive.kat.ac.za:9100",
    			type: "post",
    			data:getProductByIdStr.replace('REPLACE', productId),
    			dataType:"application/x-www-form-urlencoded",
    				complete:function (xhr, status) {
    			        xmlResponse = $.parseXML(xhr.responseText);
    			        $xml = $( xmlResponse );
//    			        console.log(dataStoreReference);
    			        
    			        var product = "";    			        
			        	$xml.find("param").each(function(){
			        		product = $(this)[0].outerHTML;
			        	});
//			        	console.log(product);
    			        
    			        $.ajax({url:"http://kat-archive.kat.ac.za:9100",
    		    			type: "post",
    		    			data:removeFileStr.replace('REPLACE', dataStoreReference),
    		    			dataType:"application/x-www-form-urlencoded",
    		    				complete:function (xhr, status) {
    		    			        xmlResponse = $.parseXML(xhr.responseText);
//    		    			        console.log("RemoveFile response");
    		    			        $xml = $( xmlResponse );
//    		    			        console.log($xml);
    		    			        var success = "";
    		    			        $xml.find("methodResponse").each(function(){
    		    			        	success = $(this)[0].textContent;
    		    			        });
//    		    			        console.log(success);
    		    			        
    		    			        if (success == "1"){
    		    			        	$.ajax({url:"http://kat-archive.kat.ac.za:9100",
    		        		    			type: "post",
    		        		    			data:removeProductStr.replace('REPLACE', product),
    		        		    			dataType:"application/x-www-form-urlencoded",
    		        		    				complete:function (xhr, status) {
    		        		    			        xmlResponse = $.parseXML(xhr.responseText);
    		        		    			        $xml = $( xmlResponse );
//    		        		    			        console.log("RemoveProduct response");
//    		        		    			        console.log($xml);
    		        		    			        $xml.find("methodResponse").each(function(){
    		        		    			        	success = $(this)[0].textContent;
    		        		    			        });
//    		        		    			        console.log(success);
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
//	console.log("KATFILE");
//	console.log ($( '#chkKATFile' ).prop( "checked" ));
//	console.log("RTSFILE");
//	console.log ($( '#chkRTSFile' ).attr("checked"));
//	console.log("AR1FILE");
//	console.log ($( '#chkRTSFile' ).attr("checked"));
	
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
	
	var reductionState = {};
	var reduction_num_regex = new RegExp(".*[0-9]{1,2}.[0-9]{1,2}");
	if ( $( '#chkReductionsOnly' ).prop( "checked" ) ){
		products = "CAS.ProductTypeName:*ReductionProduct AND (CAS.ProductTypeName:'YOLO' ";
		$.each( $( 'input[id^="ui-multiselect-reductionChoice-option-"]' ), function (index, value){
			
			if ($(value).prop("checked")){
//				console.log($(value).prop("value"));
//			    console.log (reductions);
			    products += " OR " + reductions[$(value).prop("value")];
			}
			else{
				res = reduction_num_regex.exec($(value).prop("value"));
				if (res)
					reductionState[res[0]] = false;
				else
					reductionState[$(value).prop("value")] = false;
			}
			
			
				
		});
		products += " )";
	}
	
	
	
		
	console.log("PRODUCTS");
	console.log(products);
	Manager.store.addByValue('q', products + ' AND ' + searchval + ' AND CAS.ProductTransferStatus:"RECEIVED"');
	if ( $( '#orderBy ').val() == 0){
		Manager.store.addByValue('sort', 'score desc, StartTime desc');
	}
	else if ( $( '#orderBy ').val() == 1){
		Manager.store.addByValue('sort', 'StartTime desc');
	}
	else if ( $( '#orderBy ').val() == 2){
		Manager.store.addByValue('sort', 'StartTime asc');
	}
	else if ( $( '#orderBy ').val() == 3){
		Manager.store.addByValue('sort', 'Observer asc');
	}
	else if ( $( '#orderBy ').val() == 4){
		Manager.store.addByValue('sort', 'Observer desc');
	}
	
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
//	console.log (observer);
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
		var startstr = null;
		if (endDate != null)
			endstr = endDate.getMonth()+1+"/"+endDate.getDate()+"/"+endDate.getFullYear();
		else{
			endDate = moment();
//			console.log(endDate);
			endstr = endDate._d.getMonth()+1+"/"+endDate._d.getDate()+"/"+endDate._d.getFullYear();
		}
		if (startDate != null)
			startstr = startDate.getMonth()+1+"/"+startDate.getDate()+"/"+startDate.getFullYear();
				
	    state = {}
		if ($( '#inpSearch' ).val() != "")
			state["s"] = $( '#inpSearch' ).val();
		if (startstr != null)
			state["sd"] = startstr;
		if (endstr)
			state["e"] = endstr;
		if (observer != "")
			state["o"] = observer;
		if (experimentID != "")
			state["ei"] = experimentID;
		if (target != "")
			state["t"] = target;
		if (searchOpen)
			state["so"] = searchOpen;
		if ($( '#chkRTSFile' ).prop( "checked" ))
			state["r"] = true;
		if ($( '#chkKATFile' ).prop( "checked" ))
			state["k"] = true;
		if ($( '#chkAR1File' ).prop( "checked" ))
			state["a"] = true;
		if ($( '#orderBy ').val() != "0")
			state["ob"] = $( '#orderBy ').val();
		if ($( '#chkReductionsOnly' ).prop( "checked" ))
			state["ro"] = $( '#chkReductionsOnly' ).prop( "checked" );
		state["rs"] = reductionState;
		
		
		history.pushState(state, '', '#'+JSON.stringify(state));
		}
	Manager.doRequest();
	if (searchOpen){
		$( "#searchOptions" ).accordion( "option","active", 0 );
//		console.log("Yo");
	}
}





//Handle pressing back button
$(window).on("popstate", function() {
	state = history.state;
//	console.log(history);
//	console.log(state);
	
	setState(state);	
	search(false);
	printState();
  });

function setState(state){
//	console.log('Before state');
	printState();
	if (state == null)
		state = {"s":"",
				'ob':0};
	if (state["so"]){
//		console.log("Yo");
		$( "#searchOptions" ).accordion( "option","active", 0 );
	}
	$( '#inpSearch' ).val( state["s"] );
	if (state["sd"]){
//		console.log("startDate = " + state["sd"]);
//		$( '#dpFrom ').datepicker("setDate",Date.parse(state["startDate"]));
//		$( '#dpFrom ').datepicker("defaultDate",Date.parse(state["startDate"]));
		$( '#dpFrom ').val(state["sd"]);
	}
	else
		$.datepicker._clearDate($( '#dpFrom '));
	if (state["e"]){
//		$( '#dpTo' ).datepicker("setDate",Date.parse(state["endDate"]));
		$( '#dpTo' ).prop("Date",Date.parse(state["e"]));
		$( '#dpTo ').val(state["e"]);
//		console.log("endDate = " + state["e"]);
	}
	else
		$.datepicker._clearDate($( '#dpTo '));
	if (state['o']){
		$( '#orderBy' ).val(state['o']);
		$( '#orderBy' ).selectmenu('refresh',true);
	}
//	$( '#orderBy' ).selectmenu("value",state['order']);
//	$('#orderBy span').text($("#orderBy option[value='" + state['order'] +"']").text());
	if (state["o"])
		$( '#inpObserver' ).val(state["o"]);
	if (state["ei"])
		$( '#inpExpID' ).val(state["ei"]);
	if (state["t"])
		$( '#inpTarget' ).val(state["t"]);
	if (state["r"])
		$( '#chkRTSFile' ).prop( "checked",state["r"]);
	else
		$( '#chkRTSFile' ).prop( "checked",false);
	if (state["k"])
		$( '#chkKATFile' ).prop( "checked",state["k"]);
	else
		$( '#chkKATFile' ).prop( "checked",false);
	if (state["a"])
		$( '#chkAR1File' ).prop( "checked",state["a"]);
	else
		$( '#chkAR1File' ).prop( "checked",false);
	if (state["ro"])
		$( '#chkReductionsOnly' ).prop( "checked",state["ro"]);
	else
		$( '#chkReductionsOnly' ).prop( "checked",false);
	reductionState=state["rs"];
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
	
	if ( $( '#chkReductionsOnly' ).prop( "checked" ) ){
		$( ".ui-multiselect" ).show(0);
//		console.log ("visible");
	}
	else{
		$( ".ui-multiselect" ).hide(0);
//		console.log("hidden");
	}


//collapse opened details on double click
$( ".details" ).dblclick(function(){
	$( ".collapsible.opened" ).accordion( "option", "active", false );
	$( window ).delay(1000).scrollTop( $( this ).offset().top - 180 ); //return to the result you opened

});



});