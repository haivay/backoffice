import pkg from 'pg';
const { Client } = pkg;

const bd_params = {
  user: 'backoffice',
  host: 'main.psaa.ru',
  database: 'db_backoffice',
  password: 'W30082021',
  port: '5432',
};
export const client = new Client(bd_params);

export async function getForms() {
  const query = 'SELECT * FROM practice.tblformtypes';
  const query_result = await client.query(query);
  return query_result.rows
}

export function saveForm(formName, formFields) {
  const query = "INSERT INTO practice.tblformtypes(type_name, document_fields) VALUES ($1, $2)";
  return client.query(query, [formName, formFields]);
}

export function deleteForm(id) {
  const query = "DELETE FROM practice.tblformtypes WHERE id = $1;";
  return client.query(query, [id]);
}

export function updateForm(id, formName, formFields) {
  // const query = "DELETE FROM practice.tblformtypes WHERE id = $1;";
  const query = "UPDATE practice.tblformtypes SET type_name = $2, document_fields = $3 WHERE id = $1;";
  return client.query(query, [id, formName, formFields]);
}

export async function testTry(formId){
  const query = 'SELECT * FROM practice.tblformtypes WHERE id = $1';
  const query_result = await client.query(query, [formId]);
  return query_result.rows[0];
}