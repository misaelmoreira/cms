var db = require('../../config/db.js');

var Pagina = function(pagina){

    if(pagina != undefined){
        this.id = pagina.id;
        this.nome = pagina.nome;
        this.conteudo = pagina.conteudo;
    }
    else{
        this.id = 0;
        this.nome = "";
        this.conteudo = "";
    }
    

    this.salvar = function(callback){
        if(this.nome == ""){
            console.log("[Modelo:Pagina] Nome da pagina obrigatorio");
            return;
        }

        if(this.conteudo == ""){
            console.log("[Modelo:Pagina] Conteudo da página obrigatorio");
            return;
        }      

        var query = "";
        if(this.id == 0 || this.id == "" || this.id == undefined){
            
            query = "INSERT INTO `CMS-API`.paginas (nome, conteudo) VALUES ('" + this.nome + "', '" + this.conteudo + "');";

            db.cnn.exec(query, function(rows, err ){
                if(err !== undefined && err !== null){
                    callback.call(null, {erro: true, mensagem: err.message});
                }
                else{
                    callback.call(null, {erro: false});
                }
            });
        }
        else {
            query = "UPDATE `cms-api`.paginas SET nome = '" + this.nome + "', conteudo = '" + this.conteudo + "' WHERE (id = '" + this.id + "');";
            db.cnn.exec(query, function(rows, err ){
                if(err !== undefined && err !== null){
                    callback.call(null, {erro: true, mensagem: err.message});
                }
                else{
                    callback.call(null, {erro: false});
                }
            });
        }
    };
};

Pagina.excluirTodos = function(callback){
    query = "delete from paginas";
    db.cnn.exec(query, function(rows, err ){
        if(err !== undefined && err !== null){
            callback.call(null, {erro: true, mensagem: err.message});
        }
        else{
            callback.call(null, {erro: false});
        }
    });

};

Pagina.truncateTable = function(callback){
    query = "truncate `cms-api`.paginas";
    db.cnn.exec(query, function(rows, err ){
        if(err !== undefined && err !== null){
            callback.call(null, {erro: true, mensagem: err.message});
        }
        else{
            callback.call(null, {erro: false});
        }
    });

};

Pagina.todos = function(callback){
    query = "select * from paginas";
    db.cnn.exec(query, function(rows, err ){
        if(err !== undefined && err !== null){
            callback.call(null, {
                erro: true, 
                mensagem: err.message, 
                paginas: []
            });
        }
        else{
            callback.call(null, {
                erro: false, 
                paginas: rows
            });
        }
    });
};

Pagina.buscaPorId = function(id, callback){
    query = "select * from paginas where id = " + id + ";";
    db.cnn.exec(query, function(rows, err ){
        if(err !== undefined && err !== null){
            callback.call(null, {
                erro: true, 
                mensagem: err.message, 
                pagina: {}
            });
        }
        else{
            if(rows.length > 0){
                callback.call(null, {
                erro: false, 
                pagina: rows[0]
                });
            }
            else{
                callback.call(null, {
                    erro: false, 
                    pagina: {}
                });
            }                    
        }
    });
};

Pagina.excluirPorId = function(id, callback){
    query = "delete from paginas where id = " + id + ";";
    db.cnn.exec(query, function(rows, err ){
        if(err !== undefined && err !== null){
            callback.call(null, {
                erro: true, 
                mensagem: err.message
            });
        }
        else{
            callback.call(null, {
                erro: false
            });
        }
            
    });
};

Pagina.buscaPorNome = function(nome, callback){
    query = "SELECT * FROM `cms-api`.paginas where nome like '%" + nome + "%';";
    db.cnn.exec(query, function(rows, err ){
        if(err !== undefined && err !== null){
            callback.call(null, {
                erro: true, 
                mensagem: err.message, 
                paginas: []
            });
        }
        else{
            if(rows.length > 0){
                callback.call(null, {
                erro: false, 
                paginas: rows
                });
            }
            else{
                callback.call(null, {
                    erro: false, 
                    paginas: []
                });
            }                    
        }
    });
};


module.exports = Pagina;