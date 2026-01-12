import { Router } from "express";
import dispositivoRouter from "../resources/dispositivo/dispositivo.router";
import usuarioRouter from "../resources/user/user.router";
import authRouter from "../resources/auth/auth.router";
import historicoRouter from "../resources/historico/historico.router";
import favoritoRouter from "../resources/favoritos/favorito.router";

const router = Router();

router.use(
  "/dispositivos",
  // #swagger.tags = ['dispositivo']
  dispositivoRouter
);


export default router;
