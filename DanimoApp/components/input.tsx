import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export type InputProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];// hacerlo generico para todos
} & React.ComponentProps<typeof TextInput>;

export default function Input({ icon, ...props }: InputProps) {
  return (
    <View className="relative mb-4">
      <FontAwesome name={icon} size={18} color="gray" style={{ position: "absolute", top: 16, left: 12 }} />
      <TextInput
        className="w-full pl-10 pr-4 py-3 border border-oscuro rounded-md text-oscuro"
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
}

export type InputDateProps = {
  setDate?: (date: Date | undefined) => void;
  date: Date | string;
  handleFieldChange?: (field: string, value: any) => void;
};

export function Input_date({ setDate, date, handleFieldChange }: InputDateProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [myDate, setMydate] = useState<string | Date>(date);


  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      handleFieldChange && handleFieldChange('date', dateString);
      setDate && setDate(selectedDate);
      setMydate(dateString);
    }
  };

  const formatDateForDisplay = (dateValue: string | Date) => {
    
    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return date.toLocaleDateString('es-ES');
    } catch {
      return String(dateValue);
    }
  };
  return (
    <>
    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
      {/* <Input icon={"calendar"} placeholder={formatDateForDisplay(myDate)}/> */}
      <View className="relative mb-4">
        <FontAwesome name={"calendar"} size={18} color="gray" style={{ position: "absolute", top: 16, left: 12 }} />
        <Text className="w-full pl-10 pr-4 py-3 border border-oscuro rounded-md text-oscuro">{formatDateForDisplay(myDate)}</Text>
      </View>
    </TouchableOpacity>
    {showDatePicker && (
      <DateTimePicker
        value={new Date(myDate)}
        mode="date"
        display="default"
        onChange={handleDateChange}
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
      />
    )}
  </>
  );
}

export function Input_date_big({ setDate, date, handleFieldChange }: InputDateProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [myDate, setMydate] = useState<string | Date>(date);
  console.log("Input_date_big: ", date);
  

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      handleFieldChange && handleFieldChange('date', dateString);
      setDate && setDate(selectedDate);
      setMydate(selectedDate);      
    }
  };

  const formatDateForDisplay = (dateValue: string | Date) => {
    console.log("formatDateForDisplay: ", dateValue);
    
    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return date.toLocaleDateString('es-ES');
    } catch {
      return String(dateValue);
    }
  };
  return (
    <>
    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
      {/* <Input icon={"calendar"} placeholder={formatDateForDisplay(myDate)}/> */}
      <View className="w-full py-3 px-5 rounded-md mt-2 shadow-2xl border border-oscuro flex-row items-center justify-start">
        <FontAwesome name={"calendar"} size={30} color={colors.oscuro} />
        <Text className="text-oscuro px-5 font-bold text-lg">{formatDateForDisplay(myDate)}</Text>
      </View>
    </TouchableOpacity>
    {showDatePicker && (
      <DateTimePicker
        value={new Date(myDate)}
        mode="date"
        display="default"
        onChange={handleDateChange}
        minimumDate={new Date(1900, 0, 1)}
      />
    )}
  </>
  );
}


export type InputTimeProps = {
  setTime?: (time: Date) => void;
  time: Date | string;
  handleFieldChange?: (field: string, value: any) => void;
};

export function Input_time({ setTime, time, handleFieldChange }: InputTimeProps) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [myTime, setMyTime] = useState<Date>(
    typeof time === 'string' ? parseTimeStringToDate(time) : time || new Date()
  );

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);

    if (selectedTime) {
      const now = new Date();
      const selected = new Date(now);
      selected.setHours(selectedTime.getHours());
      selected.setMinutes(selectedTime.getMinutes());
      selected.setSeconds(0);
      selected.setMilliseconds(0);

      // Si la hora seleccionada es mayor a la actual, asumimos que fue ayer
      if (selected > now) {
        selected.setDate(selected.getDate() - 1);
      }

      handleFieldChange?.("time", selected.toISOString());
      setTime?.(selected);
      setMyTime(selected);
    }
  };

  const formatTimeForDisplay = (value: Date) => {
    return value.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <View className="relative mb-4">
          <FontAwesome name="clock-o" size={18} color="gray" style={{ position: "absolute", top: 16, left: 12 }} />
          <Text className="w-full pl-10 pr-4 py-3 border border-oscuro rounded-md text-oscuro">
            {formatTimeForDisplay(myTime)}
          </Text>
        </View>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={myTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </>
  );
}

// Función auxiliar para convertir "HH:mm" → Date con hoy
function parseTimeStringToDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
}
