<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Recebe os dados da solicitação HTTP
$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['idusuario'])) {
    $idusuario = $data['idusuario'];
    $rodada = $data['rodada'];

    // Conecte-se ao seu banco de dados SQL (substitua pelas suas configurações)
    $servername = "srv716.hstgr.io:3306";
    $username = "u148575132_puzzlegame";
    $password = "LontraR0sa";
    $dbname = "u148575132_puzzle";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Erro de conexão com o banco de dados: " . $conn->connect_error);
    }

    // Consulta SQL para buscar resultados com base em idusuario
    $sql = "SELECT idquadrinho, urlimg FROM estadojogo WHERE idusuario = $idusuario and rodada = $rodada";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $resultados = [];

        // Construa um array com os resultados
        while ($row = $result->fetch_assoc()) {
            $resultados[] = $row;
        }

        echo json_encode($resultados);
    } else {
        echo json_encode(['erro' => 'Nenhum resultado encontrado']);
    }

    $conn->close();
} else {
  http_response_code(400); // Resposta de erro 400 (Bad Request)
    echo json_encode(['erro' => 'Dados inválidos']);
}
?>
