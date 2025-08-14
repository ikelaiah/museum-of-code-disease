<?php
// ex-001-variable-variable-challenge.php AUTOPSY VERSION
// INTENTIONALLY AWFUL: PHP variable variables and magic method madness
// This file celebrates every PHP WTF moment and anti-pattern known to humanity
// AUTOPSY: Same nightmare code with detailed explanations of PHP's dangerous features

// PROBLEM: Error suppression paradise - silence ALL the warnings
error_reporting(0);                                              // PROBLEM: Disable all error reporting
ini_set('display_errors', 0);                                   // PROBLEM: Hide errors from display
// FIX: Enable error reporting in development, use proper error handling

// PROBLEM: Global state soup with confusing variable names
$GLOBALS['chaos'] = 'global chaos';                             // PROBLEM: Global variable pollution
$GLOBALS['l1'] = 'l1';                                          // PROBLEM: Confusable with I1
$GLOBALS['O0'] = 'O0';                                          // PROBLEM: Confusable with 00
$GLOBALS['I1'] = 'I1';                                          // PROBLEM: Confusable with l1
$GLOBALS['data'] = array();                                     // PROBLEM: Generic global array
$GLOBALS['config'] = array();                                  // PROBLEM: Global config array
$GLOBALS['state'] = array();                                   // PROBLEM: Global state array
$GLOBALS['db'] = null;                                         // PROBLEM: Global database connection
$GLOBALS['user'] = null;                                       // PROBLEM: Global user object
// FIX: Use classes, dependency injection, avoid global state

// PROBLEM: Variable variables chaos
$var = 'chaos';                                                // PROBLEM: Variable name as string
$$var = 'variable variable madness';                           // PROBLEM: $chaos = 'variable variable madness'
$$$var = 'triple variable chaos';                              // PROBLEM: ${$chaos} = 'triple variable chaos'
// FIX: Use arrays or objects instead of variable variables

// PROBLEM: Dynamic variable names from user input (NEVER DO THIS)
function createVariableFromInput($input) {
    global ${$input};                                           // PROBLEM: Create global variable from user input
    ${$input} = "HACKED: " . $input;                           // PROBLEM: Assign value to dynamic variable
    
    // PROBLEM: Even worse - create function names from input
    $funcName = 'process_' . $input;                           // PROBLEM: Function name from user input
    if (!function_exists($funcName)) {
        eval("function $funcName() { return 'EVAL CHAOS'; }"); // PROBLEM: EVAL IS EVIL - code injection
    }
    
    return ${$input};
}
// FIX: Validate and sanitize input, use whitelists, avoid eval()

// PROBLEM: Magic method overuse
class ChaosClass {
    private $data = array();                                    // PROBLEM: Private data accessed via magic methods
    private $config = array();                                  // PROBLEM: Private config accessed via magic methods
    
    // PROBLEM: Magic method abuse
    public function __get($name) {
        // PROBLEM: Return anything for any property
        if (isset($this->data[$name])) {
            return $this->data[$name];                          // PROBLEM: Return unvalidated data
        }
        
        // PROBLEM: Create properties on the fly
        $this->data[$name] = "MAGIC_" . strtoupper($name);      // PROBLEM: Auto-create properties
        return $this->data[$name];
    }
    
    public function __set($name, $value) {
        // PROBLEM: Set anything as any property
        $this->data[$name] = $value;                            // PROBLEM: No validation or type checking
        
        // PROBLEM: Side effects in __set
        global $GLOBALS;                                        // PROBLEM: Access globals in magic method
        $GLOBALS['last_set'] = $name;                          // PROBLEM: Global side effect
        $GLOBALS['set_count'] = isset($GLOBALS['set_count']) ? $GLOBALS['set_count'] + 1 : 1;
    }
    
    public function __call($method, $args) {
        // PROBLEM: Handle any method call
        if (strpos($method, 'get') === 0) {                     // PROBLEM: String-based method detection
            $property = strtolower(substr($method, 3));         // PROBLEM: Extract property name
            return $this->__get($property);                     // PROBLEM: Delegate to magic __get
        }
        
        if (strpos($method, 'set') === 0) {                     // PROBLEM: String-based method detection
            $property = strtolower(substr($method, 3));         // PROBLEM: Extract property name
            $this->__set($property, isset($args[0]) ? $args[0] : null);
            return $this;                                       // PROBLEM: Return $this for chaining
        }
        
        // PROBLEM: Execute arbitrary code based on method name
        if (method_exists($this, 'handle_' . $method)) {        // PROBLEM: Dynamic method calling
            return call_user_func_array(array($this, 'handle_' . $method), $args);
        }
        
        // PROBLEM: Last resort - eval the method name
        $code = "return 'DYNAMIC_METHOD_" . strtoupper($method) . "';";
        return @eval($code);                                    // PROBLEM: Eval with error suppression
    }
    
