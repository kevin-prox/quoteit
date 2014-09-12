/**
 * Javascript file containing usefull methods not business related
 */

/*
 * Generates a random code with 'L' characters long
 */
function generateRandomString(L) {
	
    var s= '';
    
    var randomChar=function(){
    	var n= Math.floor(Math.random()*62);
    	if(n<10) return n; //1-10
    	if(n<36) return String.fromCharCode(n+55); //A-Z
    	return String.fromCharCode(n+61); //a-z
    };
    
    while(L--) s+= randomChar();
    
    return s;
};