/**
 * Text widget for searching files
 */
(function ($) {
AjaxSolr.TextWidget = AjaxSolr.AbstractTextWidget.extend({
	
	init: function () {
		  var self = this;
		  $(this.target).find('input').bind('keydown', function(e) {
//		    if (e.which == 13) {
//		      var value = '(CAS.ProductTypeName:KatFile OR CAS.ProductTypeName:RTSTelescopeProduct) AND *:RTS';// + $(this).val();
//		      if (value && Manager.store.addByValue(value)) {
//		        Manager.doRequest();
//		      }
//		    }
		  });
		},

		afterRequest: function () {
//		  $(this.target).find('input').val('');
		}
});
})(jQuery);