import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import QuizIcon from "@mui/icons-material/Quiz"
import CssBaseline from "@mui/material/CssBaseline"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import * as React from "react"
import Footer from "./Footer"
import QuizModal from "./QuizModal"

export default function Home() {
  const theme = createTheme()
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <QuizIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Blueprint-Health Quiz
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h2"
              variant="h3"
              align="center"
              color="text.primary"
            >
              Diagnostic Screening
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              {`The following screening will give us better insight to properly
              diagnose your condition.`}
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" onClick={handleOpen}>
                Click here to begin
              </Button>
              <QuizModal handleClose={handleClose} open={open} />
            </Stack>
          </Container>
        </Box>
      </main>
      <Footer />
    </ThemeProvider>
  )
}
