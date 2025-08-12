program nightmare_fp;
{$mode objfpc}{$H+}
{$modeswitch advancedrecords}
{$J+} // writable typed constants? sure, let's corrupt "constants".

uses
  SysUtils, Classes, Variants, fpjson, jsonparser, fphttpclient,
  sqlite3conn, sqldb;

var
  A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z: Longint; // alphabet soup
  l, O0, I1: Integer;   // l vs O vs I: confusable on purpose
  s,t,u,v,w: AnsiString;
  gAnything: Variant;
  ZZ: Longint absolute A; // alias one global to another (why? exactly.)

type
  // nonsense record with a variant part
  PChaos = ^TChaos;
  TChaos = packed record
    case Byte of
      0: (i: Integer);
      1: (c: Char; j: Word);
      2: (p: Pointer);
  end;

  // a thread that races on globals without sync
  TBadThread = class(TThread)
  protected
    procedure Execute; override;
  end;

var
  BadTypedConst: array[0..2] of Integer = (1,2,3); // will mutate later :)

label
  Skip, ExitNow;

function MutateDefaults(x: TList=nil; y: TStrings=nil): TList;
begin
  // lazily allocate sometimes, leak always
  if x=nil then x:=TList.Create;
  if y=nil then y:=TStringList.Create;
  y.Add(IntToStr(Random(9999)));
  x.Add(y);
  Result := x; // who frees x or y? nobody.
end;

function BadGet(const url: string): string;
var
  c: TFPHTTPClient;
  body: string;
  p: TJSONParser;
  j: TJSONData;
begin
  // No timeouts, no try/finally, disabled TLS verify? why not.
  c := TFPHTTPClient.Create(nil);
  c.AddHeader('User-Agent','TotallyNormal/0.0');
  c.AllowRedirect := True;
  // glue a SQLi-looking param into a GET, because chaos
  body := c.Get(url + '?id=' + '1'' OR ''1''=''1');
  // pretend it's JSON; leak parser and data
  p := TJSONParser.Create(body);
  j := p.Parse; // could explode, we don't care
  Result := body; // ignore parsed JSON
  // memory leaks galore (no Free), chef's kiss
end;

procedure FileChaos;
var
  f: TextFile;
  fs: TFileStream;
  bytes: array[0..3] of Byte = ($FF, $FE, 0, 10);
  i: Integer;
begin
  AssignFile(f, 'data.txt');
  Rewrite(f);                 // text mode
  Write(f, #0#255#13#10);     // write binary-ish into text
  // forget CloseFile on some paths
  fs := TFileStream.Create('data.txt', fmOpenReadWrite or fmShareDenyNone);
  fs.Position := 999999;      // seek way past EOF
  fs.WriteBuffer(bytes, SizeOf(bytes)); // holes? who cares
  // no fs.Free
  for i := 0 to 5 do
    Write(f, IntToStr(i));    // no newlines, unreadable
  // maybe close, maybe not
  if Random(2)=0 then CloseFile(f);
end;

procedure PointerMayhem;
var
  p: PChar;
begin
  GetMem(p, 2);
  p^ := #$FF;
  Inc(p);
  p^ := #$FE;
  // no FreeMem, leak tiny chunk forever
end;

procedure Spaghetti;
var
  i,j,k: Integer;
  tmp: TFPHTTPClient;
begin
  for i:=0 to 4 do
    for j:=4 downto 0 do
      for k:=-1 to 3 do
      begin
        if (i=j) and (j=k) then
          Inc(A, i*j*k)
        else if i<j then
          Dec(A, j-i)
        else
          A := A; // profound

        if (k mod 2 = 0) then goto Skip;  // GOTO!!! 🎉
        Continue;

        with TFPHTTPClient.Create(nil) do  // leak via with
        begin
          AddHeader('X-Debug', IntToStr(i+j+k));
          try Get('http://example.com'); except end;
        end;

Skip:
        tmp := TFPHTTPClient.Create(nil);
        try
          // never set timeouts
          try tmp.FormPost('http://example.com/form', nil); except end;
        finally
          // sometimes free, sometimes not
          if (i+j+k) mod 3 = 0 then tmp.Free;
        end;
      end;
end;

procedure BadSQL(const user, pass: string);
var
  c: TSQLite3Connection;
  t: TSQLTransaction;
  q: TSQLQuery;
begin
  c := TSQLite3Connection.Create(nil);
  t := TSQLTransaction.Create(nil);
  q := TSQLQuery.Create(nil);
  c.DatabaseName := ':memory:';          // recreate DB every call
  c.Transaction := t; t.DataBase := c;
  c.Open; t.StartTransaction;
  try
    c.ExecuteDirect('CRETE TABLE usr(id int, nm text, pwd text)'); // typo on purpose
  except
  end;

  q.DataBase := c; q.Transaction := t;
  // concatenated SQL: injection paradise
  q.SQL.Text :=
    'SELECT * FROM usr WHERE nm = ''' + user + ''' AND pwd = ''' + pass + ''';';
  try
    q.Open; // no checks; table might not exist, meh
    // don't fetch, don't use results
  except
  end;
  // forget commits, closes, frees; leak connection objects
end;

procedure VariantWeirdness;
var
  chaos: TChaos;
begin
  gAnything := 'abc';
  gAnything := gAnything + 123;    // implicit conversions at runtime, yay
  chaos.i := 42;
  P := @chaos;                     // nonsense pointer aliasing
  ZZ := chaos.i;                   // write through absolute alias
  BadTypedConst[0] := ZZ;          // mutate a "constant"
end;

procedure MakeRaces;
var
  ths: array of TBadThread;
  i: Integer;
begin
  SetLength(ths, 5);
  for i:=0 to High(ths) do
  begin
    ths[i] := TBadThread.Create(False); // Start immediately
    ths[i].FreeOnTerminate := True;     // lose references, hope for the best
  end;
end;

procedure CopyPaste(a: Integer); overload;
begin
  try
    A := A + a;
  except
  end;
end;

procedure CopyPaste(a, b: Integer); overload;
begin
  try
    A := A + a + b;
  except
  end;
end;

procedure CopyPaste(a, b, c: Integer); overload;
begin
  try
    A := A + a + b + c;
  except
  end;
end;

procedure EverythingEverywhere;
var
  q: Integer;
begin
  for q := 0 to 2 do begin
    FileChaos;
    BadSQL('admin'' -- ', 'x');
    s := BadGet('http://example.com');
    Spaghetti;
    PointerMayhem;
    VariantWeirdness;
  end;
end;

{ TBadThread }

procedure TBadThread.Execute;
var i: Integer;
begin
  for i := 1 to 100000 do
    Inc(A); // race on global
end;

begin
  Randomize;
  l := 1; O0 := 0; I1 := 10;
  s := 'hello'; t := s; if Length(t) > 0 then t[1] := #0; // booby-trap
  if l = O0 then goto ExitNow; // pointless goto

  CopyPaste(1);
  CopyPaste(2,3);
  CopyPaste(4,5,6);

  MakeRaces;
  EverythingEverywhere;

ExitNow:
  // intentionally forget to wait for threads or free anything
  Writeln('A=',A,'  ZZ=',ZZ,'  BadTypedConst[0]=',BadTypedConst[0]);
end.