    public function __toString() {
        // PROBLEM: Return serialized data (could expose sensitive info)
        return serialize($this->data);                          // PROBLEM: Serialize private data
    }
    
    public function __invoke() {
        // PROBLEM: Make object callable
        return "OBJECT_INVOKED_" . time();                      // PROBLEM: Time-based return value
    }
    
    public function __debugInfo() {
        // PROBLEM: Expose everything during debugging
        return array_merge($this->data, $this->config, $GLOBALS); // PROBLEM: Expose globals and private data
    }
}
// FIX: Use explicit methods, validate inputs, avoid magic methods when possible

// PROBLEM: SQL injection paradise
function getUserData($username, $password) {
    global $db;
    
    // PROBLEM: Direct string concatenation - SQL injection heaven
    $query = "SELECT * FROM users WHERE username = '" . $username . "' AND password = '" . $password . "'";
    
    // PROBLEM: Log the query with sensitive data
    error_log("Executing query: " . $query);                   // PROBLEM: Log passwords in plain text
    
    // PROBLEM: Execute without any validation
    $result = @mysql_query($query, $db);                       // PROBLEM: Deprecated mysql_ functions
    
    if ($result) {
        $user = mysql_fetch_assoc($result);                     // PROBLEM: Deprecated function
        
        // PROBLEM: Store sensitive data in global state
        $GLOBALS['current_user'] = $user;                       // PROBLEM: User data in globals
        $GLOBALS['last_query'] = $query;                        // PROBLEM: Query with passwords in globals
        
        return $user;
    }
    
    return false;
}
// FIX: Use prepared statements, PDO, never log sensitive data, validate inputs

// PROBLEM: Include/require hell with circular dependencies
function loadConfig($configName) {
    global $config;
    
    // PROBLEM: Dynamic includes based on user input
    $configFile = "config/" . $configName . ".php";            // PROBLEM: Path from user input
    
    // PROBLEM: No validation of file path
    if (@file_exists($configFile)) {                           // PROBLEM: Error suppression
        include $configFile;                                    // PROBLEM: Could include anything
    } else {
        // PROBLEM: Try alternative paths
        include_once "configs/" . $configName . ".php";        // PROBLEM: More dynamic includes
        require "settings/" . $configName . ".config.php";     // PROBLEM: Require without error handling
        require_once "../" . $configName . ".php";             // PROBLEM: Directory traversal possible
    }
    
    // PROBLEM: Circular dependency - config files that include this file
    if (isset($config['dependencies'])) {
        foreach ($config['dependencies'] as $dep) {
            loadConfig($dep);                                   // PROBLEM: Potential infinite recursion
        }
    }
}
// FIX: Validate file paths, use whitelists, avoid circular dependencies

// PROBLEM: Error suppression abuse
function errorSuppressionParadise() {
    // PROBLEM: Suppress ALL the errors
    @file_get_contents("http://nonexistent-domain.com/api");    // PROBLEM: Suppress network errors
    @json_decode("invalid json");                               // PROBLEM: Suppress JSON errors
    @mysql_connect("invalid_host", "user", "pass");            // PROBLEM: Suppress connection errors
    @fopen("/root/secret.txt", "r");                           // PROBLEM: Suppress file access errors
    @unlink("/important/system/file");                         // PROBLEM: Suppress file deletion errors
    
    // PROBLEM: Suppress division by zero
    $result = @(10 / 0);                                       // PROBLEM: Suppress math errors
    
    // PROBLEM: Suppress array access errors
    $data = array();
    $value = @$data['nonexistent']['nested']['key'];           // PROBLEM: Suppress undefined index
    
    // PROBLEM: Suppress function call errors
    @nonExistentFunction("with", "parameters");                // PROBLEM: Suppress undefined function
    
    return "All errors suppressed successfully!";
}
// FIX: Handle errors properly, use try-catch, validate before operations

