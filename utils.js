import pkg from 'pg';
import imageSize from "image-size";
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
  const query = "SELECT * FROM backoffice.tblformtypes";
  const query_result = await client.query(query);
  return query_result.rows
}

export function saveForm(formName, formFields) {
  const query = "INSERT INTO backoffice.tblformtypes(type_name, document_fields) VALUES ($1, $2)";
  client.query(query, [formName, formFields]);
}

export function deleteForm(id) {
  const query = "DELETE FROM backoffice.tblformtypes WHERE id = $1;";
  client.query(query, [id]);
}

export function deleteData(id) {
  const query = "DELETE FROM backoffice.tblformrequest WHERE type_id = $1;";
  client.query(query, [id]);
}

export function updateForm(id, formName, formFields) {
  const query = "UPDATE backoffice.tblformtypes SET type_name = $2, document_fields = $3 WHERE id = $1;";
  client.query(query, [id, formName, formFields]);
}

export function sendData(formId, formData){
  const query = "INSERT INTO backoffice.tblformrequest(type_id, request_data, ts) VALUES($1, $2, $3)";
  client.query(query, [formId, formData, 'now']);
}

export async function getData(typeId){
  const query = "SELECT request_data, ts FROM backoffice.tblformrequest WHERE type_id = $1";
  const queryResult = await client.query(query, [typeId]);
  return queryResult.rows
}

export const isImageFilter = function(mimetype) {
  return (mimetype.split('/')[0] === 'image') ? true : false
}

export const getType = function(mimetype) {
  let type = mimetype.split('/')[1];
  if (type === 'jpeg') type = 'jpg'
  return type
}

export const getDimensions = function(filelink) {
  let dimensions = imageSize(filelink)
  return dimensions
}