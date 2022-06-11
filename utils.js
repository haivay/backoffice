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
};

export async function getForm(formId) {
  const query = "SELECT * FROM backoffice.tblformtypes WHERE id = $1";
  const queryResult = await client.query(query, [formId]);
  return queryResult.rows[0];
};

export async function saveForm(formName, formFields, staffId) {
  const query = "INSERT INTO backoffice.tblformtypes(type_name, document_fields, staff_id) VALUES ($1, $2, $3)";
  await client.query(query, [formName, formFields, staffId]);
};

export async function updateForm(id, formName, formFields, staffId) {
  const query = "UPDATE backoffice.tblformtypes SET type_name = $2, document_fields = $3, staff_id = $4 WHERE id = $1;";
  await client.query(query, [id, formName, formFields, staffId]);
};

export async function deleteForm(id) {
  const query = "DELETE FROM backoffice.tblformtypes WHERE id = $1;";
  await client.query(query, [id]);
};

export async function getRequests(typeId, filterStatement) {
  const baseQuery = "SELECT id, request_data, ts, request_number, person_id, status_id FROM backoffice.tblformrequest WHERE type_id = $1 JOIN backofiice.tblformanswer ON backoffice.tblformrequest.id = backofiice.tblformanswer.request_id";
  let query = `SELECT * FROM (${baseQuery}) dq`;
  if (filterStatement != '') {
    query = `${query} WHERE ${filterStatement}`;
  }
  const queryResult = await client.query(query, [typeId]);
  return queryResult.rows
};

export async function saveRequest(formId, formData, personId = null) {
  const query = "INSERT INTO backoffice.tblformrequest(type_id, request_data, ts, person_id) VALUES($1, $2, $3, $4) RETURNING request_number";
  const queryResult = await client.query(query, [formId, formData, 'now', personId]);
  return queryResult.rows[0]
};

export async function deleteRequest(id) {
  const query = "DELETE FROM backoffice.tblformrequest WHERE type_id = $1;";
  await client.query(query, [id]);
};

export async function getStaff() {
  const query = "SELECT * FROM staff.tblperson";
  const queryResult = await client.query(query);
  return queryResult.rows
};

export async function getStaffById(staffId) {
  const query = "SELECT * FROM staff.tblperson WHERE id = $1";
  const queryResult = await client.query(query, [staffId]);
  return queryResult.rows
};

export async function getStatuses() {
  const query = "SELECT * FROM backoffice.statuses";
  const queryResult = await client.query(query);
  return queryResult.rows;
};

export async function getCategories() {
  const query = "SELECT * FROM backoffice.categories";
  const queryResult = await client.query(query);
  return queryResult.rows;
};

export async function getPriorities() {
  const query = "SELECT * FROM backoffice.priorities";
  const queryResult = await client.query(query);
  return queryResult.rows;
};

export async function saveAnswer(status_id, category_id, priority_id, answer, request_id) {
  const query = "INSERT INTO backoffice.tblformanswer(status_id, category_id, priority_id, change_time, answer, request_id) VALUES ($1, $2, $3, $4, $5, $6)";
  await client.query(query, [status_id, category_id, priority_id, "now", answer, request_id]);
};

export async function getAnswerByRequestNumber(requestNumber) {
  const query = "SELECT status_id, category_id, priority_id, change_time, answer from backoffice.tblformanswer WHERE request_id = (SELECT id from backoffice.tblformrequest WHERE request_number = $1) ORDER BY change_time DESC";
  const queryResult = await client.query(query, [requestNumber]);
  return queryResult.rows
};