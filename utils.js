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

export function saveForm(formName, formFields, staffId) {
  const query = "INSERT INTO backoffice.tblformtypes(type_name, document_fields, staff_id) VALUES ($1, $2, $3)";
  client.query(query, [formName, formFields, staffId]);
}

export function updateForm(id, formName, formFields, staffId) {
  const query = "UPDATE backoffice.tblformtypes SET type_name = $2, document_fields = $3, staff_id = $4 WHERE id = $1;";
  client.query(query, [id, formName, formFields, staffId]);
}

export function deleteForm(id) {
  const query = "DELETE FROM backoffice.tblformtypes WHERE id = $1;";
  client.query(query, [id]);
}

export function deleteData(id) {
  const query = "DELETE FROM backoffice.tblformrequest WHERE type_id = $1;";
  client.query(query, [id]);
}

export function sendData(formId, formData, personId = null) {
  const query = "INSERT INTO backoffice.tblformrequest(type_id, request_data, ts, person_id) VALUES($1, $2, $3, $4)";
  client.query(query, [formId, formData, 'now', personId]);
}

export async function getData(typeId){
  const query = "SELECT request_data, ts FROM backoffice.tblformrequest WHERE type_id = $1";
  const queryResult = await client.query(query, [typeId]);
  return queryResult.rows
}

export async function getForm(formId) {
  const query = "SELECT * FROM backoffice.tblformtypes WHERE id = $1";
  const queryResult = await client.query(query, [formId]);
  return queryResult.rows[0]
}

export async function getStaff() {
  const query = "SELECT * FROM staff.tblperson";
  const queryResult = await client.query(query);
  return queryResult.rows
}

export async function getStaffById(staffId) {
  const query = "SELECT * FROM staff.tblperson WHERE id = $1";
  const queryResult = await client.query(query, [staffId]);
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

export const getStatuses = function() {
  const query = "SELECT * FROM backoffice.statuses";
  const queryResult = await client.query(query);
  return queryResult.rows;
}

export const getCategories = function() {
  const query = "SELECT * FROM backoffice.categories";
  const queryResult = await client.query(query);
  return queryResult.rows;
}

export const getPriorities = function() {
  const query = "SELECT * FROM backoffice.priorities";
  const queryResult = await client.query(query);
  return queryResult.rows;
}

export function saveAnswer(status_id, category_id, priority_id, answer) {
  const query = "INSERT INTO backoffice.tblformanswer(status_id, category_id, priority_id, answer) VALUES ($1, $2, $3, $4, $5)";
  client.query(query, [status_id, category_id, priority_id, "now", answer]);
}