import Badge from 'react-bootstrap/Badge';

export const renderMode = (chat) => {
  switch (chat.chat_mode) {
    case 'Extract PDF text':
      return <Badge bg="success" style={{marginRight:'6px'}}>PDF2Text</Badge>
    case 'Text to speech':
      return <Badge bg="orange" style={{marginRight:'6px', background:'orange'}}>TTS</Badge>
    case 'Image to video':
        return <Badge bg="orange" style={{marginRight:'6px', background:'purple'}}>Img2Vid</Badge>
    default:
      return <div></div>;
  }
};