import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import * as React from "react"
import Copyright from "./Copyright"

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        An interview test for Blueprint-Health
      </Typography>
      <Copyright />
    </Box>
  )
}
