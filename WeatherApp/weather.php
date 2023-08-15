<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather Data Table</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Weather Data for the Last 5 Days</h1>
    <table>
        <tr>
            <th>City</th>
            <th>Date</th>
            <th>Temperature (°C)</th>
            <th>Wind Speed (Km/H)</th>
            <th>Humidity (%)</th>
        </tr>
        <?php
        $city = $_GET['city'];

        $conn = mysqli_connect("localhost", "weather", "weather");

        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        $fiveDaysAgo = date('Y-m-d', strtotime('-5 days'));

        $sql = "SELECT city_name, date_recorded, temperature, pressure, wind_speed, humidity 
                FROM weatherInfo 
                WHERE city_name = '$city' AND date_recorded >= '$fiveDaysAgo'
                ORDER BY date_recorded DESC";

        $result = mysqli_query($conn, $sql);

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    echo "<tr><td>".$row["city"]."</td><td>".$row["date_recorded"]."</td><td>".$row["temperature"]."</td><td>".$row["pressure"]."</td><td>".$row["wind_speed"]."</td><td>".$row["humidity"]."</td></tr>";
                }
            } else {
                echo "<tr><td colspan='6'>No data available for the last 7 days.</td></tr>";
            }
        } else {
            echo "Error in SQL query: " . mysqli_error($conn);
        }

        mysqli_close($conn);
        ?>
    </table>
</body>
</html>