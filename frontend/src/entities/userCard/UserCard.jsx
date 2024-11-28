import React, {useEffect} from 'react'
import styles from './styles.module.css'
import { useKeycloak } from "@react-keycloak/web";

const UserCard = ({isShowSettings, setIsShowSettings, colormode}) => {

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  return (
    <div className={styles.userInfo} onClick={() => setIsShowSettings(!isShowSettings)} colormode={colormode}>
      <div className={styles.avatar}>{username[0]}</div>
      <div className={styles.text_wrapper}>
        <div style={{lineHeight:'1rem'}}>
          <h5 className={styles.user_creds}>{username}</h5>
          <span className={styles.email}>{keycloak.tokenParsed.email}</span>
        </div>

      </div>
    </div>
  )
}

export default UserCard