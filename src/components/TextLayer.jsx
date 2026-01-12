import React from 'react';
import '../styles/Animations.css';

const TextLayer = ({ layer, currentTime }) => {
  // সময় চেক করা: যদি বর্তমান সময় লেয়ারের শুরু এবং শেষের মাঝে না থাকে, তবে দেখাবে না
  if (currentTime < layer.startTime || currentTime > layer.endTime) {
    return null;
  }

  const baseStyle = {
    position: 'absolute',
    top: `${layer.posY}%`,
    left: `${layer.posX}%`,
    transform: 'translate(-50%, -50%)', // সেন্টার পজিশনিং
    color: layer.color,
    fontSize: `${layer.fontSize}px`,
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
    whiteSpace: 'nowrap',
    zIndex: 10 // ভিডিওর উপরে
  };

  // স্টাইল অনুযায়ী রেন্ডারিং লজিক
  let content;
  switch (layer.style) {
    case 'reveal':
      // Reveal অ্যানিমেশনের জন্য টেক্সটকে span এর ভেতর wrapp করতে হবে
      content = <div className="anim-reveal"><span>{layer.text}</span></div>;
      break;
    case 'highlight':
      content = <div className="anim-highlight">{layer.text}</div>;
      break;
    case 'glitch':
      content = <div className="anim-glitch" data-text={layer.text}>{layer.text}</div>;
      break;
    default: // Normal
      content = <div>{layer.text}</div>;
  }

  return <div style={baseStyle}>{content}</div>;
};

export default TextLayer;