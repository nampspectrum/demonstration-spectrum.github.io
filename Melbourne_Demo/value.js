function map_ordering(){
    layers = layer_pointer();
    //alert('set map');
	for (var key in layers){
		item_layer = layers[key];
        if (typeof(item_layer) != "undefined"){
          	if (item_layer.map == map) {
             	  	item_layer.setMap(map);
            }
        }
	}
		
}

var list_of_class = {
"territory":{'id':"18Nifm-lKVVdaZa2J0HXiS-Xu1ncppA783e7lVJdm",'ulid':'territory_list','id_col':'name','name_col':'name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':'checked'},
"comp":{'id':"10FG4AKMLnw5IjeHGLQ28KqBheqKTE3YmKrKyX_P4",'ulid':'comp_list','id_col':'Place_id','name_col':'Name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoxml','default':'checked'},
"store_location":{'id':"1OfjlUvwb2TPrA81JOJUVQD3dYOUq_4L0cNtRw6aW",'ulid':'store_location_list','id_col':'Name','name_col':'Name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoxml','default':'checked'},
"seifa":{'id':"1e4IqA448df06v1bWrrN2h9NrThRVrEaky2Uy7ajg",'ulid':'seifa_list','id_col':'name','name_col':'LOCALITY_NAME','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':''},
"pop_density":{'id':"1tKDcENAXfHD7Bk-q6S6hs0n88-z9NFlQpl8NUWb6",'ulid':'pop_density_list','id_col':'name','name_col':'LOCALITY_NAME','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':''},
"building_approval":{'id':"1deeKWARIb3QYbIiwaxvscKg_aFqrmaM8wYvGaOzq",'ulid':'building_approval_list','id_col':'name','name_col':'LOCALITY_NAME','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':''},


};

function layer_pointer(){
   var layer_list = {			


					"pop_density":pop_density_layer,

					"building_approval":building_approval_layer,
					

					
					"territory":territory_layer,
					"seifa":seifa_layer,
					"comp":competitor_layer,
					"store_location":store_location_layer,


					};
   return layer_list;
}

function list_pointer(){
   var a_list = {"comp":comp_list,
   	   		  	 "store_location":store_location_list,
   	   		  	 "seifa":seifa_list,

					"territory":territory_list,
 				 "pop_density":pop_density_list,
 				 "building_approval":building_approval_list,		 						 				 
				 };
   return a_list;
}




var comp_list = [];
var territory_list = [];
var store_location_list = [];
var seifa_list = [];
var pop_density_list = [];

var building_approval_list = [];
var layer_list = new Array();
var test_layer;

function name_id_list(id_col,name_col,TableID, current_list_pointer) {
  var FT_TableID =TableID;

  var col_name = "1";
  var term = "2";
  var queryText = encodeURIComponent("SELECT '"+id_col+"', '" + name_col +"', 'centroidy','centroidx','area' FROM "+FT_TableID);
  var query = 'https://www.googleapis.com/fusiontables/v2/query?key=AIzaSyDfM2G-dd5qJ5A09ffhzyH7YrHinEVE9po&sql='  + queryText;
  //alert('query constructed:' + query);
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET',query,true);
  xhttp.send();
  //alert('xhttp ok');
  var a_list = list_pointer()[current_list_pointer];
  xhttp.onreadystatechange = function() {
	//if (this.readyState == 4 && this.status == 400){
	//   if(typeof(JSON.parse(this.responseText)["error"]["errors"]) != "undefined"){
	//	   alert("Error with list " + current_list_pointer + "\n" + JSON.parse(this.responseText)["error"]["errors"][0]["message"]);
	//   }
	//}
    if (this.readyState == 4 && this.status == 200) {
		//alert(current_list_pointer + "       :" + this.responseText);
      a_list = a_list.concat(JSON.parse(this.responseText)['rows']);
	  //alert("layer_list: " + layer_list.length);
	  //alert('a_list_json: ' + current_list_pointer + "       :" + a_list.length);
	  list_generate(a_list,list_of_class[current_list_pointer]['ulid'],current_list_pointer);
	  format_input_box(current_list_pointer); //attach the event listening function into the box
    }  
  };

}

for (var key in list_of_class){
	if(typeof(list_of_class[key]['ulid']) != 'undefined'){
		name_id_list(list_of_class[key]['id_col'],list_of_class[key]['name_col'],list_of_class[key]['id'],key);
	}
}


function attach_layer(f_TableID, f_where,f_options,f_index){
	layer_list[f_index]= new google.maps.FusionTablesLayer({query: {select: '\'col2\'',from: f_TableID, where: f_where}, options: f_options  });
	//alert('layer_list set');
}

function list_generate(list,ulid,liid,layer_index){
	var list_default = list_of_class[liid]['default'];
	if (typeof(layer_index) === 'undefined') {
		layer_index = 'undefined';
	}
	ul = document.getElementById(ulid);
    for (var i =0; i<list.length; i++){
		var el = document.createElement("li");
		el.innerHTML = "<input type='checkbox' layer_index='"+layer_index+"' querytype='"+liid+"' "+ "query_val = '"+list[i][0]+"' "  +"value='"+list[i][1]+"' "+ list_default+"><span querytype= '"+liid+"' "+"query_val = '"+list[i][0]+"'"  + "centroidy = '"+list[i][2]+"' "+ "centroidx = '"+list[i][3]+"' "+ "area = '"+list[i][4]+"' "  +"class='button query'>"+list[i][1]+"</span>";
		//var ul = document.createElement("ul");
		ul.appendChild(el);
	}

}


//list_generate(territory_list,"territory_list","territory");
//list_generate(comp_list,"comp_list","comp");
//setInterval(map_ordering, 3000);