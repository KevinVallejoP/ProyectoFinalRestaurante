'use strict';
const querystring = require("querystring")
const mysql=require('mysql');
const connection=mysql.createConnection({
  host:'proyectofinal-jd-kevindavid.chaimywkeuxz.us-east-2.rds.amazonaws.com',
  user:'admin',
  port:'3306',
  password:'admin123',
  database:'Pedidosrestaurante',
});

module.exports.hacerPedido = async (event) => {
  const pedido = querystring.parse(event["body"])
  await new Promise((resolve, reject) => {
  const queryclient = "CALL insert_pedido(?,?,?,?,?);";
    connection.query(queryclient,[pedido.producto_id,pedido.cantidad_und,pedido.valorUnidad,pedido.valorTotal,pedido.cliente_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "exitoso",
        cliente_id: pedido.cliente_id,
        producto_id: pedido.producto_id,
        cantidad_und: pedido.cantidad_und,
        valorUnidad: pedido.valorUnidad,
        valorTotal: pedido.valorTotal,  
      },
      null,
      2
    ),
  };
  connection.end();
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


module.exports.obtenerPedido = async (event) => {
  const pedido = querystring.parse(event["body"])
  const queryclient = "SELECT * FROM Pedidosrestaurante.pedidos where id=?;";
  const consulta = await new Promise((resolve, reject) => {
     connection.query(queryclient,[pedido.id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  connection.end();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "exitoso",
        pedido: consulta,
      },
      null,
      2
    ),
  };
  
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
