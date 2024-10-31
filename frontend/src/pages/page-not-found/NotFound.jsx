import React from "react";
import styles from './NotFound.module.css'

const NotFound = () => {

    return(
      <div className={styles.container}>
      <div className={styles.layout__box}>
        <div className={styles.layout__body}>
          <h2 className={styles.auth__tagline}>Oops...</h2>
          <h1 className={styles.auth__tagline2}>Page Not Found</h1>
          <img 
            src="/src/assets/CodePen-404.gif" width="700" height="550" alt="">
          </img>
            <a href="/" className={styles.submitButton}> 
                Go Back To Home
            </a>
  
        </div>
      </div>
    </div>
    )
  }
  export default NotFound