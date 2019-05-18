<?php
    $database = 'crud.db';
    $db = new SQLite3($database);

    $tabela_discente = "CREATE TABLE IF NOT EXISTS discente (nome STRING, email STRING, 
                        matricula STRING, senha STRING)";

    $db -> exec($tabela_discente);

    function criarDiscente(){
        if(isset($_GET['submit'])){
            $nome = $_GET['nome'];
            $email = $_GET['email'];
            $matricula = $_GET['matricula'];
            $senha = $_GET['senha'];

            $query = "INSERT INTO discente (nome, email, matricula, senha) VALUES ('$nome',
                    '$email', '$maticula','$senha')";

            if($db -> exec($query)){
                echo "Discente inserido com sucesso.";
            }
            else{
                echo "Erro ao inserir novo discente.";
            }
        }
    }

    function atualizarDiscente(){
        if(isset($_GET['submit'])){
            $nome = $_GET['nome'];
            $email = $_GET['email'];
            $matricula = $_GET['matricula'];
            $senha = $_GET['senha'];

            $query = "UPDATE discente set nome='$nome', email='$email' WHERE rowid=$matricula";
            
            if($db->exec($query)){
                echo "Dados atualizados com sucesso.";
            }else{
                echo "Erro, dados não atualizados.";
            }
        }
    }

    function removeDiscente(){
        $matricula = $_GET['matricula'];

        $query = "DELETE FROM discente WHERE rowid=$matricula";

        if($db->query($query)){
            echo"Discente deletado com sucesso.";
        }
        else {
            echo "Erro ao deletar discente.";
        }
    }
?>
