import * as React from "react"
import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import MobileStepper from "@mui/material/MobileStepper"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import { useQuery } from "@tanstack/react-query"
import { Alert, CircularProgress } from "@mui/material"
import blueprintApi from "../api/blueprint-api"
import InputForm from "./InputForm"

export default function Quiz(props) {
  const { sx, handleClose } = props
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState(0)
  const [activeAnswers, setActiveAnswers] = React.useState([])
  const [result, setResult] = React.useState(undefined)
  const [nextButtonStatus, setNextButtonStatus] = React.useState("next")

  const addAnswer = (answer, index) => {
    const temp = [...activeAnswers]
    temp[index] = answer
    setActiveAnswers(temp)
  }

  const { isLoading: isDiagnosticScreenerLoading, data: diagnosticScreener } =
    useQuery(["diagnostic-screener"], blueprintApi.getDiagnosticScreener)

  const handleSubmit = async () => {
    const mappedAnswers = activeAnswers.map((answer) => ({
      value: answer.value,
      question_id: answer.question_id,
    }))
    const results = await blueprintApi.scoreAnswers(mappedAnswers)
    setResult(results)
  }

  const handleNext = async () => {
    if (
      activeStep !==
      diagnosticScreener.content.sections[0].questions.length - 1
    ) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleSubmitOrClose = async () => {
    if (
      activeStep ===
        diagnosticScreener.content.sections[0].questions.length - 1 &&
      !result
    ) {
      await handleSubmit()
    } else if (nextButtonStatus === "close") {
      setResult(undefined)
      handleClose()
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    setResult(undefined)
  }

  React.useEffect(() => {
    if (diagnosticScreener && !isDiagnosticScreenerLoading) {
      if (
        activeStep ===
          diagnosticScreener.content.sections[0].questions.length - 1 &&
        !result
      ) {
        setNextButtonStatus("submit")
      } else if (result && result.results) {
        setNextButtonStatus("close")
      } else {
        setNextButtonStatus("next")
      }
    }
  }, [activeStep, result, diagnosticScreener, isDiagnosticScreenerLoading])

  return (
    <Box sx={sx}>
      {result && result.results.length > 0 && (
        <Alert severity="success">{`You scored ${result.results}`}</Alert>
      )}
      {result && result.results.length === 0 && (
        <Alert severity="success">Congrats! No actions needed.</Alert>
      )}
      <Paper
        square
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          pl: 2,
          bgcolor: "background.default",
        }}
      >
        <Typography fontWeight="bold">
          {isDiagnosticScreenerLoading
            ? "Loading"
            : `${diagnosticScreener.full_name} (${diagnosticScreener.content.display_name})`}
        </Typography>
      </Paper>
      {!isDiagnosticScreenerLoading && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            p: 2,
            justifyContent: "center",
          }}
        >
          <Typography variant="subtitle1" color="text.secondary">
            {diagnosticScreener.content.sections[0].title}
          </Typography>
        </Box>
      )}
      {!isDiagnosticScreenerLoading && (
        <InputForm
          answers={diagnosticScreener.content.sections[0].answers}
          questions={diagnosticScreener.content.sections[0].questions}
          activeStep={activeStep}
          addAnswer={addAnswer}
          activeAnswers={activeAnswers}
          handleNext={handleNext}
        />
      )}
      {!isDiagnosticScreenerLoading && (
        <MobileStepper
          variant="text"
          steps={diagnosticScreener.content.sections[0].questions.length}
          position="static"
          activeStep={activeStep}
          nextButton={
            activeStep ===
              diagnosticScreener.content.sections[0].questions.length - 1 &&
            activeAnswers.length ===
              diagnosticScreener.content.sections[0].questions.length && (
              <Button size="small" onClick={handleSubmitOrClose}>
                {nextButtonStatus}
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            )
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0 || !!result}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      )}
      {isDiagnosticScreenerLoading && (
        <Box
          style={{
            justifyContent: "center",
            display: "flex",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  )
}
