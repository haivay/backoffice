import pkg from 'pg';
const { Client } = pkg;

const bdParams = {
  user: 'backoffice',
  host: 'main.psaa.ru',
  database: 'db_backoffice',
  password: 'W30082021',
  port: '5432',
};
export const client = new Client(bdParams);

export async function getForms() {
  const query = "SELECT * FROM practice.tblformtypes";
  const query_result = await client.query(query);
  return query_result.rows
}

export function saveForm(formName, formFields) {
  const query = "INSERT INTO practice.tblformtypes(type_name, document_fields) VALUES ($1, $2)";
  client.query(query, [formName, formFields]);
}

export function deleteForm(id) {
  const query = "DELETE FROM practice.tblformtypes WHERE id = $1;";
  client.query(query, [id]);
}

export function updateForm(id, formName, formFields) {
  const query = "UPDATE practice.tblformtypes SET type_name = $2, document_fields = $3 WHERE id = $1;";
  client.query(query, [id, formName, formFields]);
}

export function sendData(formId, formData){
  const query = "INSERT INTO practice.tblformrequest(type_id, request_data, ts) VALUES($1, $2, $3)";
  client.query(query, [formId, formData, 'now']);
}

export async function getData(typeId){
  const query = "SELECT request_data FROM practice.tblformrequest WHERE type_id = $1";
  const queryResult = await client.query(query, [typeId]);
  return queryResult.rows
}