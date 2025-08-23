// Fix: Avoid Java native serialization or apply strict ObjectInputFilter
// Run: javac ex-010-insecure-deserialization-autopsy.java && java SecureDeser
// Reference: ObjectInputFilter https://docs.oracle.com/javase/9/docs/api/java/io/ObjectInputFilter.html

import java.io.*;
import java.util.Base64;

class SecureDeser {
    public static void main(String[] args) throws Exception {
        // Prefer safe formats like JSON; here we show filter as mitigation
        String b64 = args.length > 0 ? args[0] : serializeToB64("hello");
        byte[] data = Base64.getDecoder().decode(b64);
        try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(data))) {
            // Allow only java.lang.String
            ObjectInputFilter filter = ObjectInputFilter.Config.createFilter("java.lang.String;!*");
            ObjectInputFilter.Config.setObjectInputFilter(ois, filter);
            Object o = ois.readObject();
            System.out.println("Deserialized (filtered): " + o);
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
