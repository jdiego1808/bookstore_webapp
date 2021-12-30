import { Paper, Grid, Typography, CircularProgress, makeStyles } from "@material-ui/core"
import UserTransactions from "./UserTransactions"
import StatisticChart from "./StatisticCharts"
import { useAdmin, useAdminActions } from '../../Context/AdminContext'
import { Alert } from '@material-ui/lab'
import { Snackbar } from "@material-ui/core"
import { useState } from 'react'

const useStyles = makeStyles({
  loader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const Dashboard = ({ token }) => {
  const classes = useStyles()
  const { trans, statistics } = useAdmin()
  const { verifyTransaction } = useAdminActions()
  const [loading, setLoading] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleCheckTransaction = (email, date) => {
    setLoading(true)
    const res = verifyTransaction(token, email, date)
    if(!res) {
      setOpenSnackbar(true)
      return
    }
    setLoading(false)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return
    setOpenSnackbar(false);
  };

  return (
    <>
    {loading ? (
      <div className={classes.loader}>
        <CircularProgress size='3rem' thickness={5} />
      </div>
    ): (
    <Grid container spacing={3}>      
        <Grid item xs={12}>
          <StatisticChart data={statistics}/>
        </Grid>
        <br />
        <Grid item xs={12}>
          <Paper style={{ maxHeight: 800, overflow: "auto" }}>
            {
              trans ?
              trans.map((u) => (
                  <UserTransactions key={u.email} user={u} handleCheckTransaction={handleCheckTransaction}/>
              ))
              : <Typography variant='body2' color='error'>An error occurred</Typography>
            }
          </Paper>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                  An error occured!
              </Alert>
        </Snackbar>
        </Grid>
      
    </Grid>
    )}
    </>
  )
}

export default Dashboard;