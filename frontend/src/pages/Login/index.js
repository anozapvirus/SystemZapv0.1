import React, { useState, useEffect, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import { nomeEmpresa } from "../../../package.json";
import { AuthContext } from "../../context/Auth/AuthContext";
import FlowerAnimation from "./animacao/FlowerAnimation"; // Importando animação das flores

const Copyright = () => (
  <Typography variant="body2" color="primary" align="center">
    {"Copyright "}
    <Link color="primary" href="#">
      {nomeEmpresa} - v {versionSystem}
    </Link>{" "}
    {new Date().getFullYear()}
    {"."}
  </Typography>
);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "linear-gradient(to right, #ff9a9e, #fad0c4, #fad0c4)", // Gradiente suave
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundSize: "cover",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif", // Fonte clean e moderna
    color: "#000", // Cor base do texto
  },
  paper: {
    backdropFilter: "blur(10px)", // Suavização de fundo
    background: "rgba(255, 255, 255, 0.6)", // Fundo com transparência suave
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    borderRadius: "15px",
    padding: "60px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px", // Limite de largura para não exagerar em telas grandes
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundImage: "linear-gradient(to right, #ff0844, #ffb199)", // Gradiente no botão
    color: "#fff",
    fontWeight: "bold",
    padding: "14px",
    borderRadius: "8px",
    boxShadow: "0px 5px 15px rgba(255, 105, 135, .3)",
    '&:hover': {
      backgroundImage: "linear-gradient(to right, #ff79b0, #ff0844)",
    },
    transition: "background-color 0.3s ease",
    fontSize: "1.1rem", // Aumentando a legibilidade
    cursor: "pointer",
  },
  input: {
    marginBottom: theme.spacing(2),
    '& input': {
      backdropFilter: "blur(8px)", // Efeito de desfocagem
      backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparência suave nos campos
      borderRadius: "8px",
      padding: "15px",
      color: "#000", // Texto branco dentro do campo
      border: "none",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      fontSize: "1rem", // Ajuste de fonte
      width: "100%", // Para garantir que o campo ocupe toda a largura disponível
    },
    '& .MuiInputLabel-root': {
      color: "#000", // Cor das labels brancas
    },
  },
  link: {
    color: "#ffffffcc", // Cor clara e suave
    fontSize: "0.9rem", // Ajuste de tamanho para melhorar a leitura
    marginTop: theme.spacing(2),
    '&:hover': {
      color: "#ff84b5", // Cor de hover suave
    },
  },
  '@media (max-width: 768px)': { // Responsividade para dispositivos menores
    paper: {
      padding: "40px 30px", // Ajuste de padding em telas menores
      maxWidth: "90%", // Aumenta a largura máxima para pequenos dispositivos
    },
    submit: {
      fontSize: "1rem", // Reduz o tamanho da fonte em telas menores
      padding: "12px", // Ajuste de padding para telas pequenas
    },
    input: {
      '& input': {
        fontSize: "0.9rem", // Reduz o tamanho da fonte nos campos de entrada
      },
    },
  },
  '@media (max-width: 480px)': { // Ajustes para telas extra pequenas (como BlackBerry)
    paper: {
      padding: "20px 15px", // Ajustando o padding para telas menores
      maxWidth: "95%", // Largura máxima para telas muito pequenas
    },
    submit: {
      fontSize: "0.9rem", // Menor tamanho de fonte
      padding: "10px", // Reduzindo o padding para botões em telas pequenas
    },
    input: {
      '& input': {
        fontSize: "0.8rem", // Ajuste fino no tamanho da fonte para telas pequenas
      },
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const { handleLogin } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [viewregister, setviewregister] = useState("disabled");

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchviewregister();
  }, []);

  const fetchviewregister = async () => {
    try {
      const responsev = await api.get("/settings/viewregister");
      const viewregisterX = responsev?.data?.value;
      setviewregister(viewregisterX);
    } catch (error) {
      console.error("Error retrieving viewregister", error);
    }
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  const logo = `${process.env.REACT_APP_BACKEND_URL}/public/logotipos/login.png`;
  const randomValue = Math.random();
  const logoWithRandom = `${logo}?r=${randomValue}`;

  return (
    <div className={classes.root}>
      <FlowerAnimation /> {/* Adiciona a animação de flores caindo */}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img
            style={{ margin: "0 auto", width: "80%" }}
            src={logoWithRandom}
            alt={`${process.env.REACT_APP_NAME_SYSTEM}`}
          />
          <form className={classes.form} noValidate onSubmit={handlSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={i18n.t("login.form.email")}
              name="email"
              value={user.email}
              onChange={handleChangeInput}
              autoComplete="email"
              autoFocus
              className={classes.input}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={i18n.t("login.form.password")}
              type="password"
              id="password"
              value={user.password}
              onChange={handleChangeInput}
              autoComplete="current-password"
              className={classes.input}
            />
            <Grid container justify="flex-end">
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Link className={classes.link} component={RouterLink} to="/forgetpsw" variant="body2">
                  Esqueceu sua senha?
                </Link>
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" className={classes.submit}>
              {i18n.t("login.buttons.submit")}
            </Button>
            {viewregister === "enabled" && (
              <Grid container>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    component={RouterLink}
                    to="/signup"
                    className={classes.link}
                  >
                    {i18n.t("login.buttons.register")}
                  </Link>
                </Grid>
              </Grid>
            )}
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
};

export default Login;
