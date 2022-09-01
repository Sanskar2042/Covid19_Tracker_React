import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./css/InfoBox.css";

const InfoBox = ({ title, type, active, cases, total, ...props }) => {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && `infoBox--selected_${type}`}`}
    >
      <CardContent className="infoBox__cardContent">
        <Typography className="infoBox__titel" color="textSecondary">
          {title}
        </Typography>
        <h2 className={`infoBox__${type}`}>{cases} Today</h2>
        <Typography color="infoBox_total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
