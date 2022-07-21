import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import * as React from "react"
import { Button, ButtonGroup } from "@mui/material"

export default function InputForm(props) {
  const {
    answers,
    questions,
    activeStep,
    addAnswer,
    activeAnswers,
    handleNext,
  } = props
  const [checkedIndex, setCheckedIndex] = React.useState(undefined)
  const [disabled, setDisabled] = React.useState(false)

  const updateAnswer = (index, e) => {
    e.preventDefault()
    setCheckedIndex(index)
    setDisabled(true)
    setTimeout(() => {
      addAnswer(
        {
          question_id: questions[activeStep].question_id,
          value: answers[index].value,
          activeStep,
          index,
        },
        activeStep
      )
      handleNext()
      setDisabled(false)
    }, 500)
  }

  React.useEffect(() => {
    if (activeAnswers[activeStep]) {
      setCheckedIndex(activeAnswers[activeStep].index)
    } else {
      setCheckedIndex(undefined)
    }
  }, [activeStep, activeAnswers])

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ButtonGroup orientation="vertical" sx={{ width: 400 }}>
        <Typography
          align="center"
          component="p"
          fontWeight="bold"
          sx={{ margin: 2 }}
        >
          {`${questions[activeStep].title}`}
        </Typography>
        {answers.map((answer, index) => (
          <Button
            variant={index === checkedIndex ? "contained" : "outlined"}
            onClick={(e) => updateAnswer(index, e)}
            key={`key=${answer.title}:${answer.value}`}
            disabled={disabled}
          >
            {`${answer.title}`}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  )
}
