// src/api/controllers/product.controllers.js
// Controladores para productos Barberpoint

import ProductModel from "../models/product.models.js";

const {
  selectAllProducts,
  selectProductById,
  createProduct,
  updateProductById,
  deleteProductById
} = ProductModel;

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await selectAllProducts();

    return res.status(200).json({
      payload: rows,
      message: "Productos encontrados"
    });
  } catch (error) {
    console.error("Error obteniendo productos", error);
    return res.status(500).json({
      message: "Error interno al obtener productos"
    });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Debe enviar un id de producto"
      });
    }

    const [rows] = await selectProductById(id);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    const producto = rows[0];

    return res.status(200).json({
      payload: producto,
      message: "Producto encontrado"
    });
  } catch (error) {
    console.error("Error obteniendo producto por id", error);
    return res.status(500).json({
      message: "Error interno al obtener el producto"
    });
  }
};

// POST /api/products
export const createProductController = async (req, res) => {
  try {
    const { nombre, tipo, precio, imagen, activo } = req.body;

    if (!nombre || !tipo || precio === undefined || !imagen || activo === undefined) {
      return res.status(400).json({
        message: "Faltan datos para crear el producto"
      });
    }

    const nuevoProducto = {
      nombre: nombre.trim(),
      tipo: tipo.trim(),
      precio: Number(precio),
      imagen: imagen.trim(),
      activo: Number(activo) === 1 ? 1 : 0
    };

    await createProduct(nuevoProducto);

    return res.status(201).json({
      message: "Producto creado correctamente"
    });
  } catch (error) {
    console.error("Error creando producto", error);
    return res.status(500).json({
      message: "Error interno al crear el producto"
    });
  }
};

// PUT /api/products
export const updateProductController = async (req, res) => {
  try {
    const { id, nombre, tipo, precio, imagen, activo } = req.body;

    if (!id || !nombre || !tipo || precio === undefined || !imagen || activo === undefined) {
      return res.status(400).json({
        message: "Faltan datos para actualizar el producto"
      });
    }

    const [rows] = await selectProductById(id);
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "El producto que desea actualizar no existe"
      });
    }

    const productoActualizado = {
      id: Number(id),
      nombre: nombre.trim(),
      tipo: tipo.trim(),
      precio: Number(precio),
      imagen: imagen.trim(),
      activo: Number(activo) === 1 ? 1 : 0
    };

    await updateProductById(productoActualizado);

    return res.status(200).json({
      message: "Producto actualizado correctamente"
    });
  } catch (error) {
    console.error("Error actualizando producto", error);
    return res.status(500).json({
      message: "Error interno al actualizar el producto"
    });
  }
};

// DELETE /api/products/:id
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Debe enviar un id de producto"
      });
    }

    const [rows] = await selectProductById(id);
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "El producto que desea eliminar no existe"
      });
    }

    await deleteProductById(id);

    return res.status(200).json({
      message: "Producto eliminado correctamente"
    });
  } catch (error) {
    console.error("Error eliminando producto", error);
    return res.status(500).json({
      message: "Error interno al eliminar el producto"
    });
  }
};
