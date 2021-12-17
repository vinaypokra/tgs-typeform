import React, { useEffect } from "react";
import { Grid, Button, Slide } from "@mui/material";
import FormSet from "./FormSet";
import { questionsSchema } from "./masterConfig";
import { useRecoilState, useRecoilValue } from "recoil";
import { makeStyles } from "@mui/styles";
import { allValueSet, errorSet } from "./AtomUtils";
import { constants } from "./constants";
import LinearProgress from "./LinearProgress";
import { isError } from "./commonUtils";
import { useKeyPress } from "./useKeyPressHook";
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    backgroundColor: "#f5f5f5",
    height: "100vh",
  },
  innerContainer: {
    backgroundColor: "#fff",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    height: "100vh",
    position: "relative",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    overflow: "hidden",
  },
  buttonBox: {
    position: "absolute",
    bottom: "0",
    backgroundColor: "#dcdcdc",
    left: "0",
    borderRadius: "inherit",
  },
}));

const AnswerTab = () => {
  const value = useRecoilValue(allValueSet);
  return questionsSchema.map((item, index) => {
    return (
      <Slide direction='down' timeout={750} in={value}>
        <Grid key={index} xs={12}>
          <h2>{item.title}</h2>
          <p>{value[item.id]}</p>
        </Grid>
      </Slide>
    );
  });
};
const getProgress = (step) => {
  return (step / questionsSchema.length) * 100;
};
// Secondary Component
const SetForm = ({ step, classes, containerRef }) => {
  //Coverting the questions to a list of components
  const list = questionsSchema.map((item, index) => (
    <FormSet {...item} classes={classes} />
  ));

  return list.map((item, index) => {
    return step === index ? (
      <Slide
        direction='down'
        timeout={750}
        in={step === index}
        // appear={step === index}
        key={index}
        container={containerRef.current}
      >
        <Grid key={index}>{item}</Grid>
      </Slide>
    ) : null;
  });
};

// Main Component
const TypeForm = () => {
  const classes = useStyles();
  const [value, setValue] = useRecoilState(allValueSet);
  const [error, setError] = useRecoilState(errorSet);
  const [step, setStep] = React.useState(0); //Setting the step to the first step
  const [capturedValue, setCapturedValue] = React.useState(false);
  const keyPress = useKeyPress();

  useEffect(() => {
    if (constants.Navigation.resetKey.includes(keyPress)) {
      alert("Escape key pressed, Resetting Form");
      resetFrom();
    }
    if (constants.Navigation.forwardKey.includes(keyPress)) {
      // e.preventDefault();
      !isError(error) && inc();
    }
    if (keyPress === constants.Navigation.backKey) {
      // e.preventDefault();
      !isError(error) && dec();
    }
    if (keyPress === constants.Navigation.showKey) {
      show();
    }
  }, [keyPress]);
  //Changing the step
  const inc = () => {
    setStep(step + 1);
    if (step === questionsSchema.length - 1) {
      setCapturedValue(!capturedValue);
    }
    if (step === questionsSchema.length) {
      capturedValue && setCapturedValue(!capturedValue);
      setStep(0);
    }
  };

  const dec = () => {
    capturedValue && setCapturedValue(!capturedValue);
    setStep(step - 1);
    if (step === 0) {
      setStep(questionsSchema.length - 1);
    }
  };

  const show = () => {
    setCapturedValue(!capturedValue);
  };

  const resetFrom = () => {
    setCapturedValue(false);
    setValue({});
    setStep(0);
  };
  const containerRef = React.useRef();
  return (
    <Grid
      container
      item
      xs={12}
      justifyContent='center'
      alignItems='center'
      className={classes.mainContainer}
      ref={containerRef}
    >
      <Grid
        item
        container
        direction='row'
        xs={12}
        className={classes.innerContainer}
        // ref={containerRef}
      >
        <Grid item xs={12}>
          <LinearProgress progressStep={getProgress(step)} />
        </Grid>
        <Grid item container xs={12}>
          {capturedValue ? (
            <AnswerTab />
          ) : (
            <SetForm
              step={step}
              classes={classes}
              keyPress={keyPress}
              containerRef={containerRef}
            />
          )}
        </Grid>
        <Grid
          className={classes.buttonBox}
          item
          container
          xs={12}
          justifyContent='flex-end'
        >
          <Button onClick={show}>{`Show [Tab]`}</Button>
          <Button onClick={resetFrom}>{`Reset [Ecs]`}</Button>
          <Button onClick={dec}>{`Prev [⬇]`}</Button>
          <Button onClick={inc}>{`Next [Enter Or ⬆]`}</Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TypeForm;
