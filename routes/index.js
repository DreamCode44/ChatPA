const express = require('express');
const crypto = require('crypto');
const { Op } = require('sequelize');
const Doctor = require('../models/Doctor')
const InicioSesion = require('../models/InicioSesion')

const router = express.Router();

router.post("/inicio-sesion", async (req, res) => {
  const { enter, contra } = req.body

  const inicioSesion = await InicioSesion.findOne({ where: { [Op.or]: [{ correo: enter }, { usuario: enter }], } });

  if (inicioSesion) {
    // Obtener datos de la base de datos (reemplace con sus datos reales)
    const encryptedPasswordBase64 = inicioSesion.contra;
    const claveAleatoriaBase64 = inicioSesion.clave_maestra;

    // Decodificar la clave aleatoria
    const claveAleatoria = Buffer.from(claveAleatoriaBase64, 'base64');

    // Inicializar cifrador con la clave aleatoria
    const cipher = crypto.createDecipheriv('aes-256-cbc', claveAleatoria, Buffer.alloc(16));

    // Decodificar la contraseña cifrada y realizar el descifrado
    const encryptedPassword = Buffer.from(encryptedPasswordBase64, 'base64');
    let decryptedPassword = cipher.update(encryptedPassword, 'base64', 'utf-8');
    decryptedPassword += cipher.final('utf-8');

    if (contra === decryptedPassword) {
      res.cookie("usuario", inicioSesion.usuario, {
        secure: true,
        httpOnly: true
      })
      res.cookie("tipo", 1, {
        secure: true,
        httpOnly: true
      })
      return res.redirect("/usuario.html")
    }
  } else {
    const doctor = await Doctor.findOne({ where: { [Op.or]: [{ correo: enter }, { usuario: enter }], contra: contra } });
    if (doctor) {
      res.cookie("usuario", doctor.usuario, {
        secure: true,
        httpOnly: true
      })
      res.cookie("tipo", 2, {
        secure: true,
        httpOnly: true
      })
      return res.redirect("/medico.html");
    }
  }
  return res.redirect("/inicio.html")
})

router.post("/registrar", async (req, res) => {
  const { usuario, correo, contra, tipo } = req.body

  // Generar clave aleatoria para cifrado de contraseñas
  const claveAleatoria = crypto.randomBytes(32);
  const secretKeySpec = crypto.createCipheriv('aes-256-cbc', claveAleatoria, Buffer.alloc(16));

  // Inicializar cifrador con la clave aleatoria
  const cipher = crypto.createCipheriv('aes-256-cbc', claveAleatoria, Buffer.alloc(16));

  // Cifrar la contraseña
  let encryptedPassword = cipher.update(contra, 'utf-8', 'base64');
  encryptedPassword += cipher.final('base64');

  // Convertir a Base64 para almacenar en la base de datos
  const encryptedPasswordBase64 = Buffer.from(encryptedPassword, 'base64').toString('base64');

  await InicioSesion.create({
    usuario: usuario,
    correo: correo,
    contra: encryptedPasswordBase64,
    tipo: tipo,
    clave_maestra: claveAleatoria.toString('base64'),
  });

  res.redirect('/inicio.html');
})

router.get("/cerrar-session", (req, res) => {
  res.clearCookie("usuario")
  res.clearCookie("tipo")
  res.redirect('/');
})

module.exports = router;
