<?php
// ex-001-variable-variable-chaos.php
// INTENTIONALLY AWFUL: PHP variable variables and magic method madness
// This file celebrates every PHP WTF moment and anti-pattern known to humanity
// WARNING: This code will make your server cry and your security team quit

// Error suppression paradise - silence ALL the warnings
error_reporting(0);
ini_set('display_errors', 0);

// Global state soup with confusing variable names
$GLOBALS['chaos'] = 'global chaos';
$GLOBALS['l1'] = 'l1';                    // confusable with I1
$GLOBALS['O0'] = 'O0';                    // confusable with 00
$GLOBALS['I1'] = 'I1';                    // confusable with l1
$GLOBALS['data'] = array();
$GLOBALS['config'] = array();
$GLOBALS['state'] = array();
$GLOBALS['db'] = null;
$GLOBALS['user'] = null;

// Variable variables chaos
$var = 'chaos';
$$var = 'variable variable madness';      // $chaos = 'variable variable madness'
$$$var = 'triple variable chaos';         // ${$chaos} = 'triple variable chaos'

// Dynamic variable names from user input (NEVER DO THIS)
function createVariableFromInput($input) {
    global ${$input};                     // create global variable from user input
    ${$input} = "HACKED: " . $input;      // assign value to dynamic variable
    
    // Even worse - create function names from input
    $funcName = 'process_' . $input;
    if (!function_exists($funcName)) {
        eval("function $funcName() { return 'EVAL CHAOS'; }");  // EVAL IS EVIL
    }
    
    return ${$input};
}

// Magic method overuse
class ChaosClass {
    private $data = array();
    private $config = array();
    
    // Magic method abuse
    public function __get($name) {
        // Return anything for any property
        if (isset($this->data[$name])) {
            return $this->data[$name];
        }
        
        // Create properties on the fly
        $this->data[$name] = "MAGIC_" . strtoupper($name);
        return $this->data[$name];
    }
    
    public function __set($name, $value) {
        // Set anything as any property
        $this->data[$name] = $value;
        
        // Side effects in __set
        global $GLOBALS;
        $GLOBALS['last_set'] = $name;
        $GLOBALS['set_count'] = isset($GLOBALS['set_count']) ? $GLOBALS['set_count'] + 1 : 1;
    }
    
    public function __call($method, $args) {
        // Handle any method call
        if (strpos($method, 'get') === 0) {
            $property = strtolower(substr($method, 3));
            return $this->__get($property);
        }
        
        if (strpos($method, 'set') === 0) {
            $property = strtolower(substr($method, 3));
            $this->__set($property, isset($args[0]) ? $args[0] : null);
            return $this;
        }
        
        // Execute arbitrary code based on method name
        if (method_exists($this, 'handle_' . $method)) {
            return call_user_func_array(array($this, 'handle_' . $method), $args);
        }
        
        // Last resort - eval the method name
        $code = "return 'DYNAMIC_METHOD_" . strtoupper($method) . "';";
        return @eval($code);  // suppress eval errors
    }
    
    public function __toString() {
        // Return serialized data (could expose sensitive info)
        return serialize($this->data);
    }
    
    public function __invoke() {
        // Make object callable
        return "OBJECT_INVOKED_" . time();
    }
    
    public function __debugInfo() {
        // Expose everything during debugging
        return array_merge($this->data, $this->config, $GLOBALS);
    }
}

// SQL injection paradise
function getUserData($username, $password) {
    global $db;
    
    // Direct string concatenation - SQL injection heaven
    $query = "SELECT * FROM users WHERE username = '" . $username . "' AND password = '" . $password . "'";
    
    // Log the query with sensitive data
    error_log("Executing query: " . $query);
    
    // Execute without any validation
    $result = @mysql_query($query, $db);  // deprecated mysql_ functions
    
    if ($result) {
        $user = mysql_fetch_assoc($result);
        
        // Store sensitive data in global state
        $GLOBALS['current_user'] = $user;
        $GLOBALS['last_query'] = $query;
        
        return $user;
    }
    
    return false;
}

