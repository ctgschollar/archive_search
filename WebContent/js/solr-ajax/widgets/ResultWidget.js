(function($) {

	AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget
			.extend({
				start : 0,

				beforeRequest : function() {
					$(this.target).html(
							$('<img>').attr('src', 'images/ajax-loader.gif'));
				},

				facetLinks : function(facet_field, facet_values) {
					var links = [];
					if (facet_values) {
						for (var i = 0, l = facet_values.length; i < l; i++) {
							if (facet_values[i] !== undefined) {
								links.push($('<a href="#"></a>').text(
										facet_values[i]).click(
										this.facetHandler(facet_field,
												facet_values[i])));
							} else {
								links
										.push('no items found in current selection');
							}
						}
					}
					return links;
				},

				facetHandler : function(facet_field, facet_value) {
					var self = this;
					return function() {
						self.manager.store.remove('fq');
						self.manager.store.addByValue('fq', facet_field + ':'
								+ AjaxSolr.Parameter.escapeValue(facet_value));
						self.doRequest();
						return false;
					};
				},

				// This function is called after every request of the manager
				// (the response is accessible via this.manager.response)
				afterRequest : function() {
					$(this.target).empty(); // empty the target
					for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
						var doc = this.manager.response.response.docs[i];
						$(this.target).append(this.template(doc));

						var items = [];
						items = items.concat(this.facetLinks(doc.Observer));
						items = items.concat(this.facetLinks(doc.Description));
						items = items.concat(this
								.facetLinks(doc.NumFreqChannels));

						var $links = $('#links_' + doc.ProductId);
						$links.empty();
						for (var j = 0, m = items.length; j < m; j++) {
							$links.append($('<li></li>').append(items[j]));
						}
					}
				},

				template : function(doc) {

					var output = '<div class="result"><h2>' + doc.Description
							+ '</h2>';

					var result = "No Change";
					var stat = "NOTHIN";
					$
							.post(
									'http://kat-archive.kat.ac.za:8983/solr/collection1/select?q=ExperimentID:'
											+ doc['ExperimentID']
											+ ' AND CAS.ProductTypeName:RTSReductionProduct&wt=json&json.wrf=?',
									{},
									function(data, status) {
										append = "";
										result = data;
										stat = status;
										if (result["response"]["docs"].length > 0)
											append += "<button type='button' class='seeReductions' id='btnSeeReductions"
												+ doc['ExperimentID']
											+"'> Show Reductions </button>"
											+ "<div class='collapsible' id='collapseSeeReductions"
											+ doc['ExperimentID']
											+ "'> <br>"
											+ "<div class='details'>";
//											$("#files" + doc['ExperimentID'])
//													.append("<button type='button' class='seeReductions' id='btnSeeReductions"
//															+ doc['ExperimentID']
//															+"> Show Reductions </button>"
//															+ "<div class='collapsible' id='collapseSeeReductions"
//															+ doc['ExperimentID']
//															+ "'> <br>"
//															+ "<div class='details'><p>");
										for (var i = 0; i < result["response"]["docs"].length; i++){
											
										}

										for (var i = 0; i < result["response"]["docs"].length; i++) {
											link = "http://kat-archive.kat.ac.za:8983/fmprod/data?productID="
													+ result["response"]["docs"][i]["id"]
													+ "&format=application/x-zip";
											append += "<table width = 100% ><tr><td>"
												+ "<b> "
												+ result["response"]["docs"][i]["ReductionName"]
												+ "</b> : </td><td><a href = "
												+ link
												+ "><button type='button' style='float:right;'> Download Zip </button></a>";
//											$("#files" + doc['ExperimentID'])
//													.append(
//															""
//																	+ "<b> "
//																	+ result["response"]["docs"][i]["ReductionName"]
//																	+ "</b> : <a href = "
//																	+ link
//																	+ "> Download Zip </a>");
											files = result["response"]["docs"][i]["CAS.ReferenceDatastore"];
											fileshtml = "";

											for (var j = 0; j < files.length; j++) {
												url_deconstruct = files[j]
														.split("/");
												link = "http://kat-archive.kat.ac.za/archive/data/"
														+ files[j]
																.substring(
																		27,
																		files[j].length);
												fileshtml += "<a href= "
														+ link
														+ ">"
														+ url_deconstruct[url_deconstruct.length - 1]
														+ "</a><br>";
											}
											append +="<button type='button' style='float:right;' class='seeFiles' id='btnSeeFiles"
												+ doc['ExperimentID']
											+ i
											+ "'>Show file list</button></td></tr></table>"
											+ "<div class='collapsible' id='collapseSeeFiles"
											+ doc['ExperimentID']
											+ i
											+ "'> <br>"
											+ "<div class='details'>"
											+ fileshtml
											+ "</div></div>";

											
											
										}
										$("#files" + doc['ExperimentID']).append(append);
										console.log(append + "</div></div>");
										
										$("button").button();
										$(".seeReductions")
										.click(
												function(event) {
													collapsibleid = "#collapse"
															+ this.id
																	.substring(
																			3,
																			this.id.length);
													console
															.log(collapsibleid);
													if ($(collapsibleid)
															.hasClass(
																	"opened")) {
														$(collapsibleid)
																.accordion(
																		"option",
																		"active",
																		false);
													} else {
														$(collapsibleid)
																.accordion(
																		"option",
																		"active",
																		0);
													}

												});
										$(".seeFiles")
												.click(
														function(event) {
															collapsibleid = "#collapse"
																	+ this.id
																			.substring(
																					3,
																					this.id.length);
															console
																	.log(collapsibleid);
															if ($(collapsibleid)
																	.hasClass(
																			"opened")) {
																$(collapsibleid)
																		.accordion(
																				"option",
																				"active",
																				false);
															} else {
																$(collapsibleid)
																		.accordion(
																				"option",
																				"active",
																				0);
															}

														});
									}, "json");

					var link = "http://kat-archive.kat.ac.za:8983/fmprod/data?productID="
							+ doc.id;
					var filesize = parseFloat(doc.FileSize) / 1073741824;
					var snippet = '';
					var date = moment(doc['StartTime']);
					snippet += "<b>Observer</b> : " + doc['Observer'] + "<br>";
					snippet += "<b>Experiment ID</b> : " + doc['ExperimentID']
							+ "<br>";
					snippet += "<b>Start Time</b> : "
							+ date.format('YYYY-MM-DD HH:mm:ss') + "<br>";
					snippet += "<div id= 'files" + doc['ExperimentID']
							+ "'> <b> Observation Data </b> : <a href = "
							+ link + " >" + doc.Filename + "</a> ("
							+ filesize.toFixed(2) + " GB) <br></div>";
					if (doc.Details != undefined) {
						snippet += "<pre>" + "<div class='collapsible'>"
								+ "<h3>Details</h3>"
								+ "<div class='details'><p>" + doc.Details
								+ "</p></div>" + "</div>" + "</pre>";
					}
					output += '<p id="links_' + doc.ProductId
							+ '" class="links"></p>';
					// output += doc["CAS.ProductTypeName"];
					output += '<p>' + snippet + '</p><hr></div>';

					// alert("POSTING");

					return output;
				}
			});

})(jQuery);