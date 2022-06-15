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

export async function getRequests(typeId, filterStatement, page, sortField, sortOrder) {
  // const baseQuery = "SELECT r.id, r.request_data, r.request_number, r.person_id, a.status_id FROM backoffice.tblformrequest as r JOIN backoffice.tblformanswer as a ON r.id = a.request_id WHERE r.type_id = $1";

  const baseQuery = `SELECT r.id, r.request_data, r.ts, r.request_number, r.category_id, r.priority_id, a.change_time, a.answer, a.request_id, a.status_id\
                     FROM backoffice.tblformrequest as r\
                     LEFT JOIN backoffice.tblformanswer as a ON r.id = a.request_id\
                     WHERE ((a.request_id, a.change_time) IN\
                     (SELECT request_id, max(change_time) FROM backoffice.tblformanswer GROUP BY request_id)\
                     OR a.request_id is null) AND type_id = '${typeId}'`
  let query = `SELECT * FROM (${baseQuery}) dq`;
  if (filterStatement != '') {
    filterStatement = 'dq.' + filterStatement;
    query = `${query} WHERE ${filterStatement}`;
  }

  if (sortField != null) {
    query = `${query} ORDER BY ${sortField} ${sortOrder}`;
  }

  const qrowcount = await client.query(`SELECT COUNT(1) as cnt FROM (${query}) qcnt`);
  const totalRows = qrowcount.rows[0].cnt;
  const rowNum = 10;

  const totalPages = Math.ceil(totalRows / rowNum);
  if (page > totalPages) page = totalPages;
  if (rowNum < 0) rowNum = 0;
  let offsetRow = (rowNum * page) - rowNum;
  if (offsetRow < 0) offsetRow = 0;
  query += ` OFFSET ${offsetRow} LIMIT ${rowNum}`;

  const queryResult = await client.query(query);
  return {data:queryResult.rows, totalRows}
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

// export async function saveAnswer(status_id, category_id, priority_id, answer, request_id) {
//   const query = "INSERT INTO backoffice.tblformanswer(status_id, change_time, answer, request_id) VALUES ($1, $2, $3, $4)";
//   await client.query(query, [status_id, "now", answer, request_id]);
// };

export async function saveAnswer(status_id, category_id, priority_id, answer, request_id) {
  const query1 = "INSERT INTO backoffice.tblformanswer(status_id, change_time, answer, request_id) VALUES ($1, $2, $3, $4)";
  const query2 = "UPDATE backoffice.tblformrequest SET category_id = $2, priority_id = $3 WHERE id = $1;";
  await client.query(query1, [status_id, "now", answer, request_id]);
  await client.query(query2, [request_id, category_id, priority_id]);
}; 

export async function getAnswerByRequestNumber(requestNumber) {
  const query = "SELECT status_id, category_id, priority_id, change_time, answer from backoffice.tblformanswer WHERE request_id = (SELECT id from backoffice.tblformrequest WHERE request_number = $1) ORDER BY change_time DESC";
  const queryResult = await client.query(query, [requestNumber]);
  return queryResult.rows
};