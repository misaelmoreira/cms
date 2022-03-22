var Pagina = require("../../../app/models/pagina");

describe("O modelo de pagina", function(){
    describe("com atributos", function(){
        it("id precisa ser valido", function(){
            var pagina = new Pagina();    
            expect(pagina.id).toBe(0);
        });
        it("nome precisa ser valido", function(){
            var pagina = new Pagina();
            expect(pagina.nome).toBe("");
        });
        it("conteudo precisa ser valido", function(){
            var pagina = new Pagina();
            expect(pagina.conteudo).toBe("");
        });
    });
    describe("com o metodo salvar", function(){
        it("deve inclur no banco de dados", function(done){
            var pagina = new Pagina();
            pagina.nome = "Pagina de teste";
            pagina.conteudo = "algum conteudo";            
            pagina.salvar(function(retorno){
                expect(retorno.erro).toBe(false);
                done();
            });            
        });
    });

    describe("com o metodo excluirTodos", function(){
        it("deve excluir todas as paginas", function(done){
            Pagina.excluirTodos(function(retorno){
                expect(retorno.erro).toBe(false);
                done();
            });            
        });
    });

    describe("com o metodo buscarPorID", function(){
        it("deve exibir pagina pelo ID", function(done){
            Pagina.truncateTable(function(retorno1){
                var pagina = new Pagina();
                pagina.nome = "Criando Pagina nova";
                pagina.conteudo = "teste conteudo";                
                pagina.salvar(function(retorno2){
                    Pagina.buscaPorId(1, function(retorno3){
                        expect(retorno3.erro).toBe(false);
                        expect(retorno3.pagina.id).toBe(1);
                        done();
                    }); 
                });  
            });           
        });
    });
    
    describe("com o metodo ExcluirPorID", function(){
        it("deve excluir pagina pelo seu ID", function(done){
            Pagina.truncateTable(function(retorno1){
                var pagina = new Pagina();
                pagina.nome = "Criando Pagina nova";
                pagina.conteudo = "teste conteudo";                 
                pagina.salvar(function(retorno2){
                    Pagina.excluirPorId(1, function(retorno3){
                        expect(retorno3.erro).toBe(false);
                        done();
                    }); 
                });  
            });           
        });
    });


    describe("com o metodo todos", function(){
        it("deve exibir todas as paginas", function(done){
            Pagina.excluirTodos(function(retorno1){
                var pagina = new Pagina();                
                pagina.nome = "Criando Pagina nova";
                pagina.conteudo = "teste conteudo"; 
                pagina.salvar(function(retorno2){
                    Pagina.todos(function(retorno3){
                        expect(retorno3.erro).toBe(false);
                        expect(retorno3.paginas.length).toBe(1);
                        done();
                    }); 
                });  
            });           
        });
    });

    describe("com o metodo atualizar", function(){
        it("deve atualizar o pagina criado", function(done){
            Pagina.excluirTodos(function(retorno1){
                var pagina = new Pagina();
                pagina.nome = "Criando Pagina nova";
                pagina.conteudo = "teste conteudo"; 
                pagina.salvar(function(retorno2){
                    Pagina.todos(function(retorno3){
                        var pagina = retorno3.paginas[0];
                        var uUpdate = new Pagina(pagina);
                        uUpdate.nome = "Nome Atualizado";
                        uUpdate.salvar(function(retorno4){
                            expect(retorno4.erro).toBe(false);
                            done();
                        });
                    }); 
                });  
            });           
        });
    });

    describe("com o metodo buscaPorNome", function(){
        it("deve retornar as paginas que tem o nome", function(done){
            Pagina.excluirTodos(function(retorno1){
                nome = "pagina de busca original";
                var pagina = new Pagina({ nome: nome, conteudo: "uma pagina de busca" });                
                pagina.salvar(function(retorno2){
                    var pagina2 = new Pagina({ nome: "pagina de busca 2", conteudo: "uma pagina de busca 2"});  
                    pagina2.salvar(function(retorno3){
                        Pagina.buscaPorNome("original", function(retorno4){
                            expect(retorno4.erro).toBe(false);
                            expect(retorno4.paginas.length).toBe(1);                            
                            expect(retorno4.paginas[0].nome).toBe(nome);
                            done();
                        }); 
                    });
                });  
            });           
        });
    });

    
    

});