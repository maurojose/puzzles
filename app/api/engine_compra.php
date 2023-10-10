<?php
$servername = "srv716.hstgr.io:3306";
$username = "u148575132_puzzlegame";
$password = "LontraR0sa";
$dbname = "u148575132_puzzle";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Erro de conexão com o banco de dados: " . $conn->connect_error);
}

$id = mt_rand(1, 66);
$rodada = 1;
$idusuario = 1;

$sqlverificacao = "SELECT ganhador FROM jogos WHERE rodada = $rodada";

$resultverificacao = $conn->query($sqlverificacao);
$rowverificacao = $resultverificacao->fetch_assoc();

if($resultverificacao->num_rows > 0 && $rowverificacao["ganhador"] != 0){

    echo "esse jogo ja acabou";
}else{

$sql = "SELECT quantidade FROM compradas WHERE id = $id and rodada = $rodada and idusuario = $idusuario";

$result = $conn->query($sql);


if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $somaquantidade = $row["quantidade"] + 1;

    $sql2 = "UPDATE compradas SET quantidade = $somaquantidade WHERE id = $id and rodada = $rodada and idusuario = $idusuario";
    $result2 = $conn->query($sql2);

    echo "seu id: $idusuario, tem $somaquantidade imagens com id: $id na rodada $rodada ";
} else {
    $somaquantidade = 1;
    $sql3 = "INSERT INTO compradas (id, quantidade, rodada, idusuario) VALUES ($id, $somaquantidade, $rodada, $idusuario)";
    $result3 = $conn->query($sql3);

    // Como não há $row definido aqui, defina $quantidadetotal para $somaquantidade
    $quantidadetotal = $somaquantidade;

    echo "seu id: $idusuario, acabou de comprar $quantidadetotal imagens com id: $id na rodada $rodada ";
}

$sqlsaldo = "SELECT saldo FROM usuarios WHERE idusuario = $idusuario";

$resultsaldo = $conn->query($sqlsaldo);
$rowsaldo = $resultsaldo->fetch_assoc();
$updatesaldo = $rowsaldo["saldo"]-1;

$sqlupdatesaldo = "UPDATE usuarios SET saldo = $updatesaldo WHERE idusuario = $idusuario";
$resultupdate = $conn->query($sqlupdatesaldo);

echo "seu saldo atual é $updatesaldo";

}
$conn->close();


?>
