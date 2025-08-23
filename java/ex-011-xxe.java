// Dangerous: XML External Entity (XXE)
// Run: javac ex-011-xxe.java && java XXEDemo "<!DOCTYPE foo [<!ENTITY xxe SYSTEM 'file:///etc/hosts'>]><a>&xxe;</a>"
// Ref: OWASP XXE
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;

public class XXEDemo {
    public static void main(String[] args) throws Exception {
        String xml = args.length>0? args[0] : "<a>ok</a>";
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        // VULN: features left default (DTDs enabled on some impls)
        DocumentBuilder db = dbf.newDocumentBuilder();
        Document doc = db.parse(new ByteArrayInputStream(xml.getBytes("UTF-8")));
        System.out.println(doc.getDocumentElement().getTextContent());
    }
}
