// Dangerous: Insecure Deserialization in Java
// Run: javac ex-010-insecure-deserialization.java && java InsecureDeser
// Reference: OWASP https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data

import java.io.*;
import java.util.Base64;

class InsecureDeser {
    public static void main(String[] args) throws Exception {
        // Simulate untrusted Base64 input (could come from HTTP param)
        String b64 = args.length > 0 ? args[0] : serializeToB64("hello");
        byte[] data = Base64.getDecoder().decode(b64);
        // VULNERABLE: deserializing untrusted bytes
        try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(data))) {
            Object o = ois.readObject();
            System.out.println("Deserialized: " + o);
        }
    }

    static String serializeToB64(Serializable o) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try (ObjectOutputStream oos = new ObjectOutputStream(bos)) {
            oos.writeObject(o);
        }
        return Base64.getEncoder().encodeToString(bos.toByteArray());
    }
}
