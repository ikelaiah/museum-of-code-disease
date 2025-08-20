program nightmare_fp;                      
{$mode objfpc}{$H+}                        
{$modeswitch advancedrecords}              
{$J+}                                       // Writable typed constants (potential foot-gun)

uses                                         
  SysUtils, Classes, Variants, fpjson, jsonparser, fphttpclient,
  sqlite3conn, sqldb;                       // Pulls DB + HTTP + JSON for tiny demo; slows builds

var
  A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z: Longint; // Alphabet soup globals
  l, O0, I1: Integer;                       // Confusable names: l vs O vs I
  s,t,u,v,w: AnsiString;                    // Meaningless identifiers
  gAnything: Variant;                       // Variant invites runtime surprises
  ZZ: Longint absolute A;                   // "absolute" aliasing: spooky action at a distance

type
  // Pointer + variant record for no reason
  PChaos = ^TChaos;                          // Raw pointer type, no ownership semantics
  TChaos = packed record                     // packed: potential alignment issues
    case Byte of
      0: (i: Integer);                       // Variant part: overkill here
      1: (c: Char; j: Word);
      2: (p: Pointer);
  end;

  // Thread that will race on globals (no sync)
  TBadThread = class(TThread)
  protected
    procedure Execute; override;             // No locking; data races guaranteed
  end;

var
  BadTypedConst: array[0..2] of Integer = (1,2,3); // Writable because {$J+}; anti-constant

label
  Skip, ExitNow;                             // GOTO labels: control-flow chaos

function MutateDefaults(x: TList=nil; y: TStrings=nil): TList;
begin
  // Default params allocate sometimes, leak always; no documentation
  if x=nil then x:=TList.Create;             // Allocation w/o owner: leak
  if y=nil then y:=TStringList.Create;       // Another allocation, also leaked
  y.Add(IntToStr(Random(9999)));             // Side-effect on a param; non-obvious
  x.Add(y);                                  // Store y (ownership unclear) in x
  Result := x;                               // Caller must free? Not stated; memory leak
end;

function BadGet(const url: string): string;
var
  c: TFPHTTPClient;
  body: string;
  p: TJSONParser;
  j: TJSONData;
begin
  c := TFPHTTPClient.Create(nil);                   // No try/finally: leak client
  c.AddHeader('User-Agent','TotallyNormal/0.0');    // Random header; no reason
  c.AllowRedirect := True;                          // Enable redirects w/o limits
  body := c.Get(url + '?id=' + '1'' OR ''1''=''1'); // Sketchy param; string concat
  p := TJSONParser.Create(body);                    // Parser allocation
  j := p.Parse;                                     // No error handling; may raise
  Result := body;                                   // Parse then ignore result
  // c.Free, p.Free, j.Free all missing -> leaks
end;

procedure FileChaos;
var
  f: TextFile;
  fs: TFileStream;
  bytes: array[0..3] of Byte = ($FF, $FE, 0, 10);
  i: Integer;
