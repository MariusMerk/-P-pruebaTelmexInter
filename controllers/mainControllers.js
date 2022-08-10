const { json } = require("body-parser");
const cookieParser = require("cookie-parser");
let fs = require("fs");
let eventDB = fs.readFileSync("./data/eventDB.json", {
  encoding: "utf-8",
});

if (eventDB != "") {
  let datos = JSON.parse(eventDB);
  console.log("Numero de datos es:" + datos.length);
}

let mailDB = fs.readFileSync("./data/user2Mail.json", {
  encoding: "utf-8",
});

if (mailDB != "") {
  let correos = JSON.parse(mailDB);
  console.log("Numero de correo en User2 es: " + correos.length);
}

let adminMailDB = fs.readFileSync("./data/user3Mail.json", {
  encoding: "utf-8",
});

if (adminMailDB != "") {
  let correosAdmin = JSON.parse(mailDB);
  console.log("Numero de correo en User3 es: " + correosAdmin.length);
}

const controller = {
  index: (req, res) => {
    if (eventDB == "") {
      eventDB = "[]";
      console.log("La BD está vacia");
    }

    console.log(req.cookies);
    req.session.user = "Inidef";
    var user = req.session.user;
    console.log(`El usuario es: ${user}`);
    res.render("index");
  }, //landig al login
  login: (req, res) => {
    let usuarioL = req.body.userName;
    let user = req.session.user;
    switch (usuarioL) {
      case "User1":
        req.session.user = usuarioL;
        user = usuarioL;
        res.cookie("usuario", user, { maxAge: 1000 * 60 * 10 });
        res.locals.userL = user;
        console.log(`El usuario cambio a: ${user}`);
        res.redirect("/nuevo");
        break;
      case "User2":
        req.session.user = usuarioL;
        user = usuarioL;
        res.cookie("usuario", user, { maxAge: 1000 * 60 * 10 });
        res.locals.userL = user;
        console.log(`El usuario cambio a: ${user}`);
        res.redirect("/validar");
        break;
      case "User3":
        req.session.user = usuarioL;
        user = usuarioL;
        res.cookie("usuario", user, { maxAge: 1000 * 60 * 10 });
        res.locals.userL = user;
        console.log(`El usuario cambio a: ${user}`);
        res.redirect("/validar");
        break;
      default:
        return res.redirect("/");
    }
  }, //login de un usuario
  logOut: (req, res) => {
    req.session.destroy();
    if (req.cookies.usuario != undefined) {
      res.clearCookie("usuario");
    }
    return res.redirect("/");
  }, //logOut de cualquier usuario
  nuevoE: (req, res) => {
    if (req.cookies.usuario != undefined) {
      req.session.user = req.cookies.usuario;
    }
    res.render("newEvent", { user: req.session.user });
  }, //página de nuevos eventos
  ingresarBD: (req, res) => {
    console.log("Empieza a escribir a DB");
    let eventoNuevo;
    if (eventDB == "[]") {
      console.log("Base de eventos vacia, se procede a crearla");
      eventoNuevo = {
        id: 0,
        descripcion: req.body.descripcion,
        estatus: req.body.estatus,
      };
      console.log(eventoNuevo);

      let eventos;
      if (eventDB == "") {
        eventos = [];
      } else {
        eventos = JSON.parse(eventDB);
      }
      eventos.push(eventoNuevo);

      let eventosJSON = JSON.stringify(eventos);
      fs.writeFileSync("./data/eventDB.json", eventosJSON);
      console.log("Base de eventos ha cargado evento");

      console.log("Base de correos User2 inicia copia");
      let nuevoCorreo;
      let mail2; //revisa user2Mail y la pobla
      if (mailDB == "") {
        mailDB = "[]";
        mail2 = JSON.parse(mailDB);

        nuevoCorreo = {
          id: 0,
          usuario: req.session.user,
          descripcion: req.body.descripcion,
          estatus: req.body.estatus,
        };
        mail2.push(nuevoCorreo);
        let correosJSON = JSON.stringify(mail2);
        fs.writeFileSync("./data/user2Mail.json", correosJSON);
      } else {
        mail2 = JSON.parse(mailDB);
        nuevoCorreo = {
          id: mail2.length,
          usuario: req.session.user,
          descripcion: req.body.descripcion,
          estatus: req.body.estatus,
        };
        mail2.push(nuevoCorreo);
        let correosJSON = JSON.stringify(mail2);
        fs.writeFileSync("./data/user2Mail.json", correosJSON);
      } //finaliza metodo de User2
      console.log("Base de correos User2 ha cargado evento");

      let mail3;
      console.log("Empieza proceso de enviar correo a User3");
      if (adminMailDB == "") {
        console.log("Dentro del proceso, base vacia");
        mailAdminDB = "[]";
        mail3 = JSON.parse(mailAdminDB);
        console.log(nuevoCorreo);
        mail3.push(nuevoCorreo);

        let correosJSON = JSON.stringify(mail3);
        fs.writeFileSync("./data/user3Mail.json", correosJSON);
      } else {
        console.log("Dentro del proceso, base con cosas");
        mail3 = JSON.parse(adminMailDB);
        mail3.push(nuevoCorreo);
        let correosJSON = JSON.stringify(mail3);
        fs.writeFileSync("./data/user2Mail.json", correosJSON);
      }
      console.log("Termina proceso de enviar correo User3");
      return res.redirect("/nuevo");
    } else {
      console.log("Base ya tiene datos, empieza parse");
      let eventos = JSON.parse(eventDB);
      eventoNuevo = {
        id: eventos.length,
        descripcion: req.body.descripcion,
        estatus: req.body.estatus,
      };
      eventos.push(eventoNuevo);
      let eventosJSON = JSON.stringify(eventos);
      fs.writeFileSync("./data/eventDB.json", eventosJSON);

      let mail2 = JSON.parse(mailDB);
      let mail3 = JSON.parse(adminMailDB);

      let nuevoCorreo2 = {
        id: mail2.length,
        usuario: "User 1",
        descripcion: req.body.descripcion,
        estatus: req.body.estatus,
      };
      let nuevoCorreo3 = {
        id: mail3.length,
        usuario: "User 1",
        descripcion: req.body.descripcion,
        estatus: req.body.estatus,
      };

      mail2.push(nuevoCorreo2);
      mail3.push(nuevoCorreo3);

      let correos2JSON = JSON.stringify(mail2);
      fs.writeFileSync("./data/user2Mail.json", correos2JSON);
      let correos3JSON = JSON.stringify(mail3);
      fs.writeFileSync("./data/user3Mail.json", correos3JSON);

      return res.redirect("/nuevo");
    }
  }, //ingresa los datos a la BD
  validar: (req, res) => {
    let listadoEventos = [];
    if (req.cookies.usuario != undefined) {
      req.session.user = req.cookies.usuario;
    }
    if (eventDB == "[]") {
      console.log("La BD está vacia");
      listadoEventos = eventDB;
      console.log("Esto es lo que hay en la BD");
      console.log(typeof listadoEventos);
    } else {
      listadoEventos = JSON.parse(eventDB);
      console.log(listadoEventos.length);
    }
    res.render("validation", {
      user: req.session.user,
      listadoEventos,
    });
  }, //página de validar eventos
  aceptar: (req, res) => {
    listadoEventos = JSON.parse(eventDB);
    const elemento = parseInt(req.params.id);
    for (let i = 0; i < listadoEventos.length; i++) {
      if (listadoEventos[i].id === elemento) {
        console.log("Encontré el elemento");
        listadoEventos[i].estatus = "Aceptado";
        let nuevoJSON = JSON.stringify(listadoEventos);
        fs.writeFileSync("./data/eventDB.json", nuevoJSON);
        let mail3 = JSON.parse(adminMailDB);
        let nuevoCorreo3 = {
          id: mail3.length,
          usuario: "User 2",
          descripcion: listadoEventos[i].descripcion,
          estatus: listadoEventos[i].estatus,
        };
        mail3.push(nuevoCorreo3);
        let correos3JSON = JSON.stringify(mail3);
        fs.writeFileSync("./data/user3Mail.json", correos3JSON);
      }
    }

    res.redirect("/validar");
  }, //código para aceptar un evento, estos dos controllers requieren un manual refresh
  rechazar: (req, res) => {
    listadoEventos = JSON.parse(eventDB);
    const elemento = parseInt(req.params.id);
    for (let i = 0; i < listadoEventos.length; i++) {
      if (listadoEventos[i].id === elemento) {
        console.log("Encontré el elemento");
        listadoEventos[i].estatus = "Rechazado";
        let nuevoJSON = JSON.stringify(listadoEventos);
        fs.writeFileSync("./data/eventDB.json", nuevoJSON);
        let mail3 = JSON.parse(adminMailDB);
        let nuevoCorreo3 = {
          id: mail3.length,
          usuario: "User 2",
          descripcion: listadoEventos[i].descripcion,
          estatus: listadoEventos[i].estatus,
        };
        mail3.push(nuevoCorreo3);
        let correos3JSON = JSON.stringify(mail3);
        fs.writeFileSync("./data/user3Mail.json", correos3JSON);
      }
    }
    return res.redirect("/validar");
  }, //código para rechazar un evento
  terminar: (req, res) => {
    listadoEventos = JSON.parse(eventDB);
    const elemento = parseInt(req.params.id);
    for (let i = 0; i < listadoEventos.length; i++) {
      if (listadoEventos[i].id === elemento) {
        console.log("Encontré el elemento");
        listadoEventos[i].estatus = "Terminado";
        let nuevoJSON = JSON.stringify(listadoEventos);
        fs.writeFileSync("./data/eventDB.json", nuevoJSON);
        let mail2 = JSON.parse(mailDB);
        let mail3 = JSON.parse(adminMailDB);
        let nuevoCorreoU2 = {
          id: mail2.length,
          usuario: "User 3",
          descripcion: listadoEventos[i].descripcion,
          estatus: "Terminado",
        };
        let nuevoCorreoU3 = {
          id: mail3.length,
          usuario: "User 3",
          descripcion: listadoEventos[i].descripcion,
          estatus: "Terminado",
        };

        mail2.push(nuevoCorreoU2);
        mail3.push(nuevoCorreoU3);

        let correos2JSON = JSON.stringify(mail2);
        fs.writeFileSync("./data/user2Mail.json", correos2JSON);
        let correos3JSON = JSON.stringify(mail3);
        fs.writeFileSync("./data/user3Mail.json", correos3JSON);
      } else {
        console.log("Error: No encontré ese elemento");
      }
    }

    return res.redirect("/validar");
  },
  editar: (req, res) => {
    listadoEventos = JSON.parse(eventDB);
    const elemento = parseInt(req.params.id);
    res.render("edVDes", { elemento, listadoEventos });
  },
  editarE: (req, res) => {
    listadoEventos = JSON.parse(eventDB);
    const elemento = parseInt(req.params.id);
    res.render("edVEst", { elemento, listadoEventos });
  },
  editado: (req, res) => {
    listadoEventos = JSON.parse(eventDB);
    const elemento = parseInt(req.params.id);
    const newD = req.body.edit;
    for (let i = 0; i < listadoEventos.length; i++) {
      if (listadoEventos[i].id === elemento) {
        console.log("Encontré el elemento");
        listadoEventos[i].descripcion = newD;
        let nuevoJSON = JSON.stringify(listadoEventos);
        fs.writeFileSync("./data/eventDB.json", nuevoJSON);
      } 
    }
    res.redirect("/validar");
  },
  editadoE: (req, res) => {
    listadoEventos = JSON.parse(eventDB);
    const elemento = parseInt(req.params.id);
    const newE = req.body.edit;
    for (let i = 0; i < listadoEventos.length; i++) {
      if (listadoEventos[i].id === elemento) {
        console.log("Encontré el elemento");
        listadoEventos[i].estatus = newE;
        let nuevoJSON = JSON.stringify(listadoEventos);
        fs.writeFileSync("./data/eventDB.json", nuevoJSON);
      }
    }
    res.redirect("/validar");
  },
  cancelar: (req, res) => {
    listadoEventos = JSON.parse(eventDB);
    const elemento = parseInt(req.params.id);
    for (let i = 0; i < listadoEventos.length; i++) {
      if (listadoEventos[i].id === elemento) {
        console.log("Encontré el elemento");
        listadoEventos[i].estatus = "Cancelado";
        let nuevoJSON = JSON.stringify(listadoEventos);
        fs.writeFileSync("./data/eventDB.json", nuevoJSON);
        let mail2 = JSON.parse(mailDB);
        let mail3 = JSON.parse(adminMailDB);
        let nuevoCorreoU2 = {
          id: mail2.length,
          usuario: "User 3",
          descripcion: listadoEventos[i].descripcion,
          estatus: "Cancelado",
        };
        let nuevoCorreoU3 = {
          id: mail3.length,
          usuario: "User 3",
          descripcion: listadoEventos[i].descripcion,
          estatus: "Cancelado",
        };

        mail2.push(nuevoCorreoU2);
        mail3.push(nuevoCorreoU3);

        let correos2JSON = JSON.stringify(mail2);
        fs.writeFileSync("./data/user2Mail.json", correos2JSON);
        let correos3JSON = JSON.stringify(mail3);
        fs.writeFileSync("./data/user3Mail.json", correos3JSON);
      } else {
        console.log("Error: No encontré ese elemento");
      }
    }
    return res.redirect("/validar");
  },
  correo2: (req, res) => {
    let mail2;
    if (mailDB == "") {
      mailDB = "[]";
      mail2 = JSON.parse(mailDB);
    } else {
      mail2 = JSON.parse(mailDB);
    }
    let mail3;
    if (adminMailDB == "") {
      adminMailDB = "[]";
      mail3 = JSON.parse(adminMailDB);
    } else {
      mail3 = JSON.parse(adminMailDB);
    }
    console.log("El correo trae esto:");
    console.log(mail2);
    res.render("user2Inbox", { user: req.session.user, mail2, mail3 });
  }, //página de correo a User2 y 3
  correo2Vista: (req, res) => {
    let mail2;
    if (mailDB == "") {
      mailDB = "[]";
      mail2 = JSON.parse(mailDB);
    } else {
      mail2 = JSON.parse(mailDB);
    }
    let id = req.params.id;
    res.render("vistaCorreo", { mail2, id });
  }, //renderiza vista de correo específico
  correo3Vista: (req, res) => {
    let mail3;
    if (adminMailDB == "") {
      adminMailDB = "[]";
      mail3 = JSON.parse(adminMailDB);
    } else {
      mail3 = JSON.parse(adminMailDB);
    }
    let id = req.params.id;
    res.render("vistaCorreoAdmin", { mail3, id });
  },
};

module.exports = controller;
