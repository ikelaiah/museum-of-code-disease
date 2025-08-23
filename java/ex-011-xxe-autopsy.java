// Fix: Disable DTDs and external entities
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;

public class XXEFix {
    public static void main(String[] args) throws Exception {
        String xml = args.length>0? args[0] : "<a>ok</a>";
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
        dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        dbf.setXIncludeAware(false);
        dbf.setExpandEntityReferences(false);
        DocumentBuilder db = dbf.newDocumentBuilder();
        Document doc = db.parse(new ByteArrayInputStream(xml.getBytes("UTF-8")));
        System.out.println(doc.getDocumentElement().getTextContent());
    }
}
