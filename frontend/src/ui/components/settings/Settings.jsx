import React from 'react'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { MdLogout, MdBrightnessMedium } from "react-icons/md";
import { useKeycloak } from "@react-keycloak/web";
import styles from './styles.module.css'

const Settings = ({colorMode, setColorMode, setIsShowSettings}) => {
  const { keycloak } = useKeycloak();
  return (
    <Card id={styles.card} colorMode={colorMode}>
      <ListGroup className="list-group-flush" style={{textAlign: 'left'}}>
        <ListGroup.Item colorMode={colorMode} id={styles.listItem} 
        onClick={colorMode==='dark' 
          ? () => {setColorMode('light'); setIsShowSettings(false)} 
          : () => {setColorMode('dark'); setIsShowSettings(false)}}>
            <MdBrightnessMedium/> Change color theme
        </ListGroup.Item>
        <ListGroup.Item colorMode={colorMode} id={styles.listItem} onClick={keycloak.logout}><MdLogout /> Log out</ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export default Settings