// PROBLEM: Global variable mutation everywhere
function mutateGlobals() {
    global $chaos, $data, $config, $state, $user;              // PROBLEM: Import many globals
    
    // PROBLEM: Modify globals without any coordination
    $chaos .= "_MUTATED";                                      // PROBLEM: String concatenation to global
    $data['mutated'] = true;                                   // PROBLEM: Add to global array
    $config = array_merge($config, array('chaos' => true));   // PROBLEM: Merge into global config
    $state['mutations'] = isset($state['mutations']) ? $state['mutations'] + 1 : 1;
    
    // PROBLEM: Create new globals dynamically
    $GLOBALS['dynamic_global_' . time()] = "CREATED_AT_RUNTIME"; // PROBLEM: Runtime global creation
    
    // PROBLEM: Modify superglobals
    $_SESSION['chaos'] = true;                                  // PROBLEM: Modify session
    $_COOKIE['hacked'] = 'yes';                                // PROBLEM: Modify cookies (won't work)
    $_SERVER['CUSTOM_CHAOS'] = 'injected';                    // PROBLEM: Modify server vars
}
// FIX: Use classes, dependency injection, avoid global mutation

// PROBLEM: Type juggling chaos
function typeJugglingChaos($input) {
    // PROBLEM: PHP's loose comparison madness
    if ($input == 0) {                                         // PROBLEM: Loose comparison
        echo "Input equals 0\n";                               // PROBLEM: True for "", "0", false, null, array()
    }
    
    if ($input == false) {                                     // PROBLEM: Loose comparison
        echo "Input equals false\n";                           // PROBLEM: True for 0, "", "0", null, array()
    }
    
    if ($input == null) {                                      // PROBLEM: Loose comparison
        echo "Input equals null\n";                            // PROBLEM: True for false, 0, "", "0"
    }
    
    // PROBLEM: String to number conversion chaos
    $result = $input + 0;                                      // PROBLEM: Force numeric conversion
    $stringResult = $input . "";                               // PROBLEM: Force string conversion
    
    // PROBLEM: Array to string conversion
    if (is_array($input)) {
        $arrayString = (string)$input;                          // PROBLEM: Just returns "Array"
    }
    
    return array(
        'original' => $input,
        'as_number' => $result,
        'as_string' => $stringResult,
        'type' => gettype($input)
    );
}
// FIX: Use strict comparisons (===), validate types explicitly

// PROBLEM: File handling disasters
function fileHandlingChaos($filename) {
    // PROBLEM: Open file without checking if it exists or is readable
    $handle = @fopen($filename, "r+");                         // PROBLEM: Suppress errors, read+write mode
    
    if ($handle) {
        // PROBLEM: Read entire file into memory without size limits
        $content = fread($handle, filesize($filename) * 2);    // PROBLEM: Read more than file size
        
        // PROBLEM: Write without checking permissions
        fwrite($handle, "CHAOS_INJECTED_" . time());           // PROBLEM: Inject content into file
        
        // PROBLEM: Don't close the handle - resource leak
        // fclose($handle);                                    // PROBLEM: Commented out for chaos
    }
    
    // PROBLEM: File operations without error checking
    @copy($filename, "/tmp/backup_" . basename($filename));    // PROBLEM: Copy without validation
    @chmod($filename, 0777);                                   // PROBLEM: World writable permissions
    @chown($filename, "www-data");                             // PROBLEM: Change ownership
    
    // PROBLEM: Include user-provided files
    if (strpos($filename, '.php') !== false) {                 // PROBLEM: Weak file type check
        @include $filename;                                     // PROBLEM: Code injection vulnerability
    }
    
    return "File chaos complete";
}
// FIX: Validate file paths, check permissions, use proper error handling

// PROBLEM: Session chaos
function sessionChaos() {
    // PROBLEM: Start session without proper configuration
    @session_start();                                           // PROBLEM: Suppress session errors
    
    // PROBLEM: Store sensitive data in session
    $_SESSION['password'] = 'admin123';                        // PROBLEM: Password in session
    $_SESSION['credit_card'] = '4111-1111-1111-1111';         // PROBLEM: Credit card in session
    $_SESSION['ssn'] = '123-45-6789';                          // PROBLEM: SSN in session
    
    // PROBLEM: Session fixation vulnerability
    if (isset($_GET['session_id'])) {                          // PROBLEM: Accept session ID from GET
        session_id($_GET['session_id']);                       // PROBLEM: Set session ID from user input
        session_start();                                        // PROBLEM: Start with user-provided ID
    }
    
    // PROBLEM: Store objects in session without proper serialization
    $_SESSION['chaos_object'] = new ChaosClass();              // PROBLEM: Object in session
    
    // PROBLEM: Never regenerate session ID
    // session_regenerate_id();                                // PROBLEM: Commented out for chaos
}
// FIX: Configure sessions properly, don't store sensitive data, regenerate IDs