// Include/require hell with circular dependencies
function loadConfig($configName) {
    global $config;
    
    // Dynamic includes based on user input
    $configFile = "config/" . $configName . ".php";
    
    // No validation of file path
    if (@file_exists($configFile)) {
        include $configFile;  // could include anything
    } else {
        // Try alternative paths
        include_once "configs/" . $configName . ".php";
        require "settings/" . $configName . ".config.php";
        require_once "../" . $configName . ".php";
    }
    
    // Circular dependency - config files that include this file
    if (isset($config['dependencies'])) {
        foreach ($config['dependencies'] as $dep) {
            loadConfig($dep);  // potential infinite recursion
        }
    }
}

// Error suppression abuse
function errorSuppressionParadise() {
    // Suppress ALL the errors
    @file_get_contents("http://nonexistent-domain.com/api");
    @json_decode("invalid json");
    @mysql_connect("invalid_host", "user", "pass");
    @fopen("/root/secret.txt", "r");
    @unlink("/important/system/file");
    
    // Suppress division by zero
    $result = @(10 / 0);
    
    // Suppress array access errors
    $data = array();
    $value = @$data['nonexistent']['nested']['key'];
    
    // Suppress function call errors
    @nonExistentFunction("with", "parameters");
    
    return "All errors suppressed successfully!";
}

// Global variable mutation everywhere
function mutateGlobals() {
    global $chaos, $data, $config, $state, $user;
    
    // Modify globals without any coordination
    $chaos .= "_MUTATED";
    $data['mutated'] = true;
    $config = array_merge($config, array('chaos' => true));
    $state['mutations'] = isset($state['mutations']) ? $state['mutations'] + 1 : 1;
    
    // Create new globals dynamically
    $GLOBALS['dynamic_global_' . time()] = "CREATED_AT_RUNTIME";
    
    // Modify superglobals
    $_SESSION['chaos'] = true;
    $_COOKIE['hacked'] = 'yes';
    $_SERVER['CUSTOM_CHAOS'] = 'injected';
}

// Type juggling chaos
function typeJugglingChaos($input) {
    // PHP's loose comparison madness
    if ($input == 0) {
        echo "Input equals 0\n";  // true for "", "0", false, null, array()
    }
    
    if ($input == false) {
        echo "Input equals false\n";  // true for 0, "", "0", null, array()
    }
    
    if ($input == null) {
        echo "Input equals null\n";  // true for false, 0, "", "0"
    }
    
    // String to number conversion chaos
    $result = $input + 0;  // convert to number
    $stringResult = $input . "";  // convert to string
    
    // Array to string conversion
    if (is_array($input)) {
        $arrayString = (string)$input;  // just "Array"
    }
    
    return array(
        'original' => $input,
        'as_number' => $result,
        'as_string' => $stringResult,
        'type' => gettype($input)
    );
}

// File handling disasters
function fileHandlingChaos($filename) {
    // Open file without checking if it exists or is readable
    $handle = @fopen($filename, "r+");
    
    if ($handle) {
        // Read entire file into memory without size limits
        $content = fread($handle, filesize($filename) * 2);  // read more than file size
        
        // Write without checking permissions
        fwrite($handle, "CHAOS_INJECTED_" . time());
        
        // Don't close the handle - resource leak
        // fclose($handle);  // commented out for chaos
    }
    
    // File operations without error checking
    @copy($filename, "/tmp/backup_" . basename($filename));
    @chmod($filename, 0777);  // world writable
    @chown($filename, "www-data");
    
    // Include user-provided files
    if (strpos($filename, '.php') !== false) {
        @include $filename;  // code injection vulnerability
    }
    
    return "File chaos complete";
}

// Session chaos
function sessionChaos() {
    // Start session without proper configuration
    @session_start();
    
    // Store sensitive data in session
    $_SESSION['password'] = 'admin123';
    $_SESSION['credit_card'] = '4111-1111-1111-1111';
    $_SESSION['ssn'] = '123-45-6789';
    
    // Session fixation vulnerability
    if (isset($_GET['session_id'])) {
        session_id($_GET['session_id']);
        session_start();
    }
    
    // Store objects in session without proper serialization
    $_SESSION['chaos_object'] = new ChaosClass();
    
    // Never regenerate session ID
    // session_regenerate_id();  // commented out for chaos
}

