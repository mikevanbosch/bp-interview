const URL = "https://api.appsdirect.click/blueprint"

const getDiagnosticScreener = async () => {
  let result
  try {
    result = await fetch(`${URL}/diagnostic-screener`)
  } catch (e) {
    throw new Error("An unknown error has occurred")
  }

  if (result.status >= 400) {
    throw new Error("Unable to retrieve diagnostic screening")
  }

  return result.json()
}

const scoreAnswers = async (answers) => {
  const result = await fetch(`${URL}/score-answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  })
  if (result.status >= 400) {
    throw new Error("Unable to submit answers")
  }
  return result.json()
}

export default { getDiagnosticScreener, scoreAnswers }
