define(['jquery','underscore','dust'],function($, _, dust){
    
   /**
    * Dust Wrapper - with caching support 
    */
   var templateEngine = {
       
       /**
        * Array of already known template names. 
        */
       compiledTemplate : [],
       
       /**
        * If the name of template is not already registered,
        * compile the template and register it.
        * @param {object} name
        * @param {object} template 
        */
       compile : function(name,template){
           this.compiledTemplate.push(name);
           dust.loadSource(dust.compile(template, name));
       },
       
       /**
        * Rendering function
        * @param {object} name
        * @param {object} ctx 
        */
       render : function(name, ctx){
           var result;
           dust.render(name, ctx, function(err, out){
              result = out; 
           });
           return result;
       },
       
       /**
        * Rendering function
        * @param {object} name
        * @param {object} ctx 
        */
       renderTemplate : function(template, ctx){
           var generatedName = this.hashFunction(template);
           this.compile(generatedName, template);
           return this.render(generatedName, ctx);
       },
       
       /**
        * Hash function used to generate fake name (djb2)
        * cf. http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash
        * @param {object} str 
        */
       hashFunction : function(str){
           var hash = 'lotofoot';
           for (i=0; i<str.length; i++){
               char = str.charCodeAt(i);
               hash = ((hash << 5) + hash) + char;
           }
           return hash;
       }
   };
   
   /* Register dust helper */
  /* Before using dust helpers do not forget to add the library */
  if(!dust.helpers)
    dust.helpers = {};
    
  // Just a trivial helper demo <h1>{@helloWorld}</h1>
  dust.helpers.helloWorld = function(chunk, context, bodies, params){
    return chunk.write('Hello World');  
  };
      
   return templateEngine 
});
