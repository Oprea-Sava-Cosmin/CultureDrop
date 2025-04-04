import BlurText from "../ui/BlurText";

const TextReveal = () => {
  return (
    <div style={{ 
      position: 'absolute',
      bottom: '20%',
      width: '100%',
      textAlign: 'center'
    }}>
      <BlurText
          text="Fortnite asdasdasdasd asdasdasdas"
          delay={150}
          animateBy="words"
          direction="top"
      />
    </div>
  );
};

export default TextReveal;
