// import "./styles.css";
import { Tabs, Tab, makeStyles, Box, Avatar, Grid, Container, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import PropTypes from "prop-types";
import { useAdmin, useAdminActions } from '../Context/AdminContext'
import Welcome from "../Components/Admin/WelcomePanel/Welcome";
import Dashboard from "../Components/Admin/Dashboard";
import adminAvatar from "../assets/adminAvatar.png";
import SignIn from '../Components/Admin/SignIn'
import Books from '../Components/Admin/Books'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "20px",
    paddingLeft: "0",
    backgroundColor: theme.palette.background.paper
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  panel: {},
  divider: {
    marginRight: "0",
    paddingRight: "0"
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

export default function AdminPage() {  
  
  const { token } = useAdmin()

  const { signin, logout } = useAdminActions();
  const history = useHistory()
  const classes = useStyles();
  const [ value, setValue ] = useState(0);
  const [ isLogined, setIsLogined ] = useState(false)
  const [ error, setError ] = useState("")
  const [ loading, setLoading ] = useState(false)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const handleLogout = () => {
    logout()
    history.push('/')
  }

  const login = (email, password) => {
    setLoading(true)
    const res = signin(email, password)    

    res.error ? setError(res.error) : setIsLogined(true)
    setLoading(false)
  }

  useEffect(()=>{
    setIsLogined(!(!token || token===''))
  },[token])

  return (
    !isLogined ? <SignIn error={error} loading={loading} login={login} /> :
    <Container className={classes.root} maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={2} className={classes.tabs}>
          <Tabs
            orientation="vertical"
            indicatorColor="primary"
            textcolor="primary"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs"
          >
            <Tab
              label="Diego Phan"
              icon={<Avatar alt="avatar" src={adminAvatar} />}
              {...a11yProps(0)}
            />
            <Tab label="Dashboard" {...a11yProps(1)} />
            <Tab label="Items" {...a11yProps(2)} />
            <Button className={classes.button} size="small" variant="outlined" color="secondary" onClick={handleLogout}>Logout</Button>
          </Tabs>
        </Grid>
        <Grid item xs={10}>
          <TabPanel className={classes.panel} value={value} index={0}>
            <Welcome />
          </TabPanel>
          <TabPanel className={classes.panel} value={value} index={1}>
            <Dashboard token={token}/>
          </TabPanel>
          <TabPanel className={classes.panel} value={value} index={2}>
            <Books />
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  )
}