// PROBLEM: Output buffering chaos
function outputBufferingChaos() {
    // PROBLEM: Nested output buffers
    ob_start();                                                 // PROBLEM: Start buffer level 1
    echo "Level 1\n";
    
    ob_start();                                                 // PROBLEM: Start buffer level 2
    echo "Level 2\n";
    
    ob_start();                                                 // PROBLEM: Start buffer level 3
    echo "Level 3\n";
    
    // PROBLEM: Mix ob_get_contents and ob_end_clean randomly
    $level3 = ob_get_contents();                               // PROBLEM: Get level 3 contents
    ob_end_clean();                                            // PROBLEM: Clean level 3
    
    echo "Back to level 2\n";
    $level2 = ob_get_contents();                               // PROBLEM: Get level 2 contents
    // PROBLEM: Don't clean level 2 - leave it hanging
    
    echo "Back to level 1\n";
    $level1 = ob_get_contents();                               // PROBLEM: Get level 1 contents
    ob_end_flush();                                            // PROBLEM: Flush instead of clean
    
    return array($level1, $level2, $level3);
}
// FIX: Manage output buffers properly, clean up all levels

// PROBLEM: Main chaos orchestrator
function main() {
    echo "🐘 PHP NIGHTMARE STARTING - PREPARE FOR CHAOS! 🐘\n";
    
    // PROBLEM: Initialize global chaos
    global $chaos, $data, $config, $state;                     // PROBLEM: Import globals
    $data = array('initialized' => true);                      // PROBLEM: Initialize global
    $config = array('chaos_mode' => true);                     // PROBLEM: Initialize global config
    $state = array('active' => true);                          // PROBLEM: Initialize global state
    
    // PROBLEM: Variable variable chaos
    $result1 = createVariableFromInput("user_input");          // PROBLEM: Create variable from string
    echo "Variable variable result: $result1\n";
    
    // PROBLEM: Magic method chaos
    $chaosObj = new ChaosClass();                              // PROBLEM: Create chaos object
    $chaosObj->dynamicProperty = "DYNAMIC_VALUE";              // PROBLEM: Use magic __set
    echo "Magic property: " . $chaosObj->dynamicProperty . "\n"; // PROBLEM: Use magic __get
    echo "Magic method: " . $chaosObj->getDynamicData("param") . "\n"; // PROBLEM: Use magic __call
    echo "Object as string: " . $chaosObj . "\n";             // PROBLEM: Use magic __toString
    echo "Invoke object: " . $chaosObj() . "\n";              // PROBLEM: Use magic __invoke
    
    // PROBLEM: SQL injection chaos
    $userData = getUserData("admin' OR '1'='1", "password");   // PROBLEM: SQL injection payload
    if ($userData) {
        echo "User data retrieved (probably hacked)\n";
    }
    
    // PROBLEM: Include chaos
    loadConfig("database");                                     // PROBLEM: Might cause circular includes
    
    // PROBLEM: Error suppression chaos
    $suppressionResult = errorSuppressionParadise();           // PROBLEM: Suppress all errors
    echo "Error suppression: $suppressionResult\n";
    
    // PROBLEM: Global mutation chaos
    mutateGlobals();                                           // PROBLEM: Mutate global state
    echo "Globals mutated\n";
    
    // PROBLEM: Type juggling chaos
    $typeResults = array(                                      // PROBLEM: Array of type juggling results
        typeJugglingChaos("0"),                               // PROBLEM: String "0"
        typeJugglingChaos(false),                             // PROBLEM: Boolean false
        typeJugglingChaos(null),                              // PROBLEM: Null value
        typeJugglingChaos(array()),                           // PROBLEM: Empty array
        typeJugglingChaos("")                                 // PROBLEM: Empty string
    );
    echo "Type juggling results: " . print_r($typeResults, true) . "\n";
    
    // PROBLEM: File handling chaos
    $fileResult = fileHandlingChaos("/tmp/chaos.txt");         // PROBLEM: File operations without validation
    echo "File chaos: $fileResult\n";
    
    // PROBLEM: Session chaos
    sessionChaos();                                            // PROBLEM: Session mismanagement
    echo "Session chaos complete\n";
    
    // PROBLEM: Output buffering chaos
    $bufferResults = outputBufferingChaos();                   // PROBLEM: Nested buffer chaos
    echo "Buffer chaos: " . print_r($bufferResults, true) . "\n";
    
    // PROBLEM: Final chaos report
    echo "🔥 PHP CHAOS COMPLETE! 🔥\n";
    echo "Global variables: " . count($GLOBALS) . "\n";       // PROBLEM: Count globals
    echo "Memory usage: " . memory_get_usage() . " bytes\n";  // PROBLEM: Memory usage
    echo "Peak memory: " . memory_get_peak_usage() . " bytes\n"; // PROBLEM: Peak memory
    
    // PROBLEM: Exit without cleanup
    exit(0);                                                   // PROBLEM: Force exit
}

