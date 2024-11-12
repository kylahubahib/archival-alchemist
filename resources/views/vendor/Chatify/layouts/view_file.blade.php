<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>View File</title>
</head>
<body>
    <h1>My File</h1>
    <iframe style="height: 800px; width: 100%" src="{{ asset('storage/capstone_files/' . $filename) }}"></iframe>
</body>
</html>