// Output buffering chaos
function outputBufferingChaos() {
    // Nested output buffers
    ob_start();
    echo "Level 1\n";
    
    ob_start();
    echo "Level 2\n";
    
    ob_start();
    echo "Level 3\n";
    
    // Mix ob_get_contents and ob_end_clean randomly
    $level3 = ob_get_contents();
    ob_end_clean();
    
    echo "Back to level 2\n";
    $level2 = ob_get_contents();
    // Don't clean level 2 - leave it hanging
    
    echo "Back to level 1\n";
    $level1 = ob_get_contents();
    ob_end_flush();  // flush instead of clean
    
    return array($level1, $level2, $level3);
}

// Main chaos orchestrator
function main() {
    echo "🐘 PHP NIGHTMARE STARTING - PREPARE FOR CHAOS! 🐘\n";
    
    // Initialize global chaos
    global $chaos, $data, $config, $state;
    $data = array('initialized' => true);
    $config = array('chaos_mode' => true);
    $state = array('active' => true);
    
    // Variable variable chaos
    $result1 = createVariableFromInput("user_input");
    echo "Variable variable result: $result1\n";
    
    // Magic method chaos
    $chaosObj = new ChaosClass();
    $chaosObj->dynamicProperty = "DYNAMIC_VALUE";
    echo "Magic property: " . $chaosObj->dynamicProperty . "\n";
    echo "Magic method: " . $chaosObj->getDynamicData("param") . "\n";
    echo "Object as string: " . $chaosObj . "\n";
    echo "Invoke object: " . $chaosObj() . "\n";
    
    // SQL injection chaos
    $userData = getUserData("admin' OR '1'='1", "password");
    if ($userData) {
        echo "User data retrieved (probably hacked)\n";
    }
    
    // Include chaos
    loadConfig("database");  // might cause circular includes
    
    // Error suppression chaos
    $suppressionResult = errorSuppressionParadise();
    echo "Error suppression: $suppressionResult\n";
    
    // Global mutation chaos
    mutateGlobals();
    echo "Globals mutated\n";
    
    // Type juggling chaos
    $typeResults = array(
        typeJugglingChaos("0"),
        typeJugglingChaos(false),
        typeJugglingChaos(null),
        typeJugglingChaos(array()),
        typeJugglingChaos("")
    );
    echo "Type juggling results: " . print_r($typeResults, true) . "\n";
    
    // File handling chaos
    $fileResult = fileHandlingChaos("/tmp/chaos.txt");
    echo "File chaos: $fileResult\n";
    
    // Session chaos
    sessionChaos();
    echo "Session chaos complete\n";
    
    // Output buffering chaos
    $bufferResults = outputBufferingChaos();
    echo "Buffer chaos: " . print_r($bufferResults, true) . "\n";
    
    // Final chaos report
    echo "🔥 PHP CHAOS COMPLETE! 🔥\n";
    echo "Global variables: " . count($GLOBALS) . "\n";
    echo "Memory usage: " . memory_get_usage() . " bytes\n";
    echo "Peak memory: " . memory_get_peak_usage() . " bytes\n";
    
    // Exit without cleanup
    exit(0);
}

// Auto-execute chaos
main();

// Dead code that might still execute due to includes
if (false) {
    echo "This should never execute\n";
    eval($_POST['code']);  // remote code execution
    system($_GET['cmd']);  // command injection
}

?>

<!-- HTML mixed with PHP for extra chaos -->
<script>
// JavaScript in PHP file
var phpData = <?php echo json_encode($GLOBALS); ?>;
console.log('PHP globals exposed to JavaScript:', phpData);

// XSS vulnerability
document.write('<?php echo $_GET["xss"]; ?>');
</script>

<?php
// More PHP after HTML
echo "<!-- This comment contains sensitive data: " . serialize($_SESSION) . " -->\n";
?>
