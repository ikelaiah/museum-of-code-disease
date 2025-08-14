// ex-002-reflection-nightmare-autopsy.java AUTOPSY VERSION
// INTENTIONALLY AWFUL: Java reflection abuse and serialization disasters
// This file celebrates runtime class manipulation and annotation processing chaos
// AUTOPSY: Same challenge code with detailed explanations of Java reflection anti-patterns

import java.lang.reflect.*;
import java.lang.annotation.*;
import java.io.*;
import java.util.*;
import java.util.concurrent.*;
import java.net.*;
import java.security.*;
import javax.tools.*;
import java.nio.file.*;

// PROBLEM: Custom annotations for chaos
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@interface ChaosAnnotation {
    String value() default "CHAOS";
    int level() default 888;
    boolean dangerous() default true;
}
// WHY THIS IS PROBLEMATIC: Custom annotations can be abused for runtime manipulation
// FIX: Use standard annotations and avoid runtime processing when possible

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface InjectChaos {
    String before() default "";
    String after() default "";
    boolean modifyReturn() default true;
}
// WHY THIS IS PROBLEMATIC: Annotations that modify behavior at runtime are dangerous
// FIX: Use explicit method calls or proper AOP frameworks

// PROBLEM: Class with reflection chaos
@ChaosAnnotation(value = "REFLECTION_NIGHTMARE", level = 999)
public class ReflectionNightmare {
    /*
    PROBLEM: This class demonstrates multiple reflection anti-patterns:
    1. Breaks encapsulation by accessing private members
    2. Modifies final fields using reflection
    3. Creates instances without calling constructors
    4. Bypasses access control and security
    5. Uses reflection for operations that should be compile-time
    
    WHY THIS IS PROBLEMATIC:
    - Breaks type safety and compile-time guarantees
    - Makes code very difficult to debug and maintain
    - Can cause security vulnerabilities
    - Performance overhead from reflection calls
    - Breaks IDE support and refactoring tools
    
    FIX: Use proper OOP design, interfaces, dependency injection
    */
    
    // PROBLEM: Private fields that will be accessed via reflection
    private String secretData = "TOP_SECRET";                   // PROBLEM: Will be accessed via reflection
    private static final String IMMUTABLE_CONSTANT = "SHOULD_NOT_CHANGE"; // PROBLEM: Will be modified via reflection
    private transient String transientData = "TRANSIENT";       // PROBLEM: Transient field accessed via reflection
    private volatile boolean volatileFlag = false;              // PROBLEM: Volatile field modified unsafely
    
    // PROBLEM: Fields with different access modifiers
    public String publicField = "PUBLIC";                       // PROBLEM: Public access but still abused
    protected String protectedField = "PROTECTED";              // PROBLEM: Protected access bypassed
    String packageField = "PACKAGE";                            // PROBLEM: Package access violated
    
    // PROBLEM: Constructor chaos
    private ReflectionNightmare() {
        System.out.println("Private constructor called via reflection!");
    }
    // WHY THIS IS PROBLEMATIC: Private constructors can be bypassed with reflection
    // FIX: Use factory methods and proper access control
    
    public ReflectionNightmare(String data) {
        this.secretData = data;
        System.out.println("Public constructor called: " + data);
    }
    // WHY THIS IS PROBLEMATIC: Constructor parameters can be manipulated via reflection
    // FIX: Validate inputs and use immutable objects
    
    // PROBLEM: Methods with annotations
    @InjectChaos(before = "BEFORE_CHAOS", after = "AFTER_CHAOS")
    private String getSecretData() {
        return this.secretData;
    }
    // WHY THIS IS PROBLEMATIC: Private methods exposed via reflection and annotation processing
    // FIX: Use proper access modifiers and avoid runtime annotation processing
    
    @ChaosAnnotation(level = 777)
    public void publicMethod() {
        System.out.println("Public method called");
    }
    // WHY THIS IS PROBLEMATIC: Annotations can be used to modify method behavior at runtime
    // FIX: Use explicit method calls instead of annotation-driven behavior
    
