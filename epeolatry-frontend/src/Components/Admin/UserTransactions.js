import {
    Card, 
    CardHeader, 
    CardContent, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails, 
    Typography, 
    makeStyles, 
    Chip,
    Button
  } from '@material-ui/core'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DoneIcon from '@material-ui/icons/Done';
import {useState} from 'react'
  
const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
});

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '5px',
    },
    info: {
        marginTop: "0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    image: {
        maxWidth: "100%"
    },
    title: {
        marginLeft: "15px"
    },
    break: {
        width: "100%",
        color: "grey",
        opacity: "0.4",
        marginBottom: "0"
    },
    list: {
        padding: "10px"
    },
    heading: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: "33.33%",
        flexShrink: 0
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(17),
        color: theme.palette.text.secondary
    },
    items: {
        display: "flex",
        flexDirection: "column"
    }
}));
  
const UserTransactions = ({ user, handleCheckTransaction }) => {
    const classes = useStyles()    
    const [expanded, setExpanded] = useState("")
  
    const handleChange = (panel) => (event, expanded) => {
      setExpanded(expanded ? panel : "")
    }
    
    return(
      <Card className={classes.root}>
        <CardHeader 
          title={user.email} 
          titleTypographyProps={{variant:"h6"}}
          subheader={`Transactions: ${user.transactions? user.transactions
          .length: 0}`}
        />
        <CardContent>
          {user.transactions ? (
            user.transactions.map((tran) => {
              const d = new Date(tran.date);
              const date = `${
                d.getUTCMonth() + 1
              }/${d.getUTCDate()}/${d.getUTCFullYear()}`;
              return (
                <Accordion
                  expanded={expanded === tran.date}
                  onChange={handleChange(tran.date)}
                  key={tran.date}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>
                      {date}
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      {tran.status}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.items}>
                    {tran.items.map((item) => (
                      <Card key={item.bookId}>
                        <CardHeader
                          title={item.title}
                          titleTypographyProps={{ variant: "subtitle1" }}
                          subheader={`Quantity: ${item.quantity}`}
                          subheaderTypographyProps={{ variant: "caption" }}
                          action={
                            <Chip label={formatter.format(item.price)} />
                          }
                        />
                      </Card>
                    ))}
                    <br />
                    <Typography variant="subtitle1"><b>Total:</b> {formatter.format(tran.totalPrice)}</Typography>
                    <Typography variant="subtitle1"><b>Address:</b> {tran.address}</Typography>
                    <Typography variant="subtitle1"><b>Phone:</b> {tran.phone}</Typography>
                    <br/>
                    {tran.status==='In process' && 
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary" 
                        startIcon={<DoneIcon />}
                        onClick={() => handleCheckTransaction(user.email, tran.date)}
                        disableElevation
                      >
                          Check
                      </Button>}
                  </AccordionDetails>
                </Accordion>
              );
            })
          ) : (
            <Typography variant="body2">
              No transaction yet
            </Typography>
          )}
        </CardContent>
      </Card>
    )
  }
  
  export default UserTransactions