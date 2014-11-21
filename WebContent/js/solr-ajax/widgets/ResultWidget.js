(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  beforeRequest: function () {
    $(this.target).html($('<img>').attr('src', 'images/ajax-loader.gif'));
  },

  facetLinks: function (facet_field, facet_values) {
    var links = [];
    if (facet_values) {
      for (var i = 0, l = facet_values.length; i < l; i++) {
        if (facet_values[i] !== undefined) {
          links.push(
            $('<a href="#"></a>')
            .text(facet_values[i])
            .click(this.facetHandler(facet_field, facet_values[i]))
          );
        }
        else {
          links.push('no items found in current selection');
        }
      }
    }
    return links;
  },

  facetHandler: function (facet_field, facet_value) {
    var self = this;
    return function () {
      self.manager.store.remove('fq');
      self.manager.store.addByValue('fq', facet_field + ':' + AjaxSolr.Parameter.escapeValue(facet_value));
      self.doRequest();
      return false;
    };
  },

  //This function is called after every request of the manager (the response is accessible via this.manager.response)
  afterRequest: function () {
    $(this.target).empty(); //empty the target
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var doc = this.manager.response.response.docs[i];
      $(this.target).append(this.template(doc));

      var items = [];
      items = items.concat(this.facetLinks(doc.Observer));
      items = items.concat(this.facetLinks(doc.Description));
      items = items.concat(this.facetLinks(doc.NumFreqChannels));

      var $links = $('#links_' + doc.ProductId);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
        $links.append($('<li></li>').append(items[j]));
      }
    }
  },

  template: function (doc) {
	  
//	  var options;
//	  var response;
//	  var query = "ExperimentID:20140718-0001";
//	  opts = {dataType: 'json'};
//	  if (this.proxyUrl) {
//	      options.url = this.proxyUrl;
//	      options.data = {query: string};
//	      options.type = 'POST';
//	    }
//	    else {
//	      options.url = this.solrUrl + servlet + '?' + string + '&wt=json&json.wrf=?';
//	    }
//	  errorler = errorHandler || function (jqXHR, textStatus, errorThrown) {
//	      Manager.handleError(textStatus + ', ' + errorThrown);
//	    };
//	   ler = function (data) {
//		    response = data;};
//	   jQuery.ajax(opts).done(ler).fail(errorler);
	  var output = '<div class="result"><h2>' + doc.Description + '</h2>';
	  
	  var result = "No Change";
	  var stat = "NOTHIN";
	  var paused = true;
	  
	  
	var link = "http://kat-archive.kat.ac.za:8983/fmprod/data?productID=" + doc.id;
	var filesize = parseFloat(doc.FileSize) / 1073741824;
    var snippet = '';
    if (doc.Details != undefined) {
		snippet += "<b>Observer</b> : " + doc['Observer'] + "<br>";
	    snippet += "<b>Experiment ID</b> : " + doc['ExperimentID'] + "<br>";
	    snippet += "<b> <div id = 'files" + doc['ExperimentID'] + "'>File Name </b> : <a href = " + link + " >" + doc.Filename + "</a> (" + filesize.toFixed(2) + " GB) </div> <br>";
	    snippet += "<b>Product ID</b> : " + doc.id + "<br>";
		snippet +=  "<pre>" +
		"<div class='collapsible'>" +
		"<h3>Details</h3>" +
		"<div class='details'><p>" + doc.Details + "</p></div>" +
		"</div>" +
		"</pre>";
    }
    else {
    	snippet += "<b>Observer</b> : " + doc.Observer + "<br>";
        snippet += "<b>Experiment ID</b> : " + doc.ExperimentID + "<br>";
        snippet += "<b> <div id = 'files" + doc['ExperimentID'] + "'>File Name </b> : <a href = " + link + " >" + doc.Filename + "</a> (" + filesize.toFixed(2) + " GB) </div> <br>";
        snippet += "<b>Product ID</b> : " + doc.id + "<br>";
    }

    
     output +=  " Yoho" + JSON.stringify(result) + JSON.stringify(stat);
     output += '<p id="links_' + doc.ProductId + '" class="links"></p>';
     output += '<p>' + snippet + '</p><hr></div>';
     
//     alert("POSTING");
	  jQuery.ajax('http://kat-archive.kat.ac.za:8983/solr/collection1/select?q=ExperimentID:20140718-0001&CAS.ProductTypeName:RTSTelescopeProduct&wt=json&json.wrf=?', {}, function(data,status){
		    result = data;
		     stat = status;
		     alert(status);
		     $("files"+doc['ExperimentID']).html(JSON.stringify(result));
		     });
	  
    return output;
  }
});

})(jQuery);