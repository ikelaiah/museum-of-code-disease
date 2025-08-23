<?php
// Dangerous: unserialize of untrusted data
// Run: php ex-010-insecure-unserialize.php "O:8:\"stdClass\":0:{}"
// Reference: https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data

$input = $argv[1] ?? serialize((object)["msg" => "hello"]);
$obj = unserialize($input); // VULNERABLE
var_dump($obj);
