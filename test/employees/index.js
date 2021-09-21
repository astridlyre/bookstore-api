import { expect } from "chai";
import { testEmployees } from "../../lib/testData.js";

export function testGetEmployees(chai, server, done) {
  chai.request(server).get("/employees").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.employees).to.be.a("array");
    expect(res.body.employees.length).to.equal(testEmployees.length);
    expect(res.body.employees).to.deep.equal(
      testEmployees.map((employee, i) => ({ ...employee, id: i + 1 })),
    );
    done();
  });
}

export function testCreateEmployee(chai, server, done) {
  const newEmployee = {
    firstName: "John",
    lastName: "Smith",
    birthDate: "1943-02-11",
    address: {
      line1: "143 Employee Drive",
      line2: "#2",
      city: "Blumfield",
      state: "Park",
      country: "USA",
      postalCode: "58869",
    },
    phoneNumber: {
      home: "12348585432",
      cell: null,
      main: null,
      fax: null,
    },
    email: "jsmith@fox.cute",
    hireDate: new Date().toLocaleDateString(),
    employeeNumber: 69,
  };
  chai.request(server).post("/employees").type("json").send(newEmployee).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(201);
      expect(res.body.employee).to.be.a("object");
      expect(res.body.employee).to.deep.equal({ ...newEmployee, id: 2 });
      done();
    },
  );
}

export function testGetEmployeesSortByLastNameDesc(chai, server, done) {
  chai.request(server).get("/employees?sort=lastName_desc").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.employees).to.be.a("array");
    expect(res.body.employees[0].lastName).to.equal("Smith");
    done();
  });
}

export function testGetEmployee(chai, server, done) {
  chai.request(server).get("/employees/1").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.employee).to.be.a("object");
    expect(res.body.employee).to.deep.equal({ ...testEmployees[0], id: 1 });
    done();
  });
}

export function testUpdateEmployee(chai, server, done) {
  const updates = {
    lastName: "Smith-Wilson",
    address: {
      line1: "123 New Street",
    },
    phoneNumber: {
      cell: "14325435435",
    },
  };
  chai.request(server).put("/employees/2").type("json").send(updates).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(200);
      expect(res.body.employee).to.be.a("object");
      expect(res.body.employee.lastName).to.equal(updates.lastName);
      expect(res.body.employee.address.line1).to.equal(updates.address.line1);
      expect(res.body.employee.phoneNumber.cell).to.equal(
        updates.phoneNumber.cell,
      );
      done();
    },
  );
}

export function testGetEmployeePerPageWithPage(chai, server, done) {
  chai.request(server).get("/employees?perpage=1&page=1").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.employees).to.be.a("array");
    expect(res.body.employees.length).to.equal(1);
    expect(res.body.employees[0].firstName).to.equal("John");
    done();
  });
}

export function testCreateEmployeeWithMissingFields(chai, server, done) {
  const newEmployee = {
    firstName: "John",
    birthDate: "1943-02-11",
    address: {
      line1: "143 Employee Drive",
      line2: "#2",
      city: "Blumfield",
      state: "Park",
      country: "USA",
      postalCode: "58869",
    },
    phoneNumber: {
      home: "12348585432",
      cell: null,
      main: null,
      fax: null,
    },
    email: "jsmith@fox.cute",
    hireDate: new Date().toLocaleDateString(),
  };
  chai.request(server).post("/employees").type("json").send(newEmployee).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.a("array");
      expect(res.body.errors).to.deep.equal([{
        message: "must have required property 'lastName'",
      }, { message: "must have required property 'employeeNumber'" }]);
      done();
    },
  );
}
