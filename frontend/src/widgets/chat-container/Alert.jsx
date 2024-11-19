import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import styles from './styles.module.css'

function AlertDismissible({ error, onClose }) {
  const [show, setShow] = useState(true);

  if (error && error.response && error.response.status === 501 && show) {
    return (
      <Alert variant="danger" onClose={() => { setShow(false); onClose(); }} dismissible className={styles.alert_style}>
        <Alert.Heading>Oh snap! You got an error! {error.response.status}</Alert.Heading>
        <p>
          There is no such possibility yet. This mode will be added later. Expect it!
        </p>
      </Alert>
    );
  }
  return null;
}

export default AlertDismissible