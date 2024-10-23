import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TicketsManager from "../../components/TicketsManagerTabs/";
import Ticket from "../../components/Ticket/";

const useStyles = makeStyles(theme => ({
  chatContainer: {
    flex: 1,
    padding: theme.spacing(0),
    height: `calc(100% - 48px)`,
    overflowY: "hidden",
  },
  chatPapper: {
    display: "flex",
    height: "100%",
  },
  contactsWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
  },
  messagesWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
  },
  welcomeMsg: {
    backgroundColor: theme.palette.boxticket,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
  },
}));

const logo = `${process.env.REACT_APP_BACKEND_URL}/public/logotipos/login.png`;
const recadosURL = "/path/to/recados.json"; // URL para obter os recados (ou você pode usar localStorage)

const TicketsCustom = () => {
  const classes = useStyles();
  const { ticketId } = useParams();
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isDaytime, setIsDaytime] = useState(true);
  const [showLogo, setShowLogo] = useState(true); // Controla se a logo ou o recado será exibido

  const getCurrentRecado = (recados) => {
    const now = new Date();
    return recados.find(recado => {
      const startDateTime = new Date(`${recado.startDate}T${recado.startTime}`);
      const endDateTime = new Date(`${recado.endDate}T${recado.endTime}`);

      return now >= startDateTime && now <= endDateTime;
    });
  };

  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      // Exibe logo durante o dia se não houver recados
      if (currentHour >= 8 && currentHour < 18) {
        setIsDaytime(true);
      } else {
        setIsDaytime(false);

        // Pegar recados do localStorage ou API
        const savedRecados = localStorage.getItem('tasks');
        if (savedRecados) {
          const recados = JSON.parse(savedRecados);
          const recado = getCurrentRecado(recados);
          if (recado) {
            setCurrentMessage(recado.text);
          }
        }
      }
    };

    checkTime();

    const interval = setInterval(checkTime, 3600000); // Verifica a cada 1 hora
    return () => clearInterval(interval);
  }, []);

  // Alternar entre logo e recado
  useEffect(() => {
    const logoInterval = setInterval(() => {
      setShowLogo(prevShowLogo => !prevShowLogo); // Alterna entre logo e recado
    }, showLogo ? 60000 : 30000); // Alterna: 1 minuto para logo e 30 segundos para recado

    return () => clearInterval(logoInterval);
  }, [showLogo]);

  return (
    <div className={classes.chatContainer}>
      <div className={classes.chatPapper}>
        <Grid container spacing={0}>
          <Grid item xs={4} className={classes.contactsWrapper}>
            <TicketsManager />
          </Grid>
          <Grid item xs={8} className={classes.messagesWrapper}>
            {ticketId ? (
              <Ticket />
            ) : (
              <Paper square variant="outlined" className={classes.welcomeMsg}>
                <div>
                  <center>
                    {isDaytime || !currentMessage ? (
                      <img
                        style={{ margin: "0 auto", width: "80%" }}
                        src={logo}
                        alt={`${process.env.REACT_APP_NAME_SYSTEM}`}
                      />
                    ) : (
                      showLogo ? (
                        <img
                          style={{ margin: "0 auto", width: "80%" }}
                          src={logo}
                          alt={`${process.env.REACT_APP_NAME_SYSTEM}`}
                        />
                      ) : (
                        // Exibe o recado atual
                        <div>{currentMessage}</div>
                      )
                    )}
                  </center>
                </div>
              </Paper>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TicketsCustom;
