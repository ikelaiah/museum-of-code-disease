// Dangerous: Insecure deserialization via BinaryFormatter (do not use)
// Ref: Microsoft BinaryFormatter Security Guide
using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

[Serializable]
public class Msg { public string Text = "hello"; }

class BinaryFormatterDanger {
    static void Main(string[] args) {
        var bf = new BinaryFormatter(); // obsolete and dangerous
        if (args.Length > 0 && args[0] == "make") {
            using var ms = new MemoryStream();
            bf.Serialize(ms, new Msg());
            Console.WriteLine(Convert.ToBase64String(ms.ToArray()));
        } else {
            var b64 = args.Length > 0 ? args[0] : Convert.ToBase64String(new byte[] {0});
            var data = Convert.FromBase64String(b64);
            using var ms = new MemoryStream(data);
            // VULNERABLE: deserializing untrusted data
            var obj = bf.Deserialize(ms);
            Console.WriteLine(obj);
        }
    }
}