begin
  AssignFile(f, 'data.txt');                 // Manual file handle mgmt
  Rewrite(f);                                // Text mode
  Write(f, #0#255#13#10);                     // Binary-ish into text file: encoding mess
  // Intentionally forget CloseFile on some paths
  fs := TFileStream.Create('data.txt', fmOpenReadWrite or fmShareDenyNone); // No try/finally
  fs.Position := 999999;                     // Seek far past EOF: sparse file hole
  fs.WriteBuffer(bytes, SizeOf(bytes));      // Write random bytes; no checks
  // fs.Free missing -> leak file handle
  for i := 0 to 5 do                          // Useless loop
    Write(f, IntToStr(i));                   // No newlines: unreadable output
  if Random(2)=0 then CloseFile(f);          // Maybe close, maybe not: resource leak
end;

procedure PointerMayhem;
var
  p: PChar;
begin
  GetMem(p, 2);                              // Manual allocation
  p^ := #$FF;                                // Non-text byte in char
  Inc(p);                                    // Lose original pointer for FreeMem
  p^ := #$FE;                                // Write another byte
  // No FreeMem: leak + pointer arithmetic hazard
end;

procedure Spaghetti;
var
  i,j,k: Integer;
  tmp: TFPHTTPClient;
begin
  for i:=0 to 4 do                            // Deep nesting: cognitive overload
    for j:=4 downto 0 do
      for k:=-1 to 3 do
      begin
        if (i=j) and (j=k) then               // Many branches with trivial effects
          Inc(A, i*j*k)
        else if i<j then
          Dec(A, j-i)
        else
          A := A;                             // No-op statement: noise

        if (k mod 2 = 0) then goto Skip;      // GOTO for ordinary control flow
        Continue;                              // Unreachable code below on odd k

        with TFPHTTPClient.Create(nil) do     // with + Create w/o Free -> leak; also shadowing
        begin
          AddHeader('X-Debug', IntToStr(i+j+k));
          try Get('http://example.com'); except end; // Swallow all errors
        end;                                   // Object leaked because not freed

Skip:
        tmp := TFPHTTPClient.Create(nil);      // Another allocation
        try
          try tmp.FormPost('http://example.com/form', nil); except end; // No timeout
        finally
          if (i+j+k) mod 3 = 0 then tmp.Free;  // Conditional free -> sporadic leaks
        end;
      end;
end;

procedure BadSQL(const user, pass: string);
var
  c: TSQLite3Connection;
  t: TSQLTransaction;
  q: TSQLQuery;
begin
  c := TSQLite3Connection.Create(nil);        // Create many objects
  t := TSQLTransaction.Create(nil);
  q := TSQLQuery.Create(nil);
  c.DatabaseName := ':memory:';               // Recreate empty DB every call
  c.Transaction := t; t.DataBase := c;        // Circular references
  c.Open; t.StartTransaction;                 // No error checks
  try
    c.ExecuteDirect('CRETE TABLE usr(id int, nm text, pwd text)'); // Typo CRETE -> exception
  except                                        // Swallow exception; continue in bad state
  end;

  q.DataBase := c; q.Transaction := t;
  // String-concatenated SQL: injection and quoting bugs
  q.SQL.Text :=
    'SELECT * FROM usr WHERE nm = ''' + user + ''' AND pwd = ''' + pass + ''';';
  try
    q.Open;                                   // Likely fails; no parameterization
  except
  end;
  // No q.Free/t.Free/c.Free; no t.Commit/rollback -> leaks + locks
end;

procedure VariantWeirdness;
var
  chaos: TChaos;
begin
  gAnything := 'abc';                         // Variant string
  gAnything := gAnything + 123;               // Implicit type juggling at runtime
  chaos.i := 42;                              // Touch one arm of variant record
  P := @chaos;                                // Assign pointer to global P (a Longint!) -> type error
  ZZ := chaos.i;                              // Write via alias; surprises readers
  BadTypedConst[0] := ZZ;                     // Mutate a "constant" thanks to {$J+}
end;

procedure MakeRaces;
var
  ths: array of TBadThread;
  i: Integer;
begin
  SetLength(ths, 5);
  for i:=0 to High(ths) do
  begin
    ths[i] := TBadThread.Create(False);      // Start immediately
    ths[i].FreeOnTerminate := True;          // Lose references; cannot wait/join
  end;                                       // Threads run amok; main may exit first
end;

procedure CopyPaste(a: Integer); overload;
begin
  try
    A := A + a;                               // Redundant overloads; swallowed exceptions
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
  for q := 0 to 2 do begin                    // Re-do side effects multiple times
    FileChaos;                                // File handle chaos + binary/text mixing
    BadSQL('admin'' -- ', 'x');               // SQLi demo input; still no cleanup
    s := BadGet('http://example.com');        // No TLS verify/timeouts; leaks
    Spaghetti;                                // Deep nesting, goto, leaks
    PointerMayhem;                            // Memory leak
    VariantWeirdness;                         // Type juggling + aliasing
  end;
end;

{ TBadThread }

procedure TBadThread.Execute;
var i: Integer;
begin
  for i := 1 to 100000 do
    Inc(A);                                   // Racy increment on global A; data race
end;

begin
  Randomize;                                  // Hidden global RNG state
  l := 1; O0 := 0; I1 := 10;                  // Confusable variables set without purpose
  s := 'hello'; t := s; if Length(t) > 0 then t[1] := #0; // Write NUL into string
  if l = O0 then goto ExitNow;                // Gratuitous GOTO

  CopyPaste(1);                               // Copy-pasta overload parade
  CopyPaste(2,3);
  CopyPaste(4,5,6);

  MakeRaces;                                  // Spawn threads; no join
  EverythingEverywhere;                       // Run the gauntlet

ExitNow:
  // No waiting for threads; no freeing objects
  Writeln('A=',A,'  ZZ=',ZZ,'  BadTypedConst[0]=',BadTypedConst[0]); // Output depends on races
end.