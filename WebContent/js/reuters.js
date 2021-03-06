/**
 * Testing out the AJAX SOLR stuff
 */


var Manager;
(function ($) {
  $(function () {
    Manager = new AjaxSolr.Manager({
      //solrUrl: 'http://localhost:8080/solr/#/collection1'
      solrUrl: 'http://kat-archive.kat.ac.za:8983/solr/collection1/'
    });
    
    
    //add a result widget
    Manager.addWidget(new AjaxSolr.ResultWidget({
    	  id: 'result',
    	  target: '#docs' //The css selector for the html element which this widget targets
    	}));
    
    //pager widget, breaks results into pages
    Manager.addWidget(new AjaxSolr.PagerWidget({
    	  id: 'pager',
    	  target: '.pager',
    	  prevLabel: '&lt;',
    	  nextLabel: '&gt;',
    	  innerWindow: 1,
    	  renderHeader: function (perPage, offset, total) {
    	    $('#pager-header').html($('<span></span>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
    	  }
    	}));
    
    //Textwidget for searches
    Manager.addWidget(new AjaxSolr.TextWidget({
    	  id: 'text',
    	  target: '#search'
    	}));
    
    //must call init after adding widgets
    Manager.init();
    
    if(window.location.hash) {
    	state = JSON.parse(window.location.hash.substr(1).split('&'));
    	console.log (state);
    	setState(state);
//    	search(false);
    	printState();
    }
//    else{   
    //Create query
//    Manager.store.addByValue('q', '(CAS.ProductTypeName:KatFile OR CAS.ProductTypeName:RTSTelescopeProduct OR CAS.ProductTypeName:MeerKATAR1TelescopeProduct) AND CAS.ProductTransferStatus:"RECEIVED"');
//    
//    Manager.store.addByValue('sort', 'StartTime desc');
//    //execute query
//    Manager.doRequest();
    //result in Manager.response
//    }
    });
  
})(jQuery);