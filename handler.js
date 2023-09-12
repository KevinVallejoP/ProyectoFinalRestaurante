'use strict';
const aws=require('aws-sdk'); 
const querystring = require("querystring")
const mysql=require('mysql');
const connection=mysql.createConnection({
  host:'proyecto-final-restaurante-dev-databasekevindavid-gmjksygs7xns.chaimywkeuxz.us-east-2.rds.amazonaws.com',
  user:'admin',
  port:'3306',
  password:'admin123',
  database:'restaurantebd',
});

module.exports.hacerPedido = async (event) => {
  const pedido = querystring.parse(event["body"])
  await new Promise((resolve, reject) => {
  const queryclient = "CALL insert_pedidos(?,?,?,?,?);";
    connection.query(queryclient,[pedido.producto_id,pedido.cantidad_und,pedido.valorUnidad,pedido.valorTotal,pedido.cliente_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  const messageBody = {
    Cliente: pedido.cliente_id,
    Producto: pedido.producto_id,
    Cantidad: pedido.cantidad_und,
    "Valor Total": pedido.valorTotal,
  };
   // Parámetros del mensaje
   const params = {
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: 'https://sqs.us-east-2.amazonaws.com/667168568942/order-queue',
  };
  await sqs.sendMessage(params).promise();
  const paramsEmail = {
    Source: "kevin.vallejo27635@ucaldas.edu.co", 
    Destination: {
      ToAddresses: [clienteEmail],
    },
    Message: {
      Subject: {
        Data: "Detalles del pedido",
      },
      Body: {
        Text: {
          Data: `Detalles del pedido:\n\nCliente: ${cliente_id}\nProducto: ${producto_id}\nValor unidad: ${valorUnidad}\nCantidad: ${pedido.cantidad_und}\nValor Total: ${pedido.valorTotal}`,
        },
      },
    },
  };
  await ses.sendEmail(paramsEmail).promise();
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
};


module.exports.obtenerPedido = async (event) => {
  const pedido_id = event.queryStringParameters.id;
  const queryPedido = "SELECT * FROM Pedidosrestaurante.pedidos WHERE id = ?";
  const results = await new Promise((resolve, reject) => {
    connection.query(queryPedido, [pedido_id], (err, results) => {
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
        pedido: results[0],
      },
      null,
      2
    ),
  };
};
