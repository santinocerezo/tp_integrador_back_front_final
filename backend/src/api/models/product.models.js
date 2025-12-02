// src/api/models/product.models.js
// Modelos para la tabla productos de Barberpoint

import connection from "../database/db.js";

// Traer todos los productos
const selectAllProducts = () => {
  const sql = "SELECT * FROM productos WHERE activo = 1";
  return connection.query(sql);
};

// Traer producto por id
const selectProductById = (id) => {
  const sql = "SELECT * FROM productos WHERE id = ? AND activo = 1";
  return connection.query(sql, [id]);
};

// Insertar producto nuevo
const createProduct = (producto) => {
  const { nombre, tipo, precio, imagen, activo } = producto;

  const sql = `
    INSERT INTO productos (nombre, tipo, precio, imagen, activo)
    VALUES (?, ?, ?, ?, ?)
  `;

  return connection.query(sql, [nombre, tipo, precio, imagen, activo]);
};

// Actualizar producto por id
const updateProductById = (producto) => {
  const { id, nombre, tipo, precio, imagen, activo } = producto;

  const sql = `
    UPDATE productos
    SET nombre = ?, tipo = ?, precio = ?, imagen = ?, activo = ?
    WHERE id = ?
  `;

  return connection.query(sql, [nombre, tipo, precio, imagen, activo, id]);
};

// marcamos el producto como inactivo
const deleteProductById = (id) => {
  const sql = "UPDATE productos SET activo = 0 WHERE id = ?";
  return connection.query(sql, [id]);
};


export default {
  selectAllProducts,
  selectProductById,
  createProduct,
  updateProductById,
  deleteProductById
};
