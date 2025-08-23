// Dangerous: NoSQL injection (Mongo style)
// Ref: OWASP NoSQLi
function findUser(queryParam) {
  // VULN: directly trust client-supplied JSON as query
  const query = JSON.parse(queryParam);
  return query; // imagine db.users.find(query)
}
console.log(findUser(process.argv[2] || '{"username": {"$ne": null}}'));
