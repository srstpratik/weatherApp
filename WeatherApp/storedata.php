<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $city = $data['city'];
    $temp = $data['temp'];
    $humidity = $data['humidity'];
    $wind_speed = $data['wind_speed'];
    $icon = $data['icon'];

   
    $host = 'localhost';
    $username = 'Weather';
    $password = 'weather@12';
    $database = 'weather';

    $conn = new mysqli($host, $username, $password, $database);
    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    $sql = "INSERT INTO weather_data (city, temp, humidity, wind_speed, icon)
            VALUES ('$city', '$temp', '$humidity', '$wind_speed', '$icon')";

    if ($conn->query($sql) === TRUE) {
        $response = array('status' => 'success', 'message' => 'Weather data stored successfully');
    } else {
        $response = array('status' => 'error', 'message' => 'Error storing weather data: ' . $conn->error);
    }

    $conn->close();

    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    http_response_code(405);
}

?>