    @InjectChaos(modifyReturn = true)
    protected String protectedMethod(String input) {
        return "PROTECTED: " + input;
    }
    // WHY THIS IS PROBLEMATIC: Protected methods can be accessed and modified via reflection
    // FIX: Use proper inheritance patterns and avoid reflection-based access
    
    // PROBLEM: Static method for reflection abuse
    private static void staticSecretMethod() {
        System.out.println("Static secret method called!");
    }
    // WHY THIS IS PROBLEMATIC: Static private methods can be accessed via reflection
    // FIX: Use proper access control and avoid exposing internal methods
    
    // PROBLEM: Method that throws exceptions
    private void dangerousMethod() throws Exception {
        throw new RuntimeException("This method always fails!");
    }
    // WHY THIS IS PROBLEMATIC: Exception handling becomes complex with reflection
    // FIX: Use proper exception handling and avoid reflection for error-prone operations
    
    // PROBLEM: Reflection abuse methods
    public static void reflectionChaos() {
        System.out.println("🔮 Starting reflection chaos...");
        
        try {
            // PROBLEM: Get class via reflection
            Class<?> clazz = ReflectionNightmare.class;
            // WHY THIS IS PROBLEMATIC: Runtime class access bypasses compile-time checks
            // FIX: Use direct class references when possible
            
            // PROBLEM: Create instance using private constructor
            Constructor<?> privateConstructor = clazz.getDeclaredConstructor();
            privateConstructor.setAccessible(true);  // PROBLEM: Break encapsulation
            ReflectionNightmare instance = (ReflectionNightmare) privateConstructor.newInstance();
            // WHY THIS IS PROBLEMATIC: Private constructors can be bypassed
            // FIX: Use factory methods and proper access control
            
            // PROBLEM: Access private fields
            Field secretField = clazz.getDeclaredField("secretData");
            secretField.setAccessible(true);
            String originalSecret = (String) secretField.get(instance);
            System.out.println("Original secret: " + originalSecret);
            // WHY THIS IS PROBLEMATIC: Private fields are exposed
            // FIX: Use proper getter methods and encapsulation
            
            // PROBLEM: Modify private field
            secretField.set(instance, "HACKED_VIA_REFLECTION");
            System.out.println("Modified secret: " + secretField.get(instance));
            // WHY THIS IS PROBLEMATIC: Internal state can be corrupted
            // FIX: Use immutable objects and proper validation
            
            // PROBLEM: Modify final static field (very dangerous)
            Field constantField = clazz.getDeclaredField("IMMUTABLE_CONSTANT");
            constantField.setAccessible(true);
            
            // PROBLEM: Remove final modifier
            Field modifiersField = Field.class.getDeclaredField("modifiers");
            modifiersField.setAccessible(true);
            modifiersField.setInt(constantField, constantField.getModifiers() & ~Modifier.FINAL);
            // WHY THIS IS PROBLEMATIC: Final fields can be modified, breaking immutability
            // FIX: Use proper immutable design patterns
            
            // PROBLEM: Modify the "immutable" constant
            constantField.set(null, "FINAL_FIELD_HACKED");
            System.out.println("Modified final constant: " + constantField.get(null));
            // WHY THIS IS PROBLEMATIC: Constants are no longer constant
            // FIX: Use proper configuration management
            
        } catch (Exception e) {
            System.out.println("Reflection chaos failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // PROBLEM: Main chaos orchestrator
    public static void main(String[] args) {
        System.out.println("☕ JAVA REFLECTION CHALLENGE STARTING! ☕");
        
        // PROBLEM: Run all chaos methods
        reflectionChaos();
        // WHY THIS IS PROBLEMATIC: Demonstrates multiple reflection anti-patterns
        // FIX: Use proper OOP design, dependency injection, and compile-time safety
        
        // PROBLEM: Final chaos report
        System.out.println("🔥 JAVA REFLECTION CHAOS COMPLETE! 🔥");
        System.out.println("Security model: COMPROMISED");
        System.out.println("Encapsulation: BROKEN");
        System.out.println("Type safety: VIOLATED");
        // WHY THIS IS PROBLEMATIC: Reflection breaks fundamental Java principles
        // FIX: Use interfaces, dependency injection, and proper design patterns
        
        System.out.println("Memory usage: LEAKED");
        System.out.println("Performance: DEGRADED");
        System.out.println("Maintainability: DESTROYED");
    }
    
    // PROBLEM: Constructor that uses reflection on itself
    public ReflectionNightmare() {
        try {
            // PROBLEM: Use reflection to modify own fields during construction
            Field secretField = this.getClass().getDeclaredField("SECRET_KEY");
            secretField.setAccessible(true);                    // PROBLEM: Break access control
            
            // PROBLEM: Modify static final field
            Field modifiersField = Field.class.getDeclaredField("modifiers");
            modifiersField.setAccessible(true);
            modifiersField.setInt(secretField, secretField.getModifiers() & ~Modifier.FINAL);
            secretField.set(null, "HACKED_SECRET_" + System.currentTimeMillis());
            
            // PROBLEM: Modify final instance field
            Field immutableField = this.getClass().getDeclaredField("immutableValue");
            immutableField.setAccessible(true);
            modifiersField.setInt(immutableField, immutableField.getModifiers() & ~Modifier.FINAL);
            immutableField.set(this, 999);                      // PROBLEM: Change "immutable" value
            
        } catch (Exception e) {
            // PROBLEM: Swallow reflection exceptions
            System.out.println("Reflection chaos in constructor: " + e.getMessage());
        }
    }
    
    // PROBLEM: Method that creates instances without constructors
    @ChaosAnnotation(value = "UNSAFE_INSTANTIATION", level = 9)
    public static <T> T createInstanceUnsafely(Class<T> clazz) {
        /*
        PROBLEM: This method demonstrates unsafe instantiation:
        1. Bypasses constructors completely
        2. Creates uninitialized objects
        3. Can create instances of abstract classes
        4. Ignores access modifiers
        
        WHY THIS IS PROBLEMATIC:
        - Objects are in inconsistent state
        - Constructors' initialization logic is skipped
        - Can violate class invariants
        - Security bypass for protected constructors
        
        FIX: Use proper constructors, factory methods, or dependency injection
        */
        try {
            // PROBLEM: Use sun.misc.Unsafe to create instance without constructor
            Field unsafeField = sun.misc.Unsafe.class.getDeclaredField("theUnsafe");
            System.out.println("Maintainability: DESTROYED");
            sun.misc.Unsafe unsafe = (sun.misc.Unsafe) unsafeField.get(null);
            
            // PROBLEM: Allocate instance without calling constructor
            @SuppressWarnings("unchecked")
            T instance = (T) unsafe.allocateInstance(clazz);    // PROBLEM: Uninitialized object
            
            // PROBLEM: Cache the unsafe instance
            reflectionCache.put(clazz.getName() + "_unsafe", instance);
            
            return instance;
        } catch (Exception e) {
            // PROBLEM: Fall back to reflection if Unsafe fails
            try {
                Constructor<T> constructor = clazz.getDeclaredConstructor();
                constructor.setAccessible(true);                // PROBLEM: Break access control
                return constructor.newInstance();
            } catch (Exception e2) {
                // PROBLEM: Return null on failure
                System.out.println("Unsafe instantiation failed: " + e2.getMessage());
                return null;
            }
        }
    }
    
    // PROBLEM: Method that modifies any object's private fields
    @ChaosAnnotation(value = "FIELD_CHAOS", level = 8)
    public static void modifyPrivateField(Object target, String fieldName, Object newValue) {
        /*
        PROBLEM: This method breaks encapsulation completely:
        1. Accesses private fields of any object
        2. Modifies final fields
        3. Changes field types without validation
        4. Bypasses setter logic and validation
        
        WHY THIS IS PROBLEMATIC:
        - Violates encapsulation principle
        - Can corrupt object state
        - Bypasses validation and business logic
        - Makes debugging extremely difficult
        
        FIX: Use public APIs, setters, or proper object design
        */
        try {
            Class<?> targetClass = target.getClass();
            Field field = null;
            
            // PROBLEM: Search through class hierarchy for field
            while (field == null && targetClass != null) {
                try {
                    field = targetClass.getDeclaredField(fieldName);
                } catch (NoSuchFieldException e) {
                    targetClass = targetClass.getSuperclass();  // PROBLEM: Walk up hierarchy
                }
            }
            
            if (field != null) {
                field.setAccessible(true);                      // PROBLEM: Break access control
                
                // PROBLEM: Remove final modifier if present
                if (Modifier.isFinal(field.getModifiers())) {
                    Field modifiersField = Field.class.getDeclaredField("modifiers");
                    modifiersField.setAccessible(true);
                    modifiersField.setInt(field, field.getModifiers() & ~Modifier.FINAL);
                }
                
                // PROBLEM: Set field without type checking
                field.set(target, newValue);                    // PROBLEM: No type validation
                
                // PROBLEM: Cache the field for future use
                reflectionCache.put(targetClass.getName() + "." + fieldName, field);
            }
        } catch (Exception e) {
            System.out.println("Field modification chaos: " + e.getMessage());
        }
    }
    
    // PROBLEM: Method that invokes any method with any parameters
    @ChaosAnnotation(value = "METHOD_CHAOS", level = 7)
    public static Object invokeAnyMethod(Object target, String methodName, Object... args) {
        /*
        PROBLEM: This method demonstrates method invocation abuse:
        1. Invokes private methods
        2. No parameter type checking
        3. Automatic type coercion attempts
        4. Bypasses access control
        
        WHY THIS IS PROBLEMATIC:
        - Breaks method visibility rules
        - Can cause ClassCastException at runtime
        - Bypasses method preconditions
        - Makes code unpredictable
        
        FIX: Use public APIs, interfaces, or proper method calls
        */
        try {
            Class<?> targetClass = target.getClass();
            Method[] methods = targetClass.getDeclaredMethods(); // PROBLEM: Get all methods including private
            
            // PROBLEM: Find method by name, ignoring parameter types
            for (Method method : methods) {
                if (method.getName().equals(methodName)) {
                    method.setAccessible(true);                 // PROBLEM: Break access control
                    
                    // PROBLEM: Try to coerce arguments to match parameters
                    Class<?>[] paramTypes = method.getParameterTypes();
                    Object[] coercedArgs = new Object[paramTypes.length];
                    
                    for (int i = 0; i < paramTypes.length && i < args.length; i++) {
                        coercedArgs[i] = coerceType(args[i], paramTypes[i]); // PROBLEM: Unsafe type coercion
                    }
                    
                    // PROBLEM: Invoke method with coerced arguments
                    Object result = method.invoke(target, coercedArgs);
                    
                    // PROBLEM: Cache the method for future use
                    reflectionCache.put(targetClass.getName() + "." + methodName, method);
                    
                    return result;
                }
            }
        } catch (Exception e) {
            System.out.println("Method invocation chaos: " + e.getMessage());
        }
        
        return null; // PROBLEM: Return null on failure
    }
    
    // PROBLEM: Unsafe type coercion method
    private static Object coerceType(Object value, Class<?> targetType) {
        /*
        PROBLEM: This method attempts unsafe type coercion:
        1. No validation of conversion safety
        2. Can cause data loss
        3. Arbitrary string parsing
        4. Null handling issues
        
        WHY THIS IS PROBLEMATIC:
        - Can cause runtime exceptions
        - Data corruption through lossy conversions
        - Unpredictable behavior with edge cases
        - Violates type safety
        
        FIX: Use proper type checking and validation
        */
        if (value == null) return null;
        if (targetType.isAssignableFrom(value.getClass())) return value;
        
        // PROBLEM: Attempt various type coercions
        try {
            if (targetType == String.class) {
                return value.toString();                        // PROBLEM: Any object to string
            } else if (targetType == int.class || targetType == Integer.class) {
                return Integer.parseInt(value.toString());      // PROBLEM: Parse any string as int
            } else if (targetType == double.class || targetType == Double.class) {
                return Double.parseDouble(value.toString());    // PROBLEM: Parse any string as double
            } else if (targetType == boolean.class || targetType == Boolean.class) {
                return Boolean.parseBoolean(value.toString());  // PROBLEM: Parse any string as boolean
            } else if (targetType.isArray()) {
                // PROBLEM: Convert single value to array
                Object array = Array.newInstance(targetType.getComponentType(), 1);
                Array.set(array, 0, coerceType(value, targetType.getComponentType()));
                return array;
            }
        } catch (Exception e) {
            System.out.println("Type coercion failed: " + e.getMessage());
        }
        
        return value; // PROBLEM: Return original value if coercion fails
    }
    
    // PROBLEM: Serialization disaster methods
    @ChaosAnnotation(value = "SERIALIZATION_CHAOS", level = 6)
    private void writeObject(ObjectOutputStream out) throws IOException {
        /*
        PROBLEM: This custom serialization method demonstrates serialization abuse:
        1. Serializes private data from other objects
        2. Includes non-serializable fields
        3. Modifies object state during serialization
        4. Can cause infinite recursion
        
        WHY THIS IS PROBLEMATIC:
        - Can expose sensitive data
        - Breaks serialization contract
        - Can cause stack overflow
        - Makes deserialization unpredictable
        
        FIX: Follow serialization best practices, use transient for non-serializable fields
        */
        // PROBLEM: Modify object state during serialization
        this.privateData = "SERIALIZING_" + System.currentTimeMillis();
        
        // PROBLEM: Default serialization first
        out.defaultWriteObject();
        
        // PROBLEM: Serialize reflection cache (might contain non-serializable objects)
        try {
            out.writeObject(reflectionCache);                   // PROBLEM: Serialize global state
        } catch (Exception e) {
            out.writeObject(new HashMap<String, Object>());     // PROBLEM: Write empty map on error
        }
        
        // PROBLEM: Serialize private fields from other objects in cache
        for (Map.Entry<String, Object> entry : reflectionCache.entrySet()) {
            try {
                if (entry.getValue() instanceof Field) {
                    Field field = (Field) entry.getValue();
                    out.writeObject(field.getName());           // PROBLEM: Serialize field metadata
                }
            } catch (Exception e) {
                // PROBLEM: Ignore serialization errors
            }
        }
        
        // PROBLEM: Serialize non-serializable field by converting to string
        if (nonSerializableField != null) {
            out.writeObject(nonSerializableField.toString());   // PROBLEM: Convert non-serializable to string
        } else {
            out.writeObject("NULL_NON_SERIALIZABLE");
        }
    }
    
    @ChaosAnnotation(value = "DESERIALIZATION_CHAOS", level = 6)
    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        /*
        PROBLEM: This custom deserialization method demonstrates deserialization abuse:
        1. Executes arbitrary code during deserialization
        2. Modifies global state
        3. Can trigger reflection operations
        4. Unsafe object reconstruction
        
        WHY THIS IS PROBLEMATIC:
        - Security vulnerability (deserialization attacks)
        - Can execute malicious code
        - Modifies global application state
        - Unpredictable object state after deserialization
        
        FIX: Validate all deserialized data, avoid code execution in readObject
        */
        // PROBLEM: Default deserialization first
        in.defaultReadObject();
        
        // PROBLEM: Read and restore global reflection cache
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> deserializedCache = (Map<String, Object>) in.readObject();
            reflectionCache.putAll(deserializedCache);          // PROBLEM: Modify global state
        } catch (Exception e) {
            System.out.println("Cache deserialization failed: " + e.getMessage());
        }
        
        // PROBLEM: Execute reflection operations during deserialization
        try {
            // PROBLEM: Use reflection to modify the deserialized object
            Field privateField = this.getClass().getDeclaredField("privateData");
            privateField.setAccessible(true);
            String currentValue = (String) privateField.get(this);
            privateField.set(this, currentValue + "_DESERIALIZED");
            
            // PROBLEM: Trigger more reflection operations
            invokeAnyMethod(this, "toString");                  // PROBLEM: Call method via reflection
            
        } catch (Exception e) {
            System.out.println("Deserialization reflection chaos: " + e.getMessage());
        }
        
        // PROBLEM: Read non-serializable field data
        try {
            String nonSerializableData = (String) in.readObject();
            // PROBLEM: Create new object from string (unsafe)
            if (!"NULL_NON_SERIALIZABLE".equals(nonSerializableData)) {
                nonSerializableField = new Object() {
                    @Override
                    public String toString() {
                        return nonSerializableData;
                    }
                };
            }
        } catch (Exception e) {
            nonSerializableField = null;
        }
    }
    
    // PROBLEM: Class loader manipulation
    @ChaosAnnotation(value = "CLASSLOADER_CHAOS", level = 5)
    public static Class<?> loadClassDynamically(String className, byte[] classBytes) {
        /*
        PROBLEM: This method demonstrates class loader abuse:
        1. Loads arbitrary bytecode
        2. Bypasses normal class loading security
        3. Can load malicious classes
        4. Creates custom class loaders without proper isolation
        
        WHY THIS IS PROBLEMATIC:
        - Major security vulnerability
        - Can execute arbitrary code
        - Bypasses JVM security model
        - Can cause class loading conflicts
        
        FIX: Use proper class loading mechanisms, validate bytecode, use security managers
        */
        try {
            // PROBLEM: Create custom class loader that loads from byte array
            ClassLoader customLoader = new ClassLoader() {
                @Override
                protected Class<?> findClass(String name) throws ClassNotFoundException {
                    if (name.equals(className)) {
                        // PROBLEM: Load class from arbitrary bytes
                        return defineClass(name, classBytes, 0, classBytes.length);
                    }
                    return super.findClass(name);
                }
            };
            
            // PROBLEM: Load the class
            Class<?> loadedClass = customLoader.loadClass(className);
            
            // PROBLEM: Cache the loaded class globally
            reflectionCache.put("loaded_class_" + className, loadedClass);
            processedClasses.add(loadedClass);
            
            // PROBLEM: Automatically instantiate the loaded class
            Object instance = createInstanceUnsafely(loadedClass); // PROBLEM: Unsafe instantiation
            reflectionCache.put("loaded_instance_" + className, instance);
            
            return loadedClass;
        } catch (Exception e) {
            System.out.println("Dynamic class loading chaos: " + e.getMessage());
            return null;
        }
    }
    
    // PROBLEM: Annotation processing chaos
    @ChaosAnnotation(value = "ANNOTATION_CHAOS", level = 4)
    public void processAnnotationsChaotically() {
        /*
        PROBLEM: This method demonstrates annotation processing abuse:
        1. Processes annotations at runtime instead of compile-time
        2. Modifies class behavior based on annotations
        3. Recursive annotation processing
        4. Side effects during annotation processing
        
        WHY THIS IS PROBLEMATIC:
        - Performance overhead at runtime
        - Unpredictable behavior based on annotations
        - Can cause infinite recursion
        - Makes code behavior implicit and hard to debug
        
        FIX: Use compile-time annotation processing, avoid runtime annotation magic
        */
        Class<?> clazz = this.getClass();
        
        // PROBLEM: Process class annotations
        if (clazz.isAnnotationPresent(ChaosAnnotation.class)) {
            ChaosAnnotation annotation = clazz.getAnnotation(ChaosAnnotation.class);
            System.out.println("Processing class annotation: " + annotation.value());
            
            // PROBLEM: Modify object based on annotation
            if (annotation.level() > 5) {
                modifyPrivateField(this, "privateData", "ANNOTATION_MODIFIED_" + annotation.level());
            }
            
            // PROBLEM: Recursive processing if annotation says so
            if (annotation.recursive() && annotation.level() > 1) {
                // PROBLEM: Create new annotation with decremented level
                try {
                    // PROBLEM: This is extremely complex and fragile
                    InvocationHandler handler = new InvocationHandler() {
                        @Override
                        public Object invoke(Object proxy, Method method, Object[] args) {
                            if ("level".equals(method.getName())) {
                                return annotation.level() - 1;  // PROBLEM: Decrement level
                            } else if ("value".equals(method.getName())) {
                                return annotation.value() + "_RECURSIVE";
                            } else if ("recursive".equals(method.getName())) {
                                return annotation.level() > 2;  // PROBLEM: Stop recursion eventually
                            }
                            return null;
                        }
                    };
                    
                    // PROBLEM: Create proxy annotation
                    ChaosAnnotation recursiveAnnotation = (ChaosAnnotation) Proxy.newProxyInstance(
                        ChaosAnnotation.class.getClassLoader(),
                        new Class[]{ChaosAnnotation.class},
                        handler
                    );
                    
                    // PROBLEM: Process the recursive annotation (potential infinite loop)
                    processAnnotationRecursively(recursiveAnnotation);
                } catch (Exception e) {
                    System.out.println("Recursive annotation processing failed: " + e.getMessage());
                }
            }
        }
        
        // PROBLEM: Process method annotations
        for (Method method : clazz.getDeclaredMethods()) {
            if (method.isAnnotationPresent(ChaosAnnotation.class)) {
                ChaosAnnotation annotation = method.getAnnotation(ChaosAnnotation.class);
                System.out.println("Processing method annotation: " + method.getName() + " -> " + annotation.value());
                
                // PROBLEM: Invoke method based on annotation
                if (annotation.level() > 3) {
                    try {
                        invokeAnyMethod(this, method.getName());  // PROBLEM: Invoke via reflection
                    } catch (Exception e) {
                        System.out.println("Annotation-triggered method invocation failed: " + e.getMessage());
                    }
                }
            }
        }
        
        // PROBLEM: Process field annotations
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(ChaosAnnotation.class)) {
                ChaosAnnotation annotation = field.getAnnotation(ChaosAnnotation.class);
                System.out.println("Processing field annotation: " + field.getName() + " -> " + annotation.value());
                
                // PROBLEM: Modify field based on annotation
                if (annotation.level() > 2) {
                    modifyPrivateField(this, field.getName(), "FIELD_ANNOTATION_" + annotation.level());
                }
            }
        }
    }
    
    // PROBLEM: Recursive annotation processing
    private void processAnnotationRecursively(ChaosAnnotation annotation) {
        System.out.println("Recursive annotation processing: " + annotation.value() + " level " + annotation.level());
        
        // PROBLEM: Potential infinite recursion
        if (annotation.recursive() && annotation.level() > 0) {
            // PROBLEM: This could go on forever
            processAnnotationRecursively(annotation);           // PROBLEM: Infinite recursion risk
        }
    }
    
    // PROBLEM: Main chaos demonstration method
    public static void main(String[] args) {
        System.out.println("☕ JAVA REFLECTION NIGHTMARE STARTING - PREPARE FOR CHAOS! ☕");
        
        try {
            // PROBLEM: Create instance using unsafe instantiation
            ReflectionNightmare chaos1 = createInstanceUnsafely(ReflectionNightmare.class);
            ReflectionNightmare chaos2 = new ReflectionNightmare(); // PROBLEM: Normal constructor for comparison
            
            System.out.println("Instances created");
            
            // PROBLEM: Modify private fields
            modifyPrivateField(chaos1, "privateData", "HACKED_DATA_1");
            modifyPrivateField(chaos2, "privateData", "HACKED_DATA_2");
            
            // PROBLEM: Invoke private methods
            Object result1 = invokeAnyMethod(chaos1, "toString");
            Object result2 = invokeAnyMethod(chaos2, "processAnnotationsChaotically");
            
            System.out.println("Method invocation results: " + result1 + ", " + result2);
            
            // PROBLEM: Process annotations chaotically
            chaos2.processAnnotationsChaotically();
            
            // PROBLEM: Serialization chaos
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(baos);
            oos.writeObject(chaos2);                            // PROBLEM: Serialize with custom writeObject
            oos.close();
            
            ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
            ObjectInputStream ois = new ObjectInputStream(bais);
            ReflectionNightmare deserialized = (ReflectionNightmare) ois.readObject(); // PROBLEM: Deserialize with custom readObject
            ois.close();
            
            System.out.println("Serialization/deserialization complete");
            
            // PROBLEM: Show global state
            System.out.println("Reflection cache size: " + reflectionCache.size());
            System.out.println("Processed classes: " + processedClasses.size());
            
            // PROBLEM: Final chaos report
            System.out.println("🔥 JAVA REFLECTION CHAOS COMPLETE! 🔥");
            System.out.println("SECRET_KEY after reflection: " + SECRET_KEY);
            System.out.println("Chaos1 immutableValue: " + chaos1.immutableValue);
            System.out.println("Chaos2 immutableValue: " + chaos2.immutableValue);
            
        } catch (Exception e) {
            System.out.println("Reflection chaos error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // PROBLEM: Override toString to show reflection chaos
    @Override
    public String toString() {
        return String.format("ReflectionNightmare{privateData='%s', immutableValue=%d, SECRET_KEY='%s'}",
                privateData, immutableValue, SECRET_KEY);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// JAVA REFLECTION ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Reflection Abuse**: Breaking encapsulation by accessing private members
// 2. **Final Field Modification**: Using reflection to modify final fields
// 3. **Unsafe Instantiation**: Creating objects without calling constructors
// 4. **Access Control Bypass**: Using setAccessible(true) to bypass security
// 5. **Serialization Disasters**: Custom serialization with side effects
// 6. **Class Loader Manipulation**: Loading arbitrary bytecode at runtime
// 7. **Annotation Processing Abuse**: Runtime annotation processing with side effects
// 8. **Type Safety Violations**: Unsafe type coercion and casting
// 9. **Global State Pollution**: Storing reflection artifacts globally
// 10. **Security Bypass**: Circumventing Java's security model

// WHY JAVA REFLECTION IS UNIQUELY DANGEROUS:
// ─────────────────────────────────────────────────────────────────────────────
// - **Access Control Bypass**: Can access any private member with setAccessible(true)
// - **Final Field Modification**: Can modify supposedly immutable fields
// - **Constructor Bypass**: Can create objects without initialization
// - **Type Safety Violation**: Can bypass compile-time type checking
// - **Security Model Bypass**: Can circumvent SecurityManager restrictions
// - **Performance Impact**: Reflection calls are much slower than direct calls
// - **Serialization Vulnerabilities**: Custom serialization can execute arbitrary code
// - **Class Loading Attacks**: Can load and execute malicious bytecode

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Use proper OOP design instead of reflection for normal operations
// 2. Don't modify final fields, use proper mutability design
// 3. Always use constructors for object creation
// 4. Respect access modifiers, use public APIs
// 5. Follow serialization best practices, avoid side effects
// 6. Use proper class loading mechanisms, validate bytecode
// 7. Use compile-time annotation processing when possible
// 8. Validate types explicitly, don't rely on unsafe casting
// 9. Avoid global state, use proper scoping
// 10. Use SecurityManager and proper security policies

// Remember: Reflection is powerful but dangerous - use it sparingly and carefully! ☕
