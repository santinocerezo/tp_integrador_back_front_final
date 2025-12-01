import { Router } from "express";
const router = Router();

import { validateId } from "../middlewares/middlewares.js";

import {
  createProductController,
  removeProduct,
  getAllProducts,
  getProductById,
  updateProductController
} from "../controllers/product.controllers.js";

// GET -> Traer todos los productos
router.get("/", getAllProducts);

// GET -> Producto por id
router.get("/:id", validateId, getProductById);

// POST -> Crear un nuevo producto
router.post("/", createProductController);

// PUT -> Actualizar un producto
router.put("/", updateProductController);

// DELETE -> Eliminar un producto por su id
router.delete("/:id", validateId, removeProduct);

export default router;
