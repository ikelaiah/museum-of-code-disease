// ex-002-reflection-nightmare.java
// INTENTIONALLY AWFUL: Java reflection abuse and serialization disasters
// This file celebrates runtime class manipulation and annotation processing chaos
// WARNING: This code will make your JVM question its security model

import java.lang.reflect.*;
import java.lang.annotation.*;
import java.io.*;
import java.util.*;
import java.util.concurrent.*;
import java.net.*;
import java.security.*;
import javax.tools.*;
import java.nio.file.*;

// Custom annotations for chaos
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@interface ChaosAnnotation {
    String value() default "CHAOS";
    int level() default 888;
    boolean dangerous() default true;
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface InjectChaos {
    String before() default "";
    String after() default "";
    boolean modifyReturn() default true;
}

// Class with reflection chaos
@ChaosAnnotation(value = "REFLECTION_NIGHTMARE", level = 999)
public class ReflectionNightmare {
    
    // Private fields that will be accessed via reflection
    private String secretData = "TOP_SECRET";
    private static final String IMMUTABLE_CONSTANT = "SHOULD_NOT_CHANGE";
    private transient String transientData = "TRANSIENT";
    private volatile boolean volatileFlag = false;
    
    // Fields with different access modifiers
    public String publicField = "PUBLIC";
    protected String protectedField = "PROTECTED";
    String packageField = "PACKAGE";
    
    // Constructor chaos
    private ReflectionNightmare() {
        System.out.println("Private constructor called via reflection!");
    }
    
    public ReflectionNightmare(String data) {
        this.secretData = data;
        System.out.println("Public constructor called: " + data);
    }
    
    // Methods with annotations
    @InjectChaos(before = "BEFORE_CHAOS", after = "AFTER_CHAOS")
    private String getSecretData() {
        return this.secretData;
    }
    
    @ChaosAnnotation(level = 777)
    public void publicMethod() {
        System.out.println("Public method called");
    }
    
    @InjectChaos(modifyReturn = true)
    protected String protectedMethod(String input) {
        return "PROTECTED: " + input;
    }
    
    // Static method for reflection abuse
    private static void staticSecretMethod() {
        System.out.println("Static secret method called!");
    }
    
    // Method that throws exceptions
    private void dangerousMethod() throws Exception {
        throw new RuntimeException("This method always fails!");
    }
    
    // Reflection abuse methods
    public static void reflectionChaos() {
        System.out.println("🔮 Starting reflection chaos...");
        
        try {
            // Get class via reflection
            Class<?> clazz = ReflectionNightmare.class;
            
            // Create instance using private constructor
            Constructor<?> privateConstructor = clazz.getDeclaredConstructor();
            privateConstructor.setAccessible(true);  // Break encapsulation
            ReflectionNightmare instance = (ReflectionNightmare) privateConstructor.newInstance();
            
            // Access private fields
            Field secretField = clazz.getDeclaredField("secretData");
            secretField.setAccessible(true);
            String originalSecret = (String) secretField.get(instance);
            System.out.println("Original secret: " + originalSecret);
            
            // Modify private field
            secretField.set(instance, "HACKED_VIA_REFLECTION");
            System.out.println("Modified secret: " + secretField.get(instance));
            
            // Modify final static field (very dangerous)
            Field constantField = clazz.getDeclaredField("IMMUTABLE_CONSTANT");
            constantField.setAccessible(true);
            
            // Remove final modifier
            Field modifiersField = Field.class.getDeclaredField("modifiers");
            modifiersField.setAccessible(true);
            modifiersField.setInt(constantField, constantField.getModifiers() & ~Modifier.FINAL);
            
            // Modify the "immutable" constant
            constantField.set(null, "FINAL_FIELD_HACKED");
            System.out.println("Modified final constant: " + constantField.get(null));
            
            // Call private methods
            Method secretMethod = clazz.getDeclaredMethod("getSecretData");
            secretMethod.setAccessible(true);
            String result = (String) secretMethod.invoke(instance);
            System.out.println("Private method result: " + result);
            
            // Call static private method
            Method staticSecret = clazz.getDeclaredMethod("staticSecretMethod");
            staticSecret.setAccessible(true);
            staticSecret.invoke(null);
            
            // Method with parameters
            Method protectedMethod = clazz.getDeclaredMethod("protectedMethod", String.class);
            protectedMethod.setAccessible(true);
            String protectedResult = (String) protectedMethod.invoke(instance, "REFLECTION_INPUT");
            System.out.println("Protected method result: " + protectedResult);
            
            // Handle exceptions via reflection
            Method dangerousMethod = clazz.getDeclaredMethod("dangerousMethod");
            dangerousMethod.setAccessible(true);
            try {
                dangerousMethod.invoke(instance);
            } catch (InvocationTargetException e) {
                System.out.println("Caught reflected exception: " + e.getCause().getMessage());
            }
            
        } catch (Exception e) {
            System.out.println("Reflection chaos failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Annotation processing chaos
    public static void annotationProcessingChaos() {
        System.out.println("📝 Starting annotation processing chaos...");
        
        try {
            Class<?> clazz = ReflectionNightmare.class;
            
            // Process class annotations
            if (clazz.isAnnotationPresent(ChaosAnnotation.class)) {
                ChaosAnnotation classAnnotation = clazz.getAnnotation(ChaosAnnotation.class);
                System.out.println("Class chaos level: " + classAnnotation.level());
                System.out.println("Class chaos value: " + classAnnotation.value());
            }
            
            // Process method annotations
            Method[] methods = clazz.getDeclaredMethods();
            for (Method method : methods) {
                if (method.isAnnotationPresent(InjectChaos.class)) {
                    InjectChaos annotation = method.getAnnotation(InjectChaos.class);
                    System.out.println("Method " + method.getName() + " has chaos injection:");
                    System.out.println("  Before: " + annotation.before());
                    System.out.println("  After: " + annotation.after());
                    System.out.println("  Modify return: " + annotation.modifyReturn());
                    
                    // Dynamically modify method behavior based on annotations
                    method.setAccessible(true);
                    if (method.getParameterCount() == 0) {
                        try {
                            ReflectionNightmare instance = new ReflectionNightmare("ANNOTATION_TEST");
                            Object result = method.invoke(instance);
                            if (annotation.modifyReturn() && result instanceof String) {
                                result = annotation.before() + result + annotation.after();
                            }
                            System.out.println("  Modified result: " + result);
                        } catch (Exception e) {
                            System.out.println("  Method invocation failed: " + e.getMessage());
                        }
                    }
                }
            }
            
            // Get all annotations
            Annotation[] annotations = clazz.getAnnotations();
            for (Annotation annotation : annotations) {
                System.out.println("Found annotation: " + annotation.toString());
            }
            
        } catch (Exception e) {
            System.out.println("Annotation processing chaos failed: " + e.getMessage());
        }
    }
    
    // Dynamic class loading chaos
    public static void classLoaderChaos() {
        System.out.println("🏭 Starting ClassLoader chaos...");
        
        try {
            // Create custom class loader
            ClassLoader customLoader = new URLClassLoader(new URL[0]) {
                @Override
                protected Class<?> findClass(String name) throws ClassNotFoundException {
                    if (name.equals("DynamicChaosClass")) {
                        // Generate bytecode for a simple class
                        byte[] classBytes = generateChaosClassBytecode();
                        return defineClass(name, classBytes, 0, classBytes.length);
                    }
                    return super.findClass(name);
                }
            };
            
            // Load the dynamic class
            Class<?> dynamicClass = customLoader.loadClass("DynamicChaosClass");
            Object instance = dynamicClass.getDeclaredConstructor().newInstance();
            
            // Call methods on the dynamic class
            Method chaosMethod = dynamicClass.getMethod("getChaosMessage");
            String message = (String) chaosMethod.invoke(instance);
            System.out.println("Dynamic class message: " + message);
            
            // Create multiple class loaders (memory leak)
            for (int i = 0; i < 100; i++) {
                URLClassLoader leakyLoader = new URLClassLoader(new URL[0]);
                // Don't close the loader - memory leak!
            }
            
        } catch (Exception e) {
            System.out.println("ClassLoader chaos failed: " + e.getMessage());
        }
    }
    
    // Generate simple bytecode for dynamic class
    private static byte[] generateChaosClassBytecode() {
        // This is a simplified example - in reality, you'd use ASM or similar
        // For now, return empty bytecode (will cause ClassFormatError)
        return new byte[0];  // Intentionally broken
    }
    
    // Serialization disasters
    public static void serializationChaos() {
        System.out.println("💾 Starting serialization chaos...");
        
        try {
            // Create serializable chaos class
            SerializableChaos chaos = new SerializableChaos("ORIGINAL_DATA");
            chaos.sensitiveData = "CREDIT_CARD_123456789";
            chaos.transientData = "SHOULD_NOT_SERIALIZE";
            
            // Serialize to byte array
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(baos);
            oos.writeObject(chaos);
            oos.close();
            
            byte[] serializedData = baos.toByteArray();
            System.out.println("Serialized data length: " + serializedData.length);
            
            // Deserialize
            ByteArrayInputStream bais = new ByteArrayInputStream(serializedData);
            ObjectInputStream ois = new ObjectInputStream(bais);
            SerializableChaos deserializedChaos = (SerializableChaos) ois.readObject();
            ois.close();
            
            System.out.println("Deserialized data: " + deserializedChaos.data);
            System.out.println("Sensitive data: " + deserializedChaos.sensitiveData);
            System.out.println("Transient data: " + deserializedChaos.transientData);
            
            // Serialization with custom methods
            chaos.customSerializationChaos();
            
        } catch (Exception e) {
            System.out.println("Serialization chaos failed: " + e.getMessage());
        }
    }
    
    // Main chaos orchestrator
    public static void main(String[] args) {
        System.out.println("☕ JAVA REFLECTION NIGHTMARE STARTING! ☕");
        
        // Run all chaos methods
        reflectionChaos();
        annotationProcessingChaos();
        classLoaderChaos();
        serializationChaos();
        
        // Final chaos report
        System.out.println("🔥 JAVA REFLECTION CHAOS COMPLETE! 🔥");
        System.out.println("Security model: COMPROMISED");
        System.out.println("Encapsulation: BROKEN");
        System.out.println("Type safety: VIOLATED");
        
        // Exit without cleanup
        System.exit(0);
    }
}

// Serializable class with chaos
class SerializableChaos implements Serializable {
    private static final long serialVersionUID = 1L;
    
    public String data;
    public String sensitiveData;
    public transient String transientData;
    private String privateData = "PRIVATE";
    
    public SerializableChaos(String data) {
        this.data = data;
    }
    
    // Custom serialization with side effects
    private void writeObject(ObjectOutputStream oos) throws IOException {
        System.out.println("Custom serialization - exposing sensitive data!");
        
        // Log sensitive data during serialization
        System.out.println("Serializing sensitive data: " + sensitiveData);
        
        // Modify data during serialization
        String originalData = this.data;
        this.data = "SERIALIZATION_MODIFIED_" + originalData;
        
        // Default serialization
        oos.defaultWriteObject();
        
        // Write additional data
        oos.writeObject("EXTRA_SERIALIZED_DATA");
        
        // Restore original data
        this.data = originalData;
    }
    
    // Custom deserialization with side effects
    private void readObject(ObjectInputStream ois) throws IOException, ClassNotFoundException {
        System.out.println("Custom deserialization - potential security risk!");
        
        // Default deserialization
        ois.defaultReadObject();
        
        // Read additional data
        String extraData = (String) ois.readObject();
        System.out.println("Extra deserialized data: " + extraData);
        
        // Modify transient field during deserialization
        this.transientData = "DESERIALIZATION_INJECTED";
        
        // Execute arbitrary code during deserialization (DANGEROUS!)
        Runtime.getRuntime().exec("echo 'Deserialization code execution!'");
    }
    
    public void customSerializationChaos() {
        System.out.println("Running custom serialization chaos...");
        // This method demonstrates the chaos but doesn't actually serialize
    }
}
