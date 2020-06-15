const sql = require("./db.js");


const Customer = function(table) {
  this.table_id = table.id;
};

Customer.createTable = (headers, result) => {
  var fields = '';
  var fieldnms = '';
  var qs = '';
  headers.forEach(hdr => {
      hdr = hdr.replace(' ', '_');
      if (fields !== '') fields += ',';
      if (fieldnms !== '') fieldnms += ','
      if (qs !== '') qs += ',';
      fields += ` ${hdr} TEXT`;
      fieldnms += ` ${hdr}`;
      qs += ' ?';
  });
  sql.query(`CREATE TABLE IF NOT EXISTS anytable ( ${fields} )`,
  [ ],
  err => {
      if (err) reject(err);
      else result(null, {status : 'Success'});
  })
}


Customer.bulkCreate = (req_arr, result) =>{

  sql.query("INSERT INTO anytable(region,country,item_type,sales_channel,order_priority,order_date,order_id,ship_date,units_sold,unit_price,unit_cost,total_revenue,total_cost,total_profit) VALUES ?", [req_arr], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    
    console.log("created customer: ", { id: res.insertId, number_of_records: req_arr.length });
    result(null, {records:req_arr.length, status:'Sucess'});
  });
};

// Customer.create = (newCustomer, result) => {
//   sql.query("INSERT INTO customers SET ?", newCustomer, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }
    
//     console.log("created customer: ", { id: res.insertId, ...newCustomer });
//     result(null, { id: res.insertId, ...newCustomer });
//   });
// };


// Customer.findById = (customerId, result) => {
//   sql.query(`SELECT * FROM customers WHERE id = ${customerId}`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       console.log("found customer: ", res[0]);
//       result(null, res[0]);
//       return;
//     }

//     // not found Customer with the id
//     result({ kind: "not_found" }, null);
//   });
// };

Customer.getAll = result => {
  sql.query("SELECT * FROM anytable", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("customers: ", res);
    result(null, res);
  });
};


// Customer.updateById = (id, customer, result) => {
//   sql.query(
//     "UPDATE customers SET level_col = ?, cvss = ?, title = ?, vulnerability = ?, solution = ?, reference_col = ? WHERE id = ?",
//     [customer.level_col, customer.cvss, customer.title, customer.vulnerability, customer.solution, customer.reference_col, id],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found Customer with the id
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       console.log("updated customer: ", { id: id, ...customer });
//       result(null, { id: id, ...customer });
//     }
//   );
// };

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Delete a single record by id
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Customer.remove = (id, result) => {
  sql.query("DELETE FROM customers WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted customer with id: ", id);
    result(null, res);
  });
};


//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Delete all the records from the table
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Customer.removeAll = result => {
  sql.query("DELETE FROM customers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} customers`);
    result(null, res);
  });
};

module.exports = Customer;
