import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useRecoilState } from "recoil";
import TextField from "@mui/material/TextField";
import { allValueSet, errorSet } from "./AtomUtils";
import { constants } from "./constants";
import { validationCheck } from "./commonUtils";
const defaultError = "Required Field";
const BasicRating = ({
  style,
  id,
  title,
  required,
  valueAtom,
  options,
  initValue,
}) => {
  const [value, setValue] = useRecoilState(allValueSet);
  const [rating, setRating] = useState(initValue);

  document.addEventListener("keypress", function onEvent(event) {
    if (options.includes(Number(event.key)) && value[id] !== event.key) {
      setRating(Number(event.key));
    }
    // if (event.key === constants.Navigation.rightKey) {
    //   options.includes(rating + 1) && setRating(rating + 1);
    // }
    // if (event.key === constants.Navigation.leftKey) {
    //   options.includes(rating - 1) && setRating(rating - 1);
    // }
  });
  useEffect(() => {
    setValue({ ...value, [id]: rating });
  }, [rating]);
  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
      }}
    >
      <Typography variant='h2' component='legend'>
        {title}
      </Typography>
      <Rating
        name='simple-controlled'
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
    </Box>
  );
};

const BasicText = ({
  style,
  id,
  placeholder,
  title,
  required,
  errorMsg,
  type,
  regex,
  label,
}) => {
  const [value, setValue] = useRecoilState(allValueSet);
  const [error, setError] = useRecoilState(errorSet);
  const textRef = React.useRef();
  const validate = (e) => {
    const isError = required
      ? !validationCheck(e.target.value, type, regex)
      : false;
    setError({ ...error, [id]: isError });
    textRef.current.focus();
  };
  useEffect(() => {
    textRef.current.focus();
  }, []);
  return (
    <Box
      component='form'
      sx={{
        "& > :not(style)": { m: 1, width: "50ch" },
      }}
      noValidate
      autoComplete='off'
    >
      <Typography variant='h2' component='legend'>
        {title}
      </Typography>
      <TextField
        inputRef={textRef}
        error={error[id] || false}
        value={value[id] || ""}
        id='filled-basic'
        label={label}
        variant='filled'
        onChange={(e) => {
          validate(e);
          setValue({ ...value, [id]: e.target.value });
        }}
        // onBlur={(e) => {
        //   validate(e);
        // }}
        placeholder={placeholder}
        helperText={error[id] ? errorMsg || defaultError : ""}
      />
    </Box>
  );
};

const FormSet = (props) => {
  const { type } = props;

  return (
    <Grid style={{ ...props.style }}>
      {type === "rating" && (
        <>
          <BasicRating {...props} />
        </>
      )}
      {constants.stringTypeFields.includes(type) && (
        <>
          <BasicText {...props} />
        </>
      )}
    </Grid>
  );
};

export default FormSet;
