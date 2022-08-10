const express = require("express");
const router = express.Router();
const mainController = require('../controllers/mainControllers');
const userCheck = require("../middlewares/userCheck");
const user2 = require("../middlewares/user2");
const userC3 = require("../middlewares/userC3");

router.get("/", mainController.index);
router.post("/login", mainController.login);
router.get("/logout", mainController.logOut);
router.get("/nuevo", userCheck, mainController.nuevoE);
router.post("/nuevo", userCheck, mainController.ingresarBD);
router.get("/validar", userCheck, user2, mainController.validar);
router.post("/aceptar/:id", userCheck, user2, mainController.aceptar);
router.post("/rechazar/:id", userCheck, user2, mainController.rechazar);
router.post("/terminar/:id", userCheck, user2, mainController.terminar);
router.post("/cancelar/:id", userCheck, user2, mainController.cancelar);
router.get("/editarD/:id", userCheck, user2, userC3, mainController.editar);
router.post("/editarD/:id", userCheck, user2, userC3, mainController.editado);
router.get("/editarE/:id", userCheck, user2, userC3, mainController.editarE);
router.post("/editarE/:id", userCheck, user2, userC3, mainController.editadoE);
router.get("/correoU2", userCheck, user2, mainController.correo2);
router.get("/correo/vista/:id", userCheck, user2, mainController.correo2Vista);
router.get("/correo/vista/admin/:id", userCheck, user2, mainController.correo3Vista);


module.exports = router;
