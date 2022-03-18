import React, { useState } from "react";
import { View, Button, Platform, StyleSheet, TextInput, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const MyDatePicker = () => {
    const today = new Date();
  const [date1, setDate1] = useState(new Date(today));
  const [date2, setDate2] = useState(new Date(today));
  const [mode, setMode] = useState("date");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const onChange1 = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow1(Platform.OS === "ios");
    setDate1(currentDate);
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow2(Platform.OS === "ios");
    setDate2(currentDate);
  };

  const showMode1 = currentMode => {
    setShow1(true);
    setMode(currentMode);
  };

  const showMode2 = currentMode => {
    setShow2(true);
    setMode(currentMode);
  };

  const showDatepicker1 = () => {
    showMode1("date");
  };

  const showDatepicker2 = () => {
    showMode2("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <View style={styles.container}>

      <View style={{marginLeft: 20}}>
        <Button
          onPress={showDatepicker1}
          title="FROM DATE"
        />

      </View>
      <View>
          <Text>{date1.toISOString().slice(0,10)}</Text>
        </View>

      <View style={{marginLeft: 20}}>
        <Button
          onPress={showDatepicker2}
          title="TO DATE"
        />


        {/* <Button onPress={showTimepicker} title="Show time picker!" /> */}
      </View>
      <View>
          <Text>{date2.toISOString().slice(0,10)}</Text>
        </View>  
      {show1 && (

        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={date1}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange1}
        />
      )}
     {show2 && (

              <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={date2}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange2}
              />
)}


    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems:"center",
    flex: 1,
    marginTop: 50,
    paddingBottom: 550,
    flexDirection: "row",

  }
});