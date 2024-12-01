import React from 'react'
import styles from './styles.module.css'
import { useKeycloak } from "@react-keycloak/web";
import { MdLogout} from 'react-icons/md';

const UserCard = ({colormode}) => {

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  return (
    <div className={styles.user_card_wrapper}>
      <div className={styles.userInfo} colormode={colormode}>
        <div className={styles.avatar}>{username[0]}</div>
        <div className={styles.text_wrapper}>
          <div style={{lineHeight:'1rem'}}>
            <h5 className={styles.user_creds}>{username}</h5>
            <span className={styles.email}>{keycloak.tokenParsed.email}</span>
          </div>
        </div>
      </div>
    <MdLogout className={styles.logout} size={23} color='orange' onClick={keycloak.logout}/>
    </div>
    
  )
}

export default UserCard