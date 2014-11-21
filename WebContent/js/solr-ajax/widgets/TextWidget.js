/**
 * Text widget for searching files
 */
(function ($) {
AjaxSolr.TextWidget = AjaxSolr.AbstractTextWidget.extend({
	
	init: function () {
		  var self = this;
		  $(this.target).find('input').bind('keydown', function(e) {
		    if (e.which == 13) {
		      var value = '(CAS.ProductTypeName:KatFile OR CAS.ProductTypeName:RTSTelescopeProduct) AND ' + $(this).val();
		      if (value && self.set(value)) {
		        self.doRequest();
		      }
		    }
		  });
		},

		afterRequest: function () {
		  $(this.target).find('input').val('');
		}
});
})(jQuery);