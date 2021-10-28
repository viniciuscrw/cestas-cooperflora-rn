import React, { useReducer, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
    touched: false,
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    // console.log('[Input component] useEffect inputState', inputState);
    onInputChange(id, inputState.value, inputState.isValid);
    // Comentei pois na descrição precisamos sair do campo para a gravação funcionar.
    // if (inputState.touched) {
    //     onInputChange(id, inputState.value, inputState.isValid);
    // }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      console.log('[Input component] required failed', text);
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
      console.log('[Input component] email format failed', text);
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
      console.log('[Input component] min failed', text);
    }
    if (props.max != null && +text > props.max) {
      console.log('[Input component] max failed', text);
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      console.log('[Input component] minLenght failed', text);
      isValid = false;
    }
    // console.log('[Input component] Inputstate', inputState);
    // console.log('[Input component] isValid', isValid);

    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  return (
    <View style={styles.formControl}>
      {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={(text) => {
          textChangeHandler(text);
        }}
        onBlur={lostFocusHandler}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: '20%',
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontFamily: 'open-sans',
    color: 'red',
    fontSize: 13,
  },
});

export default Input;
