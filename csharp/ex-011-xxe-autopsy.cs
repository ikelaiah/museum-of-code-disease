// Fix: Secure XML processing in .NET
// Ref: Microsoft docs: secure XML processing
using System;
using System.Xml;

class XXEFixCs {
    static void Main(string[] args) {
        string xml = args.Length>0 ? args[0] : "<a>ok</a>";
        var settings = new XmlReaderSettings {
            DtdProcessing = DtdProcessing.Prohibit,
            XmlResolver = null
        };
        using var reader = XmlReader.Create(new System.IO.StringReader(xml), settings);
        var doc = new XmlDocument { XmlResolver = null };
        doc.Load(reader);
        Console.WriteLine(doc.DocumentElement.InnerText);
    }
}