// PROBLEM: Auto-execute chaos
main();                                                        // PROBLEM: Execute immediately

// PROBLEM: Dead code that might still execute due to includes
if (false) {                                                   // PROBLEM: Dead code block
    echo "This should never execute\n";
    eval($_POST['code']);                                      // PROBLEM: Remote code execution
    system($_GET['cmd']);                                      // PROBLEM: Command injection
}

?>

<!-- PROBLEM: HTML mixed with PHP for extra chaos -->
<script>
// PROBLEM: JavaScript in PHP file
var phpData = <?php echo json_encode($GLOBALS); ?>;           // PROBLEM: Expose PHP globals to JS
console.log('PHP globals exposed to JavaScript:', phpData);

// PROBLEM: XSS vulnerability
document.write('<?php echo $_GET["xss"]; ?>');                // PROBLEM: Direct output of GET parameter
</script>

<?php
// PROBLEM: More PHP after HTML
echo "<!-- This comment contains sensitive data: " . serialize($_SESSION) . " -->\n"; // PROBLEM: Expose session in HTML comment
?>

<?php
// ─────────────────────────────────────────────────────────────────────────────
// PHP ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Variable Variables**: Using $$var creates dynamic variable names
// 2. **Magic Method Overuse**: __get, __set, __call bypass normal method calls
// 3. **SQL Injection**: String concatenation in SQL queries
// 4. **Error Suppression**: @ operator hides all errors and warnings
// 5. **Global State Abuse**: Excessive use of global variables and $GLOBALS
// 6. **Include/Require Hell**: Dynamic includes with user input
// 7. **Type Juggling**: Loose comparisons (==) cause unexpected behavior
// 8. **Eval() Usage**: eval() executes arbitrary code - major security risk
// 9. **Session Mismanagement**: Storing sensitive data, session fixation
// 10. **XSS Vulnerabilities**: Direct output of user input without escaping

// WHY PHP IS UNIQUELY DANGEROUS:
// ─────────────────────────────────────────────────────────────────────────────
// - **Variable Variables**: Can create variables from user input
// - **Magic Methods**: Can intercept and modify all property/method access
// - **Type Juggling**: Automatic type conversion causes unexpected comparisons
// - **Global State**: Easy access to global variables and superglobals
// - **Include System**: Can include any file, even user-provided ones
// - **Error Suppression**: @ operator can hide critical errors
// - **Mixed HTML/PHP**: Easy to create XSS vulnerabilities
// - **Backwards Compatibility**: Many deprecated and dangerous functions still work

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Avoid variable variables, use arrays or objects instead
// 2. Use explicit methods instead of magic methods when possible
// 3. Use prepared statements (PDO) for database queries
// 4. Handle errors properly, don't suppress with @
// 5. Use classes and dependency injection instead of globals
// 6. Validate and whitelist file includes, avoid dynamic includes
// 7. Use strict comparisons (===) instead of loose (==)
// 8. Never use eval(), validate and sanitize all input
// 9. Configure sessions properly, don't store sensitive data
// 10. Escape output with htmlspecialchars(), validate all input

// Remember: PHP gives you many ways to shoot yourself in the foot - be careful! 🐘
?>
