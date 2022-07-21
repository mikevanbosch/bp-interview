import { Modal } from "@mui/material"
import * as React from "react"
import Quiz from "./Quiz"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}

export default function QuizModal(props) {
  const { open, handleClose } = props
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Quiz sx={style} diagnosticScreener handleClose={handleClose} />
    </Modal>
  )
}
