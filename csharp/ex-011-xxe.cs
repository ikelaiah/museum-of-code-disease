// Dangerous: XXE in .NET XmlDocument
// Ref: Microsoft secure XML processing
using System;
using System.Xml;

class XXEDemoCs {
    static void Main(string[] args) {
        string xml = args.Length>0 ? args[0] : "<a>ok</a>";
        var doc = new XmlDocument();
        // VULN: default settings may resolve external entities
        doc.XmlResolver = new XmlUrlResolver();
        doc.LoadXml(xml);
        Console.WriteLine(doc.DocumentElement.InnerText);
    }
}
