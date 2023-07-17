import React from 'react'
import ReactDOM from 'react-dom'
import classes from '../css/Modal.module.css'

const BackDrop = (props) => {
    return <div className={classes.backdrop} onClick={props.onClose}></div>
}

const ModalOverlay = (props) => {
    return (
        <div className={classes.modal}>
            <div className={classes.content}>{props.children}</div>
        </div>
    )
}

const protalElement = document.getElementById('root')

const Modal = (props) => {
  return (
    <>
        {ReactDOM.createPortal(<BackDrop onClose={props.onClose}/>, protalElement)}
        {ReactDOM.createPortal(
            <ModalOverlay>{props.children}</ModalOverlay>
            , protalElement)}
    </>
  )
}

export default Modal