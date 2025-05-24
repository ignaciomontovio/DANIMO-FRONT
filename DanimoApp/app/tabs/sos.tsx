

// type ButtonEmergencyProps = {
//   text: string;
//   onActivate: () => void;
// };

export default function sos({ text, onActivate }: ButtonEmergencyProps) {
  // // eslint-disable-next-line react-hooks/rules-of-hooks
  // const [pressing, setPressing] = useState(false)
  // // eslint-disable-next-line react-hooks/rules-of-hooks
  // const timeoutRef = useRef<number | null>(null);

  // const handlePressIn = () => {
  //   setPressing(true);
  //   timeoutRef.current = setTimeout(() => {
  //     setPressing(false);
  //     if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //     onActivate(); // se activa después de 5 segundos
  //   }, 5000);
  // };

  // const handlePressOut = () => {
  //   setPressing(false);
  //   if (timeoutRef.current) clearTimeout(timeoutRef.current);
  // };

  return (
    <></>
    // <TouchableHighlight
    //   onPressIn = {handlePressIn} 
    //   onPressOut={handlePressOut} className="w-full py-3 rounded-md mt-2 shadow-2xl"
    //   style={{ backgroundColor: pressing ? "#f93636" : "#f93636" }} 
    // >
    //   <Text className="text-white text-center font-bold text-lg">{text}</Text>
    // </TouchableHighlight>
  );
}