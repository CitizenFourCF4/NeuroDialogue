import axios from "axios";
import React, {useEffect, useState, useContext} from 'react'

const getChats = async() => {
    const data = {
      'user_login': user.username,
    }
    const options = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
    try{
      const response = await axios.post(getChatsRoute, data, options)
      SetIsAuthorized(true)
      setIsLoading(false)
      setChats(response.data)
    } 
    catch (error){
      console.log(error)
    }
  }