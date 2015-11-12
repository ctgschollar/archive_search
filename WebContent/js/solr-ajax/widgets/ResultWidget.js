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
					
						setClipboards();
						setDelete();
				},

				template : function(doc) {

					var result = "No Change";
					var stat = "NOTHIN";
					$
							.post(
									'http://kat-archive.kat.ac.za:8983/solr/collection1/select?q=InputDataProductId:'
											+ doc['CAS.ProductId']
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
										var sort_array = Array();
										for (var i = 0; i < result["response"]["docs"].length; i++){
											sort_array[i] = [result["response"]["docs"][i]["ReductionName"],i];
										}
										sorted = sort_array.sort(function(x,y){
											var xp = x[0];
											var yp = y[0];
											return xp == yp ? 0 : xp < yp ? -1 : 1;
										});

										for (var i = 0; i < result["response"]["docs"].length; i++) {
											index = sorted[i][1];
											console.log(result["response"]["docs"][index]["id"]);
											link = "http://kat-archive.kat.ac.za:8983/fmprod/data?productID="
													+ result["response"]["docs"][index]["id"]
													+ "&format=application/x-zip";
											append += "<table width = 100% ><tr><td>"
												+ "<b> "
												+ result["response"]["docs"][index]["ReductionName"]
												+ "</b> : </td><td><a href = "
												+ link
												+ "><button type='button' style='float:right;'> Download Zip </button></a>";
											files = result["response"]["docs"][index]["CAS.ReferenceDatastore"].sort();
											fileshtml = "";

											for (var j = 0; j < files.length; j++) {
												url_deconstruct = files[j]
														.split("/");
												link = "http://kat-archive.kat.ac.za/archive/data/"
														+ files[j]
																.substring(
																		27,
																		files[j].length);
												fileshtml += "<a href= '"
														+ link
														+ "' target='_blank' >"
														+ url_deconstruct[url_deconstruct.length - 1]
														+ "</a><br>";
											}
											append +="<button type='button' style='float:right;' class='seeFiles' id='btnSeeFiles"
												+ doc['ExperimentID']
											+ index
											+ "'>Show Files</button></td></tr></table>"
											+ "<div class='collapsible' id='collapseSeeFiles"
											+ doc['ExperimentID']
											+ index
											+ "'> <br>"
											+ "<div class='details'>"
											+ fileshtml
											+ "</div></div>";

											
											
										}
										$("#files" + doc['ExperimentID']).append(append);
										
										
										$("button").button();
										$(".seeReductions")
										.click(
												function(event) {
													collapsibleid = "#collapse"
															+ this.id
																	.substring(
																			3,
																			this.id.length);
													if ($(collapsibleid)
															.hasClass("opened")) {
														$(collapsibleid)
																.accordion(
																		"option",
																		"active",
																		false);
														$(this).button("option", "label", "Show Reductions");
													} else {
														$(collapsibleid)
																.accordion(
																		"option",
																		"active",
																		0);
														$(this).button("option", "label", "Hide Reductions");
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
																$(this).button("option", "label", "Show Files");
															} else {
																$(collapsibleid)
																		.accordion(
																				"option",
																				"active",
																				0);
																$(this).button("option", "label", "Hide Files");
															}

														});
									}, "json");

					var link = "http://kat-archive.kat.ac.za/"
						+ doc["FileLocation"][0].substring(9, doc["FileLocation"][0].length) + "/" + doc.Filename;
					var filesize = parseFloat(doc.FileSize) / 1073741824;
					var snippet = '';
					var date = moment(doc['StartTime']);
					var obs_log_server = "obs.kat7.karoo.kat.ac.za";
					if (doc["CAS.ProductTypeName"] == "RTSTelescopeProduct")
						obs_log_server = "obs.mkat-rts.karoo.kat.ac.za"
					snippet += "<table><tr><td width = 200px><b>Observer</b> :</td><td>" + doc['Observer'] + "</td></tr>"
					        + "<tr><td><b>Product Type</b> :</td><td>" + doc["CAS.ProductTypeName"] + "</td></tr>"
							+ "<tr><td><b>Experiment ID</b> :</td><td> <a title='Click link to see experiement log' href='http://" + obs_log_server + ":8081/tailtask/" + doc['ExperimentID'] + "/progress'>" + doc['ExperimentID'] + "</a>"
							+ "</td></tr>"
					 		+ "<tr><td><b>Start Time</b> :</td><td> "
							+ date.format('YYYY-MM-DD HH:mm:ss') + "</td></tr>";
					if (doc["Targets"]){
							snippet += "<tr><td><b> Target/s</b> :</td><td> " + doc["Targets"][0] + "</td></tr>";
						for (var i = 1; i < doc["Targets"].length; i++){
							snippet += "<tr><td></td><td>" + doc["Targets"][i] + "</td></tr>";
						}
					}
							snippet += " <tr><td><b> Observation Data </b> :</td><td> <a href = "
							+ link + " >" + doc.Filename + "</a> ("
							+ filesize.toFixed(2) + " GB) </td></tr>"
							+ " <tr><td><b> File Location </b> :</td><td>"
							+ doc["FileLocation"] + "/" + doc.Filename
							+ "</td> <td align='right' width = 100px >" + "<button id='btnCpy" + doc['ExperimentID'] +"' data-clipboard-text='" + doc["FileLocation"] + "/" + doc.Filename + "' class='toClipboard' title='Copy to clipboard'> <img src = '/archive_search/img/clipboard.png' style='height:20px;width:20px;'alt = 'Copy to clipboard'> </button>"
							+ " <tr><td><b> Delete Observation </b> :</td><td>"
							+ "<button id='btnDel" + doc['ExperimentID'] + "' class='delete' value='" + doc.id + "'> Delete Observation </button>"
							+ "<div id='dlg" + doc.id + "' class='confirm' value='" + doc.id + ":" + doc["FileLocation"] + "/" + doc.Filename + "' title='Delete experiment " +  doc['ExperimentID'] +"?' style='text-align: center;'> Delete " + doc.Description + "?</div>"
							+ "</td></tr></table><br></div>";
							
					if (doc.Details != undefined) {
						snippet += "<pre>" + "<div class='collapsible'>"
								+ "<h3>Details</h3>"
								+ "<div class='details'><p class= 'monospace'>" + doc.Details
								+ "</p></div>" + "</div>" + "</pre>";
					}
					var output = "<div class='result'><div id= 'files" + doc['ExperimentID']
					+ "'><h2>" + doc.Description
					+ '</h2>';
					// output += doc["CAS.ProductTypeName"];
					output += '<p>' + snippet + '</p><hr></div>';

					// alert("POSTING");

					return output;
				}
			});

})(jQuery);