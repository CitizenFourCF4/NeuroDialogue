import Badge from 'react-bootstrap/Badge';
import { CHAT_TYPES } from 'src/app/constants/chatTypes';

export const renderMode = (chat) => {
  switch (chat.chat_mode) {
    case CHAT_TYPES.EXTRACT_PDF_TEXT:
      return <Badge bg="success" style={{marginRight:'6px'}}>PDF2Text</Badge>
    case CHAT_TYPES.TEXT_2_SPEECH:
      return <Badge bg="orange" style={{marginRight:'6px', background:'orange'}}>TTS</Badge>
    case CHAT_TYPES.IMAGE_2_VIDEO:
        return <Badge bg="orange" style={{marginRight:'6px', background:'purple'}}>Img2Vid</Badge>
    default:
      return <div></div>;
  }
};