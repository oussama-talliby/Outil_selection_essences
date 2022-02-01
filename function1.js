function get_name(name){
	var re= /\w+/gm;
	var list = name.match(re);
	return list;

};

/************************/
function get_weight(mot){
	switch (mot){
		case 'Important':
		    return 1;
		    break;
		case 'Peu Important':
		     return 0.5;
		     break;
		default:
		     return 'bloquant'
	}
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }


function get_val(description,i){
    
    if (isNumeric(description[i]['reponses'][0].valeur)){
        
        return 0;
    }else{return '';}
}

function build_default_input_and_weights(description){
    let default_inputs={};
    let weight={};
    let default_var=[];
	let n_choice={};
	
    const nbr_prop=description.length;
    for (var i=0;i<nbr_prop;i++){
		
    	switch (description[i]['type_question']){
			case 'Select':
				
				n_choice[description[i].nom]=description[i]['reponses'].length;
				default_inputs[description[i].nom]=get_val(description,i);
				
				weight[description[i].nom]=get_weight(description[i].importance);

				break;
			case '':
				
				if (description[i].nom=='Indice de confiance'){
					value_def=5;
				}else{
					value_def=1;
				};
				n_choice[description[i].nom]=description[i]['reponses'].length;
				default_inputs[description[i].nom]=value_def;
				
				weight[description[i].nom]=get_weight(description[i].importance);
				default_var.push(description[i].nom);
				
				 break;
		default:
            const nb_choix=description[i]['reponses'].length;
            for (var j=0;j<nb_choix;j++){

                       let nom=description[i]['reponses'][j].valeur;
						default_inputs[nom]=false;
						n_choice[nom]=2;
						
						weight[nom]=get_weight(description[i].importance);}

			break;}
						};


					
    return [default_inputs, weight,default_var,n_choice];
	};

var description= require('./description.json');

var input1 = require('./input.json');

let [default_inputs, weight,default_var,n_choice]=build_default_input_and_weights(description);

function delete_non_input(input){
    const props=Object.keys(input);
    for (const i in props){
        prop=props[i];
        if ((input[prop]=='')||(input[prop]==false)){
                delete input[prop]; 
        };
    };
    return  input;
};



let input=delete_non_input(input1);

let filters_input=Object.keys(input);
let filters=Object.keys(default_inputs);

filters_input=filters_input.concat(default_var);



function update_input(input,default_inputs){
    let filters1=Object.keys(input);
     for (const i in filters1){
        prop = filters1[i];
        
        if (isNumeric(input[prop]) ){
            
                
                default_inputs[prop]=parseInt(input[prop]);
            
           }
           default_inputs[prop]=input[prop]

     	 };
          
	 return default_inputs;

           };
           
let inputs_updated=update_input(input,default_inputs);


function update_data(data,filters){
	const n_arbre=data.length;
	
    for (var i=0;i<n_arbre ;i++){

             
			for (const j in filters){
                prop=filters[j];
                
				if (prop=='Indice de potentiel d\'adaptation'){
				
									if(parseFloat(data[i][prop])>=3){
										
										data[i][prop]=1;
									}else if((parseFloat(data[i][prop])>=2.5)&&(parseFloat(data[i][prop])<3)){
										data[i][prop]=2;
				
									}else if((parseFloat(data[i][prop])>=2)&&(parseFloat(data[i][prop])<2.5)){
										data[i][prop]=3;
				
									}else if ((parseFloat(data[i][prop])>=1)&&(parseFloat(data[i][prop])<2)){
										data[i][prop]=4;
									}else if (parseFloat(data[i][prop])<1) {
										data[i][prop]=5;
									} 
				}

		         switch (data[i][prop]){

							case 'X':
							data[i][prop]=true;
						    break;
							case 'Fort':
							case 'Positif':
						     data[i][prop]=1;
						    break;
						    case '':
						     data[i]['prop']=false;
						     break;
						    case'Moyen':
						    case 'Modéré':
						    case 'Neutre':
						     data[i][prop]=2;
						     break;
						    case 'Limité':
						    case 'Faible à négligeable':
						    case 'Négatif':
						     data[i][prop]=3;
						     break;
						     // c'est une entier 
						     default:
						     data[i][prop]=parseInt(data[i][prop]);
						     break;}
				}
		}
	return data;

};

var mydata = require('./ex.json');
var data_updated=update_data(mydata,filters);
console.log(mydata)