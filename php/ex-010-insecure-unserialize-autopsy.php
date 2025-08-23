<?php
// Fix: avoid unserialize; if unavoidable, disallow classes
// Run: php ex-010-insecure-unserialize-autopsy.php '{"msg":"hello"}'

$input = $argv[1] ?? '{"msg":"hello"}';
$decoded = json_decode($input, true, 512, JSON_THROW_ON_ERROR);
var_dump($decoded);

// If legacy data must be handled:
// $obj = unserialize($input, ["allowed_classes" => false]);
